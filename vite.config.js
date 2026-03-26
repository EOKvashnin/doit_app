import { fileURLToPath, URL } from 'node:url'

import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueDevTools(), tailwindcss()],

  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },

  build: {
    target: 'esnext',
    cssCodeSplit: true,
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue', 'vue-router', 'vuex'],
          firebase: ['firebase/app', 'firebase/database'],
          charts: ['apexcharts', 'vue3-apexcharts'],
          utils: ['axios', 'yup', 'vee-validate'],
          animations: ['gsap', 'motion-v'],
          ui: ['flowbite', 'vue-toast-notification', 'vue-virtual-scroller', '@iconify/vue'],
        },
      },
    },
  },
})
