//  @ts-check

import { tanstackConfig } from '@tanstack/eslint-config'
import tailwindCanonicalClasses from 'eslint-plugin-tailwind-canonical-classes'

export default [
  ...tanstackConfig,
  {
    plugins: {
      'tailwind-canonical-classes': tailwindCanonicalClasses,
    },
    rules: {
      'tailwind-canonical-classes/tailwind-canonical-classes': [
        'warn',
        {
          cssPath: './src/styles.css',
        },
      ],
      'import/no-cycle': 'off',
      'import/order': 'off',
      'sort-imports': 'off',
      '@typescript-eslint/array-type': 'off',
      '@typescript-eslint/require-await': 'off',
      'pnpm/json-enforce-catalog': 'off',
    },
  },
  {
    ignores: ['eslint.config.js', 'prettier.config.js'],
  },
]
