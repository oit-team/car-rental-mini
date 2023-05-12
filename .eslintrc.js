module.exports = {
  extends: [
    '@uxuip',
  ],
  globals: {
    uni: 'readonly',
    wx: 'readonly',
    getCurrentPages: 'readonly',
  },
  overrides: [
    {
      files: [
        'manifest.json',
      ],
      parser: 'jsonc-eslint-parser',
      rules: {
        'jsonc/key-spacing': 'off',
        'jsonc/indent': 'off',
      },
    },
  ],
  rules: {
    'vue/component-definition-name-casing': [
      'warn',
      'kebab-case',
    ],
    'vue/component-name-in-template-casing': [
      'error',
      'kebab-case',
      { registeredComponentsOnly: false },
    ],
  },
}
