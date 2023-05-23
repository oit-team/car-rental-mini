<script>
import { clearToken, hasToken } from '@/utils/token'

export default {
  onLaunch() {
    console.info('App Launch')
    if (!hasToken()) {
      uni.reLaunch({
        url: '/pages/account/login',
      })
    }

    hasToken() && this.$store.dispatch('updateUserInfo')
      .catch(() => {
        // 忽略错误
        clearToken()
        uni.clearStorageSync()
        uni.reLaunch({
          url: '/pages/account/login',
        })
      })
  },
  onShow() {
    console.info('App Show')
  },
  onHide() {
    console.info('App Hide')
  },
}
</script>

<style lang="scss">
@import "./styles";
</style>
