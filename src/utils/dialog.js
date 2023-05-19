import Dialog from '@/wxcomponents/vant/dialog/dialog'
import { querystringify } from '@/utils/helper'

export async function loginTips(config = {}) {
  await Dialog.confirm({
    title: '提示',
    message: '您还未登录，要去登录吗？',
  })

  uni.navigateTo(`/pages/login/index?${querystringify({ redirect: config.redirect })}`)
}
