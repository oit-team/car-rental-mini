<script>
import { clearToken, hasToken } from '@/utils/token'

export default {
  onLaunch() {
    console.info('App Launch')

    hasToken() && this.$store.dispatch('updateUserInfo')
      .catch(() => {
        // 忽略错误
        clearToken()
        uni.reLaunch({
          url: '/pages/account/login',
        })
      })

    !hasToken() && uni.reLaunch({ url: '/pages/account/login' })
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
