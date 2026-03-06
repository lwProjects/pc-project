# WebSocket 使用文档

## 概述

中央广播式 WebSocket 管理器，支持多页面订阅、自动重连、消息分发。

## 系统架构

### 服务器通信协议

WebSocket 管理器与服务器采用以下通信协议：

1. **注册订阅**: 当首次订阅某个 title 时，向服务器发送 `#Atitle1/title2/...`
2. **取消订阅**: 当某个 title 的所有订阅都被取消时，向服务器发送 `#Dtitle1/title2/...`
3. **消息推送**: 服务器推送消息格式为 `{"title": "xxx", "data": {...}}`
4. **心跳保持**: 定期发送 `ping` 消息保持连接

### 订阅机制

- 每个菜单可以订阅多个 title
- 同一个 title 可以被多个菜单订阅
- 只有首次订阅某个 title 时才向服务器注册
- 只有最后一个订阅被取消时才向服务器取消注册
- 已注册的 title 会被缓存，避免重复注册
- 菜单ID用于管理和追踪订阅关系

## 系统初始化

WebSocket 连接在应用启动时通过 `globalInit` 自动初始化（`src/main.tsx`）：

```typescript
import { initGlobal } from './utils/globalInit';

// 初始化全局对象（包括 WebSocket）
initGlobal();
```

配置文件位于项目根目录 `init.json`：

```json
{
  "ws_url": "ws://localhost:3001/ws"
}
```

初始化后，WebSocket 方法会挂载到全局对象 `window.Wui.ws`。

## 在组件中使用

### 基本用法

```typescript
import { useEffect, useState } from 'react';

const MyComponent = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    // 使用全局 Wui.ws 订阅消息
    // 参数：菜单ID, title数组, 回调函数
    const unsubscribe = Wui.ws.subscribe<MyDataType>(
      'my-menu-id',
      ['MY.TOPIC.1', 'MY.TOPIC.2'],
      (message) => {
        console.log('收到消息:', message);
        console.log('title:', message.title);
        console.log('data:', message.data);
        console.log('timestamp:', message.timestamp);

        // 使用消息数据
        setData(message.data);
      }
    );

    // 组件卸载时取消订阅
    return () => {
      unsubscribe();
    };
  }, []);

  return <div>{/* 使用 data */}</div>;
};
```

### 头寸监控示例

```typescript
// src/page/position/index.tsx
useEffect(() => {
  const unsubscribe = Wui.ws.subscribe<PositionResponse>(
    'position-menu',
    ['POSIMM.FXSPOT.PAIR'],
    message => {
      console.log('[Position] 收到头寸数据:', message);
      console.log('[Position] title:', message.title);
      console.log(
        '[Position] timestamp:',
        new Date(message.timestamp).toLocaleString()
      );

      // 使用消息数据
      const response = message.data;
      if (response?.fxspotPositionList) {
        setDataSource(response.fxspotPositionList);
      }
    }
  );

  return () => {
    unsubscribe();
  };
}, []);
```

---

## API 文档

### 1. 访问配置

```typescript
Wui.initConfig: InitConfig
```

**属性：**

- `ws_url`: WebSocket 服务器地址

**示例：**

```typescript
console.log('WebSocket 地址:', Wui.initConfig.ws_url);
```

---

### 2. 订阅消息

```typescript
Wui.ws.subscribe<T>(menuId: string, titles: string[], callback: (message: WebSocketMessage<T>) => void): () => void
```

**参数：**

- `menuId`: 菜单ID，用于标识订阅来源
- `titles`: 订阅标题数组（如：`['POSIMM.FXSPOT.PAIR', 'OTHER.TITLE']`）
- `callback`: 消息回调函数，接收包装后的消息对象

**回调参数 `WebSocketMessage<T>`：**

```typescript
{
  title: string; // 消息标题
  data: T; // 消息数据（泛型）
  timestamp: number; // 消息接收时间戳（毫秒）
}
```

**返回：**

- 取消订阅函数

**示例：**

