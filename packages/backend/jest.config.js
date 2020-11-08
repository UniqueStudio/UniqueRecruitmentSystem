const tsconfig = require('./tsconfig.json');

const paths = tsconfig.compilerOptions.paths;

const moduleNameMapper = Object.keys(paths).reduce((acc, curr) => {
    return {
        ...acc,
        [`^${curr.match(/@.*\//)[0]}(.*)$`]: '<rootDir>' + paths[curr][0].replace('*', '$1'),
    };
}, {});

module.exports = {
    roots: [
        '<rootDir>/test',
    ],
    transform: {
        '^.+\\.ts?$': 'ts-jest',
    },
    testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.ts?$',
    moduleFileExtensions: [
        'ts',
        'tsx',
        'js',
        'jsx',
        'json',
        'node',
    ],
    testEnvironment: 'node',
    moduleNameMapper,
};
