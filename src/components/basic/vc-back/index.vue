<script>
export default {
  props: {
    zIndex: {
      type: Number,
      default: 110,
    },
  },

  computed: {
    position() {
      const { top, height, right } = uni.getMenuButtonBoundingClientRect()
      const { windowWidth } = uni.getWindowInfo()
      const unit = v => `${v}px`

      return {
        width: unit(height),
        height: unit(height),
        top: unit(top),
        left: unit(windowWidth - right),
        zIndex: this.zIndex,
      }
    },
  },
}
</script>

<template>
  <van-icon class="vc-back" :style="[position]" name="arrow-left" size="18" @click="uni.navigateBack()" />
</template>

<style>
.vc-back {
  position: fixed;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 50%;
  z-index: 50;
  border: rgba(0, 0, 0, 0.1) solid 1rpx;
  box-sizing: border-box;
}
</style>
