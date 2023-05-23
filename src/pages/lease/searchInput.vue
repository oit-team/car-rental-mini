<template>
  <page classes="flex flex-col bg-neutral-100 ">
    <van-search
      :value="value"
      placeholder="请输入车牌号"
      @search="onSearch"
      @change="onSearch"
    />
    <view class="flex-1 w-full overflow-hidden overflow-y-auto bg-white px-2 box-border text-sm">
      <view v-if="showEmpty" class="flex-1 bg-white">
        <van-empty></van-empty>
      </view>

      <view v-else>
        <view v-for="item in list" :key="item" class="" @click="back(item)">
          {{ item.licensePlateNumber }}
          <van-divider custom-style="{margin-top: 2px; margin-bottom: 2px;}" />
        </view>
        <view v-if="canReload" class="text-center text-[#a9a9a9] text-xs py-2" @click="reload">
          查看更多
        </view>
      </view>
    </view>

    <back-top />
  </page>
</template>

<script>
import { getVehicles } from '@/api/car'
import BackTop from '@/components/business/BackTop/BackTop.vue'

export default {
  name: 'search-input',
  components: { BackTop },
  data() {
    return {
      value: '',
      list: [],
      showEmpty: true,
      canReload: false,
      formData: {
        pageNum: 1,
        pageSize: 20,
      },
    }
  },
  onShow() {
  },
  methods: {
    async getData() {
      const { body } = await this.$loading(getVehicles({
        ...this.formData,
        licensePlateNumber: this.value,
        vehicleState: 0,
      }),
      )
      this.list = body.vehicleList
      this.showEmpty = body.count === 0
      this.canReload = body.count > body.vehicleList.length
    },
    async reload() {
      this.formData.pageNum++
      const { body } = await getVehicles({
        ...this.formData,
        licensePlateNumber: this.value,
        vehicleState: 0,
      })
      this.list = [...this.list, ...body.vehicleList]
      this.canReload = body.count > this.list.length
    },
    onSearch(e) {
      this.formData.pageNum = 1
      this.value = e.detail
      this.getData()
    },
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
