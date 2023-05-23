<template>
  <page classes="bg-neutral-100 pb-12">
    <van-field
      :value="licensePlateNumber"
      placeholder="车牌号"
      label="车牌号"
      readonly
      clickable
      :border="false"
      input-align="right"
      @click-input="toSearch"
    />

    <van-collapse v-if="vehicleInfo.vehicleId" :value="activeNames" @change="onChange">
      <van-collapse-item title="车辆信息" name="1">
        <van-cell-group :border="false">
          <van-cell
            v-for="item in vehicle"
            :key="item.value"
            :value="vehicleInfo[item.value] || '暂无'"
            border="false"
            :title="item.label"
          />
        </van-cell-group>
      </van-collapse-item>
      <van-collapse-item title="验车信息" name="2">
        <van-cell-group :border="false">
          <view class="p-2 text-sm text-[#000]">
            车辆违章
          </view>
          <van-field
            v-for="item in [
              { name: '应收金额', key: 'receivable', validator: 'number', default: 0 },
              { name: '已收金额', key: 'netReceipts', validator: 'number', default: 0 },
              { name: '金额小计', key: 'subtotal', validator: 'number', default: 0 },
              { name: '备注', key: 'remarks', validator: 'text', default: '' },
            ]"
            :key="item"
            :value="vehicleViolation[item.key]"
            :label="item.name"
            :type="item.validator"
            input-align="right"
            @change="vehicleViolation[item.key] = $event.detail, subtotalCount('vehicleViolation')"
          />
          <view class="p-2 text-sm text-[#000]">
            上浮费
          </view>
          <van-field
            v-for="item in [
              { name: '应收金额', key: 'receivable', validator: 'number', default: 0 },
              { name: '已收金额', key: 'netReceipts', validator: 'number', default: 0 },
              { name: '金额小计', key: 'subtotal', validator: 'number', default: 0 },
              { name: '备注', key: 'remarks', validator: 'text', default: '' },
            ]"
            :key="item"
            :value="floatingFee[item.key]"
            :label="item.name"
            :type="item.validator"
            input-align="right"
            @change="floatingFee[item.key] = $event.detail, subtotalCount('floatingFee')"
          />
          <view class="p-2 text-sm text-[#000]">
            折旧费
          </view>
          <van-field
            v-for="item in [
              { name: '应收金额', key: 'receivable', validator: 'number', default: 0 },
              { name: '已收金额', key: 'netReceipts', validator: 'number', default: 0 },
              { name: '金额小计', key: 'subtotal', validator: 'number', default: 0 },
              { name: '备注', key: 'remarks', validator: 'text', default: '' },
            ]"
            :key="item"
            :value="depreciationCharge[item.key]"
            :label="item.name"
            input-align="right"
            :type="item.validator"
            @change="depreciationCharge[item.key] = $event.detail, subtotalCount('depreciationCharge')"
          />
          <view class="p-2 text-sm text-[#000]">
            车辆定损
          </view>
          <van-field
            v-for="item in [
              { name: '维修时长', key: 'workingHours', validator: 'text', default: 0 },
              { name: '定损金额', key: 'receivable', validator: 'number', default: 0 },
              { name: '已收金额', key: 'netReceipts', validator: 'number', default: 0 },
              { name: '金额小计', key: 'subtotal', validator: 'number', default: 0 },
              { name: '备注', key: 'remarks', validator: 'text', default: '' },
            ]"
            :key="item"
            :value="vehicleLossAssessment[item.key]"
            :label="item.name"
            :type="item.validator"
            input-align="right"
            @change="vehicleLossAssessment[item.key] = $event.detail, subtotalCount('vehicleLossAssessment')"
          />
        </van-cell-group>
      </van-collapse-item>
      <van-collapse-item title="车辆配件" name="3">
        <view v-for="(item, index) in vehicleAccessories" :key="index">
          <view class="mt-2 pl-2 text-[#000]">
            {{ item.receivable }}
          </view>
          <view>
            <van-cell title="是否丢失" custom-class="!px-4 !py-2 !flex items-center">
              <van-switch :checked="item.missing" size="20px" @change="changeSwitch($event, index)" />
            </van-cell>
            <van-field
              :value="item.subtotal"
              label="金额小计"
              :disabled="!item.missing"
              type="number"
              input-align="right"
              @change="sub($event, index)"
            ></van-field>
            <van-field
              :value="item.remarks"
              :disabled="!item.missing"
              input-align="right"
              placeholder="备注"
              label="备注"
              @change="vehicleAccessories[index].remarks = $event.detail"
            ></van-field>
          </view>
        </view>
        <view class="shadow mt-2">
          <van-field
            v-for="item in [
              { name: '金额总计', key: 'subtotal', validator: 'number', default: 0 },
              { name: '备注', key: 'remarks', validator: 'text', default: '' },
            ]"
            :key="item.name"
            :label="item.name"
            input-align="right"
            :type="item.validator"
            :value="vehicleCertificate[item.key]"
            @change="vehicleCertificate[item.key] = $event.detail"
          ></van-field>
        </view>
      </van-collapse-item>
      <van-collapse-item title="换车原因" name="4">
        <view class="shadow">
          <van-field
            :value="vehicleChangeInstruc"
            type="textarea"
            show-word-limit
            label="换车原因"
            placeholder="请填写换车原因"
            maxlength="50"
            required
            @change="vehicleChangeInstruc = $event.detail"
          ></van-field>
        </view>
      </van-collapse-item>
    </van-collapse>

    <van-button v-if="vehicleInfo.vehicleId" block color="#1296db" class="mt-2" @click="submit">
      提交
    </van-button>
  </page>
