const { compilerOptions: { paths } } = require('./tsconfig.json');
const { version } = require('./package.json');

/*
 * TODO: when we have updated snowpack to v3.1+, we can pass version as a property of `env` object,
 * as mentioned in https://www.snowpack.dev/reference/environment-variables#option-2%3A-config-file .
 */
process.env.SNOWPACK_PUBLIC_VERSION = version;

module.exports = {
    mount: {
        public: {
            url: '/',
            static: false,
        },
        src: {
            url: '/build',
        },
    },
    plugins: [
        '@snowpack/plugin-react-refresh',
        '@snowpack/plugin-typescript',
    ],
    devOptions: {
        open: 'none',
        port: 3000,
    },
    alias: Object.fromEntries(
        Object.entries(paths || {}).map(([key, value]) =>
            [key.replace('*', ''), value[0].replace('*', '')],
        ),
    ),
    routes: [
        {
            match: 'routes',
            src: '.*',
            dest: '/index.html'
        },
    ],
    optimize: {
        treeshake: true,
        minify: true,
        target: 'es2015',
    },
    buildOptions: {
        sourcemap: false,
    },
};
