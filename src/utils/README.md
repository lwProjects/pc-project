# WebSocket 使用文档

## 概述

中央广播式 WebSocket 管理器，支持多页面订阅、自动重连、消息分发。

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
    const unsubscribe = window.Wui.ws.subscribe<MyDataType>(
      'MY.TOPIC',
      (newData) => {
        console.log('收到消息:', newData);
        setData(newData);
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
  const unsubscribe = window.Wui.ws.subscribe<PositionResponse>(
    'POSIMM.FXSPOT.PAIR',
    response => {
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
window.Wui.initConfig: InitConfig
```

**属性：**

- `ws_url`: WebSocket 服务器地址

**示例：**

```typescript
console.log('WebSocket 地址:', window.Wui.initConfig.ws_url);
```

---

### 2. 订阅消息

```typescript
window.Wui.ws.subscribe<T>(title: string, callback: (data: T) => void): () => void
```

**参数：**

- `title`: 订阅标题（如：`POSIMM.FXSPOT.PAIR`）
- `callback`: 消息回调函数

**返回：**

- 取消订阅函数

**示例：**

```typescript
// 订阅头寸消息
const unsubscribe = window.Wui.ws.subscribe<PositionResponse>(
  'POSIMM.FXSPOT.PAIR',
  data => {
    console.log('收到头寸消息:', data);
  }
);

// 取消订阅
unsubscribe();
```

---

### 3. 取消订阅

```typescript
window.Wui.ws.unsubscribe(title: string, callback?: (data: unknown) => void): void
```

**参数：**

- `title`: 订阅标题
- `callback`: 可选，指定要取消的回调函数。不传则取消该 title 的所有订阅

**示例：**

```typescript
// 取消指定回调
window.Wui.ws.unsubscribe('POSIMM.FXSPOT.PAIR', myCallback);

// 取消该 title 的所有订阅
window.Wui.ws.unsubscribe('POSIMM.FXSPOT.PAIR');
```

---

### 4. 获取 WebSocket 信息

```typescript
window.Wui.ws.getInfo(): WebSocketInfo
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
const info = window.Wui.ws.getInfo();
console.log('WebSocket 信息:', info);
```

---

### 5. 断开连接

```typescript
window.Wui.ws.disconnect(): void
```

**示例：**

```typescript
window.Wui.ws.disconnect();
```

---

### 6. 重新连接

```typescript
window.Wui.ws.reconnect(): void
```

**示例：**

```typescript
window.Wui.ws.reconnect();
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
    const unsubscribe = window.Wui.ws.subscribe<OrderData[]>(
      'FXSPOT.COM.ORDER',
      (data) => {
        console.log('收到订单更新:', data);
        setOrders(data);
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
  const unsubscribe = window.Wui.ws.subscribe('FXSPOT.COM.ORDER', data => {
    console.log('页面 A 收到消息:', data);
  });
  return () => unsubscribe();
}, []);

// 页面 B
useEffect(() => {
  const unsubscribe = window.Wui.ws.subscribe('FXSPOT.COM.ORDER', data => {
    console.log('页面 B 收到消息:', data);
  });
  return () => unsubscribe();
}, []);

// 当服务器推送 FXSPOT.COM.ORDER 消息时，页面 A 和 B 都会收到
```

---

### 场景 3: 在浏览器控制台调试

```typescript
// 查看配置
window.Wui.initConfig;

// 查看连接信息
window.Wui.ws.getInfo();

// 订阅消息
window.Wui.ws.subscribe('FXSPOT.COM.ORDER', data => {
  console.log('控制台收到消息:', data);
});

// 查看当前订阅
window.Wui.ws.getInfo().subscriptions;
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

服务器推送的消息需要符合以下格式：

```json
{
  "title": "POSIMM.FXSPOT.PAIR",
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
  CONNECTING = 'CONNECTING', // 连接中
  CONNECTED = 'CONNECTED', // 已连接
  DISCONNECTED = 'DISCONNECTED', // 已断开
  RECONNECTING = 'RECONNECTING', // 重连中
  ERROR = 'ERROR', // 错误
}
```

---

## 特性

1. **全局访问**: 通过 `window.Wui` 全局访问，方便在任何地方使用
2. **配置文件**: 使用 `init.json` 配置，易于管理和修改
3. **系统级初始化**: 应用启动时自动连接，无需在组件中初始化
4. **自动重连**: 连接断开后自动重连，默认最多重连 10 次
5. **心跳检测**: 每 30 秒发送一次心跳，保持连接活跃
6. **多订阅支持**: 同一个 title 可以在不同页面同时订阅
7. **消息分发**: 根据 title 自动分发消息到对应的订阅者
8. **类型安全**: 支持 TypeScript 泛型，提供完整的类型提示

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
window.Wui.initConfig; // 配置信息
window.Wui.ws; // WebSocket 方法
```

## 已集成页面

- **头寸监控** (`/position`): 订阅 `POSIMM.FXSPOT.PAIR` 消息，实时更新头寸数据
