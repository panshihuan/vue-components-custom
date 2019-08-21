<template>
  <div>
    <MCalendar
      class="rooms-date__calendar"
      :range="dateRage"
      @change="changeDateRange"
    ></MCalendar>
  </div>
</template>

<script>
import MCalendar from '../packages/calendar/src/index'

const now = new Date()
const next = new Date(new Date().setDate(now.getDate() + 1))

export default {
  components: {
    MCalendar
  },
  data () {
    return {
      dateRage: {
        start: this.getDate(now),
        end: this.getDate(next)
      }
    }
  },
  methods: {
    getDate (date) {
      return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
    },
    changeDateRange () {
      console.log(this.dateRage.start, this.dateRage.end)
    }
  }
}
</script>

<style lang="scss">
</style>
