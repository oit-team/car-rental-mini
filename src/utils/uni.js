const routeApi = ['navigateTo', 'redirectTo', 'switchTab']

routeApi.forEach((api) => {
  uni[api] = ((fn) => {
    return function (options) {
      options = typeof options === 'string' ? { url: options } : options
      fn.call(this, options)
    }
  })(uni[api])
})
