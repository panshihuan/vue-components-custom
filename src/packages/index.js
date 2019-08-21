// 导入组件
import MPopup from './popup'
import MSwipe from './swipe'

// 组件列表
const components = [
  MPopup,
  MSwipe
]

// 定义 install 方法
const install = Vue => {
  // 遍历
  components.forEach(component => Vue.component(component.name, component))
}

// export
export default {
  install,
  MPopup
}
