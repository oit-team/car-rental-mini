let promiseLoadingDelay: NodeJS.Timeout

/**
 * 根据promise状态显示loading效果
 * @param {Promise | Promise[]} promises
 * @param config
 */
export function promiseLoading(
  promises: Promise<any> | Promise<any>[],
  config?: {
    title?: string
    delay?: number
  } | string,
) {
  config = typeof config === 'string'
    ? { title: config }
    : config

  promiseLoadingDelay = setTimeout(() => {
    uni.showLoading({
      title: '正在加载...',
      mask: true,
      ...config as any,
    })
  }, Number(config?.delay ?? 200))

  const closeToast = () => {
    clearTimeout(promiseLoadingDelay)
    uni.hideLoading()
  }

  // 数组时执行all方法
  if (Array.isArray(promises))
    return Promise.all(promises).finally(closeToast)

  return promises.finally(closeToast)
}

/**
 * 弹出提示
 */
export function toast(config: WechatMiniprogram.ShowToastOption | string) {
  config = typeof config === 'string'
    ? { title: config }
    : config

  uni.showToast({
    ...config,
  })
}
