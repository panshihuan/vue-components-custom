<template>
  <div class="m-slider">
    <div ref="track" class="m-slider__track">
      <div
        v-if="range"
        class="m-slider__bar"
        :style="{
          width: barWidth,
          left: barLeft
        }"
      >
      </div>
      <div
        v-if="showStops"
        class="m-slider__stops"
      >
        <template v-for="(item, i) in stopsNum">
          <div
            v-if="i > 0"
            :key="`stop${item}_${i}`"
            :style="{
              left: `${(i / max) * 100}%`
            }"
            class="m-slider__stop"
          ></div>
        </template>
      </div>
      <div class="m-slider__btns">
        <div
          v-for="(item, i) in showValues"
          :key="`btns${item}_${i}`"
          :style="{
            left: getOffset(item, i)
          }"
          class="m-slider__btn"
          @mousedown="handleMouseStart($event, i)"
        >
          <div class="m-slider__circle"></div>
          <slot :value="item">
            <div class="m-slider__content">{{item}}</div>
          </slot>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'm-slider',
  provide () {
    return {
      select: this
    }
  },
  inject: {
    form: {
      default: undefined
    },
    formItem: {
      default: undefined
    }
  },
  props: {
    value: {
      default: ''
    },
    step: {
      type: Number,
      default: 1
    },
    max: {
      type: Number,
      default: 100
    },
    min: {
      type: Number,
      default: 0
    },
    showStops: {
      type: Boolean,
      default: false
    },
    range: {
      type: Boolean,
      default: false
    },
    // 滑块按比例分布
    proportion: {
      type: Boolean,
      default: false
    },
    name: String
  },
  data () {
    return {
      touchStart: 0,
      touchIndex: 0,
      startValue: 0,
      target: null,
      stepWidth: 0
    }
  },
  computed: {
    stopsNum () {
      return Math.ceil(this.max / this.step)
    },
    isComplex () {
      return this.range || Array.isArray(this.value)
    },
    showValues () {
      if (this.isComplex) {
        return [...this.value]
      }
      return [this.value]
    },
    barWidth () {
      const l = this.showValues.length
      const v = this.showValues[l - 1] - this.showValues[0]
      return `${(v / this.max) * 100}%`
    },
    barLeft () {
      return `${(this.showValues[0] / this.max) * 100}%`
    }
  },
  created () {},
  methods: {
    getOffset (v, index) {
      let offset = v
      // 按比例分配需要单独计算
      if (this.proportion) {
        offset = this.showValues.reduce((prev, current, i) => {
          if (i <= index) {
            prev += current
          }
          return prev
        }, 0)
      }
      return `${(offset / this.max) * 100}%`
    },
    handleMouseStart (e, index) {
      this.target = document.querySelectorAll('.m-slider__btn')[index]
      this.touchStart = e.clientX
      this.touchIndex = index
      this.startValue = this.showValues[index]
      this.stepWidth = this.$refs.track.clientWidth / this.max
      document.addEventListener('mousemove', this.handleMouseMove)
      document.addEventListener('mouseup', this.handleMouseUp)
    },
    handleMouseMove (e) {
      const offset = e.clientX - this.touchStart
      const offsetStep = parseInt(offset / this.stepWidth, 10)
      const v = this.startValue + offsetStep
      let next = this.showValues[this.touchIndex + 1] || this.max
      let prev = this.showValues[this.touchIndex - 1] || this.min
      if (this.proportion) {
        next = this.showValues.reduce((max, item, i) => {
          if (i !== this.touchIndex) {
            max -= item
          }
          return max
        }, this.max)
        prev = 0
      }

      let nv = v
      if (v > next) {
        nv = next
      } else if (v < prev) {
        nv = prev
      }
      this.changeValue(nv)
    },
    handleMouseUp () {
      document.removeEventListener('mousemove', this.handleMouseMove)
      document.removeEventListener('mouseup', this.handleMouseUp)
    },
    changeValue (v) {
      if (!this.isComplex) {
        this.$emit('input', v)
      } else {
        const arr = [...this.showValues]
        arr[this.touchIndex] = v
        this.$emit('input', arr)
      }
    }
  }
}
</script>

<style lang="scss">
.m-slider {
  &__track {
    height: 4px;
    border-radius: 2px;
    position: relative;
    background-color: #e8eaec;
  }
  &__bar {
    position: absolute;
    z-index: 1;
    height: 100%;
    background: #57a3f3;
    border-radius: 3px;
  }
  &__stops{
    position: relative;
    z-index: 0;
    width: 100%;
    height: 100%;
  }
  &__stop {
    position: absolute;
    top: 50%;
    height: 50%;
    width: 1px;
    background-color: #cccccc;
    transform: translate(-50%, -50%);
  }
  &__btn {
    position: absolute;
    top: 50%;
    z-index: 2;
    transform: translate(-50%, -50%);
    user-select: none;
    &:hover {
      .m-slider__circle {
        transform: scale(1.2);
      }
      .m-slider__content{
        display: block;
      }
    }
  }
  &__circle {
    box-sizing: border-box;
    width: 12px;
    height: 12px;
    border: 2px solid #57a3f3;
    border-radius: 50%;
    background-color: #fff;
    transition: all .2s linear;
  }
  &__content {
    display: none;
    position: absolute;
    top: -8px;
    left: 50%;
    transform: translate(-50%, -100%);
    box-sizing: border-box;
    max-width: 250px;
    line-height: 20px;
    padding: 8px 12px;
    color: #fff;
    text-align: left;
    background-color: rgba(70, 76, 91, .9);
    border-radius: 4px;
    box-shadow: 0 1px 6px rgba(0, 0, 0, .2);
    // word-break: break-all;
    white-space: nowrap;
    &:after {
      content: "";
      position: absolute;
      left: 50%;
      bottom: -5px;
      width: 0;
      height: 0;
      border-color: transparent;
      border-style: solid;
      border-width: 5px 5px 0;
      border-top-color: rgba(70, 76, 91, .9);
      margin-left: -5px;
    }
  }
}
</style>
