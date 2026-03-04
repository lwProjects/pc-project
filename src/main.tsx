import { ConfigProvider } from 'antd';
import enUS from 'antd/locale/en_US';
import zhCN from 'antd/locale/zh_CN';
import ReactDOM from 'react-dom';
import { RouterProvider } from 'react-router-dom';
import './index.css';
import { LocaleProvider, useLocale } from './locales/LocaleContext.tsx';
import router from './router';
import { initGlobal } from './utils/globalInit';

// 初始化全局对象（包括 WebSocket）
initGlobal();

// 创建一个包装组件来提供 Ant Design 的本地化支持
const AppWithAntdLocale = () => {
  const { locale } = useLocale();

  // 根据当前语言选择 Ant Design 的本地化配置
  const getAntdLocale = () => {
    switch (locale) {
      case 'zh-CN':
        return zhCN;
      case 'en-US':
        return enUS;
      default:
        return zhCN;
    }
  };

  return (
    <ConfigProvider locale={getAntdLocale()}>
      <RouterProvider router={router} />
    </ConfigProvider>
  );
};

ReactDOM.render(
  <LocaleProvider>
    <AppWithAntdLocale />
  </LocaleProvider>,
  document.getElementById('root')
);
