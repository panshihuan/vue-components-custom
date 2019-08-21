import Vue from 'vue'
import ToastManage from '../toast/src/manage'
import LoadingComponent from './src/Loading'

/* eslint-disable no-new */
const manage = new (Vue.extend(ToastManage))({ propsData: { className: 'm-loading-container' } })
document.body.appendChild(manage.$mount().$el)

/* eslint-disable no-new */
export const Loading = (options = {}) => {
  options.type = 'info'
  options.render = h => h(LoadingComponent)
  options.duration = 0
  const target = manage.add(options)
  return {
    clear () {
      manage.remove(target)
    }
  }
}

Loading.clear = () => manage.removeAll()
Loading.install = (V) => { V.prototype.$loading = Loading }

export default Loading
