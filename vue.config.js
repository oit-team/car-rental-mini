const MiniProgramTailwindWebpackPlugin = require('@oit/mini-program-tailwind-webpack-plugin')

module.exports = {
  transpileDependencies: ['luch-request'],
  configureWebpack: {
    plugins: [
      new MiniProgramTailwindWebpackPlugin({
        designWidth: 375,
        utilitiesSettings: {
          customAttributes: {
            'van-*': 'custom-class',
          },
        },
      }),
    ],
  },
}
