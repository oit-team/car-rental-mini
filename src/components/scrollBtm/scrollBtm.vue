<script setup>
defineProps({
  canReload: Boolean,
})
</script>

<template>
  <view class="text-center text-[#888] flex justify-center items-center">
    <view class="w-1/2">
      <van-divider content-position="center">
        {{ canReload ? '正在加载' : '暂无更多' }}
      </van-divider>
    </view>
  </view>
</template>

<style scoped>

</style>
