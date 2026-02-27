import { ConfigProvider } from 'antd';
import enUS from 'antd/locale/en_US';
import zhCN from 'antd/locale/zh_CN';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App.tsx';
import './index.css';
import { LocaleProvider, useLocale } from './locales/LocaleContext.tsx';

// 创建一个包装组件来提供 Ant Design 的本地化支持
const AppWithAntdLocale: React.FC = () => {
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
      <App />
    </ConfigProvider>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <LocaleProvider>
      <AppWithAntdLocale />
    </LocaleProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
