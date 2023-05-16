<script setup>
defineProps({
  list: Array,
  type: String,
})
const emit = defineEmits(['clickEvent'])
const statusColorMap = {
  审批中: '', // 审批中
  履约中: '#22C55E', // 履约中
  已到期: '#eab308', // 已到期
  已作废: '#EF4444', // '已作废'
  已结算: '', // '已结算'
  待生效: '#e37014', // '待生效'
}
</script>

<template>
  <view v-for="item in list" :key="item.id" @click="emit('clickEvent', { id: item.id, type })">
    <view class="border-1 border-solid border-[#ccc] rounded mb-2">
      <view class="p-2 leading-loose">
        <view class="flex justify-between items-center text-xs">
          <view>
            {{ type === 'T3' ? item.orderNo : item.leaseOrderNo }}
          </view>
          <view>
            <van-tag v-if="type === 'T3'" type="primary" class="mr-2">
              {{ item.city }}
            </van-tag>
            <van-tag plain :color="type === 'T3' ? statusColorMap[item.orderStatus] : statusColorMap[item.orderStatueName] ">
              {{ type === 'T3' ? item.orderStatus : item.orderStatueName }}
            </van-tag>
          </view>
        </view>
        <view class="flex justify-between items-center text-xs">
          <view><span class="text-[#888]">租期：</span>{{ type === 'T3' ? item.tenancy : item.leaseTerm }}（月）</view>
          <view><span class="text-[#888]">月租：</span>{{ type === 'T3' ? item.monthlyRent : item.rent }}</view>
        </view>
        <view class="flex justify-between items-center text-xs">
          <view>{{ type === 'T3' ? item.carNumber : item.licensePlateNumber }}</view>
          <view class="text-xs">
            {{ type === 'T3' ? item.t3CreatTime : item.createTime }}
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<style scoped>

</style>
