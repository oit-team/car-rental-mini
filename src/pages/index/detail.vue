<script>
import CarCard from '../car/component/CarCard.vue'
import DataFlow from '../car/component/DataFlow.vue'
import Violation from '../car/component/Violation.vue'
import CardItem from './component/CardItem.vue'
import Card from './component/Card.vue'
import Document from './component/Document.vue'
import { getT3OperationalDataList, getVehicleDetailed, getViolationInfo } from '@/api/car'
import { getDriverMap } from '@/api/driver'

export default {
  components: {
    Violation,
    Card,
    CardItem,
    CarCard,
    Document,
    DataFlow,
  },
  data() {
    return {
      name: 'Vue',
      id: 0,
      driverInfo: {},
      vehicleDetailed: {},
      active: 0,
      violation: [],
      violationEmpty: false,
      operationalEmpty: false,
      operationalCanReLoad: false,
      violationCanReLoad: false,
      operationalDataList: [],
      operationalFormData: {
        pageSize: 20,
        pageNum: 1,
      },
      violationFormData: {
        pageSize: 20,
        pageNum: 1,
      },
    }
  },
  computed: {},
  watch: {},
  onLoad(option) {
    this.id = option.id
  },
  async onPullDownRefresh() {
    this.formData.pageNum = 1
    await this.getData()
    uni.stopPullDownRefresh()
  },
  async onReachBottom() {
    if (this.active === 1) {
      this.operationalFormData.pageNum++
      await this.getT3OperationalDataListReload()
    }
    if (this.active === 2) {
      this.violationFormData.pageNum++
      await this.getViolationInfoReload()
    }
  },
  async onShow() {
    await this.getInfo()
    await this.getT3OperationalDataList()
  },
  methods: {
    // 司机详情
    async getInfo() {
      const res = await getDriverMap({
        driverId: this.id,
      })
      this.driverInfo = res.body
      if (res.body.vehicleId) {
        await this.getVehicleDetailed(res.body.vehicleId)
        await this.getViolationInfo(res.body.vehicleId)
      }
      uni.setNavigationBarTitle({
        title: this.driverInfo.driverName,
      })
    },
    async getVehicleDetailed(id) {
      const res = await getVehicleDetailed({
        vehicleId: id,
      })
      this.vehicleDetailed = res.body.vehicleDetailed
    },
    onChange(e) {
      this.active = e.detail.name
      this.resetFormData()
    },
    // 车辆违章
    async getViolationInfo(id) {
      const res = await getViolationInfo({
        ...this.violationFormData,
        vehicleId: id,
      })
      this.violation = res.body.resultList
      this.violationEmpty = this.violation.length === 0
      this.violationCanReLoad = res.body.totalCount > this.violation.length
    },
    async getViolationInfoReload() {
      if (!this.violationCanReLoad)
        return
      const res = await getViolationInfo({
        ...this.violationFormData,
        vehicleId: this.id,
      })
      this.violation = [...this.violation, ...res.body.resultList]
      this.violationCanReLoad = res.body.totalCount > this.violation.length
    },
    // 获取流水
    async getT3OperationalDataList() {
      const res = await getT3OperationalDataList({
        ...this.operationalFormData,
        driverId: this.id,
      })

      this.operationalDataList = res.body.resultList
      this.operationalEmpty = this.operationalDataList.length === 0
      this.operationalCanReLoad = res.body.count > this.operationalDataList.length
    },
    async getT3OperationalDataListReload() {
      if (!this.operationalCanReLoad)
        return
      const res = await getT3OperationalDataList({
        ...this.operationalFormData,
        vehicleId: this.id,
      })
      this.operationalDataList = [...this.operationalDataList, ...res.body.resultList]
      this.operationalCanReLoad = res.body.count > this.operationalDataList.length
    },
    resetFormData() {
      this.operationalFormData.pageNum = 1
      this.violationFormData.pageNum = 1
    },
  },
}
</script>

<template>
  <page classes="w-full h-full p-3 bg-neutral-100 box-border">
    <card-item :item="driverInfo">
      <view />
    </card-item>
    <view class="mt-2 rounded-md">
      <!--    车辆信息 -->
      <view v-if="driverInfo.vehicleId" class="py-2">
        <card>
          <template #title-left>
            <view class="flex items-center">
              <view class="border-l-2 border-sky-500 mr-1 h-10px border-solid" />
              当前签约车辆
            </view>
          </template>
          <template #card-content>
            <view>
              <car-card
                :item="vehicleDetailed"
                :is-list="false"
              />
            </view>
          </template>
        </card>
      </view>
      <view class="py-2">
        <van-tabs
          :active="active"
          :swipe-threshold="4"
          :ellipsis="false"
          color="#1296db"
          sticky
          line-width="60"
          @change="onChange"
        >
          <van-tab title="证件信息" :name="0">
            <document :info="driverInfo" />
          </van-tab>
          <van-tab title="运营流水" :name="1">
            <view v-if="!operationalEmpty" class="bg-white">
              <data-flow :list="operationalDataList" />
              <view class="text-center text-[#888] flex justify-center items-center">
                <view class="w-1/2">
                  <van-divider content-position="center">
                    {{ operationalCanReLoad ? '正在加载' : '我也是有底线的' }}
                  </van-divider>
                </view>
              </view>
            </view>
            <view v-else class="bg-white">
              <van-empty description="暂无数据" />
            </view>
          </van-tab>
          <van-tab v-if="driverInfo.vehicleId" title="违章" :name="2">
            <view v-if="violationEmpty" class="bg-white">
              <van-empty description="无违章记录" />
            </view>
            <view v-else class="py-2">
              <violation :violation="violation" />
              <view class="text-center text-[#888] flex justify-center items-center">
                <view class="w-1/2">
                  <van-divider content-position="center">
                    {{ violationCanReLoad ? '正在加载' : '我也是有底线的' }}
                  </van-divider>
                </view>
              </view>
            </view>
          </van-tab>
          <van-tab title="网约资格信息" :name="3">
            <view v-if="driverInfo.driveLicense?.driveLicenseAssistant" class="grid grid-cols-2 gap-2 p-2 bg-white">
              <van-image
                width="150"
                height="150"
                fit="contain"
                :src="driverInfo.driveLicense?.driveLicenseAssistant[0]"
              />
            </view>
            <view v-else class="w-full bg-white">
              <van-empty description="暂无数据" />
            </view>
          </van-tab>
          <!--          <van-tab title="其他信息" name="4"> -->
          <!--            <view class="bg-white"> -->
          <!--              <van-empty description="暂无数据" /> -->
          <!--            </view> -->
          <!--          </van-tab> -->
        </van-tabs>
      </view>
    </view>
  </page>
</template>

<style lang="scss" scoped>
</style>
