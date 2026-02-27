# 路由使用说明

## 项目结构

```
src/
├── router/
│   └── index.tsx          # 路由配置
├── layout/
│   └── index.tsx          # 布局组件（包含导航菜单）
├── page/
│   └── position/
│       └── index.tsx      # Position 页面
├── I18nPage.tsx           # 首页
└── main.tsx               # 入口文件
```

## 当前路由

- `/` - 首页
- `/position` - Position 页面（表格示例）

## 如何添加新页面

1. 在 `src/page/` 下创建新页面文件夹和组件
2. 在 `src/router/index.tsx` 中添加路由配置
3. 在 `src/layout/index.tsx` 的 `menuItems` 中添加菜单项

### 示例：添加一个新页面

**1. 创建页面组件** `src/page/example/index.tsx`

```tsx
const Example = () => {
  return <div>Example Page</div>;
};

export default Example;
```

**2. 添加路由** 在 `src/router/index.tsx`

```tsx
import Example from '../page/example';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      // ... 其他路由
      {
        path: 'example',
        element: <Example />,
      },
    ],
  },
]);
```

**3. 添加菜单** 在 `src/layout/index.tsx`

```tsx
const menuItems = [
  // ... 其他菜单
  {
    key: '/example',
    label: 'Example',
  },
];
```

## 运行项目

```bash
# 开发模式
npm run dev

# 构建
npm run build

# 预览构建结果
npm run preview
```

## 访问地址

- 开发环境：http://localhost:5174
- 首页：http://localhost:5174/
- Position 页面：http://localhost:5174/position
