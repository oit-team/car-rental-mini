import { warn } from '@/utils/warning'

let pageCache = null

function checkpage() {
  const page = this.$children[0]

  if (pageCache === page)
    return

  pageCache = page

  if (page?.$options?.name !== 'page')
    warn(`首个元素必须是 <page> 在页面 ${this.__route__}`)
}

const noop = () => {}

export default {
  mounted() {
    if (this.mpType === 'page')
      checkpage.call(this)
  },
  // 初始化onShow,onHide事件，以便page组件能正常添加挂载
  onShow: noop,
  onHide: noop,
  methods: {
    /**
     * 兼容vant组件v-model
     * @param {string | string[]} dataKeys
     */
    useVantModel(dataKeys) {
      dataKeys = Array.isArray(dataKeys) ? dataKeys : [dataKeys]

      dataKeys.forEach((key) => {
        this.$watch(key, (value) => {
          if (value?.currentTarget?.dataset?.comType === 'wx')
            this[key] = value.detail
        })
      })
    },
  },
}
