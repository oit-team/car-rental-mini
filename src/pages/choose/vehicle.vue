<script>
import List from './components/List.vue'
import Item from './components/Item.vue'
import { post } from '@/api'

export default {
  components: {
    List,
    Item,
  },
  data: () => ({
    value: '',
    list: [],
  }),
  methods: {
    async onSearch() {
      const res = await post('/vehicle/vehicle/getVehicles', {
        licensePlateNumber: this.value,
        vehicleState: 0,
        pageNum: 1,
        pageSize: 10,
      })
      this.list = res.body.vehicleList
    },
    choose(item) {
      uni.$emit('choose-vehicle', item)
      uni.navigateBack()
    },
  },
}
</script>

<template>
  <page>
    <van-search
      :value="value"
      placeholder="请输入搜索关键词"
      @change="value = $event.detail"
      @search="onSearch"
    />

    <list>
      <item v-for="item of list" :key="item.licensePlateNumber" @click="choose(item)">
        {{ item.licensePlateNumber }}
      </item>
    </list>
  </page>
</template>
