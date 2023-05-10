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
  rules: {},
}
