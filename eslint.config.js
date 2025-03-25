const js = require('@eslint/js');
const globals = require('globals');

module.exports = [
    js.configs.recommended,
    {
        files: ['**/*.js'],
        languageOptions: {
            globals: {
                ...globals.node,
                ...globals.jest
            },
            ecmaVersion: 'latest',
            sourceType: 'module'
        },
        rules: {
            'no-console': 'warn',
            'no-unused-vars': 'warn',
            'semi': ['error', 'always'],
            'quotes': ['error', 'single']
        }
    }
];