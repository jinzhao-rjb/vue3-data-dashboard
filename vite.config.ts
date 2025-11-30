import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  build: {
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          // 拆分大型依赖，优化加载速度
          echarts: ['echarts'],
          elementPlus: ['element-plus'],
          vue: ['vue'],
          pinia: ['pinia'],
          vueRouter: ['vue-router'],
          axios: ['axios']
        }
      }
    }
  }
})
