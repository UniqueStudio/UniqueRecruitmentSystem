import { transformAsync } from '@babel/core';
import refresh from '@vitejs/plugin-react-refresh';
import { defineConfig } from 'vite';

import { compilerOptions } from './tsconfig.build.json';

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
    plugins: [
        refresh(),
        {
            name: 'lingui-macro',
            enforce: 'pre',
            async transform(source, filename) {
                if (filename.includes('node_modules')) {
                    return;
                }
                if (!source.includes('@lingui/macro')) {
                    return;
                }
                const result = await transformAsync(source, {
                    filename,
                    parserOpts: {
                        plugins: ['jsx', 'typescript'],
                    },
                    plugins: ['babel-plugin-macros'],
                    babelrc: false,
                    configFile: false,
                    generatorOpts: {
                        jsescOption: {
                            // This option is mandatory.
                            // Otherwise, UTF-8 strings will be escaped in the produced code,
                            // which cannot be translated by @lingui/macro.
                            minimal: true,
                        },
                    },
                });
                return result?.code;
            },
        },
    ],
});
