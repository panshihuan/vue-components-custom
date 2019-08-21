<template>
  <div class="sort-container">
    <slot></slot>
  </div>
</template>

<script>
import EventBus from './eventbus'

export default {
  name: 'sort',
  props: {
    data: {
      type: Array,
      required: true
    },
    beforeDrag: {
      type: Function
    },
    beforeDropAreaCreate: {
      type: Function
    },
    onDrag: {
      type: Function
    },
    onDrop: {
      type: Function
    },
    onEnded: {
      type: Function
    },
    beforeChange: {
      type: Function
    },
    afterChange: {
      type: Function
    }
  },
  provide () {
    return {
      sortContainer: this
    }
  },
  data () {
    return {
      items: [],
      target: undefined
    }
  },
  created () {
    this.$on('drag-start', this.handleDragStart)
    EventBus.$on('drag-end', this.handleDragEnd)
    EventBus.$on('drag-end-ensure', this.handleInsert)
    EventBus.$on('getSortChildren', this.handleGetChildren)
  },
  beforeDestroy () {
    EventBus.$off('drag-end', this.handleDragEnd)
    EventBus.$off('drag-end-ensure', this.handleInsert)
    EventBus.$off('getSortChildren', this.handleGetChildren)
  },
  methods: {
    handleDragStart (instance) {
      const index = this.items.findIndex((item) => item === instance)
      if (index >= 0) {
        this.target = index
      }
    },
    handleDragEnd (container, prev, next) {
      if (this.target !== undefined) {
        const target = this.data[this.target]
        if (this.beforeChange && this.beforeChange(target, container, prev, next) === false) return
        this.data.splice(this.target, 1)
        let p = prev
        if (this.$el === container && this.target < prev) {
          p -= 1
        }
        EventBus.$emit('drag-end-ensure', container, p, next, target)
      }
      this.target = undefined
    },
    handleInsert (container, prev, next, target) {
      if (this.$el === container && target) {
        this.data.splice(prev === undefined ? 0 : prev + 1, 0, target)
        this.afterChange && this.afterChange()
      }
    },
    handleGetChildren (container, cb) {
      if (this.$el === container) {
        cb(this.items.map(item => item.$el))
      }
    }
  }
}
</script>

<style lang="scss">
  @import "index";
</style>
