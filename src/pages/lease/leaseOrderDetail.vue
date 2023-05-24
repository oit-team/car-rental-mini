<script>
import { getLeaseOrderInfo } from '@/api/car'
import { getWorkFlowSteps, getWorkOrderList } from '@/api/work'

export default {
  data() {
    return {
      driverInfo: [
        {
          title: '司机姓名',
          value: 'driverName',
        },
        {
          title: '司机手机号',
          value: 'driverPhone',
        },
        {
          title: '身份证号',
          value: 'identityCard',
        },
      ],
      vehicleInfo: [
        {
          title: '车牌号',
          value: 'licensePlateNumber',
        },
        {
          title: '车辆颜色',
          value: 'bodyColor',
        },
        {
          title: '车架号',
          value: 'vinNo',
        },
      ],
      orderInfo: [
        {
          title: '订单编号',
          value: 'leaseOrderNo',
        },
        {
          title: '方案名称',
          value: 'schemeName',
        },
        {
          title: '租期（月）',
          value: 'leaseTerm',
        },
        {
          title: '押金（元）',
          value: 'cashPledge',
        },
        {
          title: '原月租（元）',
          value: 'rent',
        },
        {
          title: '现月租（元）',
          value: 'preferentialRent',
        },
        {
          title: '起租日期',
          value: 'startTime',
        },
        {
          title: '原终止日期',
          value: 'primaryEndTime',
        },
        {
          title: '终止日期',
          value: 'endTime',
        },
        {
          title: '合同名',
          value: 'contractName',
        },
        {
          title: '备注',
          value: 'remarks',
        },
      ],
      data: {},
      active: 1,
      workOrder: [],
      workFormData: {
        pageSize: 20,
        pageNum: 1,
      },
      nowDetail: {},
      workOrderEmpty: true,
      show: false,
      steps: [],
      nowDetailEmpty: true,
      id: '',
      type: '',
    }
  },
  onLoad(option) {
    if (option) {
      this.id = option.id
      this.type = option.type
    }
  },
  async onShow() {
    await this.getData()
    await this.getWorkOrder()
  },
  methods: {
    async getData() {
      const { body } = await getLeaseOrderInfo({
        leaseOrderId: this.id,
      })
      this.data = body
    },
    async getWorkOrder() {
      const { body } = await getWorkOrderList({
        ...this.workFormData,
        orderCode: this.data.orderInfo?.leaseOrderNo,
      })
      this.workOrder = body.resultList
      this.workOrderEmpty = body.resultList?.length === 0
    },
    async getDetail(item) {
      this.nowDetail = { ...item }
      const { body } = await getWorkFlowSteps({
        workCode: item.workCode,
        flowCode: item.flowCode,
      })

      if (body.workFlowSteps) {
        this.steps = body.workFlowSteps.map((e) => {
          return {
            text: `[${e.name}] 操作人：${e.handleUser}`,
            desc: e.handleTime,
            activeIcon: 'checked',
            inactiveIcon: 'checked',
          }
        })
        this.steps = this.steps.reverse()
      }
      this.nowDetailEmpty = body.workFlowSteps?.length === 0
      this.show = true
    },
    // 去延期申请
    goToPostpone(workCode) {
      uni.navigateTo({
        url: `/pages/car/postponeRequest?workCode=${workCode?.workCode}&orderCode=${workCode?.orderCode}`,
      })
    },
    toChange() {
      uni.setStorageSync('leaseOrderNo', this.data.orderInfo?.leaseOrderNo)
      uni.setStorageSync('oldVehicleId', this.data.orderInfo?.vehicleId)
      uni.navigateTo({
        url: '/pages/lease/change',
      })
    },
    toReturn() {
      uni.navigateTo({
        url: `/pages/lease/return?vid=${this.data.orderInfo?.vehicleId}&did=${this.data.orderInfo?.driverId}&no=${this.data.orderInfo?.leaseOrderNo}&time=${this.data.orderInfo?.startTime}`,
      })
    },
  },

}
</script>

