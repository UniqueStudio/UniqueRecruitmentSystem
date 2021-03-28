const { compilerOptions: { paths } } = require('./tsconfig.json');

module.exports = {
    roots: [
        '<rootDir>/test',
    ],
    transform: {
        '^.+\\.ts?$': 'ts-jest',
    },
    testRegex: '.*\\.spec\\.ts$',
    moduleFileExtensions: [
        'ts',
        'js',
        'json',
    ],
    moduleNameMapper: Object.fromEntries(
        Object.entries(paths).map(([k, v]) => [
            k.replace('*', '(.*)'),
            `<rootDir>/${v[0].replace('*', '$1')}`
        ])
    ),
    testEnvironment: 'node',
};
