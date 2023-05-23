<script>
export default {
  name: 'VcIcon',

  props: {
    code: String,
  },

  computed: {
    iconCode() {
      let code = this.code
      if (/&#x.{4};/.test(this.code))
        code = this.code.substring(3, 7)

      return code ? JSON.parse(`"\\u${code}"`) : ''
    },
  },
}
</script>

<template>
  <text class="iconfont">
    {{ iconCode }}
  </text>
</template>

<style lang='scss'>
.iconfont {
  font-family: "iconfont";
}
</style>
