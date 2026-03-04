/// <reference types="vite/client" />

// 声明图片模块
declare module '*.png' {
  const value: string;
  export default value;
}

declare module '*.jpg' {
  const value: string;
  export default value;
}

declare module '*.jpeg' {
  const value: string;
  export default value;
}

declare module '*.gif' {
  const value: string;
  export default value;
}

declare module '*.svg' {
  const value: string;
  export default value;
}

declare module '*.webp' {
  const value: string;
  export default value;
}

declare module '*.ico' {
  const value: string;
  export default value;
}

declare module '*.bmp' {
  const value: string;
  export default value;
}

// 全局 Wui 对象声明
import type { WuiGlobal } from './utils/globalInit';

declare global {
  const Wui: WuiGlobal;

  interface Window {
    Wui: WuiGlobal;
  }
}
