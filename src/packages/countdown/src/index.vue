<template>
  <div class="m-countdown">
    <slot :detail="detail">
      {{ detail.days }}天{{ detail.hours }}时{{ detail.minutes }}分{{ detail.seconds }}秒
    </slot>
  </div>
</template>

<script>
export default {
  name: 'countdown',
  props: {
    value: {
      type: [Number, String]
    },
    startTime: {
      type: Date,
      default: () => new Date()
    },
    stopTime: {
      type: Date,
      default: () => new Date()
    },
    autoPad: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      tempValue: 0
    }
  },
  computed: {
    delta () {
      if (this.value) {
        return this.value
      }
      return ((this.stopTime.getTime() - this.startTime.getTime()) / 1000) | 0
    },
    detail () {
      const seconds = this.tempValue % 60
      const minutes = (this.tempValue - seconds) / 60
      const fullHours = (this.tempValue - seconds - minutes * 60) / 3600
      const hours = fullHours % 24
      const days = (fullHours - hours) / 24
      const detail = {
        seconds,
        minutes,
        hours,
        days
      }
      if (this.autoPad) {
        Object.keys(detail).forEach(k => {
          const v = detail[k].toString()
          if (v.length < 2) {
            detail[k] = `0${v}`
          }
        })
      }
      return detail
    }
  },
  watch: {
    delta: {
      handler () {
        this.start()
      },
      immediate: true
    }
  },
  beforeDestroy () {
    this.stop()
  },
  methods: {
    start () {
      this.stop()
      this.tempValue = this.delta
      if (this.tempValue <= 0) return
      this.timer = setInterval(() => {
        if (--this.tempValue <= 0) {
          this.stop()
        }
        this.$nextTick(() => {
          this.$emit('step', this.detail)
        })
      }, 1000)
    },
    stop () {
      this.timer && clearInterval(this.timer)
    }
  }
}
</script>
