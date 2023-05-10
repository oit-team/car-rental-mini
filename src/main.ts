import { createSSRApp } from 'vue'
import * as Pinia from 'pinia'
import App from './App.vue'
import Page from '@/components/Page.vue'

import 'uno.css'

export function createApp() {
  const app = createSSRApp(App)
  app.use(Pinia.createPinia())
  app.component('Page', Page)
  return {
    app,
    Pinia,
  }
}
