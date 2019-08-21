import Dialog from './src/dialog'

function $dialog (Component, type = 'confirm') {
  return function (props = {}) {
    const instance = new Component({
      propsData: { title: '提示', ...props, type, maskClickAble: type !== 'alert' },
      mounted () { this.value = true }
    })
    document.body.appendChild(instance.$mount().$el)

    function close () {
      instance.value = false
      setTimeout(() => {
        if (document.body.contains(instance.$el)) {
          document.body.removeChild(instance.$el)
        }
        instance.$destroy()
      }, 300)
    }

    const handle = new Promise((resolve, reject) => {
      instance.$on('cancel', () => {
        reject(new Error('cancel'))
        close()
      })
      instance.$on('ensure', () => {
        if (props.async) {
          resolve(close)
        } else {
          resolve()
          close()
        }
      })
    })
    handle.close = close
    return handle
  }
}

Dialog.install = Vue => {
  Vue.component('mDialog', Dialog)
  const component = Vue.extend(Dialog)
  Vue.prototype.$dialog = $dialog(component)
  Vue.prototype.$dialog.confirm = Vue.prototype.$dialog
  Vue.prototype.$dialog.alert = $dialog(component, 'alert')
}

export default Dialog
