<template>
  <div class="date-demo">
    <DatetimePicker
      v-model="date"
      type="datetime"
      format="MM-DD hh:mm:ss"
      valueType="format"
      @change="handleChange">
      <div slot=""></div>
      <slot/>
    </DatetimePicker>
    <DatetimePicker
      v-model="time"
      type="time"
      format="hh:mm"
      valueType="format"
      @change="handleChange">
      <div slot=""></div>
      <slot/>
    </DatetimePicker>
  </div>
</template>

<script>
import DatetimePicker from '../packages/datetimePicker'

export default {
  components: {
    DatetimePicker
  },
  data () {
    return {
      date: '03-12',
      time: '09:11'
    }
  },
  methods: {
    handleChange (v) {
      console.log(v)
    }
  }
}
</script>

<style>
  .date-demo{
    height: 2000px;
    zoom: 1.5;
  }
</style>
