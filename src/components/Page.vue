<script setup lang="ts">
import Toast from '@/wxcomponents/vant/toast/toast'
import Dialog from '@/wxcomponents/vant/dialog/dialog'

defineProps({
  // 使用flex布局
  flex: Boolean,
  // 自定义class
  classes: String,
})

const instance = getCurrentInstance()!

onShow(() => {
  Toast.setDefaultOptions({
    context: instance.ctx,
    selector: '#van-toast',
  })

  Dialog.setDefaultOptions({
    context: instance.ctx,
    selector: '#van-dialog',
  })
})
</script>

<script lang="ts">
export default {
  options: {
    virtualHost: true,
  },
}
</script>

<template>
  <div class="page" :class="[{ 'flex flex-col': flex }, classes]">
    <van-toast id="van-toast" />
    <van-dialog id="van-dialog" />

    <slot />
  </div>
</template>
