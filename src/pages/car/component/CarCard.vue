<script>
export default {
  components: {},
  props: {
    item: Object,
    isList: Boolean,
  },
  emits: ['click'],
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
  <view class="bg-white p-2 flex justify-center box-border rounded-md shadow-lg" @click="$emit('click', item)">
    <view class="flex items-center">
      <!--      <image -->
      <!--        class="w-80px h-80px rounded-md" -->
      <!--        mode="aspectFit" -->
      <!--        :src="item.src" -->
      <!--      /> -->
    </view>
    <view class="text-sm flex-1 leading-loose">
      <view class="flex justify-between">
        <view>
          {{ item.licensePlateNumber || '暂无' }}
        </view>
        <view v-if="isList">
          <van-tag :type="item.vehicleState === '待租' ? 'warning' : 'success'">
            {{ item.vehicleState }}
          </van-tag>
        </view>
        <view v-else>
          <van-tag :type="item.vehicleState === 0 ? 'warning' : 'success'">
            {{ item.vehicleState === 0 ? '待租' : '运营中' }}
          </van-tag>
        </view>
      </view>
      <view>
        <van-tag class="mr-1" type="primary">
          {{ item.bodyColor }}
        </van-tag>
        <van-tag class="" type="success">
          {{ item.city }}
        </van-tag>
      </view>
      <view class="text-xs flex justify-between items-center leading-loose">
        <view>
          <span class="text-[#888]">车架号：</span>{{ item.vehicleFrameNumber }}
        </view>

        <view class="text-xs">
          {{ item.createTime }}
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>

</style>
