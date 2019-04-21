import Vue from 'vue'
import App from './App'
import router from './router'

import ssview from '@idev1/ss-view'
// import '@idev1/ss-view/public/styles/ssview.css'
Vue.use(ssview)

Vue.config.productionTip = false

let vm = new Vue({
  el: '#app',
  router,
  components: {
    App
  },
  template: '<App/>'
})

Vue.use(vm)
