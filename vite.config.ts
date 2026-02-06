import { defineConfig } from 'vite';
import * as path from 'node:path';

export default defineConfig({
    base: '/expense-calculator/',

    plugins: [],

    server: {
        port: 3000,
        open: true,
    },

    build: {
        outDir: 'dist',
        sourcemap: true,
    },

    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src'),
        },
    },

    optimizeDeps: {
        include: ['idb', 'date-fns', 'nanoid'],
    },
});
