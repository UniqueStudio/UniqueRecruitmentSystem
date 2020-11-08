module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    parserOptions: {
        tsconfigRootDir: __dirname,
        project: ['./tsconfig.json'],
    },
    plugins: [
        '@typescript-eslint',
    ],
    extends: [
        'eslint:recommended',
        'plugin:import/errors',
        'plugin:import/warnings',
        'plugin:import/typescript',
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking'
    ],
    rules: {
        'quotes': [
            'warn',
            'single',
            {
                'avoidEscape': true
            }
        ],
        'semi': [
            'warn',
            'always'
        ],
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-unsafe-assignment': 'off',
        '@typescript-eslint/no-misused-promises': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off',
        '@typescript-eslint/quotes': [
            'warn',
            'single',
            {
                'avoidEscape': true
            }
        ],
        '@typescript-eslint/semi': [
            'warn',
            'always'
        ],
        'import/order': [
            'error',
            {
                'groups': [
                    'builtin',
                    'external',
                    'parent',
                    'sibling',
                    'index'
                ],
                'newlines-between': 'always',
                'alphabetize': {
                    'order': 'asc',
                    'caseInsensitive': true
                }
            }
        ]
    },
    env: {
        node: true,
        browser: false,
        es6: true
    },
    settings: {
        'import/parsers': {
            '@typescript-eslint/parser': ['.ts']
        },
        'import/resolver': {
            typescript: {
                alwaysTryTypes: true
            },
        }
    }
};