</template>

<script>
import numeral from 'numeral'
import { addVehicleChangeRecords } from '@/api/work'
export default {
  data() {
    return {
      activeNames: ['1', '2', '3', '4'],
      vehicle: [
        {
          label: '车牌号',
          value: 'licensePlateNumber',
        },
        {
          label: '车架号',
          value: 'vehicleFrameNumber',
        },
        {
          label: '城市',
          value: 'city',
        },
        {
          label: '车身颜色',
          value: 'bodyColor',
        },
        {
          label: '里程数',
          value: 'mileage',
        },
        {
          label: '终止时间',
          value: 'endTime',
        },
      ],
      vehicleInfo: {},
      licensePlateNumber: '', // 车牌号
      vehicleChangeInstruc: '', // 换车原因
      vehicleAccessories: [],
      floatingFee: {
        netReceipts: 0,
        receivable: 0,
        subtotal: 0,
        remarks: '',
      }, // 上浮
      depreciationCharge: {
        netReceipts: 0,
        receivable: 0,
        subtotal: 0,
        remarks: '',
      }, // 折旧
      vehicleLossAssessment: {
        netReceipts: 0,
        receivable: 0,
        subtotal: 0,
        workingHours: '',
      }, // 定损
      vehicleViolation: {
        netReceipts: 0,
        receivable: 0,
        subtotal: 0,
        remarks: '',
      }, // 车辆违章
      vehicleCertificate: {
        subtotal: 0,
        remarks: '',
      }, // 车辆配件总计
      receivables: ['车钥匙', '行驶证', '运输证', '灭火器', '脚垫', '紧急警示牌', '拖车钩', '反光背心', '千斤顶', '备胎/充气泵', '其它'],
      checked: false,
    }
  },
  onLoad(option) {
    if (option.item) {
      this.vehicleInfo = JSON.parse(option.item)
      this.licensePlateNumber = this.vehicleInfo.licensePlateNumber
    }

    this.vehicleAccessories = this.receivables.map((item) => {
      return {
        receivable: item,
        missing: false,
        subtotal: 0,
        remarks: '',
      }
    })
  },
  watch: {
    vehicleAccessories: {
      handler() {
        this.vehicleCertificate.subtotal = this.vehicleAccessories.reduce((num, item) => num + Number(item.subtotal), 0)
        this.vehicleCertificate.subtotal = numeral(this.vehicleCertificate.subtotal).format('0[.]00')
      },
      deep: true,
    },
  },
  onShow() {
  },
  methods: {
    numeral,
    // 折叠面板
    onChange(event) {
      this.activeNames = event.detail
    },
    toSearch() {
      if (this.licensePlateNumber) {
        uni.navigateTo({
          url: '/pages/lease/searchInput',
        })
      } else {
        uni.redirectTo({
          url: '/pages/lease/searchInput',
        })
      }
    },
    subtotalCount(e) {
      this[e].subtotal = numeral(this[e].receivable - this[e].netReceipts).format('0[.]00')
    },
    changeSwitch(e, index) {
      this.vehicleAccessories[index].missing = e.detail
    },
    async submit() {
      if (this.vehicleChangeInstruc.length === 0) return this.$toast.fail('请填写换车原因')
      const res = await addVehicleChangeRecords({
        leaseOrderNo: uni.getStorageSync('leaseOrderNo'), // 订单编号
        currentVehicleId: this.vehicleInfo.vehicleId, // 当前更换车辆Id
        vehicleChangeInstruc: this.vehicleChangeInstruc, // 换车原因
        vehicleInspection: {
          vehicleAccessories: this.vehicleAccessories, // 上浮
          vehicleLossAssessment: this.vehicleLossAssessment, // 定损
          vehicleViolation: this.vehicleViolation, // 违章
          depreciationCharge: this.depreciationCharge, // 折旧
        },
      })
      if (res.head.status === 0) {
        this.$toast.success('换车成功')
        setTimeout(() => {
          uni.navigateBack()
        }, 500)
      } else
        this.$toast.fail(res.head.msg)
    },
    sub(e, index) {
      this.vehicleAccessories[index].subtotal = e.detail
    },
  },
}
</script>

<style scoped>

</style>
