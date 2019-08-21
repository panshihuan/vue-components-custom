<template>
  <div class="m-swipe">
    <div class="m-swipe-container">
      <div
        ref="wraps"
        class="m-swipe-wrap"
        :style="calcStyle"
        @touchstart="onTouchStart"
        @touchmove="onTouchMove"
        @touchend="onTouchEnd"
        @touchcancel="onTouchEnd"
        @transitionend="onTransitionEnd"
      >
        <slot/>
      </div>
    </div>
    <slot name="indicator">
      <div class="m-swipe-indicators">
        <i
          v-for="index in itemLength"
          class="m-swipe-indicator"
          :key="`indicator${index}`"
          :class="index - 1 === dealActNum ? 'm-swipe-indicator__active' : ''"
          @click="move(index - 1)"></i>
      </div>
    </slot>
  </div>
</template>
<style lang="scss"
       src="./index.scss">
</style>
<script>
import Touch from './mixins/touch'

export default {
  mixins: [Touch],
  props: {
    animationTime: {
      type: Number,
      default: 2000
    },
    initialNum: {
      type: Number,
      default: 0
    },
    intervalTime: {
      type: Number,
      default: 4000
    }
  },
  data () {
    return {
      wraps: {},
      items: [],
      duration: 2000,
      activeNum: 0,
      itemLength: 0,
      offset: 0,
      tempOffset: 0,
      swiping: false,
      calcWidth: 0,
      timer: null,
      durationTimer: null,
      touchTime: 0,
      observer: null,
      initializeFlag: false
    }
  },
  computed: {
    calcStyle () {
      return {
        'transform': `translate3d(calc( -${
          this.calcWidth ? `${(this.activeNum + 2) * this.calcWidth}px` : ((this.activeNum + 2) * 100) + '%'}
           + ${this.offset}px ),0,0)`,
        'transition-duration': (this.swiping ? 0 : this.duration) + 'ms'
      }
    },
    dealActNum () {
      console.log('actnum', this.activeNum)
      console.log('itemLength', this.itemLength)
      return Math.max(0, Math.min(this.activeNum, this.itemLength - 1))
    }
  },
  watch: {
    initialNum (active) {
      this.activeNum = active
    }
  },
  mounted () {
    this.addMutationObserver()
    this.initialize()
  },
  beforeDestroy () {
    this.clearTimer()
  },
  methods: {
    initialize () {
      this.$nextTick(() => {
        this.wraps = this.$refs.wraps
        this.items = this.wraps.children
        if (!this.items.length) return
        this.itemLength = this.items.length
        this.duration = this.animationTime
        this.activeNum = this.initialNum
        this.createLoopEl()
        // this.autoPlay()
        setTimeout(() => {
          this.initializeFlag = false
        })
      })
    },
    move (n, duration) {
      this.offset = 0
      this.tempOffset = 0
      this.activeNum = n
      if (duration) {
        this.duration = duration
        this.durationTimer = setTimeout(() => {
          this.duration = this.animationTime
        }, duration)
      }
    },
    next () {
      this.move(this.activeNum + 1, this.animationTime)
      // if (this.activeNum === this.itemLength - 1) {
      //   this.duration = 0
      //   this.activeNum = -1
      //   setTimeout(() => {
      //     this.duration = this.animationTime
      //     this.activeNum = 0
      //   }, 100)
      // } else {
      // }
    },
    pre () {
      this.move(this.activeNum - 1)
      // if (this.activeNum === 0) {
      //   this.duration = 0
      //   this.activeNum = this.itemLength
      //   setTimeout(() => {
      //     this.duration = this.animationTime
      //     this.activeNum = this.itemLength - 1
      //   }, 100)
      // } else {
      // }
    },
    clearTimer () {
      clearInterval(this.timer)
      this.timer = null
      clearInterval(this.durationTimer)
      this.durationTimer = null
    },
    autoPlay () {
      // this.clearTimer()
      // this.timer = setInterval(() => {
      //   this.next()
      // }, this.intervalTime)
    },
    createLoopEl () {
      const swiperWrapEl = this.wraps
      const childrenList = swiperWrapEl.children
      const duplicateFirstChildTwo =
        childrenList.length === 1 ? childrenList[0].cloneNode(true) : childrenList[1].cloneNode(true)
      const duplicateLastChildTwo = childrenList.length === 1 ? childrenList[0].cloneNode(true) : childrenList[childrenList.length - 2].cloneNode(true)
      const duplicateFirstChild = swiperWrapEl.firstElementChild.cloneNode(true)
      const duplicateLastChild = swiperWrapEl.lastElementChild.cloneNode(true)
      swiperWrapEl.insertBefore(duplicateLastChild, swiperWrapEl.firstElementChild)
      swiperWrapEl.insertBefore(duplicateLastChildTwo, swiperWrapEl.firstElementChild)
      swiperWrapEl.appendChild(duplicateFirstChild)
      swiperWrapEl.appendChild(duplicateFirstChildTwo)
    },
    onTouchStart (event) {
      this.touchTime = new Date().getTime()
      this.touchStart(event)
      this.clearTimer()
      if (!this.calcWidth) {
        this.calcWidth = parseInt(window.getComputedStyle(this.wraps).width)
      }
      this.swiping = true
      const transformX = window.getComputedStyle(this.wraps).getPropertyValue('transform')
      // 获取当前偏移量
      this.tempOffset = parseFloat(transformX.split(',')[4] || 0) + (this.activeNum + 2) * this.calcWidth
      this.offset = this.tempOffset
    },
    onTouchMove (event) {
      this.touchMove(event)
      this.offset = this.tempOffset + this.deltaX
    },
    onTouchEnd (event) {
      this.swiping = false
      this.autoPlay()
      const duration = new Date().getTime() - this.touchTime
      this.touchTime = 0
      const justfy = (deltaX, duration, calcWidth) => {
        return deltaX * 2.5 > calcWidth || deltaX * 10000 / duration > calcWidth
      }
      // console.log('offset', this.offset)
      // console.log('activeNum', this.activeNum)
      // console.log('calcWidth', this.calcWidth)
      // console.log('deltaX', this.deltaX)
      if (!justfy(Math.abs(this.deltaX), duration, this.calcWidth)) {
        this.move(this.activeNum, Math.abs(this.offset) / this.calcWidth * this.animationTime)
      } else {
        const calcDurantion = (deltaX, calcWidth, offset) => {
          return (calcWidth - offset) / calcWidth
        }
        const calcDur = calcDurantion(this.delatX, this.calcWidth, Math.abs(this.offset)) * this.animationTime
        const nextNum = this.activeNum + (this.deltaX < 0 ? 1 : -1)
        if (nextNum === -2) {
          this.duration = 0
          this.activeNum = this.itemLength - 1
          setTimeout(() => {
            this.duration = this.animationTime
            this.move(this.itemLength - 2, calcDur)
          }, 100)
        } else if (nextNum === this.itemLength + 1) {
          this.duration = 0
          this.activeNum = 0
          setTimeout(() => {
            this.duration = this.animationTime
            this.move(1, calcDur)
          }, 100)
        } else {
          this.move(nextNum, calcDur)
        }
      }
    },
    onTransitionEnd () {
      if (this.activeNum === -1) {
        this.duration = 0
        this.activeNum = this.itemLength - 1
        setTimeout(() => {
          this.duration = this.animationTime
        }, 100)
      }
      if (this.activeNum === this.itemLength) {
        this.duration = 0
        this.activeNum = 0
        setTimeout(() => {
          this.duration = this.animationTime
        }, 100)
      }
      this.$emit('changeEnd', this.activeNum)
    },
    addMutationObserver () {
      this.observer = new MutationObserver((mutations) => {
        if (!this.initializeFlag && mutations[0].type !== 'attributes') {
          this.initializeFlag = true
          this.initialize()
        }
      })
      this.observer.observe(
        this.$el.querySelector('.m-swipe-wrap'),
        { attributes: false, childList: true, subtree: true }
      )
    }
  }
}
</script>
