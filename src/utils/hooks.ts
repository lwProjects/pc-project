/*
 * @Author: liuwei2783 liuwei2783@erayt.com
 * @Date: 2026-03-06 11:57:12
 * @LastEditors: liuwei2783 liuwei2783@erayt.com
 * @LastEditTime: 2026-03-09 10:58:06
 * @FilePath: \react\src\utils\hooks.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { useEffect, useRef } from 'react';

/**
 * 根据依赖更新 useRef
 *
 * 当依赖项变化时，自动更新 ref 的值
 * 适用于需要在回调中访问最新状态，但又不想触发重新渲染的场景
 *
 * @param value - 要存储在 ref 中的值
 * @returns ref 对象
 *
 * @example
 * ```tsx
 * const [count, setCount] = useState(0);
 * const countRef = useLatestRef(count);
 *
 * useEffect(() => {
 *   const timer = setInterval(() => {
 *     // 始终能访问到最新的 count 值
 *     console.log('Latest count:', countRef.current);
 *   }, 1000);
 *   return () => clearInterval(timer);
 * }, []); // 空依赖，但能访问最新值
 * ```
 */
export function useLatestRef<T>(value: T) {
  const ref = useRef<T>(value);

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref;
}
