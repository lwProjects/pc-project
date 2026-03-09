# React Trading Platform

基于 React 17 + TypeScript + Vite 构建的金融交易平台前端项目。

## 技术栈

- **React 17** - UI 框架
- **TypeScript** - 类型安全
- **Vite 4** - 构建工具
- **Ant Design 5** - UI 组件库
- **react-intl** - 国际化
- **ali-react-table** - 高性能表格
- **pako** - 数据压缩/解压
- **Less** - CSS 预处理器

## 项目结构

```
src/
├── component/          # 公共组件
│   └── Table/         # 表格组件封装
├── layout/            # 布局组件
├── locales/           # 国际化配置
│   ├── zh-CN.ts      # 中文
│   └── en-US.ts      # 英文
├── page/              # 页面模块
│   └── position/     # 头寸监控模块
├── router/            # 路由配置
├── utils/             # 工具函数
│   ├── webSocket.ts  # WebSocket 管理器
│   ├── globalInit.ts # 全局初始化
│   ├── business.ts   # 业务工具函数
│   ├── hooks.ts      # React Hooks
│   └── README.md     # WebSocket 使用文档
└── main.tsx          # 应用入口
```

## 核心功能

### 1. WebSocket 通信

项目采用中央广播式 WebSocket 架构，支持多页面订阅、自动重连、消息分发。

#### 特性

- **单例模式**：全局唯一 WebSocket 连接
- **智能订阅**：首次订阅自动注册，最后取消自动注销
- **消息队列**：连接未就绪时缓存消息，连接后自动发送
- **自动重连**：断线自动重连，最多 10 次
- **心跳保活**：30 秒心跳，保持连接活跃
- **数据格式**：支持压缩数据（pako）、明文 JSON、原始字符串

#### 消息格式

**服务器 → 客户端：**

```
title:数据
```

支持三种格式：

1. 压缩数据：`POSIMM.FXSPOT.PAIR:eJyLrlZKLE...`（推荐）
2. 明文 JSON：`POSIMM.FXSPOT.PAIR:{"data":[...]}`
3. 原始数据：`SYSTEM.STATUS:online`

**客户端 → 服务器：**

- 注册订阅：`#Atitle1/title2/title3`
- 取消订阅：`#Dtitle1/title2/title3`
- 心跳：`ping`

#### 使用示例

```typescript
// 订阅消息
const unsubscribe = Wui.ws.subscribe(
  'menu-id',
  ['POSIMM.FXSPOT.PAIR'],
  message => {
    console.log('title:', message.title);
    console.log('data:', message.data);
    console.log('timestamp:', message.timestamp);
  }
);

// 取消订阅
unsubscribe();
```

详细文档：[src/utils/README.md](src/utils/README.md)

### 2. 头寸监控模块（Position）

实时监控外汇头寸数据，支持多货币对展示。

#### 功能特性

- ✅ 实时数据推送（WebSocket）
- ✅ 多货币对支持（10个货币对）
- ✅ 可拖拽调整布局（5个面板区域）
- ✅ 表格行选择（全选/清空/获取选中）
- ✅ 虚拟滚动（高性能）
- ✅ 国际化（中英文）

#### 支持的货币对

- USD/AUD, EUR/USD, GBP/USD, USD/JPY, AUD/USD
- EUR/AUD, GBP/AUD, USD/CNY, EUR/GBP, AUD/JPY

#### 数据字段

| 字段         | 说明          | 字段         | 说明       |
| ------------ | ------------- | ------------ | ---------- |
| currencyPair | 货币对        | dealCurrency | 交易货币   |
| dealPort     | 交易敞口      | dayDealPort  | 日交易敞口 |
| dealPortUSD  | 交易敞口(USD) | realizedPL   | 已实现盈亏 |
| totalPL      | 总盈亏        | marketRate   | 市场汇率   |
| costRate     | 成本汇率      | longFrozen   | 多头冻结   |
| shortFrozen  | 空头冻结      | shortVolume  | 空头数量   |
| longVolume   | 多头数量      | floatingPL   | 浮动盈亏   |
| updateTime   | 更新时间      | -            | -          |

