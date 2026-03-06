# WebSocket 消息队列机制说明

## 问题场景

当页面组件挂载时调用 `Wui.ws.subscribe()`，如果 WebSocket 还没连接成功，注册消息无法发送到服务器。

## 解决方案

实现了**待发送消息队列**机制，确保连接未就绪时的订阅请求不会丢失。

## 工作原理

### 1. 连接未就绪时

```typescript
// 页面组件在 WebSocket 连接前就挂载了
useEffect(() => {
  // 此时 WebSocket 可能还在连接中
  const unsubscribe = Wui.ws.subscribe(
    'position-menu',
    ['POSIMM.FXSPOT.PAIR'],
    data => {
      console.log('收到数据:', data);
    }
  );

  return () => unsubscribe();
}, []);
```

**内部处理流程：**

1. `subscribe()` 被调用，记录订阅关系
2. 尝试发送注册消息 `#APOSIMM.FXSPOT.PAIR`
3. 检测到连接未就绪（`readyState !== OPEN`）
4. 消息被加入 `pendingMessages` 队列
5. 控制台输出：`[WebSocket] 连接未就绪，消息加入队列: #APOSIMM.FXSPOT.PAIR`

### 2. 连接成功后

```typescript
// WebSocket 连接成功时触发
private handleOpen(): void {
  console.log('[WebSocket] 连接成功');

  // 更新状态
  this.status = WSStatus.CONNECTED;

  // 启动心跳
  this.startHeartbeat();

  // 🔥 关键：发送所有待发送的消息
  this.flushPendingMessages();
}
```

**队列处理流程：**

1. 连接成功，触发 `handleOpen()`
2. 调用 `flushPendingMessages()`
3. 遍历 `pendingMessages` 队列
4. 依次发送所有缓存的消息
5. 控制台输出：`[WebSocket] 发送队列消息: #APOSIMM.FXSPOT.PAIR`

## 时序图

```
页面加载
  │
  ├─> 初始化 WebSocket (连接中...)
  │
  ├─> 页面组件挂载
  │     │
  │     └─> subscribe('menu', ['TITLE1'])
  │           │
  │           ├─> 记录订阅关系 ✓
  │           │
  │           └─> 发送 #ATITLE1
  │                 │
  │                 └─> 连接未就绪 ❌
  │                       │
  │                       └─> 加入队列 [#ATITLE1]
  │
  ├─> WebSocket 连接成功 ✓
  │     │
  │     └─> handleOpen()
  │           │
  │           ├─> 启动心跳 ✓
  │           │
  │           └─> flushPendingMessages()
  │                 │
  │                 └─> 发送 #ATITLE1 ✓
  │
  └─> 服务器收到注册请求 ✓
        │
        └─> 开始推送消息
```

## 代码实现

### 1. 添加队列属性

```typescript
class WebSocketManager {
  /** 待发送消息队列（连接未就绪时缓存） */
  private pendingMessages: string[] = [];
}
```

### 2. 修改 send() 方法

```typescript
private send(data: string): void {
  if (this.ws?.readyState === WebSocket.OPEN) {
    // 连接已就绪，直接发送
    this.ws.send(data);
    console.log(`[WebSocket] 发送消息: ${data}`);
  } else {
    // 连接未就绪，加入队列
    console.warn(`[WebSocket] 连接未就绪，消息加入队列: ${data}`);
    this.pendingMessages.push(data);
  }
}
```

### 3. 添加队列处理方法

```typescript
private flushPendingMessages(): void {
  if (this.pendingMessages.length === 0) return;

  console.log(`[WebSocket] 发送 ${this.pendingMessages.length} 条待发送消息`);

  // 发送所有待发送消息
  while (this.pendingMessages.length > 0) {
    const message = this.pendingMessages.shift();
    if (message && this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(message);
      console.log(`[WebSocket] 发送队列消息: ${message}`);
    }
  }
}
```

### 4. 在连接成功时调用

```typescript
private handleOpen(): void {
  console.log('[WebSocket] 连接成功');
  this.status = WSStatus.CONNECTED;
  this.reconnectAttempts = 0;
  this.lastError = null;
  this.startHeartbeat();

  // 🔥 发送所有待发送的消息
  this.flushPendingMessages();
}
```

## 优势

1. **无需修改业务代码**：页面组件可以在任何时候调用 `subscribe()`，不用关心连接状态
2. **自动处理时序**：消息队列自动处理连接时序问题
3. **不丢失订阅**：即使连接未就绪，订阅请求也会被缓存并在连接后发送
4. **透明化**：对使用者完全透明，无需额外处理

## 控制台日志示例

### 正常流程（连接已就绪）

```
[WebSocket] 正在连接: ws://localhost:3001/ws
[WebSocket] 连接成功
[WebSocket] 订阅成功, menuId: position-menu, title: POSIMM.FXSPOT.PAIR, 当前订阅数: 1
[WebSocket] 向服务器注册 title: POSIMM.FXSPOT.PAIR
[WebSocket] 发送消息: #APOSIMM.FXSPOT.PAIR
```

### 队列流程（连接未就绪）

```
[WebSocket] 正在连接: ws://localhost:3001/ws
[WebSocket] 订阅成功, menuId: position-menu, title: POSIMM.FXSPOT.PAIR, 当前订阅数: 1
[WebSocket] 向服务器注册 title: POSIMM.FXSPOT.PAIR
[WebSocket] 连接未就绪，消息加入队列: #APOSIMM.FXSPOT.PAIR
[WebSocket] 连接成功
[WebSocket] 发送 1 条待发送消息
[WebSocket] 发送队列消息: #APOSIMM.FXSPOT.PAIR
```

## 测试方法

### 1. 模拟慢速连接

在 `init.json` 中配置一个延迟响应的 WebSocket 服务器，或在 `connect()` 方法中添加延迟：

```typescript
private connect(): void {
  // 模拟慢速连接
  setTimeout(() => {
    this.ws = new WebSocket(this.config.url);
    // ...
  }, 2000); // 延迟 2 秒
}
```

### 2. 在浏览器控制台查看

打开浏览器控制台，观察日志输出，确认消息是否被加入队列并在连接后发送。

### 3. 检查队列状态

在控制台执行：

```javascript
// 查看连接信息
Wui.ws.getInfo();

// 查看订阅信息
Wui.ws.getInfo().subscriptions;
```

## 注意事项

1. **队列不持久化**：页面刷新后队列会清空
2. **重连时不重发**：重连时不会重新发送队列消息（订阅关系已记录）
3. **心跳不入队**：心跳消息不会加入队列，只在连接打开时发送

## 总结

通过消息队列机制，完美解决了页面组件在 WebSocket 连接前就调用 `subscribe()` 的时序问题。使用者无需关心连接状态，可以在任何时候安全地调用订阅方法。