<template>
  <page classes="relative min-h-screen bg-neutral-100 box-border pb-12">
    <van-tabs
      :active="active"
      color="#1296db"
      sticky
      @change="active = $event.detail.name"
    >
      <van-tab title="基础信息" :name="1">
        <view class="px-2">
          <view class="my-2 text-sm text-[#777]">
            司机信息
          </view>
          <van-cell-group>
            <van-cell
              v-for="item in driverInfo"
              :key="item.value"
              :title="item.title"
              :value="data.driverInfo[item.value]"
            />
          </van-cell-group>
        </view>
        <view class="px-2">
          <view class="my-2 text-sm text-[#777]">
            车辆信息
          </view>
          <van-cell-group>
            <van-cell v-for="item in vehicleInfo" :key="item.value" :title="item.title" :value="data.vehicleInfo[item.value]" />
          </van-cell-group>
        </view>
      </van-tab>
      <van-tab title="租赁信息" :name="2">
        <view class="px-2">
          <view class="my-2 text-sm text-[#777]">
            租赁信息
          </view>
          <van-cell-group>
            <van-cell v-for="item in orderInfo" :key="item.value" :title="item.title" :value="data.orderInfo[item.value] || '暂无'" />
          </van-cell-group>
        </view>
        <view class="px-2">
          <view class="my-2 text-sm text-[#777]">
            账单信息
          </view>
          <view class="bg-white rounded-lg">
            <view v-for="item in data.billingInfo" :key="item.numberOfPeriods" class="flex justify-between items-center text-sm text-[#333] py-2 px-4">
              <view class="flex-1">
                {{ item.numberOfPeriods }}
              </view>
              <view class="flex-1">
                {{ item.accountingPeriod }}
              </view>
              <view class="flex-1 text-right">
                {{ item.rent }}
              </view>
            </view>
          </view>
        </view>
      </van-tab>
      <van-tab title="工单" :name="3">
        <view>
          <view v-if="workOrderEmpty">
            <van-empty description="暂无数据" />
          </view>
          <view v-else class="p-2">
            <view
              v-for="item in workOrder"
              :key="item.workCode"
              class="p-2 leading-loose shadow rounded-md mb-2 bg-white text-xs"
              @click="getDetail(item)"
            >
              <view class="flex place-content-between">
                <view>
                  {{ item.workCode }}
                </view>
                <view>
                  <van-tag type="primary" class="ml-2">
                    {{ item.statusName }}
                  </van-tag>
                </view>
              </view>
              <view class="flex place-content-between">
                <view>司机姓名：{{ item.driverName }}</view>
                <view>{{ item.licensePlateNumber }}</view>
              </view>
              <view class="flex place-content-between">
                <van-tag type="success">
                  {{ item.workName }}
                </van-tag>
                <view>
                  {{ item.createDate }}
                </view>
              </view>
            </view>
          </view>
        </view>
      </van-tab>
    </van-tabs>

    <view class="w-full fixed bottom-0 p-2 z-20 box-border grid grid-cols-4 gap-1 bg-white shadow">
      <van-button
        size="small"
        block
        class="flex-1"
        color="#fb923c"
        :disabled="data.orderInfo.orderStatue !== 1"
        @click="toChange()"
      >
        换车
      </van-button>
      <van-button
        size="small"
        block
        class="flex-1"
        color="#1296db"
        :disabled="data.orderInfo.orderStatue !== 1"
        @click="goToPostpone(workOrder[0])"
      >
        延期
      </van-button>
      <van-button
        size="small"
        block
        class="flex-1"
        color="#1296db"
        :disabled="!(data.orderInfo.orderStatue === 1 || data.orderInfo.orderStatue === 2)"
        @click="uni.navigateTo({ url: `/pages/order/car-renewal/apply?orderNo=${data.orderInfo.leaseOrderNo}` })"
      >
        续租
      </van-button>
      <van-button
        size="small"
        block
        class="flex-1"
        color="#be123c"
        :disabled="!(data.orderInfo.orderStatue === 1 || data.orderInfo.orderStatue === 2)"
        @click="toReturn"
      >
        退车
      </van-button>
    </view>

    <van-popup
      :show="show"
      position="bottom"
      :close-on-click-overlay="true"
      round
      @close="show = false"
    >
      <view class="h-60vh flex flex-col">
        <view v-if="nowDetailEmpty">
          <van-empty />
        </view>
        <view v-else class="flex-1 overflow-hidden overflow-y-auto p-2">
          <view class="mb-2 text-sm p-2">
            <view class="flex place-content-between">
              <span>发起人：{{ nowDetail.createUserName }}</span>
              <span>{{ nowDetail.city }} </span>
            </view>
            <view class="flex place-content-between mt-2">
              <span>发起时间：{{ nowDetail.createDate }}</span>
            </view>
          </view>
          <van-divider custom-style="{margin: 0;}" />
          <van-steps
            :steps="steps"
            :active="0"
            direction="vertical"
            active-color="#1296db"
            inactive-color="#1296db"
          />
        </view>
      </view>
    </van-popup>
  </page>
</template>

<style lang="scss" scoped>
</style>
