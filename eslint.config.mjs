import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import eslintConfigPrettier from 'eslint-config-prettier';

export default [
    {
        name: 'global-ignores',
        ignores: [
            '**/dist/**',
            '**/node_modules/**',
            '**/.vite/**',
            '**/coverage/**',
            '**/build/**',
        ],
    },
    {
        name: 'js-recommended',
        ...js.configs.recommended,
    },
    ...tseslint.configs.recommended.map((config, index) => ({
        name: `typescript-eslint-recommended-${index}`,
        ...config,
    })),
    {
        name: 'prettier-config',
        ...eslintConfigPrettier,
    },
    {
        name: 'project-overrides',
        files: ['**/*.{js,mjs,cjs,ts,tsx,mts,cts}'],
        languageOptions: {
            globals: {
                ...globals.node,
                ...globals.browser,
            },
        },
        rules: {
            // '@typescript-eslint/no-explicit-any': 'warn',
        },
    },
];
