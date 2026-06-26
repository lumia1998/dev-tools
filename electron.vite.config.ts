import { resolve } from 'path'
import { defineConfig } from 'electron-vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  main: {
    build: {
      minify: 'esbuild',
      rollupOptions: {
        output: {
          manualChunks: undefined
        }
      }
    }
  },
  preload: {
    build: {
      minify: 'esbuild'
    }
  },
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src')
      }
    },
    plugins: [react()],
    build: {
      minify: 'esbuild',
      cssMinify: true,
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor-react': ['react', 'react-dom'],
            'vendor-codemirror': ['@uiw/react-codemirror', '@codemirror/lang-json'],
            'vendor-ui': [
              '@radix-ui/react-scroll-area',
              '@radix-ui/react-separator',
              '@radix-ui/react-slot',
              '@radix-ui/react-tooltip',
              'class-variance-authority',
              'clsx',
              'tailwind-merge'
            ],
            'vendor-utils': ['electron-updater', 'json-stringify-pretty-compact']
          }
        }
      }
    },
    server: {
      port: 4120
    }
  }
})
