import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
      },
      manifest: {
        short_name: 'todo.it',
        name: '',
        description: '',
        start_url: '.',
        display: 'standalone',
        orientation: 'portrait',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        icons: [
        ],
      },
      devOptions: {
        enabled: false,
      }
    }),
  ],
});
