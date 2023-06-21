<script>
import OrderItem from './components/OrderItem.vue'

export default {
  components: {
    OrderItem,
  },
  data() {
    return {
      taskCode: '验车',
      list: [],
    }
  },
  watch: {
    taskCode() {
      this.$refs.list.reset().load()
    },
  },
  methods: {
    loadData({ page, next, done, fail }) {
      this.workOrderList(page)
        .then(isDone => isDone ? done() : next())
        .catch(fail)
    },
    async workOrderList(pageNum = 1) {
      const res = await this.$post('/workFlow/workFlow/workOrderList', {
        pageNum,
        pageSize: 20,
        taskCode: this.taskCode,
      })
      this.list = pageNum === 1 ? res.body.resultList : [...this.list, ...res.body.resultList]

      return res.body.count <= this.list.length
    },
  },
}
</script>

<template>
  <page>
    <div class="h-screen overflow-hidden">
      <van-tabs :active="taskCode" @change="taskCode = $event.detail.title">
        <van-tab title="验车" />
        <van-tab title="出库" />
      </van-tabs>
      <vc-list ref="list" load-more pull-refresh @load="loadData" @refresh="loadData">
        <div class="flex gap-3 p-3 flex-col">
          <order-item v-for="item of list" :key="item.vehicleId" :item="item" />
        </div>
      </vc-list>
    </div>
  </page>
</template>
