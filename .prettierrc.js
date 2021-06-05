module.exports = {
    semi: true,
    arrowParens: 'always',
    singleQuote: true,
    jsxSingleQuote: true,
    trailingComma: 'all',
    tabWidth: 4,
    printWidth: 120,
    overrides: [
        {
            files: '*.{json,yaml,yml,*rc}',
            options: {
                tabWidth: 2,
            },
        },
    ],
};
