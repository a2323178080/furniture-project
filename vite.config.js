import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: '/',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        // 全域使用 bootstrap5 $xxx 自訂義變數
        additionalData: '@import "@/assets/sass/all.scss";',
      },
    },
  },
  server: {
    port: 30328,
    proxy: {
      './db.json': {
        // target: 'http://localhost:3000', // json-server 的預設執行端口
        target: import.meta.url, // 動態監聽當前開啟網址
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/db\.json/, '')
      },
    }
  }
});