import Axios from 'luch-request'
import ApiError, { type ApiErrorOptions } from './ApiError'
import { Toast } from '@/components'
import { useUserStore } from '@/store/user'

// 创建接口错误封装对象
function createApiError(option: ApiErrorOptions) {
  return new ApiError(option).reject()
}

const axiosInstance = new Axios({
  baseURL: import.meta.env.VITE_APP_API_URL,
  timeout: 60000,
})

// 添加请求拦截器
axiosInstance.interceptors.request.use((config) => {
  config.header ??= {}
  config.header.token = uni.getStorageSync('token')
  return config
}, (error) => {
  return createApiError({ error })
})

// 添加响应拦截器
axiosInstance.interceptors.response.use((response) => {
  if (response.header['Content-Type'].includes('application/json') && response.data.head?.status !== 0) {
    return createApiError({
      url: response?.config.url,
      response,
      status: response?.statusCode,
      message: response.data.head.msg,
      code: response.data.head.status,
    })
  }
  return response
}, async (error) => {
  return createApiError({
    error,
    url: error?.config?.url,
    message: error?.errMsg,
  })
})

function isApiError(err: unknown): err is ApiError {
  return err instanceof ApiError
}

/**
 * 处理接口错误
 */
export function errorHandler(error: unknown) {
  // 处理接口错误
  if (isApiError(error)) {
    if (error.resolved)
      return

    const httpStatusCode = error.error?.statusCode
    let message = error.message

    if (httpStatusCode > 500)
      message = '服务器出错\n请稍后重试'

    // 弹出提示
    Toast.fail({
      message,
    })
  }
}

/**
 * post请求封装
 * @param {string} url 接口地址
 * @param {object} data 参数
 * @param {object} config 请求配置
 */
export function post(url: string, data: any = {}, config: any = {}) {
  const user = useUserStore()

  const wrapData = {
    head: {
      aid: user.profile?.userId,
      cmd: config.cmd,
      ver: '1.0',
      ln: 'cn',
      mod: 'app',
      de: '2019-10-16',
      sync: 1,
      uuid: user.profile?.orgId,
      chcode: 'ef19843298ae8f2134f',
    },
    con: data,
  }

  return axiosInstance
    .post(url, wrapData, config)
    .then(res => res.data)
}
