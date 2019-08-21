<template>
  <div class="imgpreview" :style="{backgroundColor: `rgba(0, 0, 0, ${loadedImg[currentIndex].scale > 1 ? 1 : loadedImg[currentIndex].scale})`}">
    <div
      class="imgpreview__wrap"
      :style="{transform: `translate3d(${wrapX}px, 0, 0)`}"
      @touchstart.prevent.stop="touchStart"
      @touchmove.prevent.stop="touchmove"
      @touchend.prevent.stop="touchend"
    >
      <div class="imgpreview__wrap__imgcontainer" :style="{transform: `translate3d(${imgContainer[0]}px, -50%, 0)`}">
        <div
          :style="{transform: `scale(${loadedImg[0].scale}) translate3d(${loadedImg[0].x}px, ${loadedImg[0].y}px, 0)`, transformOrigin: `${originX}px ${originY}px`}"
        >
          <img :src="imgList[loadedImg[0].index]" :style="{width: clientWidth + 'px'}">
        </div>
      </div>
      <div class="imgpreview__wrap__imgcontainer" :style="{transform: `translate3d(${imgContainer[1]}px, -50%, 0)`}">
        <div
          :style="{transform: `scale(${loadedImg[1].scale}) translate3d(${loadedImg[1].x}px, ${loadedImg[1].y}px, 0)`, transformOrigin: `${originX}px ${originY}px`}"
        >
          <img :src="imgList[loadedImg[1].index]" :style="{width: clientWidth + 'px'}">
        </div>
      </div>
      <div class="imgpreview__wrap__imgcontainer" :style="{transform: `translate3d(${imgContainer[2]}px, -50%, 0)`}">
        <div
          :style="{transform: `scale(${loadedImg[2].scale}) translate3d(${loadedImg[2].x}px, ${loadedImg[2].y}px, 0)`, transformOrigin: `${originX}px ${originY}px`}"
        >
          <img :src="imgList[loadedImg[2].index]" :style="{width: clientWidth + 'px'}">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'imgpreview',

  props: {
    imgList: {
      require: true,
      type: Array
    }
  },

  data () {
    const clientWidth = window.screen.width

    return {
      test: 0,
      clientWidth: clientWidth,
      currentIndex: 1,
      wrapX: 0,
      wrapXTemp: 0,
      imgContainer: [-clientWidth, 0, clientWidth],
      isMultiple: false,
      position: [{}, {}],
      hypotenuse: 0,
      originX: 0,
      originY: 0,
      maxLeftTranslateX: 0,
      minRightTranslateX: 0,
      singleTouchPosition: {
        x: 0
      },
      loadedImg: [
        {
          index: -1,
          scale: 1,
          scaleTemp: 1,
          x: 0,
          y: 0,
          start: {
            x: 0,
            y: 0
          },
          move: {
            x: 0,
            y: 0
          }
        },
        {
          index: 0,
          scale: 1,
          scaleTemp: 1,
          x: 0,
          y: 0,
          start: {
            x: 0,
            y: 0
          },
          move: {
            x: 0,
            y: 0
          }
        },
        {
          index: 1,
          scale: 1,
          scaleTemp: 1,
          x: 0,
          y: 0,
          start: {
            x: 0,
            y: 0
          },
          move: {
            x: 0,
            y: 0
          }
        }
      ]
    }
  },

  watch: {
    wrapX (newVal, oldVal) {
      if (newVal % this.clientWidth === 0 && newVal !== this.wrapXTemp) {
        if (newVal < oldVal) {
          this.currentIndex = (this.currentIndex + 1) % 3
        } else if (this.currentIndex === 0) {
          this.currentIndex = 2
        } else {
          this.currentIndex--
        }

        this.wrapXTemp = newVal
      }
    },

    currentIndex (newVal, oldVal) {
      if ((newVal > oldVal || (newVal === 0 && oldVal === 2)) && !(newVal === 2 && oldVal === 0)) {
        const currentLoadedIndex = this.loadedImg[newVal].index
        this.loadedImg[(newVal + 1) % 3].index = currentLoadedIndex + 1
        this.imgContainer[(newVal + 1) % 3] += 3 * this.clientWidth
      } else {
        const currentLoadedIndex = this.loadedImg[newVal].index
        this.loadedImg[(oldVal + 1) % 3].index = currentLoadedIndex - 1
        this.imgContainer[(oldVal + 1) % 3] -= 3 * this.clientWidth
      }

      this.resetScale(oldVal)
    }
  },

  methods: {
    touchStart (e) {
      this.singleTouchPosition.x = e.touches[0].clientX

      if (e.targetTouches.length >= 2) {
        this.isMultiple = true

        const _position = this.position
        const _targetTouches = e.targetTouches

        _position[0].x = _targetTouches[0].clientX
        _position[0].y = _targetTouches[0].clientY

        _position[1].x = _targetTouches[1].clientX
        _position[1].y = _targetTouches[1].clientY

        this.originX = (_position[0].x + _position[1].x) / 2
        this.originY = (_position[0].y + _position[1].y) / 2

        this.hypotenuse = Math.sqrt(Math.pow((_position[0].x - _position[1].x), 2) + Math.pow((_position[0].y - _position[1].y), 2))
      } else {
        this.wrapXTemp = this.wrapX

        if (this.loadedImg[this.currentIndex].scale !== 1) { // 图片未放大情况
          const _start = this.loadedImg[this.currentIndex].start
          const _targetTouches = e.targetTouches
          _start.x = _targetTouches[0].clientX
          _start.y = _targetTouches[0].clientY
        }
      }
    },

    touchmove (e) {
      const _loadedImg = this.loadedImg
      const currentIndex = this.currentIndex

      if (this.isMultiple) {
        const _position = this.position
        const _targetTouches = e.targetTouches

        if (Object.keys(_position[0]).length) {
          this.setScale(_targetTouches)
        }
      } else if (_loadedImg[currentIndex].scale === 1) { // 图片未放大
        this.moveWrap(e)
      } else { // 图片已放大
        const img = _loadedImg[currentIndex]
        const _start = img.start
        const _move = img.move
        const _targetTouches = e.targetTouches

        let moveOffset = (_targetTouches[0].clientX - _start.x) / 1.8 + img.x
        if (moveOffset < this.maxLeftTranslateX && moveOffset > this.minRightTranslateX) {
          _move.x = _targetTouches[0].clientX
          _move.y = _targetTouches[0].clientY

          img.x += ((_move.x - _start.x) / 1.8)
          img.y += ((_move.y - _start.y) / 1.8)

          img.start.x = img.move.x
          img.start.y = img.move.y
        } else {
          this.moveWrap(e)
        }
      }
    },

    touchend (e) {
      const _loadedImg = this.loadedImg
      const currentIndex = this.currentIndex
      _loadedImg[currentIndex].scaleTemp = 1

      if (_loadedImg[currentIndex].scale < 1) { // 若 scale 小于 1， 则恢复为 1
        this.resetScale(currentIndex)
      }

      this.setFinalPosition()

      if (!e.targetTouches.length) {
        this.isMultiple = false
      }
    },

    setScale (_targetTouches) {
      if (_targetTouches.length < 2) return

      const _hypotenuse = Math.sqrt(Math.pow((_targetTouches[0].clientX - _targetTouches[1].clientX), 2) + Math.pow((_targetTouches[0].clientY - _targetTouches[1].clientY), 2))

      const temp = this.loadedImg[this.currentIndex].scale + ((_hypotenuse / this.hypotenuse) - this.loadedImg[this.currentIndex].scaleTemp)
      if (temp < 0.3 || temp > 4) return

      this.loadedImg[this.currentIndex].scale = temp
      this.loadedImg[this.currentIndex].scaleTemp = _hypotenuse / this.hypotenuse

      if (temp >= 1) { // 图片放大时允许其左移和右移的距离
        const allowOffset = (temp - 1) * this.clientWidth / temp
        this.maxLeftTranslateX = allowOffset * (this.originX / this.clientWidth)
        this.minRightTranslateX = -(allowOffset - this.maxLeftTranslateX)
      }
    },

    resetScale (index) {
      const _loadedImg = this.loadedImg

      _loadedImg[index].scale = 1
      _loadedImg[index].scaleTemp = 1
      _loadedImg[index].x = 0
      _loadedImg[index].y = 0

      this.maxLeftTranslateX = 0
      this.minRightTranslateX = 0
    },

    moveWrap (e) {
      this.wrapX += (e.touches[0].clientX - this.singleTouchPosition.x)
      this.singleTouchPosition.x = e.touches[0].clientX
    },

    setFinalPosition () {
      const _loadedImg = this.loadedImg
      const currentIndex = this.currentIndex

      const offset = this.wrapX - this.wrapXTemp
      if (Math.abs(offset) < this.clientWidth / 4 ||
          (_loadedImg[currentIndex].index === this.imgList.length - 1 && offset < 0) ||
          (_loadedImg[currentIndex].index === 0 && offset > 0)) {
        this.wrapX = Math.round(this.wrapX - offset)
      } else if (offset > 0) { // 手指向右滑
        this.wrapX = Math.round(this.wrapX + this.clientWidth - offset)
      } else { // 手指向左滑
        this.wrapX = Math.round(this.wrapX - this.clientWidth - offset)
      }

      this.singleTouchPosition.x = 0
    },

    throttle (delay, action) {
      let last = 0
      return () => {
        let curr = +new Date().getTime()
        if (curr - last > delay) {
          action.apply(this, arguments)
          last = curr
        }
      }
    }
  }
}
</script>

<style lang="scss">
  .imgpreview {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 12;

    .imgpreview__wrap {
      width: 300%;
      height: 100%;
      white-space: nowrap;

      .imgpreview__wrap__imgcontainer {
        position: absolute;
        top: 50%;
        left: 0;

        img {
          max-width: 100%;
        }
      }
    }
  }
</style>
