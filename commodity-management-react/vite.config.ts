import {ConfigEnv, defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import {viteMockServe} from "vite-plugin-mock";

// https://vitejs.dev/config/
export default defineConfig(({command}: ConfigEnv) => ({
  plugins: [
    react(),
    viteMockServe({
      localEnabled: command === 'serve',
    }),
  ],
  resolve: {
    alias: {
      '@': '/src',
    },
  }
}));
