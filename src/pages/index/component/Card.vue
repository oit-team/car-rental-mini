<script>
export default {
  components: {},
  props: {
  },
  // emits: ['clickEvent'],
  data() {
    return {
    }
  },
  computed: {},
  watch: {},
  methods: {},
}
</script>

<template>
  <view class="bg-white rounded" @click="$emit('clickEvent')">
    <view class="flex justify-between items-center p-2 text-sm">
      <view>
        <slot name="title-left" />
      </view>
      <view>
        <slot name="title-right" />
      </view>
    </view>
    <van-divider custom-style="margin: 0;" />

    <view class="">
      <slot name="card-content" />
    </view>
  </view>
</template>

<style lang="scss" scoped>
</style>
