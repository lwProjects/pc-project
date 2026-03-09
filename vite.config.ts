/*
 * @Author: liuwei2783 liuwei2783@erayt.com
 * @Date: 2025-08-28 11:55:54
 * @LastEditors: liuwei2783 liuwei2783@erayt.com
 * @LastEditTime: 2026-03-06 09:11:51
 * @FilePath: \react\vite.config.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    sourcemap: true, // 生产环境也生成 source map
  },
  css: {
    devSourcemap: true, // CSS source map
  },
});
