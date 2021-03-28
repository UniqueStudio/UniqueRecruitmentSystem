module.exports = {
    parser: '@typescript-eslint/parser',
    parserOptions: {
        project: 'tsconfig.json',
        sourceType: 'module',
    },
    plugins: ['@typescript-eslint'],
    extends: [
        'eslint:recommended',
        'plugin:import/errors',
        'plugin:import/warnings',
        'plugin:import/typescript',
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
        'prettier',
    ],
    root: true,
    rules: {
        'max-len': ['warn', { code: 120 }],
        'quote-props': ['warn', 'as-needed'],
        'arrow-parens': ['warn', 'always'],
        'no-empty': ['warn', { allowEmptyCatch: true }],
        'padded-blocks': ['warn', 'never'],
        'lines-between-class-members': ['warn', 'always'],
        'no-trailing-spaces': ['warn'],
        'no-multiple-empty-lines': ['warn', { max: 1, maxBOF: 0, maxEOF: 1 }],
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-unsafe-assignment': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off',
        '@typescript-eslint/quotes': [
            'warn',
            'single',
            {
                avoidEscape: true,
            },
        ],
        '@typescript-eslint/semi': ['warn', 'always'],
        '@typescript-eslint/comma-dangle': ['warn', 'always-multiline'],
        '@typescript-eslint/member-delimiter-style': ['warn'],
        'import/order': [
            'warn',
            {
                groups: ['builtin', 'external', 'parent', 'sibling', 'index'],
                'newlines-between': 'always',
                alphabetize: {
                    order: 'asc',
                    caseInsensitive: true,
                },
            },
        ],
    },
    settings: {
        'import/parsers': {
            '@typescript-eslint/parser': ['.ts', '.tsx'],
        },
        'import/resolver': {
            typescript: {},
        },
    },
    env: {
        node: true,
    },
    ignorePatterns: ['build', '**/*.js'],
};
