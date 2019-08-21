import Vue from 'vue'

const configure = {
  maxPool: 1000, // 最大池容量
  maxConn: 5, // 最大并发加载数量
  defaultImg: '', // 开始加载钱的默认图片
  errorImg: '' // 加载出错的默认图片
}

const ThumbTypes = {
  'ZOOM': 1,
  'FIXED_WIDTH': 4,
  'FIXED_HEIGHT': 5,
  'FIXED_WIDTH_HEIGHT': 11
}

/**
 * @description 创建缩略图链接
 * @param type {String|Number}
 * @param url {String}
 * @param width {String|Number}
 * @param height {String|Number}
 * @returns {string}
 */
function createThumbURL (
  {
    type = 1,
    url = '',
    width = '',
    height = ''
  }
) {
  if (typeof type === 'string' && ThumbTypes[type] !== undefined) {
    type = ThumbTypes[type]
  }
  return `${url}?iopcmd=thumbnail&type=${type}&height=${height}&width=${width}`
}

const context = Symbol('context')
const assigned = Symbol('assigned')
class Provider {
  constructor (base = []) {
    this[context] = base
    this[assigned] = 0
  }
  /**
   * @description 获取下一个任务
   * @returns {*[]}
   */
  nextTask () {
    const task = this[context].find(item => !item.assigned)
    if (task) {
      task.assigned = true
      this[assigned] += 1
      return task
    }
    return null
  }
  /**
   * @description 移除任务
   * @param task {LazyTask}
   * @returns {*[]}
   */
  removeTask (task) {
    const index = this[context].findIndex(item => item === task)
    if (index >= 0) {
      this[assigned] -= 1
      return this[context].splice(index, 1)
    }
  }
  /**
   * @description 添加任务
   * @param task {LazyTask}
   * @returns {*[]}
   */
  addTask (task) {
    this[context].push(task)
  }
  get size () {
    return this[context].length
  }
  get assigned () {
    return this[assigned]
  }
}

const privateElement = Symbol('el')
const privateURL = Symbol('url')
const privatePreload = Symbol('pre')

class LazyTask {
  static providers = new Provider()
  constructor (el, url) {
    // 私有属性
    this[privateElement] = el
    this[privateURL] = url
    // 设置默认图片
    if (configure.defaultImg) {
      el.setAttribute('src', configure.defaultImg)
    }
    const preLoadElement = document.createElement('img')
    preLoadElement.onload = () => this.ready()
    preLoadElement.onerror = () => this.error()
    preLoadElement.onreadystatechange = () => {
      if (el.readyState === 'complete' || el.readyState === 'loaded') {
        this.ready()
      }
    }
    this[privatePreload] = preLoadElement
    if (LazyTask.providers.size < configure.maxPool) {
      LazyTask.providers.addTask(this)
    } else {
      console.warn('懒加载池已满')
    }
  }
  error () {
    if (configure.errorImg) {
      this[privateElement].setAttribute('src', configure.errorImg)
    }
    this.destroy()
    const task = LazyTask.providers.nextTask()
    task && task.run()
  }
  ready () {
    this[privateElement].setAttribute('src', this[privateURL])
    this.destroy()
    const task = LazyTask.providers.nextTask()
    task && task.run()
  }
  destroy () {
    let task = LazyTask.providers.removeTask(this)
    task && (task = null)
  }
  run () {
    this[privatePreload].setAttribute('src', this[privateURL])
  }
}
/* eslint-disable no-new */
function createTask (el, binding) {
  if (el.tagName.toLowerCase() === 'img') {
    let url = binding.value
    if (typeof binding.value === 'object') {
      url = binding.modifiers.thumb ? createThumbURL(binding.value) : binding.value.url
    }
    if (el[privateTask]) {
      LazyTask.providers.removeTask(el[privateTask])
    }
    el[privateTask] = new LazyTask(el, url)
  }
}

const privateTask = Symbol('task')

Vue.directive('lazy', {
  bind (el, binding) {
    createTask(el, binding)
    if (LazyTask.providers.assigned < configure.maxConn) {
      const task = LazyTask.providers.nextTask()
      task && task.run()
    }
  },
  update: createTask,
  unbind (el) {
    if (el[privateTask]) {
      LazyTask.providers.removeTask(el[privateTask])
    }
  }
})

export default {
  defaults: configure
}
