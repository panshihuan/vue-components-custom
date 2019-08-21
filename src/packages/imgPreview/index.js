import Vue from 'vue'
import VueImgPreview from './src'

const defaultOptions = {
  images: [],
  show: true,
  startIndex: 0
}

const createInstance = () => {
  let instance = new (Vue.extend(VueImgPreview))({
    el: document.createElement('div')
  })
  document.body.appendChild(instance.$el)
  return instance
}

const ImgPreview = (images, startIndex) => {
  const instance = createInstance()
  const options = Array.isArray(images) ? { images, startIndex } : { images }
  Object.assign(instance, {
    ...defaultOptions,
    ...options
  })

  instance.$on('layerShow', show => {
    document.body.removeChild(instance.$el)
    instance.show = show
    if (!show) {
      instance.$destroy()
    }
  })

  return instance
}

ImgPreview.install = Vue => Vue.use(ImgPreview)

export default ImgPreview