#### 路由

```
/position - 头寸监控页面
```

### 3. Maker 报价模块（待开发）

做市商报价管理模块，用于管理和监控外汇报价。

#### 计划功能

- 🔲 实时报价展示
- 🔲 报价录入/修改
- 🔲 报价历史查询
- 🔲 报价策略配置
- 🔲 报价监控告警
- 🔲 多货币对支持

#### 预计路由

```
/maker - Maker 报价页面
```

## 快速开始

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

访问：http://localhost:5173

### 构建生产版本

```bash
npm run build
```

### 预览生产版本

```bash
npm run preview
```

## 配置

### WebSocket 配置

编辑 `init.json`：

```json
{
  "ws_url": "ws://localhost:3001/ws"
}
```

### 国际化配置

- 中文：`src/locales/zh-CN.ts`
- 英文：`src/locales/en-US.ts`

## 开发指南

### 添加新页面

1. 在 `src/page/` 下创建页面目录
2. 在 `src/router/index.tsx` 中添加路由
3. 在 `src/locales/` 中添加国际化文本

### 使用 WebSocket

```typescript
import { useEffect } from 'react';

function MyComponent() {
  useEffect(() => {
    // 订阅消息
    const unsubscribe = Wui.ws.subscribe(
      'my-menu',
      ['MY.TITLE'],
      (message) => {
        console.log(message.data);
      }
    );

    // 清理
    return () => unsubscribe();
  }, []);

  return <div>My Component</div>;
}
```

## 性能优化

- ✅ 虚拟滚动（ali-react-table）
- ✅ 数据压缩（pako）
- ✅ 代码分割（React.lazy）
- ✅ 生产环境 Source Map

## 浏览器支持

- Chrome >= 90
- Firefox >= 88
- Safari >= 14
- Edge >= 90

## Git 提交规范

### 提交格式

```
【修改内容】: (此次提交修改内容)
【提交类型】: (此次提交对应下方哪一种形式)
【详细描述】: (描述具体修改内容)
【需要测试】: (是否需要测试)
```

### 提交类型

- **feat** - 新功能
- **fixed** - 修复 bug
- **docs** - 文档变更
- **style** - 代码风格（不影响代码运行的变动）
- **refactor** - 代码重构（既不是新增功能，也不是修复 bug）
- **test** - 测试用例修改
- **chore** - 构建工具变更（构建过程或辅助工具的变动）
- **perf** - 性能优化
- **revert** - 撤销之前的提交
- **build** - 构建过程变更

### 提交示例

```
【修改内容】: 添加头寸监控模块
【提交类型】: feat
【详细描述】:
1. 实现头寸数据实时推送
2. 支持 10 个货币对展示
3. 添加表格行选择功能
【需要测试】: 是
```

### 提交规则

1. **提交前必须先拉取代码**

   ```bash
   git pull origin main
   ```

2. **每次提交文件数量不能大于 10 个**
   - 便于代码审查
   - 如果修改文件过多，请分批提交

3. **不同提交类型的文件分开提交**
   - 新功能（feat）单独提交
   - Bug 修复（fixed）单独提交
   - 文档更新（docs）单独提交

4. **提交信息要清晰明确**
   - 说明修改了什么
   - 为什么要修改
   - 影响范围

### 提交流程

```bash
# 1. 拉取最新代码
git pull origin main

# 2. 查看修改的文件
git status

# 3. 添加文件（不超过 10 个）
git add file1.ts file2.tsx ...

# 4. 提交（按照规范填写）
git commit -m "
【修改内容】: 优化 WebSocket 连接逻辑
【提交类型】: refactor
【详细描述】:
1. 添加消息队列机制
2. 优化重连逻辑
3. 改进错误处理
【需要测试】: 是
"

# 5. 推送到远程
git push origin main
```

## 许可证

MIT

## 联系方式

q:2591654285
