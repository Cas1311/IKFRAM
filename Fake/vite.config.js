import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath, URL } from 'url';

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  // Environment variables that start with VITE_ will be exposed to your client-side code
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [vue()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    server: {
      port: 3000,
      open: true,
      proxy: {
        // Example API proxy configuration if needed
        // '/api': {
        //   target: 'http://localhost:5000',
        //   changeOrigin: true,
        //   secure: false,
        //   rewrite: (path) => path.replace(/^\/api/, '')
        // }
      }
    },
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: mode !== 'production',
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks: {
            'vue-vendor': ['vue', 'vue-router', 'vuex'],
            'chart-vendor': ['chart.js', 'vue-chart-3'],
            'date-fns': ['date-fns'],
            'firebase': ['firebase/app', 'firebase/firestore', 'firebase/auth']
          }
        }
      }
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `
            @import "@/assets/styles/_variables.scss";
            @import "@/assets/styles/_mixins.scss";
          `
        }
      }
    },
    define: {
      __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
      __BUILD_DATE__: JSON.stringify(new Date().toISOString()),
      __ENABLE_ANALYTICS__: env.VITE_ENABLE_ANALYTICS === 'true'
    },
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './tests/setup.js',
      coverage: {
        reporter: ['text', 'json', 'html'],
        exclude: [
          'node_modules/',
          'tests/',
          '**/*.spec.js',
          '**/__mocks__/**',
          '**/*.config.js',
          '**/dist/**'
        ]
      }
    }
  };
});
