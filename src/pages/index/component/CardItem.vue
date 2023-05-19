<script>
export default {
  props: {
    item: Object,
  },
  data() {
    return {
      name: 'Vue',
    }
  },
  computed: {},
  watch: {},
  methods: {
  },
}
</script>

<template>
  <view
    class="bg-white shadow-md flex py-2 rounded box-border"
    @click="$emit('to-detail')"
  >
    <view class="pl-2 flex items-center">
      <image
        class="w-70px h-70px rounded-md"
        src="/static/user.png"
      />
      <!--      :src="item.headPortrait" -->
    </view>
    <view class="flex-1 text-xs px-2 leading-loose">
      <view class="flex justify-between">
        <view class="text-base">
          {{ item.driverName || '无' }}
        </view>
        <slot />
      </view>
      <view class="w-full">
        <van-tag v-if="item.age" type="primary" class="mr-2">
          {{ item.age }}
        </van-tag>
        <van-tag v-if="item.sex && item.sex !== '暂无'" color="#888888" class="mr-2">
          {{ item.sex }}
        </van-tag>
        <van-tag v-if="item.city" type="success" class="mr-2">
          {{ item.city }}
        </van-tag>
      </view>
      <view class="flex justify-between">
        <view class="w-120px truncate">
          {{ item.driverPhone || '暂无' }}
        </view>
        <view>
          <span class="text-[#888]">入驻时间：</span>
          <text>
            {{ item.createTime || '暂无' }}
          </text>
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.van-image__img {
  border-radius: 6px !important;
}
</style>
