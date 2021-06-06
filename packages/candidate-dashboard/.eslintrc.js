module.exports = {
    extends: ['../../.eslintrc.js'],
    env: {
        browser: true,
    },
    rules: {
        'react/react-in-jsx-scope': 'off',
    },
    globals: {
        JSX: 'readonly',
        React: 'readonly',
    },
};
