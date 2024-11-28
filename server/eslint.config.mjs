import eslint from '@eslint/js';
import jsdoc from 'eslint-plugin-jsdoc';
import tseslint from 'typescript-eslint';
import globals from 'globals';
import vitest from 'eslint-plugin-vitest';

export default tseslint.config(
    eslint.configs.recommended,
    tseslint.configs.recommended,
    tseslint.configs.stylistic,
    tseslint.configs.strict,
    {
        files: ['src/**/*.{ts,tsx}', '**/__tests__/**/*.{ts,tsx}'],
        languageOptions: {
            parser: tseslint.parser,
            ecmaVersion: 2022,
            sourceType: 'module',
            globals: {
                ...globals.node,
            },
        },
        plugins: {
            jsdoc,
            vitest,
        },
        rules: {
            ...eslint.configs.recommended.rules,
            'jsdoc/require-description': 'error',
            'jsdoc/require-jsdoc': [
                'error',
                {
                    require: {
                        FunctionDeclaration: true,
                        MethodDefinition: true,
                        ClassDeclaration: true,
                        ArrowFunctionExpression: true,
                    },
                },
            ],
            'jsdoc/check-alignment': 'error',
            'jsdoc/check-param-names': 'error',
            'jsdoc/check-types': 'error',
            'jsdoc/require-returns': 'error',
            'jsdoc/require-returns-type': 'error',
            'jsdoc/valid-types': 'error',
            'max-len': ['error', { code: 100, tabWidth: 2, ignoreUrls: true }],
            'no-console': ['error', { allow: ['warn', 'error'] }],
            'no-debugger': 'error',
            'no-empty-function': ['error', { allow: ['arrowFunctions'] }],
            'prefer-const': 'error',
            'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
            'no-undef': 'error',
            'vitest/expect-expect': 'error',
            'vitest/prefer-to-have-length': 'error',
            'vitest/no-conditional-expect': 'error',
            'vitest/consistent-test-it': 'error',
            '@typescript-eslint/no-explicit-any': 'error',
            '@typescript-eslint/explicit-module-boundary-types': 'error',
            '@typescript-eslint/ban-ts-comment': 'error',
        },
    }
);
