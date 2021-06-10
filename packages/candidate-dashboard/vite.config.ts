import refresh from '@vitejs/plugin-react-refresh';
import { defineConfig } from 'vite';

import { compilerOptions } from './tsconfig.json';

export default defineConfig({
    resolve: {
        alias: Object.fromEntries(
            Object.entries(compilerOptions.paths).map(([key, value]) => [
                key.replace('*', ''),
                `/${value[0].replace('*', '')}`,
            ]),
        ),
    },
    build: {
        outDir: 'build',
        minify: 'esbuild',
    },
    plugins: [refresh()],
});
