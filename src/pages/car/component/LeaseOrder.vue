<script>
export default {
  props: {
    item: Object,
    type: String,
    card: String,
  },
  data() {
    return {
      statusColorMap: {
        审批中: '#888888', // 审批中
        履约中: '#22C55E', // 履约中
        已到期: '#eab308', // 已到期
        已作废: '#EF4444', // '已作废'
        已结算: '#888888', // '已结算'
        待生效: '#e37014', // '待生效'
        终止租赁: '#d4d4d8', // '终止租赁'
      },
    }
  },
}
</script>

<template>
  <view @click="$emit('click-event', { id: item.id, type })">
    <view class="rounded-md mb-2" :class="card === 'card' ? 'shadow-lg bg-white' : 'shadow'">
      <view class="p-2">
        <view class="flex justify-between items-center leading-loose text-xs">
          <view>
            {{ type === 'T3' ? item.orderNo : item.leaseOrderNo }}
          </view>
          <view>
            <van-tag v-if="type === 'T3'" type="primary" class="mr-2">
              {{ item.city }}
            </van-tag>
            <van-tag v-if="type === 'T3'" plain :color="statusColorMap[item.orderStatus] || '#888888'">
              {{ item.orderStatus }}
            </van-tag>
            <van-tag v-else plain :color="statusColorMap[item.orderStatueName] || '#888888'">
              {{ item.orderStatueName }}
            </van-tag>
            <!--            <van-tag plain :color="type === 'T3' ? statusColorMap[item.orderStatus] : statusColorMap[item.orderStatueName]"> -->
            <!--              {{ type === 'T3' ? item.orderStatus : item.orderStatueName }} -->
            <!--            </van-tag> -->
          </view>
        </view>
        <view class="flex justify-between items-center leading-loose text-xs">
          <view><span class="text-[#888]">租期：</span>{{ type === 'T3' ? item.tenancy : item.leaseTerm }}（月）</view>
          <view><span class="text-[#888]">月租：</span>{{ type === 'T3' ? item.monthlyRent : item.rent }}</view>
        </view>
        <view class="flex justify-between items-center leading-loose text-xs">
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
