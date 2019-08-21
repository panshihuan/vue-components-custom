<template xmlns:v-finger="http://www.w3.org/1999/xhtml">
  <div
    v-if="show"
    class="m-pop-layer m-view"
    @touchstart="handleWrapperTouchStart"
    @touchend="handleWrapperTouchEnd"
    @touchcancel="handleWrapperTouchEnd"
  >
    <div class="m-view__title">
      {{active+1}}/{{total}}
      {{scale}}
    </div>

    <div class="m-view__swipe" ref="swipe">
      <div
        v-for="(img, i) of images"
        :key="img"
        class="m-view__imgs"
      >
        <img
          v-finger:pinch="onPinch"
          :style="active === i ? imageStyle : null"
          :src="img"
          @touchstart="onTouchStart($event, i)"
          @touchmove="onTouchmove"
          @touchend="onTouchend"
        />
      </div>
      <!--<MSwipe-->
      <!--ref="swipe"-->
      <!--:init="images.length"-->
      <!--:initial-num="active"-->
      <!--@changeEnd="swipeChangeEnd"-->
      <!--&gt;-->
      <!---->
      <!--</MSwipe>-->
    </div>
  </div>
</template>

<script>
// import MSwipe from '../../swipe/src/index'
import Touch from '../mixins/touch'
import './index.scss'

function range (num, min, max) {
  return Math.min(Math.max(num, min), max)
}

export default {
  name: 'img-preview',
  mixins: [Touch],
  components: {
    // MSwipe
  },
  props: {
    images: {
      type: Array,
      default: () => []
    },
    startIndex: {
      type: Number,
      default: 0
    },
    show: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      active: this.startIndex,
      touchStartTime: '',
      startScale: 1,
      moving: false, // img被放大后，是否可以被移动的标记
      scaleMin: false,
      scale: 1,
      moveX: 0,
      moveY: 0
    }
  },
  computed: {
    total () {
      return this.images.length
    },
    imageStyle () {
      const { scale } = this
      const style = {
        transition: this.scaleMin ? '.3s all' : ''
      }
      style.transform = `scale(${scale}) translate(${this.moveX / scale}px, ${this.moveY / scale}px)`
      return style
    }
  },
  watch: {
    show () {
    },
    startIndex (active) {
      this.active = active
    },
  },
  created () {

  },
  methods: {
    onPinch (et) { // 来自第三方的双指缩放事件,监听this.scale
      var request = new XMLHttpRequest()
      request.open('POST', '/scale')
      request.send(JSON.stringify({ aaa: et }))
      this.scale = (Math.abs(this.startScale) - 1) + et.scale
    },

    startMove (event) { // 准备移动放大了的img
      const image = event.currentTarget
      const rect = image.getBoundingClientRect() // 拿到被scale后的img的width
      console.log('rect:::', rect)
      const winWidth = window.innerWidth
      const winHeight = window.innerHeight

      this.touchStart(event)
      this.moving = true
      this.startMoveX = this.moveX
      this.startMoveY = this.moveY
      this.maxMoveX = Math.max(0, (rect.width - winWidth) / 2)
      this.maxMoveY = Math.max(0, (rect.height - winHeight) / 2)
    },

    onTouchStart (event, i) {
      this.active = i // 代替swipe
      const { touches } = event
      this.scaleMin = false
      this.startScale = this.scale
      if (touches.length === 1) { // &this.scale !== 1
        this.startMove(event)
      }
    },

    onTouchmove () {
      if (this.moving) {
        this.touchMove(event)
        const moveX = this.deltaX + this.startMoveX
        const moveY = this.deltaY + this.startMoveY
        this.moveX = range(moveX, -this.maxMoveX, this.maxMoveX)
        this.moveY = range(moveY, -this.maxMoveY, this.maxMoveY)
        console.log('this.moveX::::', this.moveX)
        var request = new XMLHttpRequest()
        request.open('POST', '/move')
        request.send(JSON.stringify({ move: this.imageStyle }))
      }
    },

    onTouchend (event) {
      if (this.scale < 1) {
        this.moving = false
        this.startMoveX = 0
        this.startMoveY = 0
        this.scaleMin = true
        this.resetScale()
      }
      if (this.moving) {
        if (!event.touches.length) {
          this.moving = false
          this.startMoveX = 0
          this.startMoveY = 0

          if (this.scale < 1) {
            this.resetScale()
          }
        }
      }
    },

    // 父层两个div的事件, 区分是swipe 还是 操作img
    handleWrapperTouchStart () {
      this.touchStartTime = new Date()
    },

    handleWrapperTouchEnd (event) {
      event.preventDefault()
      const deltaTime = new Date() - this.touchStartTime
      if (deltaTime < 100) {
        this.$emit('layerShow', false)
      }
    },

    resetScale () {
      this.scale = 1
      this.moveX = 0
      this.moveY = 0
    }

  }
}
</script>
