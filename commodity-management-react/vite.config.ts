import {ConfigEnv, defineConfig, loadEnv} from 'vite'
import react from '@vitejs/plugin-react'
import {viteMockServe} from "vite-plugin-mock";

// https://vitejs.dev/config/
export default defineConfig(({command, mode}: ConfigEnv) => {
  // 获取各个环境下的环境变量
  const env = loadEnv(mode, process.cwd());
  return {
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
    },
    // 代理跨域
    server: {
      proxy: {
        [env.VITE_APP_BASE_API]: {
          target: env.VITE_SERVE, //获取数据的服务器地址设置
          changeOrigin: true, //需要代理跨域
          //路径重写
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
  };
});
