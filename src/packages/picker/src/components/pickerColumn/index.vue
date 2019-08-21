<template>
  <div
    class="m-picker-column"
    @touchstart="handleTouchStart"
    @touchmove="handleTouchMove"
    @touchend="handleTouchEnd"
  >
    <ul
      class="m-picker-column__list"
      ref="column"
      :style="style"
    >
      <li
        v-for="(item, index ) in data"
        :key="index"
        class="m-picker-column__item"
        :class="{'m-picker-column__item--active':index === activeIndex}"
        @click="handleItemClick(item, index)"
      >
        {{ item.label }}
      </li>
    </ul>
  </div>
</template>

<script>
import './index.scss'
export default {
  props: {
    data: {
      type: Array,
      default: () => []
    },
    value: {
      type: [String, Number]
    }
  },
  data () {
    return {
      touched: false,
      rows: 5,
      defaultRowHeight: 45,
      touchPoints: {
        sy: 0,
        ey: 0
      }
    }
  },
  computed: {
    currentIndex () {
      if (this.value !== undefined) {
        return Math.max(0, this.data.findIndex(item => {
          return item.value === this.value
        }))
      }
      return 0
    },
    rowHeight () {
      return this.$refs.column ? this.$refs.column.offsetHeight / this.data.length : this.defaultRowHeight
    },
    halfRows () {
      return Math.floor(this.rows / 2)
    },
    ceilingUp () {
      return this.halfRows * this.rowHeight
    },
    ceilingDown () {
      return (this.halfRows + 1) * this.rowHeight
    },
    tempIndex () {
      return Math.max(0, Math.min(this.data.length - 1,
        Math.round((this.ceilingUp - this.offsetY) / this.$refs.column.offsetHeight * this.data.length)))
    },
    activeIndex () {
      return this.touched ? this.tempIndex : this.currentIndex
    },
    offsetY () {
      let offsetY = this.rowHeight * (this.halfRows - this.currentIndex)
      if (this.touchPoints.ey && this.touchPoints.sy) {
        offsetY += this.touchPoints.ey - this.touchPoints.sy
      }
      if (this.$refs.column) {
        offsetY = offsetY <= this.ceilingUp ? Math.max(this.ceilingUp - this.$refs.column.offsetHeight, offsetY)
          : Math.min(this.ceilingDown, offsetY)
      }
      return offsetY
    },
    style () {
      return {
        transform: `translate3d(0, ${this.offsetY}px, 0)`,
        transition: `all ${this.touched ? 0 : 200}ms ease`
      }
    }
  },
  methods: {
    handleItemClick (item) {
      this.$emit('change', item.value)
    },
    handleTouchStart (e) {
      this.touched = true
      this.touchPoints.sy = e.touches[0].clientY
    },
    handleTouchMove (e) {
      this.touchPoints.ey = e.touches[0].clientY
    },
    handleTouchEnd () {
      if (this.touchPoints.ey) {
        this.$emit('change', this.data[this.tempIndex].value)
      }
      this.touched = false
      this.touchPoints = { sy: 0, ey: 0 }
    }
  }
}
</script>
