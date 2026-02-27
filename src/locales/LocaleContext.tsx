import { createContext, useContext, useEffect, useState } from 'react';
import { IntlProvider } from 'react-intl';
import enUS from './en-US';
import zhCN from './zh-CN';

// 定义语言类型
export type LocaleType = 'zh-CN' | 'en-US';

// 创建上下文
interface LocaleContextProps {
    locale: LocaleType;
    setLocale: (locale: LocaleType) => void;
}

const LocaleContext = createContext<LocaleContextProps | undefined>(undefined);

// 语言提供者组件
export const LocaleProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [locale, setLocale] = useState<LocaleType>('zh-CN');

    // 在组件挂载时从本地存储获取语言设置
    useEffect(() => {
        const storedLocale = localStorage.getItem('locale') as LocaleType | null;
        if (
            storedLocale &&
            (storedLocale === 'zh-CN' || storedLocale === 'en-US')
        ) {
            setLocale(storedLocale);
        }
    }, []);

    // 当语言改变时保存到本地存储
    useEffect(() => {
        localStorage.setItem('locale', locale);
    }, [locale]);

    // 获取对应语言的消息
    const getMessages = () => {
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
        <LocaleContext.Provider value={{ locale, setLocale }}>
            <IntlProvider locale={locale} messages={getMessages()}>
                {children}
            </IntlProvider>
        </LocaleContext.Provider>
    );
};

// 自定义hook用于访问语言上下文
export const useLocale = () => {
    const context = useContext(LocaleContext);
    if (!context) {
        throw new Error('useLocale must be used within a LocaleProvider');
    }
    return context;
};
