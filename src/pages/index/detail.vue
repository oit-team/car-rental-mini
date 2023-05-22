<script>
import CarCard from '../car/component/CarCard.vue'
import DataFlow from '../car/component/DataFlow.vue'
import Violation from '../car/component/Violation.vue'
import CardItem from './component/CardItem.vue'
import Card from './component/Card.vue'
import Document from './component/Document.vue'
import { previewImg } from '@/utils/helper'
import LeaseOrder from '@/pages/car/component/LeaseOrder.vue'
import ScrollBtm from '@/components/business/ScrollBtm/ScrollBtm.vue'
import { getT3OperationalDataList, getVehicleDetailed, getViolationInfo } from '@/api/car'
import { getDriverMap, getLeaseOrderList, getT3LeaseOrderList } from '@/api/driver'

export default {
  components: {
    LeaseOrder,
    ScrollBtm,
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
      orderActive: 1,
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
      leaseOrderFormData: {
        pageSize: 20,
        pageNum: 1,
      },
      leaseOrderT3FormData: {
        pageSize: 20,
        pageNum: 1,
      },
      leaseOrderList: [],
      leaseOrderListT3: [],
      leaseOrderEmpty: false,
      leaseOrderCanReLoad: false,
      leaseOrderT3Empty: false,
      leaseOrderT3CanReLoad: false,
    }
  },
  computed: {
    driveLicenseAssistant() {
      return this.driverInfo?.driveLicense?.driveLicenseAssistant
    },
  },
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
    if (this.active === 4 && this.orderActive === 1) {
      this.leaseOrderFormData.pageNum++
      await this.getLeaseOrderListReload()
    }
    if (this.active === 4 && this.orderActive === 2) {
      this.leaseOrderT3FormData.pageNum++
      await this.getT3LeaseOrderListReload()
    }
  },
  async onShow() {
    await this.getInfo()
    await this.getT3OperationalDataList()
    await this.getLeaseOrderList()
    await this.getT3LeaseOrderList()
  },
  methods: {
    previewImg,
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
        driverId: this.id,
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
        driverId: this.id,
      })
      this.operationalDataList = [...this.operationalDataList, ...res.body.resultList]
      this.operationalCanReLoad = res.body.count > this.operationalDataList.length
    },
    // 租赁订单-自营
    async getLeaseOrderList() {
      const res = await getLeaseOrderList({
        ...this.leaseOrderFormData,
        driverId: this.id,
      })
      this.leaseOrderList = res.body.resultList
      this.leaseOrderEmpty = this.leaseOrderList.length === 0
      this.leaseOrderCanReLoad = res.body.totalCount > this.leaseOrderList.length
    },
    // 租赁订单-自营 加载
    async getLeaseOrderListReload() {
      if (!this.leaseOrderCanReLoad)
        return
      const res = await getLeaseOrderList({
        ...this.leaseOrderFormData,
        driverId: this.id,
      })
      this.leaseOrderList = [...this.leaseOrderList, ...res.body.resultList]
      this.leaseOrderCanReLoad = res.body.totalCount > this.leaseOrderList.length
    },
    // 租赁订单-T3
    async getT3LeaseOrderList() {
      const res = await getT3LeaseOrderList({
        ...this.leaseOrderT3FormData,
        driverId: this.id,
      })
      this.leaseOrderListT3 = res.body.resultList
      this.leaseOrderT3Empty = this.leaseOrderListT3.length === 0
      this.leaseOrderT3CanReLoad = res.body.totalCount > this.leaseOrderListT3.length
    },
    // 租赁订单-T3 加载
    async getT3LeaseOrderListReload() {
      if (!this.leaseOrderT3CanReLoad)
        return
      const res = await getT3LeaseOrderList({
        ...this.leaseOrderT3FormData,
        driverId: this.id,
      })
      this.leaseOrderListT3 = [...this.leaseOrderListT3, ...res.body.resultList]
      this.leaseOrderT3CanReLoad = res.body.totalCount > this.leaseOrderListT3.length
    },
    resetFormData() {
      this.operationalFormData.pageNum = 1
      this.violationFormData.pageNum = 1
    },
    orderChange(e) {
      this.orderActive = e.detail.name
    },
    toDetail(p) {
      const url = p.type === 'T3' ? 'leaseOrderT3Detail' : 'leaseOrderDetail'
      uni.navigateTo({
        url: `/pages/lease/${url}?id=${p.id}&type=${p.type}`,
      })
    },
  },
}
</script>

<template>
  <page classes="w-full h-full p-3 bg-neutral-100 box-border">
    <card-item :item="driverInfo">
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
            <view v-if="operationalEmpty" class="bg-white">
              <van-empty description="暂无数据" />
            </view>
          </van-tab>
          <van-tab v-if="driverInfo.vehicleId" title="违章" :name="2">
            <view v-if="violationEmpty" class="bg-white">
              <van-empty description="无违章记录" />
            </view>
            <view v-else class="py-2 bg-white">
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
            <view v-if="driveLicenseAssistant" class="py-2 flex justify-center bg-white">
              <van-image
                width="150"
                height="150"
                fit="contain"
                :src="driveLicenseAssistant[0]"
                @click="previewImg(driveLicenseAssistant)"
              />
            </view>
            <view v-else class="w-full bg-white">
              <van-empty description="暂无数据" />
            </view>
          </van-tab>
          <van-tab title="租赁订单" :name="4">
            <view class="bg-white">
              <van-tabs
                :active="orderActive"
                color="#1296db"
                :ellipsis="false"
                line-width="100"
                @change="orderChange"
              >
                <van-tab title="自营" :name="1">
                  <view
                    v-if="leaseOrderEmpty"
                    class="bg-white"
                  >
                    <van-empty description="暂无数据" />
                  </view>
                  <view v-if="!leaseOrderEmpty" class="bg-white p-2">
                    <view v-for="(item, index) in leaseOrderList" :key="index">
                      <lease-order :item="item" type="my" @click-event="toDetail" />
                    </view>
                    <scroll-btm :can-reload="leaseOrderCanReLoad" />
                  </view>
                </van-tab>
                <van-tab title="T3" :name="2">
                  <view v-if="leaseOrderT3Empty" class="bg-white">
                    <van-empty description="暂无数据" />
                  </view>
                  <view v-if="!leaseOrderT3Empty" class="bg-white p-2">
                    <view v-for="(item, index) in leaseOrderListT3" :key="index">
                      <lease-order :list="item" type="T3" @click-event="toDetail" />
                    </view>
                    <scroll-btm :can-reload="leaseOrderT3CanReLoad" />
                  </view>
                </van-tab>
              </van-tabs>
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
