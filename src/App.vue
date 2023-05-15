<script setup lang="ts">
import { onHide, onLaunch, onShow } from '@dcloudio/uni-app'

onLaunch(() => {
  console.info('App Launch')
})
onShow(() => {
  console.info('App Show')
})
onHide(() => {
  console.info('App Hide')
})
</script>

<style>
page {
  height: 100vh;
  background-color: #f8f8f8;
}
</style>
