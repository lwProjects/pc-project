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
