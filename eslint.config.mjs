import {includeIgnoreFile} from '@eslint/compat'
import oclif from 'eslint-config-oclif'
import prettier from 'eslint-config-prettier'
import path from 'node:path'
import {fileURLToPath} from 'node:url'
import {configs as tsEslintConfig} from 'typescript-eslint' // TypeScript 规则插件

const gitignorePath = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '.gitignore')

/** @type {import('eslint').Linter.Config[]} */
export default [
  includeIgnoreFile(gitignorePath),
  ...oclif,
  ...tsEslintConfig.recommended,
  prettier,
  {
    rules: {
      camelcase: 'off',
      'unicorn/prefer-ternary': 'off',
    },
  },
]
