<script>
export default {
  components: {},
  props: {
    list: Array,
  },
  data() {
    return {
      name: 'Vue',
    }
  },
  computed: {},
  watch: {},
  methods: {},
}
</script>

<template>
  <view class="bg-white flex p-2 overflow-hidden">
    <view class="flex gap-2 overflow-hidden overflow-x-auto">
      <view
        v-for="item in list"
        :key="item.modelCode"
        class="bg-[#1296db] rounded-xl px-3 py-1 text-xs text-white whitespace-nowrap w-max"
      >
        {{ item.brandSeriesModel }}
      </view>
    </view>
    <slot />
  </view>
</template>

<style lang="scss" scoped>

</style>
