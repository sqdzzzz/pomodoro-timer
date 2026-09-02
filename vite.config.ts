import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // JS/CSS 内联进单个 index.html：双击即可离线打开（file:// 下 ES 模块会被 CORS 拦截）
    viteSingleFile(),
  ],
  // 相对路径：GitHub Pages 和本地直接打开 dist/index.html 都能用
  base: './',
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
})
