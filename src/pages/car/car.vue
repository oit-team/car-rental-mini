<script>
import CarCard from './component/CarCard.vue'
import CheckBox from './component/CheckBox.vue'
import BackTop from '@/components/business/BackTop/BackTop.vue'
import Tabs from '@/components/business/Tabs/Tabs.vue'
import { getVehicleBrandSeriesModel, getVehicleList } from '@/api/car'

export default {
  components: {
    BackTop,
    Tabs,
    CarCard,
    Check: CheckBox,
  },
  data: () => ({
    name: 'Vue',
    tabList: [],
    formData: {
      pageSize: 20,
      pageNum: 1,
      licensePlateNumber: '',
      vehicleState: null,
    },
    carList: [],
    showEmpty: false,
    showFilter: false,
    canReLoad: false,
    carState: [{
      value: '待租',
      index: 0,
    }, {
      value: '已租',
      index: 1,
    }],
  }),
  onShow() {
    this.getTabList()
    this.formData.pageNum = 1
    this.getData()
  },
  async onPullDownRefresh() {
    this.formData.pageNum = 1
    await this.getData()
    uni.stopPullDownRefresh()
  },
  async onReachBottom() {
    this.formData.pageNum++
    await this.reload()
  },
  methods: {
    async getTabList() {
      const res = await getVehicleBrandSeriesModel()
      this.tabList = res.body.resultList
    },
    async getData() {
      await uni.showLoading({
        title: '加载中',
        mask: true,
      })
      this.showFilter = false
      const res = await getVehicleList({
        ...this.formData,
      }).finally(() => uni.hideLoading())
      this.carList = res.body.vehicleList
      this.showEmpty = res.body.vehicleList?.length === 0
      this.canReLoad = this.carList.length < res.body.count
      uni.hideLoading()
    },
    async reload() {
      if (!this.canReLoad)
        return
      uni.showLoading({ title: '加载中', mask: true })
      const res = await getVehicleList({ ...this.formData }).finally(() => uni.hideLoading())
      this.carList = this.carList.concat(...res.body.vehicleList)
      this.canReLoad = this.carList.length < res.body.count
      uni.hideLoading()
    },
    resetForm() {
      this.formData.pageNum = 1
      this.formData.licensePlateNumber = ''
      this.formData.vehicleState = null
      this.$refs.check.reset()
    },
    checkChange(e) {
      this.formData.vehicleState = e.index
    },
    itemClick(item) {
      uni.navigateTo({
        url: `/pages/car/detail?id=${item.vehicleId}`,
      })
    },
    onClear() {
      this.formData.licensePlateNumber = ''
      this.getData()
    },
    onSearch(e) {
      this.formData.pageNum = 1
      this.formData.licensePlateNumber = e.detail
      this.getData()
    },
    select() {
      this.formData.pageNum = 1
      this.getData()
    },
  },
}
</script>

<template>
  <page classes="bg-neutral-100 flex flex-col min-h-screen">
    <view class="sticky top-0 left-0 z-10">
      <van-search
        :value="formData.licensePlateNumber"
        placeholder="车牌号"
        class="shadow-lg mb-2"
        @search="onSearch"
        @clear="onClear"
        @change="formData.licensePlateNumber = $event.detail"
      />
      <tabs :list="tabList" class="h-auto shadow-lg">
        <view class="pl-2" @click="showFilter = true">
          <van-icon name="filter-o" />
        </view>
      </tabs>
    </view>
    <view v-if="showEmpty">
      <van-empty
        class="custom-image"
        description="暂无数据"
      />
    </view>
    <view v-else class="flex-1 p-2 box-border">
      <view class="grid grid-cols-1 gap-2">
        <car-card
          v-for="item of carList"
          :key="item.vehicleId"
          :item="item"
          :is-list="true"
          @click="itemClick"
        />
        <view v-if="carList.length" class="text-center text-[#888] pb-2 flex justify-center items-center">
          <view class="w-1/2">
            <van-divider content-position="center">
              {{ canReLoad ? '正在加载' : '我也是有底线的' }}
            </van-divider>
          </view>
        </view>
      </view>
    </view>

    <back-top />

    <van-popup
      :show="showFilter"
      position="top"
      :close-on-click-overlay="true"
      round
      @close="showFilter = false"
    >
      <view class="p-2 px-4 text-xs">
        <view>
          <view class="my-2">
            车辆状态
          </view>
          <check ref="check" :list="carState" @change="checkChange" />
        </view>
        <view class="flex justify-around mt-2">
          <van-button size="small" @click="resetForm">
            重置
          </van-button>
          <van-button type="primary" size="small" @click="select">
            查询
          </van-button>
        </view>
      </view>
    </van-popup>
  </page>
</template>

<style lang="scss" scoped>
.backTop{
  box-shadow: 0px 0px 12px rgba(0, 0, 0, .12);
}
</style>
