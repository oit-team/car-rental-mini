import { createSSRApp } from 'vue'
import * as Pinia from 'pinia'
import App from './App.vue'
import Dialog from './wxcomponents/vant/dialog/dialog'
import { toast } from './utils/helper'
import { errorHandler } from './api'
import Page from '@/components/Page.vue'

import 'uno.css'

export function createApp() {
  const app = createSSRApp(App)
  app.use(Pinia.createPinia())
  app.component('page', Page)
  app.config.globalProperties.$toast = toast
  app.config.globalProperties.$dialog = Dialog
  app.config.errorHandler = (error) => {
    errorHandler(error)
    console.error(error)
  }
  return {
    app,
    Pinia,
  }
}
