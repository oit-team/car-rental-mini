<script>
import { getVehicleDetailed } from '@/api/car'
import { workOrderApply } from '@/api/work'

export default {
  data() {
    return {
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
      carInfo: {},
      radio: 1,
      showDate: false,
      minDate: new Date(new Date().getFullYear() - 1, 1, 1).getTime(),
      maxDate: new Date(new Date().getFullYear() + 5, 12, 1).getTime(),
      params: {
        driverId: '',
        driverRefundAccount: '',
        leaseOrderNo: '',
        openingBank: '',
        returnOrderType: 1,
        returnTheCarTime: '',
        vehicleId: '',
      },
      formatter(type, value) {
        if (type === 'year')
          return value

        if (type === 'month')
          return value

        return value
      },
      startTime: '',
    }
  },
  computed: {
    returnTheCarTime() {
      return this.params.returnTheCarTime
    },
    driverRefundAccount() {
      return this.params.driverRefundAccount
    },
    openingBank() {
      return this.params.openingBank
    },
  },
  onLoad(option) {
    if (option.vid) {
      this.params.vehicleId = option.vid
      this.params.driverId = option.did
      this.params.leaseOrderNo = option.no
      this.startTime = new Date(option.time).getTime()
    }
  },
  onShow() {
    this.getCarInfo()
  },
  methods: {
    async getCarInfo() {
      const { body } = await getVehicleDetailed({
        vehicleId: this.params.vehicleId,
      })
      this.carInfo = body.vehicleDetailed
    },
    onConfirm(e) {
      if (this.startTime > e.detail)
        return this.$toast.fail('申请退车时间不能小于租车时间')

      const date = new Date(e.detail)
      const Y = date.getFullYear()
      const M = (date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1)
      const D = `${date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()}`
      const selectTime = `${Y}-${M}-${D}`
      this.params.returnTheCarTime = selectTime
      this.showDate = false
    },
    submit() {
      if (this.params.driverRefundAccount === '' || this.params.openingBank === '' || this.params.returnTheCarTime === '')
        return this.$toast.fail('请填写完整')
      this.$dialog.confirm({
        title: '提示',
        message: '确定提交吗？',
      })
        .then(async () => {
          await workOrderApply({
            workCode: '',
            flowCode: 'CAR_RETURN',
            params: { ...this.params },
          })
          this.$toast.success('成功')
          setTimeout(() => {
            uni.navigateBack()
          }, 500)
        })
    },
  },
}
</script>

<template>
  <page classes="bg-neutral-100 p-2 box-border text-sm">
    <view class="p-2 text-sm text-[#000] underline underline-offset-6 decoration-solid decoration-[#1296db]">
      车辆信息
    </view>
    <van-cell-group :border="false">
      <van-cell
        v-for="item in vehicle"
        :key="item.value"
        :value="carInfo[item.value] || '暂无'"
        :border="false"
        :title="item.label"
      />
    </van-cell-group>

    <view class="p-2 text-sm text-[#000] underline underline-offset-6 decoration-solid decoration-[#1296db]">
      退车信息
    </view>
    <view>
      <van-cell-group>
        <view class="flex place-content-between bg-white px-4 py-2 box-border">
          <view class="text-[#323233]">
            退车类型
          </view>
          <van-radio-group
            :value="params.returnOrderType"
            @change="params.returnOrderType = $event.detail"
          >
            <van-radio :name="1" icon-size="18px" custom-class="mb-2">
              强制收车
            </van-radio>
            <van-radio :name="2" icon-size="18px" custom-class="mb-2">
              期满退车
            </van-radio>
            <van-radio :name="3" icon-size="18px" custom-class="mb-2">
              违约收车
            </van-radio>
          </van-radio-group>
        </view>
        <van-field
          :value="returnTheCarTime"
          placeholder="选择申请退车日期"
          :border="false"
          clickable
          label="申请退车日期"
          input-align="right"
          readonly
          required
          @click-input="showDate = true"
        />
        <van-field
          :value="driverRefundAccount"
          input-align="right"
          :border="false"
          type="number"
          required
          label="退款银行账号"
          @change="params.driverRefundAccount = $event.detail"
        />
        <van-field
          :value="openingBank"
          input-align="right"
          :border="false"
          label="开户行"
          required
          @change="params.openingBank = $event.detail"
        />
      </van-cell-group>
    </view>
    <van-button block color="#1296db" class="mt-2" @click="submit">
      提交
    </van-button>

    <van-popup
      :show="showDate"
      position="bottom"
      custom-style="height:50%;"
      @close="showDate = false"
    >
      <van-datetime-picker
        type="date"
        value="currentDate"
        :min-date="minDate"
        :max-date="maxDate"
        :formatter="formatter"
        @confirm="onConfirm"
      />
    </van-popup>
  </page>
</template>

<style scoped>

</style>
