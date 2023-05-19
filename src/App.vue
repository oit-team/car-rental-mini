<script>
import { clearToken, hasToken } from '@/utils/token'

export default {
  onLaunch() {
    console.info('App Launch')

    hasToken() && this.$store.dispatch('updateUserInfo')
      .catch(() => {
        // 忽略错误
        clearToken()
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
