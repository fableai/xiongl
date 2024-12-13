import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import basicSsl from '@vitejs/plugin-basic-ssl'
import i18n from './scripts/i18n'

// https://vitejs.dev/config/
export default defineConfig((config) => ({
    plugins: [i18n(), react(), basicSsl()],
    base: '/app',
    build: {
        outDir: './dist/app',
    },
    define: {
        '__DEV__': `${JSON.stringify(config.mode)}`
    },
    server: {
        port: 9000,
        proxy: {
            '/api': {
                // target: 'http://47.129.8.10:5294',
                target: 'http://localhost:5152',
                // target: 'http://infokeymind.nat300.top',
                changeOrigin: true,
                ws: true,
                // rewrite: (path) => path.replace(/^\/api/, '')
            }
        }
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
            'i18n': path.resolve(__dirname, './i18n'),
            '@/assets': path.resolve(__dirname, './src/assets'),
            '@/pages': path.resolve(__dirname, './src/pages'),
            '@/components': path.resolve(__dirname, './src/components'),
            '@/store': path.resolve(__dirname, './src/store'),
            '@/theme': path.resolve(__dirname, './src/theme'),
            '@/service': path.resolve(__dirname, './src/service'),
            '@/hooks': path.resolve(__dirname, './src/hooks'),
        },
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.css', '.less']
    }
}))