```typescript
// 订阅头寸消息
const unsubscribe = Wui.ws.subscribe<PositionResponse>(
  'position-menu',
  ['POSIMM.FXSPOT.PAIR'],
  message => {
    console.log('title:', message.title);
    console.log('data:', message.data);
    console.log('timestamp:', message.timestamp);
    console.log('时间:', new Date(message.timestamp).toLocaleString());
  }
);

// 订阅多个 title
const unsubscribe2 = Wui.ws.subscribe(
  'multi-menu',
  ['TITLE1', 'TITLE2', 'TITLE3'],
  message => {
    console.log('收到消息:', message);
  }
);

// 取消订阅
unsubscribe();
```

---

### 3. 取消订阅

```typescript
Wui.ws.unsubscribe(menuId: string, callback?: (data: unknown) => void): void
```

**参数：**

- `menuId`: 菜单ID
- `callback`: 可选，指定要取消的回调函数

**示例：**

```typescript
// 取消指定菜单的订阅
Wui.ws.unsubscribe('position-menu', myCallback);
```

---

### 4. 获取 WebSocket 信息

```typescript
Wui.ws.getInfo(): WebSocketInfo
```

**返回：**

```typescript
{
  url: string; // WebSocket 地址
  status: WSStatus; // 连接状态
  subscriptions: Record<string, number>; // 订阅信息（title: 订阅数）
  reconnectAttempts: number; // 重连次数
  lastError: string | null; // 最后错误信息
}
```

**示例：**

```typescript
const info = Wui.ws.getInfo();
console.log('WebSocket 信息:', info);
```

---

### 5. 断开连接

```typescript
Wui.ws.disconnect(): void
```

**示例：**

```typescript
Wui.ws.disconnect();
```

---

### 6. 重新连接

```typescript
Wui.ws.reconnect(): void
```

**示例：**

```typescript
Wui.ws.reconnect();
```

---

## 使用场景

### 场景 1: 在 React 组件中订阅消息

```typescript
import { useEffect, useState } from 'react';

export default function OrderPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // 订阅订单消息
    const unsubscribe = Wui.ws.subscribe<OrderData[]>(
      'order-menu',
      ['FXSPOT.COM.ORDER'],
      (message) => {
        console.log('收到订单更新:', message);
        console.log('时间:', new Date(message.timestamp).toLocaleString());
        setOrders(message.data);
      }
    );

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
  const unsubscribe = Wui.ws.subscribe(
    'menu-a',
    ['FXSPOT.COM.ORDER'],
    message => {
      console.log('页面 A 收到消息:', message.data);
      console.log('时间:', new Date(message.timestamp).toLocaleString());
    }
  );
  return () => unsubscribe();
}, []);

// 页面 B
useEffect(() => {
  const unsubscribe = Wui.ws.subscribe(
    'menu-b',
    ['FXSPOT.COM.ORDER'],
    message => {
      console.log('页面 B 收到消息:', message.data);
    }
  );
  return () => unsubscribe();
}, []);

// 当服务器推送 FXSPOT.COM.ORDER 消息时，页面 A 和 B 都会收到
```

---

### 场景 3: 在浏览器控制台调试

```typescript
// 查看配置
Wui.initConfig;

// 查看连接信息
Wui.ws.getInfo();

// 订阅消息
Wui.ws.subscribe('debug-menu', ['FXSPOT.COM.ORDER'], message => {
  console.log('控制台收到消息:', message);
  console.log('title:', message.title);
  console.log('data:', message.data);
  console.log('timestamp:', message.timestamp);
});

// 查看当前订阅
Wui.ws.getInfo().subscriptions;
```

---

### 场景 4: 修改 WebSocket 地址

如果需要修改 WebSocket 地址，编辑项目根目录的 `init.json` 文件：

```json
{
  "ws_url": "ws://your-server:port/ws"
}
```

然后重启项目即可。

---

## 消息格式

### 客户端到服务器

1. **注册订阅**:

```
#APOSIMM.FXSPOT.PAIR/OTHER.TITLE
```

2. **取消订阅**:

```
#DPOSIMM.FXSPOT.PAIR/OTHER.TITLE
```

3. **心跳**:

```
ping
```

### 服务器到客户端

服务器推送的消息格式为：`title:数据`

**支持三种数据格式：**

1. **压缩数据（推荐）**：

```
POSIMM.FXSPOT.PAIR:eJyLrlZKLE...（pako 压缩的 base64 字符串）
```

2. **明文 JSON**：

