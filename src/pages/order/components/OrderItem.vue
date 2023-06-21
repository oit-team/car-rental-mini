<script>
export default {
  props: {
    item: Object,
  },
}
</script>

<template>
  <div class="bg-white rounded text-sm">
    <div class="flex justify-between p-2">
      <div>{{ item.workCode }}</div>
      <div>{{ item.statusName }}</div>
    </div>
    <van-divider custom-style="margin: 0;" />
    <div class="p-2 grid grid-cols-2">
      <div>司机姓名：{{ item.driverName }}</div>
      <div class="text-right">
        {{ item.licensePlateNumber }}
      </div>
    </div>
    <div class="pr-2 text-right">
      {{ item.createDate }}
    </div>
  </div>
</template>
