# WebSocket 使用文档

## 概述

中央广播式 WebSocket 管理器，支持多页面订阅、自动重连、消息分发。

## 配置文件

项目根目录下的 `src/init.json` 文件用于配置初始化参数：

```json
{
  "ws_url": "ws://10.0.3.45:8080"
}
```

**配置说明：**
- `ws_url`: WebSocket 服务器地址，项目启动时会自动连接

## 全局对象

项目启动时会自动：
1. 加载 `init.json` 配置文件
2. 挂载 `Lw` 对象到 `window`
3. 将配置挂载到 `window.Lw.initConfig`
4. 自动初始化 WebSocket 连接

可在浏览器控制台或任何地方使用：

```javascript
// 访问配置
console.log(Lw.initConfig.ws_url); // "ws://10.0.3.45:8080"

// 使用 WebSocket
Lw.ws.getInfo();
```

## API 文档

### 0. 访问配置

```typescript
Lw.initConfig: InitConfig
```

**属性：**
- `ws_url`: WebSocket 服务器地址

**示例：**
```javascript
console.log('WebSocket 地址:', Lw.initConfig.ws_url);
```

---

### 1. 初始化 WebSocket（可选）

```typescript
Lw.ws.init(url: string): void
```

**说明：**
项目启动时会自动使用 `init.json` 中的 `ws_url` 初始化连接，通常不需要手动调用。
如果需要切换到其他地址，可以手动调用此方法。

**参数：**
- `url`: WebSocket 服务器地址

**示例：**
```javascript
// 切换到其他地址
Lw.ws.init('ws://localhost:8080');
```

---

### 2. 订阅消息

```typescript
Lw.ws.subscribe(title: string, callback: (data: any) => void): () => void
```

**参数：**
- `title`: 订阅标题（如：`FXSPOT.COM.ORDER`）
- `callback`: 消息回调函数

**返回：**
- 取消订阅函数

**示例：**
```javascript
// 订阅订单消息
const unsubscribe = Lw.ws.subscribe('FXSPOT.COM.ORDER', (data) => {
  console.log('收到订单消息:', data);
});

// 取消订阅
unsubscribe();
```

---

### 3. 取消订阅

```typescript
Lw.ws.unsubscribe(title: string, callback?: (data: any) => void): void
```

**参数：**
- `title`: 订阅标题
- `callback`: 可选，指定要取消的回调函数。不传则取消该 title 的所有订阅

**示例：**
```javascript
// 取消指定回调
Lw.ws.unsubscribe('FXSPOT.COM.ORDER', myCallback);

// 取消该 title 的所有订阅
Lw.ws.unsubscribe('FXSPOT.COM.ORDER');
```

---

### 4. 获取 WebSocket 信息

```typescript
Lw.ws.getInfo(): WebSocketInfo
```

**返回：**
```typescript
{
  url: string;                      // WebSocket 地址
  status: WSStatus;                 // 连接状态
  subscriptions: Record<string, number>;  // 订阅信息（title: 订阅数）
  reconnectAttempts: number;        // 重连次数
  lastError: string | null;         // 最后错误信息
}
```

**示例：**
```javascript
const info = Lw.ws.getInfo();
console.log('WebSocket 信息:', info);
```

---

### 5. 断开连接

```typescript
Lw.ws.disconnect(): void
```

**示例：**
```javascript
Lw.ws.disconnect();
```

---

### 6. 重新连接

```typescript
Lw.ws.reconnect(): void
```

**示例：**
```javascript
Lw.ws.reconnect();
```

---

## 使用场景

### 场景 1: 在 React 组件中使用

```typescript
'use client';

import { useEffect } from 'react';

export default function OrderPage() {
  useEffect(() => {
    // 订阅订单消息
    const unsubscribe = window.Lw.ws.subscribe('FXSPOT.COM.ORDER', (data) => {
      console.log('收到订单更新:', data);
      // 更新组件状态
    });

    // 组件卸载时取消订阅
    return () => {
      unsubscribe();
    };
  }, []);

  return <div>订单页面</div>;
}
```

---

### 场景 2: 多个页面订阅同一个 title

```typescript
// 页面 A
useEffect(() => {
  const unsubscribe = Lw.ws.subscribe('FXSPOT.COM.ORDER', (data) => {
    console.log('页面 A 收到消息:', data);
  });
  return () => unsubscribe();
}, []);

// 页面 B
useEffect(() => {
  const unsubscribe = Lw.ws.subscribe('FXSPOT.COM.ORDER', (data) => {
    console.log('页面 B 收到消息:', data);
  });
  return () => unsubscribe();
}, []);

// 当服务器推送 FXSPOT.COM.ORDER 消息时，页面 A 和 B 都会收到
```

---

### 场景 3: 在浏览器控制台调试

```javascript
// 查看配置
Lw.initConfig;

// 查看连接信息（已自动连接）
Lw.ws.getInfo();

// 订阅消息
Lw.ws.subscribe('FXSPOT.COM.ORDER', (data) => {
  console.log('控制台收到消息:', data);
});

// 查看当前订阅
Lw.ws.getInfo().subscriptions;
```

---

### 场景 4: 修改配置

如果需要修改 WebSocket 地址，编辑 `src/init.json` 文件：

```json
{
  "ws_url": "ws://your-server:8080"
}
```

然后重启项目即可。

---

## 消息格式

服务器推送的消息需要符合以下格式：

```json
{
  "title": "FXSPOT.COM.ORDER",
  "data": {
    // 业务数据
  }
}
```

- `title`: 消息标题，用于分发到对应的订阅者
- `data`: 业务数据，会传递给回调函数

---

## 连接状态

```typescript
enum WSStatus {
  CONNECTING = 'CONNECTING',      // 连接中
  CONNECTED = 'CONNECTED',        // 已连接
  DISCONNECTED = 'DISCONNECTED',  // 已断开
  RECONNECTING = 'RECONNECTING',  // 重连中
  ERROR = 'ERROR',                // 错误
}
```

---

## 特性

1. **自动重连**: 连接断开后自动重连，默认最多重连 10 次
2. **心跳检测**: 每 30 秒发送一次心跳，保持连接活跃
3. **多订阅支持**: 同一个 title 可以在不同页面同时订阅
4. **消息分发**: 根据 title 自动分发消息到对应的订阅者
5. **全局访问**: 通过 `window.Lw` 全局访问，方便调试

---

## 配置项

可以在 `webSocket.ts` 中修改默认配置：

```typescript
{
  reconnectInterval: 3000,      // 重连间隔（毫秒）
  maxReconnectAttempts: 10,     // 最大重连次数
  heartbeatInterval: 30000,     // 心跳间隔（毫秒）
}
```
