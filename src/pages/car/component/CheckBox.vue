<script>
export default {
  components: {},
  props: {
    list: Array,
  },
  emits: ['change'],
  data() {
    return {
      name: 'Vue',
      checkIndex: null,
    }
  },
  computed: {},
  watch: {},
  methods: {
    onClick(item, index) {
      this.checkIndex = index
      this.$emit('change', item)
    },
    reset() {
      this.checkIndex = null
    },
  },
}
</script>

<template>
  <view class="h-full flex items-center">
    <view
      v-for="(item, index) in list"
      :key="item.index"
      class="mr-2 px-6 py-1 rounded"
      :class="{ 'bg-gray-500/50 text-white': checkIndex === item.index }"
      @click="onClick(item, index)"
    >
      {{ item.value }}
    </view>
  </view>
</template>

<style lang="scss" scoped>

</style>
