<template>
  <div
    class="m-toast-container"
    :class="[{'m-toast-multi': config.multi}, className]"
    :style="containerStyle"
  >
    <transition-group
      name="m-toast"
      @after-enter="handleAfterEnter"
      @before-leave="handleBeforeLeave "
    >
      <Toast
        v-for="item in items"
        ref="toast"
        :key="item.__name"
        :detail="item"
        @destroy="remove(item)"
      />
    </transition-group>
  </div>
</template>

<script>
import Toast from '../toast'
import './index.scss'

export default {
  components: {
    Toast
  },
  props: {
    className: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      items: [],
      itemStore: [],
      config: {
        position: 'center',
        multi: false,
        type: 'info',
        duration: 1500
      },
      maxInstance: 10,
      maxStore: 100
    }
  },
  computed: {
    containerStyle () {
      return {
        top: { center: '40%', top: '30px' }[this.config.position] || this.config.position
      }
    }
  },
  methods: {
    configure (conf) {
      const cf = this.mergeOptions(conf)
      if (cf) {
        this.config = cf
      }
    },
    handleAfterEnter (el) {
      el.style.height = `${el.offsetHeight}px`
    },
    handleBeforeLeave (el) {
      if (el.parentNode.children.length > 1) {
        el.style.height = 0
        el.style.marginBottom = 0
      }
    },
    add (options) {
      const op = this.mergeOptions(typeof options === 'object' ? options : {
        msg: options
      })
      if (op) {
        if (!this.config.multi) {
          this.removeAll()
        }
        op.__name = `toast-${Math.random().toString(32)}`
        if (this.items.length >= this.maxInstance) {
          if (this.items.length < this.maxStore) {
            this.itemStore.push(op)
          }
        } else {
          this.items.push(op)
        }
      }
      return op
    },
    mergeOptions (options = {}) {
      if (options.type && !['info', 'warning', 'success', 'fail'].includes(options.type)) {
        return console.error(`不支持的toast类型：${options.type}`)
      }
      if (options.duration && !/^\d+$/.test(options.duration)) {
        return console.error(`不支持的duration值：${options.duration}`)
      }
      if (options.render && typeof options.render !== 'function') {
        return console.error(`不支持的render值：${options.render}`)
      }
      return { ...this.config, ...options }
      // return Object.assign({}, this.config, options)
    },
    remove (val = {}) {
      const index = this.items.findIndex(item => item.__name === val.__name)
      if (index >= 0) {
        this.items.splice(index, 1)
        if (this.itemStore.length) {
          this.items.push(this.itemStore.shift())
        }
      }
    },
    removeAll () {
      const self = this
      const items = [...this.items, ...this.itemStore]
      let startTime
      let animationFrame

      function removeItem (timeStamp) {
        if (!startTime) {
          startTime = timeStamp
          self.remove(items.shift())
        } else if (timeStamp - startTime > 150) {
          startTime = timeStamp
          self.remove(items.shift())
        }
        if (items.length) {
          animationFrame = window.requestAnimationFrame(removeItem)
        } else {
          window.cancelAnimationFrame(animationFrame)
        }
      }
      animationFrame = window.requestAnimationFrame(removeItem)
    }
  }
}
</script>
