import { defineConfig } from 'vite';

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

    optimizeDeps: {
        include: ['idb', 'date-fns', 'zod', 'nanoid'],
    },
});
