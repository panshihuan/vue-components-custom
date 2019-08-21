<!--日历-年月日-->
<template>
  <div class="m-monthly">
    <div class="m-monthly__month">
      {{currentYear}}年{{currentMonth | padZero}}月
    </div>
    <table class="m-monthly__weeks">
      <tr>
        <th
          v-for="(item, i) of tableHead"
          :key="`th${i}`"
        >{{item}}</th>
      </tr>
    </table>
    <table class="m-monthly__dates">
      <tr
        v-for="(item, i) of tableList"
        :key="`tr${i}`"
      >
        <td
          v-for="(v, j) of item"
          :key="`td${j}`"
          :class="[v.group, {
            selected: v.selected,
            range: v.inRange,
            expired: v.isExpired,
          }]"
          @click="selectThis(v.year, v.month, v.date, $event)"
        >
          {{v.date | padZero}}
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
export default {
  props: {
    // 日历开始星期：7->0, 1->1, 2->2, ..., 6->6
    dayFrom: {
      type: Number,
      default: 0
    },
    data: {
      type: Object,
      default: () => {}
    },
    start: {
      type: String
    },
    end: {
      type: String
    }
  },
  data () {
    return {
      timestamp: new Date().getTime(),
      // 日历头
      tableHeadOrigin: ['日', '一', '二', '三', '四', '五', '六']
    }
  },
  methods: {
    selectThis (year, month, date, e) {
      const time = new Date(year, month - 1, date).getTime()
      // 今日零点
      const now = this.today().getTime()
      if (time < now) {
        return
      }

      if (this.start && this.end) {
        this.$emit('update:end', '')
        this.$emit('update:start', `${year}/${this.padZero(month)}/${this.padZero(date)}`)
      } else {
        const start = new Date(this.start).getTime()
        if (time === start) return
        if (time < start) {
          this.$emit('update:end', this.start)
          this.$emit('update:start', `${year}/${this.padZero(month)}/${this.padZero(date)}`)
        } else {
          this.$emit('update:end', `${year}/${this.padZero(month)}/${this.padZero(date)}`)
        }
      }
      e.stopPropagation()
    },

    // 获取某月最后一天的日期（传递month参数不用-1，传自然月即可）
    getLastDateOfMonth (month, year) {
      const now = new Date()
      now.setFullYear(year || now.getFullYear(), month, 1)
      return new Date(now.getTime() - 86400000).getDate()
    },

    today () {
      return new Date(new Date().toLocaleDateString())
    },

    // 数组按数量分组
    chunk (array, size = 0) {
      const length = array == null ? 0 : array.length
      if (!length || size < 1) {
        return []
      }

      let index = 0
      let resIndex = 0
      const result = new Array(Math.ceil(length / size))

      while (index < length) {
        result[(resIndex += 1)] = array.slice(index, (index += size))
      }

      return result
    },
    padZero (str) {
      if (!str) return ''
      return str.toString().padStart(2, '0')
    }
  },
  computed: {
    tableHead () {
      return [].concat(this.tableHeadOrigin.slice(this.dayFrom), this.tableHeadOrigin.slice(0, this.dayFrom))
    },

    currentYear () {
      return this.data.year
    },

    currentMonth () {
      return this.data.month + 1
    },

    currentDate () {
      return this.data.date
    },

    timeStart () {
      return this.start.replace(/\//g, '')
    },
    timeEnd () {
      return this.end.replace(/\//g, '')
    },

    // 上个月最后一天
    prevMonthLastDate () {
      return this.getLastDateOfMonth(this.currentMonth - 1, this.currentYear)
    },

    // 当前月最后一天
    currentMonthLastDate () {
      return this.getLastDateOfMonth(this.currentMonth, this.currentYear)
    },

    // 当前月第一天是星期几
    currentMonthFirstDay () {
      const time = new Date(this.currentYear, this.currentMonth - 1, 1)
      return time.getDay()
    },

    // 当月总天数
    currentMonthTotal () {
      return this.currentMonthLastDate
    },

    // 上个月遗留天数（如果当月第一天的星期刚好是日历的起始星期，则保留上个月7天）
    prevMonthTotal () {
      return this.dayFrom === this.currentMonthFirstDay ? 7 : (7 + this.currentMonthFirstDay - this.dayFrom) % 7
    },

    // 下个月遗留天数
    nextMonthTotal () {
      const l = 42 - this.currentMonthTotal - this.prevMonthTotal
      return l >= 7 ? l - 7 : l
    },

    tableList () {
      const prev = []
      const current = []
      const next = []

      const prevYear = this.currentMonth === 1 ? this.currentYear - 1 : this.currentYear
      const prevMonth = this.currentMonth === 1 ? 12 : this.currentMonth - 1
      const nextYear = this.currentMonth === 12 ? this.currentYear + 1 : this.currentYear
      const nextMonth = this.currentMonth === 12 ? 1 : this.currentMonth + 1
      const start = this.prevMonthLastDate - this.prevMonthTotal + 1
      for (let i = start; i <= this.prevMonthLastDate; i++) {
        prev.push({
          year: prevYear,
          month: prevMonth,
          date: '',
          group: 'prev',
          selected: false
        })
      }

      for (let i = 1; i <= this.nextMonthTotal; i++) {
        next.push({
          year: nextYear,
          month: nextMonth,
          date: '',
          group: 'next',
          selected: false
        })
      }

      const today = this.today()
      for (let i = 1; i <= this.currentMonthTotal; i++) {
        // 当前时间
        const v = `${this.currentYear}/${this.padZero(this.currentMonth)}/${this.padZero(i)}`
        const n = v.replace(/\//g, '')
        // 今天
        const o = `${today.getFullYear()}${this.padZero(today.getMonth() + 1)}${this.padZero(today.getDate())}`
        current.push({
          year: this.currentYear,
          month: this.currentMonth,
          date: i,
          group: 'current',
          selected: this.start === v || this.end === v,
          inRange: n > this.timeStart && n < this.timeEnd,
          isExpired: n < o
        })
      }

      const list = [...prev, ...current, ...next]

      return this.chunk(list, 7)
    }
  },
  filters: {
    padZero (str) {
      if (!str) return ''
      return str.toString().padStart(2, '0')
    }
  }
}
</script>
