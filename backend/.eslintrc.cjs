module.exports = {
    env: {
        browser: true,
        es2021: true,
        node: true, // Add this line
    },
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:react/recommended',
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        ecmaVersion: 'latest',
        sourceType: 'module',
    },
    plugins: [
        'react',
        '@typescript-eslint',
    ],
    rules: {
        // Your existing rules
    },
    settings: {
        react: {
            version: 'detect',
        },
    },
};
