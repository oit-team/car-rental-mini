<script setup>
import { getT3LeaseOrderInfo } from '@/api/car'

const props = defineProps({
  id: String,
  type: String,
})
const data = ref()

async function getData() {
  const { body } = await getT3LeaseOrderInfo({
    leaseOrderId: props.id,
  })
  data.value = body
}
getData()
</script>

<template>
  <page classes="min-h-screen bg-neutral-100">
    <view>
      <view>
        司机信息
      </view>
      <van-cell-group inset>
        <van-cell title="司机姓名" value="内容" />
        <van-cell title="司机手机号" value="内容" label="描述信息" />
      </van-cell-group>
    </view>
  </page>
</template>

<style scoped>

</style>