```
POSIMM.FXSPOT.PAIR:{"fxspotPositionList":[...],"positionCollection":{...}}
```

3. **原始数据**（字符串、数字、布尔值等）：

```
SYSTEM.STATUS:online
SYSTEM.COUNT:12345
```

**处理流程：**

1. 客户端首先尝试解压缩数据
2. 如果解压失败，尝试作为 JSON 解析
3. 如果 JSON 解析失败，直接使用原始字符串

**示例：**

压缩数据：

```
POSIMM.FXSPOT.PAIR:eJyLjgUAARUAuQ==
→ 自动解压为 { fxspotPositionList: [...] }
```

明文 JSON：

```
POSIMM.FXSPOT.PAIR:{"status":"ok","data":[1,2,3]}
→ 自动解析为 { status: "ok", data: [1, 2, 3] }
```

原始数据：

```
SYSTEM.STATUS:online
→ 直接返回字符串 "online"
```

````

---

## 连接状态

```typescript
enum WSStatus {
  CONNECTING = 'CONNECTING', // 连接中
  CONNECTED = 'CONNECTED', // 已连接
  DISCONNECTED = 'DISCONNECTED', // 已断开
  RECONNECTING = 'RECONNECTING', // 重连中
  ERROR = 'ERROR', // 错误
}
````

---

## 特性

1. **全局访问**: 通过 `window.Wui` 全局访问，方便在任何地方使用
2. **配置文件**: 使用 `init.json` 配置,易于管理和修改
3. **系统级初始化**: 应用启动时自动连接，无需在组件中初始化
4. **菜单级订阅**: 支持按菜单ID管理订阅，便于追踪和管理
5. **批量订阅**: 一次可以订阅多个 title
6. **智能注册**: 首次订阅时自动向服务器注册，避免重复注册
7. **自动取消注册**: 最后一个订阅取消时自动向服务器取消注册
8. **消息队列**: 连接未就绪时，订阅请求会被缓存，连接成功后自动发送
9. **自动重连**: 连接断开后自动重连，默认最多重连 10 次
10. **心跳检测**: 每 30 秒发送一次心跳，保持连接活跃
11. **多订阅支持**: 同一个 title 可以在不同菜单同时订阅
12. **消息分发**: 根据 title 自动分发消息到对应的订阅者
13. **类型安全**: 支持 TypeScript 泛型，提供完整的类型提示

## 工作流程

### 订阅流程

1. 组件调用 `Wui.ws.subscribe('menu-id', ['TITLE1', 'TITLE2'], callback)`
2. 记录菜单ID和title数组的映射关系
3. 检查每个 title 是否是首次订阅
4. 如果有首次订阅的 title，批量向服务器发送 `#ATITLE1/TITLE2`
   - 如果连接未就绪，消息会被加入待发送队列
   - 连接成功后会自动发送队列中的所有消息
5. 将 callback 添加到每个 title 的订阅列表
6. 返回取消订阅函数

### 消息接收流程

1. 服务器推送消息 `{"title": "TITLE", "data": {...}}`
2. WebSocket 管理器解析消息
3. 根据 title 查找所有订阅者
4. 依次调用所有订阅者的 callback

### 取消订阅流程

1. 组件调用取消订阅函数或 `Wui.ws.unsubscribe('menu-id', callback)`
2. 获取该菜单订阅的所有 title
3. 从每个 title 的订阅列表中移除 callback
4. 检查每个 title 是否还有其他订阅者
5. 收集没有订阅者的 title，批量向服务器发送 `#DTITLE1/TITLE2`
6. 移除菜单订阅记录

---

## 配置项

WebSocket 配置在项目根目录的 `init.json` 中设置：

```json
{
  "ws_url": "ws://localhost:3001/ws"
}
```

默认配置（在 `webSocket.ts` 中）：

- `reconnectInterval`: 3000ms（重连间隔）
- `maxReconnectAttempts`: 10（最大重连次数）
- `heartbeatInterval`: 30000ms（心跳间隔）

## 全局对象

初始化后，可通过 `window.Wui` 访问：

```typescript
Wui.initConfig; // 配置信息
Wui.ws; // WebSocket 方法
```

## 已集成页面

- **头寸监控** (`/position`): 订阅 `POSIMM.FXSPOT.PAIR` 消息，实时更新头寸数据
