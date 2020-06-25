module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    parserOptions: {
        tsconfigRootDir: __dirname,
        project: ['./tsconfig.json'],
        ecmaVersion: 2020,
        sourceType: 'module',
        ecmaFeatures: {
            jsx: true
        }
    },
    plugins: [
        '@typescript-eslint',
        'react'
    ],
    extends: [
        "plugin:react/recommended",
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
    ],
    rules: {
        'react/display-name': ['off'],
        'react/prop-types': ['off'],
        "@typescript-eslint/explicit-function-return-type": ['off'],
        '@typescript-eslint/quotes': ['warn', 'single', { avoidEscape: true }],
        '@typescript-eslint/semi': ['warn', 'always'],
        "@typescript-eslint/no-unused-vars": ['error', { 'ignoreRestSiblings': true }]

    },
    env: {
        'browser': true,
        'es6': true
    },
    settings: {
        react: {
            version: 'detect'
        }
    },
};
