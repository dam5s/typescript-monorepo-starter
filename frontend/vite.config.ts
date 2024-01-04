/// <reference types="vitest" />
import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
    server: {
        proxy: {
            '/api': 'http://localhost:3001',
        },
    },
    plugins: [
        react(),
    ],
    test: {
        globals: true,
        clearMocks: true,
        watch: false,
        environment: 'jsdom',
        setupFiles: './src/TestSupport/Setup.ts',
    },
});
