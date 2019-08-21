<template>
  <div
    class="sort-item"
    :class="{'sort-item--dragging': isDrag}"
    :style="parsedStyle"
    @mousedown.stop="handleMouseDown"
  >
      <slot></slot>
  </div>
</template>

<script>
import EventBus from '../../eventbus'
import Vue from 'vue'
import DropArea from '../dropAea'

export default {
  name: 'sortItem',
  props: {
    data: {}
  },
  inject: ['sortContainer'],
  data () {
    return {
      start: {},
      end: {},
      style: {},
      isDrag: false,
      Area: Vue.extend(DropArea)
    }
  },
  computed: {
    parsedStyle () {
      return {
        width: this.style.width !== undefined ? `${this.style.width}px`
          : undefined,
        height: this.style.height !== undefined ? `${this.style.height}px`
          : undefined
      }
    }
  },
  created () {
    this.sortContainer.items.push(this)
  },
  beforeDestroy () {
    const index = this.sortContainer.items.findIndex((item) => item === this)
    if (index >= 0) {
      this.sortContainer.items.splice(index, 1)
    }
  },
  methods: {
    handleMouseDown (e) {
      if (this.sortContainer.beforeDrag && this.sortContainer.beforeDrag(e) === false) return
      window.addEventListener('mousemove', this.handleMouseMove, {
        capture: true
      })
      window.addEventListener('mouseup', this.handleMouseUp, {
        capture: true
      })
      this.start = { x: e.clientX, y: e.clientY }
    },
    handleMouseMove (e) {
      e.preventDefault()
      if (!this.isDrag && Math.max(Math.abs(e.clientX - this.start.x), Math.abs(e.clientY - this.start.y)) >= 10) {
        this.style = { width: this.$el.offsetWidth, height: this.$el.offsetHeight }
        const rect = this.$el.getBoundingClientRect()
        this.createFragment(e.clientX, e.clientY,
          (e.clientX - rect.left) / rect.width * 100,
          (e.clientY - rect.top) / rect.height * 100
        )
        this.isDrag = true
        this.sortContainer.$emit('drag-start', this)
      }
      if (this.isDrag) {
        this.$nextTick(() => {
          this.sortContainer.onDrag && this.sortContainer.onDrag(e)
          Object.assign(this.fragment.style, this.getPosition(e.clientX, e.clientY))
          const element = document.elementFromPoint(e.clientX, e.clientY)
          if (element) {
            const container = element.closest('.sort-container')
            if (container) {
              if (this.lastcontainer && container !== this.lastcontainer) {
                this.removeDropArea()
              }
              this.lastcontainer = container
              EventBus.$emit('getSortChildren', container, (children) => {
                const indexes = this.getPositionIndex(children, e.pageY)
                if (indexes.prev === undefined && indexes.next === undefined) {
                  this.removeDropArea()
                } else {
                  if (this.sortContainer.beforeDropAreaCreate && this.sortContainer.beforeDropAreaCreate(container, indexes) === false) return
                  this.createDropArea(indexes, children)
                }
              })
            } else {
              this.removeDropArea()
            }
          }
        })
      }
    },
    handleMouseUp (e) {
      window.removeEventListener('mousemove', this.handleMouseMove, {
        capture: true
      })
      window.removeEventListener('mouseup', this.handleMouseMove, {
        capture: true
      })
      if (this.isDrag) {
        if (!this.sortContainer.onDrop || this.sortContainer.onDrop(e, this, this.sortContainer.data) !== false) {
          if (this.dropArea) {
            const { prev, next } = this.dropArea
            EventBus.$emit('drag-end', this.dropArea.$el.closest('.sort-container'), prev, next)
          }
        }
      }
      this.start = {}
      this.isDrag = false
      this.fragmentRect = null
      this.lastcontainer = null
      if (this.fragment) {
        document.body.removeChild(this.fragment)
        this.fragment = null
      }
      this.removeDropArea()
      this.style = {}
      this.sortContainer.onEnded && this.sortContainer.onEnded(e)
    },
    createFragment (x, y, originX, originY) {
      const fragment = this.$el.cloneNode(true)
      fragment.classList.add('sort-fragment')
      Object.assign(fragment.style, {
        position: 'fixed',
        zIndex: 100000,
        pointerEvents: 'none',
        transform: 'scale(0.7)',
        transformOrigin: `${originX}% ${originY}%`,
        ...this.parsedStyle,
        ...this.getPosition(x, y)
      })
      fragment.removeAttribute('id')
      document.body.appendChild(fragment)
      this.fragment = fragment
    },
    createDropArea ({ prev, next }, children) {
      if (this.dropArea) {
        if (this.dropArea.prev === prev || this.dropArea.next === next) return
        this.removeDropArea()
      }
      if (prev === undefined && next === undefined) return this.removeDropArea()
      const node = children[prev === undefined ? next : prev]
      this.dropArea = new this.Area()
      const el = this.dropArea.$mount().$el
      this.dropArea.prev = prev
      this.dropArea.next = next
      Object.assign(el.style, {
        width: `${node.offsetWidth}`,
        height: `${node.offsetHeight}`,
        padding: '20px'
      })
      if (next === undefined) {
        this.container = children[prev].parentNode
        this.container.appendChild(el)
      } else {
        const node = children[next]
        this.container = node.parentNode
        this.container.insertBefore(el, node)
      }
    },
    removeDropArea () {
      if (this.dropArea) {
        const { $el } = this.dropArea
        this.container && this.container.removeChild($el)
        this.dropArea.$destroy()
        this.dropArea = null
      }
    },
    getPosition (x, y) {
      this.fragmentRect = this.fragmentRect || this.$el.getBoundingClientRect()
      const { fragmentRect } = this
      const left = fragmentRect.left + x - this.start.x
      const top = fragmentRect.top + y - this.start.y
      return { left: `${left}px`, top: `${top}px` }
    },
    getPositionIndex (nodeList, y) {
      let prev, next
      let list = Array.prototype.slice.call(nodeList)
        .filter(node => node.classList.contains('sort-item') && !node.classList.contains('sort-fragment'))
      list.some((node, index) => {
        const rect = node.getBoundingClientRect()
        if (index === 0 && y < rect.top) {
          next = 0
          return true
        }
        if (y > rect.bottom) {
          if (index >= list.length - 1) {
            prev = index
            return true
          } else {
            const nextNode = list[index + 1]
            const nextRect = nextNode.getBoundingClientRect()
            if (y < nextRect.top) {
              prev = index
              next = index + 1
              return true
            }
          }
        }
      })
      if ((prev !== undefined && list[prev].classList.contains('sort-item--dragging')) ||
        (next !== undefined && list[next].classList.contains('sort-item--dragging'))) {
        return {}
      }
      return { prev, next }
    }
  }
}
</script>

<style lang="scss">
  @import "index";
</style>
