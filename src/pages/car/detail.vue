<script>
import Card from '../index/component/Card.vue'
import CardItem from '../index/component/CardItem.vue'
import DataFlow from './component/DataFlow.vue'
import DocumentCar from './component/DocumentCar.vue'
import Violation from './component/Violation.vue'
import { getDriverMap, getLeaseOrderList, getT3LeaseOrderList } from '@/api/driver'
import { getT3OperationalDataList, getVehicleDetailed, getViolationInfo } from '@/api/car'
import { previewImg } from '@/utils/helper'
import ScrollBtm from '@/components/business/ScrollBtm/ScrollBtm.vue'
import LeaseOrder from '@/pages/car/component/LeaseOrder.vue'

export default {
  components: {
    ScrollBtm,
    LeaseOrder,
    Violation,
    Card,
    CardItem,
    DocumentCar,
    DataFlow,
  },
  data() {
    return {
      name: 'Vue',
      id: '',
      info: {},
      violationEmpty: false,
      violationCanReLoad: false,
      violation: [],
      violationFormData: {
        pageSize: 20,
        pageNum: 1,
      },
      active: 0,
      orderActive: 1,
      driverInfo: {},
      operationalDataList: [],
      operationalFormData: {
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
      operationalEmpty: false,
      operationalCanReLoad: false,
      imageListKeys: [],
      imageList: [],
    }
  },
  computed: {},
  watch: {},
  onLoad(option) {
    this.id = option.id
  },
  async onPullDownRefresh() {
    await this.getVehicleDetailed()
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
    if (this.active === 3 && this.orderActive === 1) {
      this.leaseOrderFormData.pageNum++
      await this.getLeaseOrderListReload()
    }
    if (this.active === 3 && this.orderActive === 2) {
      this.leaseOrderT3FormData.pageNum++
      await this.getT3LeaseOrderListReload()
    }
  },
  async onShow() {
    await this.getVehicleDetailed()
    await this.getViolationInfo()
    await this.getT3OperationalDataList()
    await this.getLeaseOrderList()
    await this.getT3LeaseOrderList()
  },
  methods: {
    previewImg,
    // 车辆详情
    async getVehicleDetailed() {
      const res = await getVehicleDetailed({ vehicleId: this.id })
      this.info = res.body.vehicleDetailed
      this.info.driverId && await this.getDriverMap(this.info.driverId)
      if (this.info?.imgList) {
        this.imageListKeys = Object.keys(this.info.imgList)
        this.imageList = Object.values(this.info.imgList)
      }
      await uni.setNavigationBarTitle({
        title: this.info.licensePlateNumber,
      })
    },
    async getDriverMap(id) {
      const res = await getDriverMap({
        driverId: id,
      })
      this.driverInfo = res.body
    },
    // 获取车辆违章
    async getViolationInfo() {
      const res = await getViolationInfo({
        ...this.violationFormData,
        vehicleId: this.id,
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
        vehicleId: this.id,
      })
      this.operationalDataList = res.body.resultList
      this.operationalEmpty = this.operationalDataList.length === 0
      this.operationalCanReLoad = res.body.count > this.operationalDataList.length
    },
    // 获取流水  触底加载
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
    // 租赁订单-自营
    async getLeaseOrderList() {
      const res = await getLeaseOrderList({
        ...this.leaseOrderFormData,
        vehicleId: this.id,
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
        vehicleId: this.id,
      })
      this.leaseOrderList = [...this.leaseOrderList, ...res.body.resultList]
      this.leaseOrderCanReLoad = res.body.totalCount > this.leaseOrderList.length
    },
    // 租赁订单-T3
    async getT3LeaseOrderList() {
      const res = await getT3LeaseOrderList({
        ...this.leaseOrderT3FormData,
        carNumber: this.info.licensePlateNumber,
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
        carNumber: this.info.licensePlateNumber,
      })
      this.leaseOrderListT3 = [...this.leaseOrderListT3, ...res.body.resultList]
      this.leaseOrderT3CanReLoad = res.body.totalCount > this.leaseOrderListT3.length
    },
    resetFormData() {
      this.operationalFormData.pageNum = 1
      this.violationFormData.pageNum = 1
      this.leaseOrderFormData.pageNum = 1
      this.leaseOrderT3FormData.pageNum = 1
    },
    tabChange(e) {
      this.active = e.detail.name
      this.resetFormData()
    },
    orderChange(e) {
      this.orderActive = e.detail.name
    },
    toDriver() {
      uni.navigateTo({
        url: `/pages/index/detail?id=${this.info.driverId}`,
      })
    },
    toDetail(p) {
      const url = p.type === 'T3' ? 'leaseOrderT3Detail' : 'leaseOrderDetail'
      uni.navigateTo({
        url: `/pages/car/${url}?id=${p.id}&type=${p.type}`,
      })
    },
  },
}
</script>

<template>
  <page classes="w-full h-full bg-neutral-100 p-3 text-sm box-border">
    <view v-if="info.imgList" class="mb-2 bg-white rounded-md">
      <swiper :indicator-dots="true" circular>
        <swiper-item v-for="(item, index) in imageListKeys" :key="item">
          <div class="flex justify-center items-center h-full py-2 box-border">
            <image
              class="w-300px h-full"
              mode="aspectFill"
              :src="info.imgList[item]"
              @click="previewImg(imageList, { current: index })"
            />
            <!--            @click="previewImg([info.imgList[item]])" -->
          </div>
        </swiper-item>
      </swiper>
    </view>
    <view class="bg-white rounded-md">
      <card>
        <template #title-left>
          <view class="flex items-center">
            <view class="border-l-2 border-sky-500 mr-1 h-10px border-solid" />
            车辆信息
          </view>
        </template>
        <template #card-content>
          <view class="p-2 box-border">
            <view class="flex justify-between items-center">
              <view>
                <van-tag :type="info.vehicleState === 0 ? 'warning' : 'success'">
                  {{ info.vehicleState === 0 ? '待租' : '运营中' }}
                </van-tag>
                <van-tag type="primary" class="ml-2">
                  {{ info.bodyColor }}
                </van-tag>
              </view>
              <view class="text-xs">
                <view>{{ info.city }}</view>
              </view>
            </view>
            <view />
            <view class="flex justify-between text-xs my-1">
              <view>车架号：{{ info.vehicleFrameNumber }}</view>
              <view>
                {{ info.licensePlateNumber }}
              </view>
            </view>
          </view>
        </template>
      </card>
    </view>
    <view v-if="info.driverId" class="bg-white mt-2 rounded-md">
      <card @click-event="toDriver">
        <template #title-left>
          <view class="flex items-center">
            <view class="border-l-2 border-sky-500 mr-1 h-10px border-solid" />
            当前签约司机
          </view>
        </template>
        <template #title-right>
          <view class="flex" @click="uni.switchTab({ url: '/pages/index/index' })">
            <!--            查看更多 -->
            <van-icon name="arrow" />
          </view>
        </template>
        <template #card-content>
          <card-item :item="driverInfo" />
        </template>
      </card>
    </view>

    <view class="py-2">
      <van-tabs
        :active="active"
        :swipe-threshold="4"
        :ellipsis="false"
        line-width="60"
        color="#1296db"
        sticky
        @change="tabChange"
      >
        <van-tab title="车辆详情" :name="0">
          <document-car :info="info" />
        </van-tab>
        <van-tab title="运营流水" :name="1">
          <view v-if="operationalEmpty" class="bg-white">
            <van-empty description="暂无数据" />
          </view>
          <view v-if="!operationalEmpty" class="bg-white">
            <data-flow :list="operationalDataList" />
            <scroll-btm :can-reload="operationalCanReLoad" />
          </view>
        </van-tab>
        <van-tab title="违章" :name="2">
          <view
            v-if="violationEmpty"
            class="bg-white"
          >
            <van-empty description="无违章记录" />
          </view>
          <view v-if="!violationEmpty" class="py-2 bg-white">
            <violation :violation="violation" />
            <scroll-btm :can-reload="violationCanReLoad" />
          </view>
        </van-tab>
        <van-tab title="租赁订单" :name="3">
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
                <view v-else class="bg-white p-2">
                  <view v-for="item in leaseOrderList" :key="item.id">
                    <lease-order :item="item" type="my" @click-event="toDetail" />
                  </view>
                  <scroll-btm :can-reload="leaseOrderCanReLoad" />
                </view>
              </van-tab>
              <van-tab title="T3" :name="2">
                <view
                  v-if="leaseOrderT3Empty"
                  class="bg-white"
                >
                  <van-empty description="暂无数据" />
                </view>
                <view v-else class="bg-white p-2">
                  <view v-for="item in leaseOrderListT3" :key="item.id">
                    <lease-order :item="item" type="T3" @click-event="toDetail" />
                  </view>
                  <scroll-btm :can-reload="leaseOrderT3CanReLoad" />
                </view>
              </van-tab>
            </van-tabs>
          </view>
        </van-tab>
      </van-tabs>
    </view>
  </page>
</template>

<style lang="scss" scoped>
:deep(van-image){
  width: 100%;
  height: 100%;
}
</style>
