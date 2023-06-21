import Vue from 'vue'
import Vuex from 'vuex'
import { clearToken, setToken } from '@/utils/token'
import { getUserToken, login as userLogin } from '@/api/account'

Vue.use(Vuex)

const plugins = process.env.NODE_ENV !== 'production' ? [Vuex.createLogger()] : []

export default new Vuex.Store({
  plugins,

  state: {
    userInfo: {},
    userLoginPromise: null,
  },

  getters: {
    // 是否已登录
    logged: state => Object.keys(state.userInfo).length > 0,
  },

  mutations: {
    setUserInfo(state, payload) {
      state.userInfo = payload
    },
  },

  actions: {
    // 账号登录
    async login(ctx, form) {
      try {
        const res = await userLogin(form)
        setToken(res.body.accessToken)
        ctx.commit('setUserInfo', res.body)
      }
      catch (err) {
        clearToken()
        throw err
      }
    },
    async updateUserInfo(ctx) {
      ctx.state.userLoginPromise = getUserToken()
      const res = await ctx.state.userLoginPromise
      ctx.commit('setUserInfo', res.body)
      setToken(res.body.accessToken)
      uni.setStorageSync('userId', res.body.userId)
    },
  },
})
