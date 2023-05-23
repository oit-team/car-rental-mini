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
      const res = await post('/driverServer/driver/getDrivers', {
        driverPhone: this.value,
        driverStatue: 0,
        pageNum: 1,
        pageSize: 10,
      })
      this.list = res.body.resultList
    },
    choose(item) {
      console.log(item)
      uni.$emit('choose-driver', item)
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
      <item v-for="item of list" :key="item.driverId" @click="choose(item)">
        {{ item.driverName }}({{ item.driverPhone }})
      </item>
    </list>
  </page>
</template>
