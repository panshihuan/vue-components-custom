import Vue from 'vue'
import ToastManage from './src/manage'

const instance = new Vue({ render: h => h(ToastManage) })
document.body.appendChild(instance.$mount().$el)
const manage = instance.$children[0]

/* eslint-disable no-new */
export const Toast = (options) => {
  const target = manage.add(options)
  return {
    clear () {
      manage.remove(target)
    },
    clearAll () {
      manage.removeAll()
    }
  }
}
Toast.configure = (...args) => {
  manage.configure(...args)
}
Toast.clear = () => manage.removeAll()
Toast.install = (V) => { V.prototype.$toast = Toast }
export default Toast
