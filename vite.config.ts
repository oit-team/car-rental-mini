import path from 'path'
import { defineConfig } from 'vite'
import Uni from '@dcloudio/vite-plugin-uni'
import Unocss from 'unocss/vite'
import Eslint from 'vite-plugin-eslint'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@/': `${path.resolve(__dirname, 'src')}/`,
    },
  },
  plugins: [
    Uni(),
    // https://github.com/antfu/unocss
    // see unocss.config.ts for config
    Unocss(),
    Eslint(),
  ],
})
