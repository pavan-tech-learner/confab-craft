import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  if (mode === 'widget') {
    // Build configuration for embeddable widget
    return {
      plugins: [react()],
      resolve: {
        alias: {
          "@": path.resolve(__dirname, "./src"),
        },
      },
      build: {
        lib: {
          entry: path.resolve(__dirname, 'src/widget.tsx'),
          name: 'ChatWidget',
          fileName: 'chat-widget',
          formats: ['umd']
        },
        rollupOptions: {
          external: [],
          output: {
            globals: {}
          }
        },
        outDir: 'dist',
        assetsDir: '',
        cssCodeSplit: false,
        minify: 'terser',
        terserOptions: {
          compress: {
            drop_console: true,
            drop_debugger: true
          }
        }
      },
      define: {
        'process.env.NODE_ENV': '"production"'
      }
    }
  }

  // Development configuration
  return {
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      port: 3001,
      host: true
    }
  }
})
