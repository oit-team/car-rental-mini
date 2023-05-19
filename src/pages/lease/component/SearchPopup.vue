<script>
export default {
  props: {
    show: Boolean,
    type: String,
  },
  data() {
    return {
      orderNo: '',
      schemeNo: '',
      carNumber: '',
      driverName: '',
      // ----
      vinNo: '',
      driverId: '',
    }
  },
  watch: {
  },
  onMounted() {
    this.orderNo = ''
  },
  methods: {
    resetForm() {
      this.orderNo = ''
      this.carNumber = ''
      this.driverName = ''
      this.schemeNo = ''
      this.vinNo = ''
      this.driverId = ''
    },
    filter() {
      const obj = this.type === 'my'
        ? {
          orderNo: this.orderNo,
          carNumber: this.carNumber,
          driverName: this.driverName,
          schemeNo: this.schemeNo,
        }
        : {
          orderNo: this.orderNo,
          carNumber: this.carNumber,
          schemeNo: this.schemeNo,
          vinNo: this.vinNo,
          driverId: this.driverId,
        }
      this.$emit('filter', obj)
    },
  },
}
</script>

<template>
  <van-popup
    :show="show"
    position="top"
    :close-on-click-overlay="true"
    round
    @close="$emit('close')"
  >
    <view class="p-2 px-4 text-xs">
      <van-field
        :value="orderNo"
        label="订单编号"
        placeholder="订单编号"
        :border="false"
        input-align="right"
        @change="orderNo = $event.detail"
      />
      <van-field
        v-if="type === 'my'"
        :value="carNumber"
        label="车牌号"
        placeholder="车牌号"
        :border="false"
        input-align="right"
        @change="carNumber = $event.detail"
      />
      <van-field
        :value="driverName"
        label="司机姓名"
        placeholder="司机姓名"
        :border="false"
        input-align="right"
        @change="driverName = $event.detail"
      />
      <van-field
        :value="schemeNo"
        label="方案编号"
        placeholder="方案编号"
        :border="false"
        input-align="right"
        @change="schemeNo = $event.detail"
      />
      <van-field
        v-if="type === 'T3'"
        :value="vinNo"
        label="车架号"
        placeholder="车架号"
        :border="false"
        input-align="right"
        @change="vinNo = $event.detail"
      />
      <van-field
        v-if="type === 'T3'"
        :value="driverId"
        label="司机id"
        placeholder="司机id"
        :border="false"
        input-align="right"
        @change="driverId = $event.detail"
      />
      <view class="flex justify-around mt-2">
        <!--          <van-button type="info" size="small" @click="showCalendar = true"> -->
        <!--            选择时间 -->
        <!--          </van-button> -->
        <van-button type="primary" size="small" @click="resetForm">
          重置
        </van-button>
        <van-button type="primary" size="small" @click="filter">
          查询
        </van-button>
      </view>
    </view>
  </van-popup>
</template>

<style scoped>

</style>
