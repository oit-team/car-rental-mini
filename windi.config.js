import { defineConfig } from 'windicss/helpers'

export default defineConfig({
  preflight: false,
  prefixer: false,
  extract: {
    exclude: ['node_modules', '.git', 'dist', 'src/wxcomponents/@vant'],
  },
  corePlugins: {
    container: false,
  },
  theme: {
    extend: {
      colors: {
        'primary': '#02696E',
        'primary-2': '#DEF5ED',
        'primary-1': '#f8fdfc',
        'secondary': '#666666',
        'accent': '#FED202',
        'greyish': '#F8F8F8',
        'price': '#FF0000',
        'wx-brand': '#1AAD19',
      },
    },
  },
})
