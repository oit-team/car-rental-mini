import path from 'path'
import { defineConfig } from 'vite'
import Uni from '@dcloudio/vite-plugin-uni'
import Unocss from 'unocss/vite'
import Eslint from 'vite-plugin-eslint'
import AutoImport from 'unplugin-auto-import/vite'

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
    // https://github.com/antfu/unplugin-auto-import
    AutoImport({
      imports: [
        'vue',
        {
          '@dcloudio/uni-app': [
            'onAddToFavorites',
            'onBackPress',
            'onError',
            'onHide',
            'onLaunch',
            'onLoad',
            'onNavigationBarButtonTap',
            'onNavigationBarSearchInputChanged',
            'onNavigationBarSearchInputClicked',
            'onNavigationBarSearchInputConfirmed',
            'onNavigationBarSearchInputFocusChanged',
            'onPageNotFound',
            'onPageScroll',
            'onPullDownRefresh',
            'onReachBottom',
            'onReady',
            'onResize',
            'onShareAppMessage',
            'onShareTimeline',
            'onShow',
            'onTabItemTap',
            'onThemeChange',
            'onUnhandledRejection',
            'onUnload',
          ],
        },
      ],
      dts: true,
      vueTemplate: true,
    }),
  ],
})
