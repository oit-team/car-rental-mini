<template>
  <page class="flex flex-col bg-neutral-100">
    <van-search
      :value="value"
      placeholder="请输入车牌号"
      show-action
      @search="onSearch"
      @change="onSearch"
      @cancel="onCancel"
    />
    <view class="flex-1 w-full overflow-hidden overflow-y-auto bg-white px-2 box-border">
      <view v-if="showEmpty"></view>

      <view v-for="item in list" :key="item" class="" @click="back(item)">
        {{ item.licensePlateNumber }}
        <van-divider custom-style="{margin-top: 2px; margin-bottom: 2px;}" />
      </view>
      <view class="text-center text-[#a9a9a9]">
        查看更多
      </view>
    </view>
  </page>
</template>

<script>
import { getVehicles } from '@/api/car'

export default {
  name: 'search-input',
  data() {
    return {
      value: '',
      list: [],
      showEmpty: true,
    }
  },
  methods: {
    async getData() {
      const { body } = await getVehicles({
        pageNum: 1,
        pageSize: 20,
        licensePlateNumber: this.value,
        vehicleState: 0,
      })
      this.list = body.vehicleList
      this.showEmpty = body.count === 0
    },
    onSearch(e) {
      this.value = e.detail
      this.getData()
    },
    onCancel() {},
    back(item) {
      uni.redirectTo({
        url: `/pages/lease/change?item=${JSON.stringify(item)}`,
      })
    },
  },
}
</script>

<style scoped>

</style>
