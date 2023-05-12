import path from 'path'
import { type PluginOption, defineConfig } from 'vite'
import Uni from '@dcloudio/vite-plugin-uni'
import Unocss from 'unocss/vite'
import Eslint from 'vite-plugin-eslint'
import AutoImport from 'unplugin-auto-import/vite'

/**
 * 修复微信小程序组件编译问题
 * @link https://github.com/dcloudio/uni-app/issues/3290#issuecomment-1053970982
 */
function FixWxComponents(): PluginOption {
  return {
    name: 'fix-wxcomponents',
    enforce: 'post',
    configResolved(config) {
      if (process.env.UNI_PLATFORM === 'mp-weixin') {
        const { output } = config.build.rollupOptions as any
        const { manualChunks } = output as any
        output.manualChunks = (id: string, api: any) => {
          if (id.includes('wxcomponents')) {
            // 将 wxcomponents 中的 js 编译为 common/wxcomponents.js
            return 'common/wxcomponents'
          }
          return manualChunks(id, api)
        }
      }
    },
  }
}

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
    FixWxComponents(),
  ],
})
