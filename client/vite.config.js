import path from 'path';
import viteReact from '@vitejs/plugin-react';
import { TanStackRouterVite } from '@tanstack/router-plugin/vite';
import { defineConfig, loadEnv } from 'vite';
export default defineConfig(function (_a) {
    var mode = _a.mode;
    var env = loadEnv(mode, process.cwd(), '');
    return {
        define: {
            'process.env.ROOT_URL': JSON.stringify(env.ROOT_URL),
        },
        plugins: [
            TanStackRouterVite({
                experimental: {
                    enableCodeSplitting: true,
                },
            }),
            viteReact(),
        ],
        resolve: {
            alias: {
                '@': path.resolve(__dirname, './src'),
            },
        },
    };
});
