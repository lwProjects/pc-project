/*
 * @Author: liuwei2783 liuwei2783@erayt.com
 * @Date: 2026-02-10 11:47:23
 * @LastEditors: liuwei2783 liuwei2783@erayt.com
 * @LastEditTime: 2026-03-04 10:35:58
 * @FilePath: \project\src\utils\globalInit.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
/**
 * @Description: 全局初始化，挂载 Lw 到 window
 * @Author: Your Name
 * @Date: 2026-02-10
 */

import initConfig from '../../init.json';
import wsManager, { MessageCallback, WebSocketInfo } from './webSocket';

/** 初始化配置接口 */
export interface InitConfig {
  /** WebSocket 服务器地址 */
  ws_url: string;
  /** 其他配置项可以在这里扩展 */
  [key: string]: unknown;
}

/** Wui 全局对象接口 */
export interface WuiGlobal {
  /** 初始化配置 */
  initConfig: InitConfig;
  /** WebSocket 相关方法 */
  ws: {
    /** 初始化 WebSocket */
    init: (url: string) => void;
    /** 订阅消息（支持泛型） */
    subscribe: <T = unknown>(
      menuId: string,
      titles: string[],
      callback: MessageCallback<T>
    ) => () => void;
    /** 取消订阅 */
    unsubscribe: (menuId: string, callback?: MessageCallback<unknown>) => void;
    /** 获取 WebSocket 信息 */
    getInfo: () => WebSocketInfo;
    /** 断开连接 */
    disconnect: () => void;
    /** 重新连接 */
    reconnect: () => void;
  };
}

/**
 * 初始化全局 Wui 对象
 *
 * 1. 加载 init.json 配置文件
 * 2. 挂载配置到 window.Wui.initConfig
 * 3. 挂载 WebSocket 方法到 window.Wui.ws
 * 4. 自动初始化 WebSocket 连接
 */
export function initGlobal(): void {
  if (typeof window === 'undefined') {
    console.warn('[Wui] 非浏览器环境，跳过初始化');
    return;
  }
  console.log('[Wui] 开始初始化全局对象');
  console.log('[Wui] 加载配置:', initConfig);

  // 挂载到 window
  (window as Window & { Wui: WuiGlobal }).Wui = {
    // 挂载初始化配置
    initConfig: initConfig as InitConfig,

    // WebSocket 相关方法
    ws: {
      init: (url: string) => {
        wsManager.init({ url });
        console.log('[Wui] WebSocket 初始化完成');
      },
      subscribe: <T = unknown>(
        menuId: string,
        titles: string[],
        callback: MessageCallback<T>
      ) => {
        return wsManager.subscribe<T>(menuId, titles, callback);
      },
      unsubscribe: (menuId: string, callback?: MessageCallback<unknown>) => {
        wsManager.unsubscribe(menuId, callback);
      },
      getInfo: () => {
        return wsManager.getInfo();
      },
      disconnect: () => {
        wsManager.disconnect();
      },
      reconnect: () => {
        wsManager.reconnect();
      },
    },
  };

  // 自动初始化 WebSocket 连接
  if (initConfig.ws_url) {
    console.log(`[Wui] 自动初始化 WebSocket: ${initConfig.ws_url}`);
    wsManager.init({ url: initConfig.ws_url });
  } else {
    console.warn('[Wui] 配置文件中未找到 ws_url，跳过 WebSocket 初始化');
  }

  console.log('[Wui] 全局对象初始化完成');
  console.log('[Wui] 使用方式:');
  console.log('  - Wui.initConfig.ws_url // 访问配置');
  console.log(
    '  - Wui.ws.subscribe("menu-id", ["TITLE1", "TITLE2"], (data) => console.log(data))'
  );
  console.log('  - Wui.ws.getInfo()');
}

// 声明全局类型
declare global {
  interface Window {
    Wui: WuiGlobal;
  }
}
