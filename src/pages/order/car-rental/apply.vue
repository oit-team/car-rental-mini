<script>
import { pick } from 'lodash-es'
import { post } from '@/api'

export default {
  data: () => ({
    // 司机信息
    driver: {},
    // 车辆信息
    vehicle: {},
    // 方案
    schemeTypeId: 0,
    scheme: {},
    schemeList: [],
    // 活动
    activityId: null,
    activity: {},
    activityList: [],
    // 优惠
    preferential: {},

    showschemePopup: false,
    showActivityPopup: false,
  }),
  watch: {
    'schemeTypeId': {
      immediate: true,
      handler() {
        this.scheme = {}
        this.schemeList = []
        this.activityId = null
        this.activity = {}
        this.activityList = []
        this.preferential = {}
        this.getscheme()
      },
    },
    'scheme.id': function (id) {
      if (!id)
        return
      this.getActivityList()
      this.getOrderPreferential()
    },
    'activityId': function (id) {
      if (!id)
        return
      this.getActivity()
      this.getOrderPreferential()
    },
  },
  methods: {
    chooseDriver() {
      uni.navigateTo({ url: '/pages/choose/driver' })
      uni.$once('choose-driver', (item) => {
        this.driver = item
      })
    },
    chooseVehicle() {
      uni.navigateTo({ url: '/pages/choose/vehicle' })
      uni.$once('choose-vehicle', (item) => {
        this.vehicle = item
      })
    },
    async getscheme() {
      const res = await post('/order/scheme/getLeaseOrderSchemes', {
        caseType: this.schemeTypeId,
        caseState: 1,
      })
      this.schemeList = res.body.schemeList
    },
    async getActivityList() {
      const res = await post('/order/activity/getActivitys', {
        caseType: this.scheme.id,
        caseState: 1,
      })
      this.activityList = res.body.resultList
    },
    async getActivity() {
      const res = await post('/order/activity/getActivityMap', {
        activityId: this.activityId,
      })
      this.activity = res.body
    },
    async getOrderPreferential() {
      const res = await post('/order/leaseOrder/getOrderPreferential', {
        schemeId: this.scheme.id,
        activityId: this.activity.activityId,
      })
      this.preferential = res.body
    },
    async submit() {
      const check = [
        [this.driver.driverId, '请选择司机'],
        [this.vehicle.vehicleId, '请选择车辆'],
        [this.scheme.id, '请选择方案'],
      ]
      const checkResult = check.find(item => !item[0])
      if (checkResult) {
        this.$toast(checkResult[1])
        return
      }

      await this.$dialog.confirm({
        title: '提示',
        message: '确定要提交申请吗？',
      })

      const params = {
        ...pick(this.scheme, [
          'leaseTerm',
          'rent',
          'cashPledge',
          'vehicleAge',
        ]),
        ...pick(this.preferential.preferentialMap, [
          'primaryEndTime',
          'preferentialRent',
          'startTime',
          'remarks',
        ]),
        ...pick(this.vehicle, [
          'endTime',
          'mileage',
        ]),
        driverId: this.driver.driverId,
        activityId: this.activity.activityId,
        schemeId: this.scheme.id,
        vehicleId: this.vehicle.vehicleId,
      }

      await post('/workFlow/workFlow/workOrderApply', {
        flowCode: 'CAR_RENTAL',
        workCode: '',
        params,
      })

      this.$toast.success('提交成功')
      uni.navigateBack()
    },
  },
}
</script>

