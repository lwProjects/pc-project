/*
 * @Author: liuwei2783 liuwei2783@erayt.com
 * @Date: 2026-03-06 09:17:06
 * @LastEditors: liuwei2783 liuwei2783@erayt.com
 * @LastEditTime: 2026-03-06 09:22:34
 * @FilePath: \react\src\utils\index.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
/**
 * 工具函数统一导出
 */

// 导出常量类
import * as constant from './constant';

// 业务功能类命名空间导出
import * as businessFunctions from './business';

// 导出 webSocket
export { default as wsManager } from './webSocket';

// 导出 globalInit
export { initGlobal } from './globalInit';
export type { InitConfig, WuiGlobal } from './globalInit';

// 套层导出使用
export const formatterUtils = businessFunctions;
export const constantUtils = constant;
export const api = {};

// 导出 hooks
export * from './hooks';

// 导出所有常量
export * from './constant';

// 导出所有业务函数
export * from './business';
