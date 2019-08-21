<template>
  <div class="m-calendar">
    <template v-for="item in calendars">
      <Monthly
        :key="`${item.month}${item.date}`"
        :data="item"
        :start="start"
        :end="end"
        @update:start="changeStart"
        @update:end="changeEnd"
      ></Monthly>
    </template>
  </div>
</template>
<script>
import Monthly from './monthly'

export default {
  name: 'MCalendar',
  components: {
    Monthly
  },
  props: {
    range: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      calendars: []
    }
  },
  computed: {
    start () {
      return this.range.start || ''
    },
    end () {
      return this.range.end || ''
    }
  },
  filters: {
    padZero (str) {
      return str.toString().padStart(2, '0')
    }
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      const now = new Date()
      const year = now.getFullYear()
      const month = now.getMonth()
      const date = now.getDate()
      const next = new Date(year, month, date + 1)

      const format = {
        ...this.range
      }
      const start = new Date(this.start)
      if (!this.start || isNaN(start.getTime())) {
        format.start = `${year}/${month + 1}/${date}`
      } else {
        format.start = `${start.getFullYear()}/${start.getMonth() + 1}/${start.getDate()}`
      }
      const end = new Date(this.end)
      if (!this.end || isNaN(end.getTime())) {
        format.end = `${next.getFullYear()}/${next.getMonth() + 1}/${next.getDate()}`
      } else {
        format.end = `${end.getFullYear()}/${end.getMonth() + 1}/${end.getDate()}`
      }

      this.calendars = Array(12)
        .fill(null)
        .map((item, i) => {
          const v = new Date(year, month + i, date)
          return {
            year: v.getFullYear(),
            month: v.getMonth(),
            date: v.getDate()
          }
        })
    },
    changeStart (v) {
      this.$set(this.range, 'start', v)
      this.$emit('change', this.range)
    },
    changeEnd (v) {
      this.$set(this.range, 'end', v)
      this.$emit('change', this.range)
    }
  }
}
</script>
<style lang="scss">
@import './index.scss';
</style>
