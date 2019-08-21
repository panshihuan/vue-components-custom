import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 组件
import MPopup from './packages/popup'
import LazyLoad from './packages/lazyLoad'
import MIndexList from './packages/indexList'
import Toast from './packages/toast'
import MPullRefresh from './packages/pullRefresh'
import Dialog from './packages/dialog'
import Loading from './packages/indicator'
import * as AlloyFingerVue from './packages/common/AlloyFingerVue'
import Cascade from './packages/cascade'
import Picker from './packages/picker'

LazyLoad.defaults.maxConn = 1
LazyLoad.defaults.defaultImg = 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1542196510428&di=5452057ee39ec3c2873be25c7f55b11a&imgtype=0&src=http%3A%2F%2Ftupian.qqjay.com%2Fu%2F2017%2F1201%2F2_161641_2.jpg'
LazyLoad.defaults.errorImg = 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1542196387050&di=8d03ef1b68447a7a9a2e012cafaca1fd&imgtype=0&src=http%3A%2F%2Fku.90sjimg.com%2Felement_origin_min_pic%2F01%2F37%2F86%2F37573c65819a30c.jpg'

Vue.config.productionTip = false

Vue.use(MPopup)
Vue.use(MIndexList)
Vue.use(Toast)
Vue.use(MPullRefresh)
Vue.use(Loading)
Vue.use(AlloyFingerVue)
Vue.use(Dialog)
Vue.use(Cascade)
Vue.use(Picker)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