<template>
  <page classes="flex flex-col h-screen">
    <div class="flex-1 overflow-auto">
      <van-tabs>
        <van-tab title="基本信息">
          <div class="py-2 flex flex-col gap-3">
            <van-cell-group inset>
              <van-cell title="司机" :value="driver.driverName || '选择司机'" is-link @click="chooseDriver()" />
              <template v-if="driver.driverName">
                <van-cell
                  v-for="item of [
                    { label: '手机号', prop: 'driverPhone' },
                    { label: '身份证号', prop: 'identityCard' },
                    { label: '地址', prop: 'address' },
                  ]"
                  :key="item.prop"
                  :title="item.label"
                  :value="driver[item.prop] || '暂无'"
                />
              </template>
            </van-cell-group>
            <van-cell-group inset>
              <van-cell title="车辆" :value="vehicle.licensePlateNumber || '选择车辆'" is-link @click="chooseVehicle()" />
              <template v-if="vehicle.licensePlateNumber">
                <van-cell
                  v-for="item of [
                    { label: '车架号', prop: 'vehicleFrameNumber' },
                    { label: '城市', prop: 'city' },
                    { label: '品牌车系车型', prop: 'vehicleModel' },
                    { label: '车身颜色', prop: 'bodyColor' },
                    { label: '行驶里程', prop: 'mileage' },
                    { label: '终止时间', prop: 'endTime' },
                  ]"
                  :key="item.prop"
                  :title="item.label"
                  :value="vehicle[item.prop] || '暂无'"
                />
              </template>
            </van-cell-group>
          </div>
        </van-tab>
        <van-tab title="租赁信息">
          <div class="py-2 flex flex-col gap-3">
            <van-cell-group inset>
              <van-cell title="方案类型">
                <van-radio-group :value="schemeTypeId" @change="schemeTypeId = $event.detail">
                  <div class="flex gap-3 justify-end">
                    <van-radio :name="0">
                      自营
                    </van-radio>
                    <van-radio :name="1">
                      T3
                    </van-radio>
                  </div>
                </van-radio-group>
              </van-cell>
              <van-cell title="方案" :value="scheme.caseName || '请选择方案'" is-link @click="showschemePopup = true" />
              <van-cell title="活动" :value="activity.activityName || '请选择活动'" is-link @click="showActivityPopup = true" />
            </van-cell-group>
            <template v-if="scheme.id">
              <div class="title">
                方案信息
              </div>
              <van-cell-group inset>
                <van-cell
                  v-for="item of [
                    { label: '品牌车系车型', prop: 'brandCarModel' },
                    { label: '租期（月）', prop: 'leaseTerm' },
                    { label: '月租（元）', prop: 'rent' },
                    { label: '押金（元）', prop: 'cashPledge' },
                    { label: '车龄（年）', prop: 'vehicleAge' },
                    { label: '里程（km）', prop: 'mileage' },
                  ]"
                  :key="item.prop"
                  :title="item.label"
                  :value="scheme[item.prop] || '暂无'"
                />
              </van-cell-group>
            </template>
            <template v-if="activity.id">
              <div class="title">
                活动信息
              </div>
              <van-cell-group inset>
                <van-cell
                  v-for="item of [
                    { label: '活动名称', prop: 'activityName' },
                    { label: '开始时间', prop: 'startTime' },
                    { label: '结束时间', prop: 'endTime' },
                    { label: '活动说明', prop: 'activityDescription' },
                  ]"
                  :key="item.prop"
                  :title="item.label"
                  :value="activity[item.prop] || '暂无'"
                />
              </van-cell-group>
            </template>
            <template v-if="activity.activityDetails">
              <div class="title">
                活动奖励
              </div>
              <div class="text-center mx-4 bg-white rounded-lg text-sm">
                <div class="grid grid-cols-3 py-1 text-gray-500">
                  <div>奖励类型</div>
                  <div>数量</div>
                  <div>兑现方式</div>
                </div>
                <div v-for="(item, index) of activity.activityDetails" :key="index" class="grid grid-cols-3 py-1">
                  <div>{{ item.rewardMethod }}</div>
                  <div>{{ item.number }}</div>
                  <div>{{ item.cashingMethod }}</div>
                </div>
              </div>
            </template>
            <template v-if="preferential.preferentialMap">
              <div class="title">
                租赁信息
              </div>
              <van-cell-group inset>
                <van-cell
                  v-for="item of [
                    { label: '租期（月）', prop: 'leaseTerm' },
                    { label: '原月租（元）', prop: 'rent' },
                    { label: '优惠月租（元）', prop: 'preferentialRent' },
                    { label: '押金（元）', prop: 'cashPledge' },
                    { label: '起租日期', prop: 'startTime' },
                    { label: '原终止日期', prop: 'primaryEndTime' },
                    { label: '终止日期', prop: 'endTime' },
                    { label: '备注', prop: 'activityDescription' },
                  ]"
                  :key="item.prop"
                  :title="item.label"
                  :value="preferential.preferentialMap[item.prop] || '暂无'"
                />
              </van-cell-group>
            </template>
            <template v-if="preferential.orderBill && preferential.orderBill.length">
              <div class="title">
                账单信息
              </div>
              <div class="text-center mx-4 bg-white rounded-lg text-sm">
                <div class="grid grid-cols-4 py-1 text-gray-500">
                  <div>期数</div>
                  <div>账期</div>
                  <div>月租</div>
                  <div>备注</div>
                </div>
                <div v-for="(item, index) of preferential.orderBill" :key="index" class="grid grid-cols-4 py-1">
                  <div>{{ item.numberOfPeriods }}</div>
                  <div>{{ item.accountingPeriod }}</div>
                  <div>{{ item.rent }}</div>
                  <div>{{ item.remarks || '-' }}</div>
                </div>
              </div>
            </template>
          </div>
        </van-tab>
      </van-tabs>
    </div>

    <van-button type="primary" block @click="submit()">
      提交
    </van-button>

    <van-popup :show="showschemePopup" position="bottom" @close="showschemePopup = false">
      <van-picker
        v-if="schemeList.length"
        :columns="schemeList"
        value-key="caseName"
        show-toolbar
        @confirm="scheme = $event.detail.value, showschemePopup = false"
      />
      <van-empty v-else description="暂无方案" />
    </van-popup>

    <van-popup :show="showActivityPopup" position="bottom" @close="showActivityPopup = false">
      <van-picker
        v-if="activityList.length"
        :columns="activityList"
        value-key="activityName"
        show-toolbar
        @confirm="activityId = $event.detail.value.activityId, showActivityPopup = false"
      />
      <van-empty v-else description="暂无活动" />
    </van-popup>
  </page>
</template>

<style scoped>
.title {
  font-size: 12px;
  color: #999;
  padding: 0 16px;
  margin-bottom: -0.5em;
}
</style>
