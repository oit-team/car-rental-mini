<script>
export default {
  methods: {
    backTop() {
      uni.pageScrollTo({
        scrollTop: 0,
        duration: 300,
      })
    },
  },
}
</script>

<template>
  <view class="fixed bottom-4 right-4">
    <view class="bg-[#1296db] w-8 h-8 backTop rounded-1/2 flex place-content-center" @click="backTop">
      <van-icon name="back-top" color="#fff" />
    </view>
  </view>
</template>

<style scoped>

</style>
