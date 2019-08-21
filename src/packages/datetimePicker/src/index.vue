<template>
  <DatePicker
    ref="datepicker"
    class="m-datepicker"
    :class="parsedChoose.class"
    :type="parsedChoose.type"
    :format="parsedChoose.format"
    :value="value"
    :not-before="parsedChoose.notBefore"
    :not-after="parsedChoose.notAfter"
    :value-type="parsedChoose.valueType"
    :clearable="clearable"
    :minute-step="parsedChoose.minuteStep"
    :placeholder="placeholder"
    :disabled="disabled"
    :appendTo="appendTarget"
    :appendToBody = "true"
    confirm
    @change="handleChange"
    @panel-change="handlePanelChange"
    @calendar-change="handleCalendarChange"
  >
  </DatePicker>
</template>

<script>
import DatePicker from 'vue2-datepicker'
import { throttle, formatDate } from 'vue2-datepicker/src/utils'
import EventBus from './eventbus'
import './index.scss'

delete DatePicker._Ctor
delete DatePicker._compiled
DatePicker.props.appendTo = {
  type: String
}
DatePicker.mounted = function mounted () {
  this._displayPopup = throttle(() => {
    if (this.popupVisible) {
      this.handleScroll()
    }
  }, 200)
  this.popupElm = this.$refs.calendar
  if (this.appendTo) {
    const target = document.querySelector(this.appendTo)
    if (target) {
      target.appendChild(this.popupElm)
      this.appendTarget = target
      let parent = this.$refs.input.parentNode
      while (parent) {
        parent.addEventListener('scroll', this._displayPopup, false)
        parent = parent.parentNode
      }
    }
  } else {
    this.appendTarget = document.body
  }

  this.position = {
    ...this.position,
    visibility: 'hidden'
  }

  this.handleFocus = (e) => {
    e.stopPropagation()
  }

  this.showPopup = () => {
    if (this.disabled) {
      return
    }
    this.popupVisible = true
    this.handleScroll()
    this.$nextTick(() => {
      this.position.visibility = 'visible'
    })
  }
  
  this.displayPopup = () => {}

  this.handleScroll = () => {
    const rect = this.$refs.input.getBoundingClientRect()
    const parentRect = this.appendTarget.getBoundingClientRect()
    const scrollTop = this.appendTarget.scrollTop
    const position = {}
    position.left = `${rect.left - parentRect.left}px`
    position.top = `${scrollTop + (rect.top - parentRect.top) + rect.height}px`
    this.position = {
      ...this.position,
      ...position
    }
    return false
  }
}

DatePicker.beforeDestroy = function beforeDestroy () {
  if (this.popupElm && this.appendTarget) {
    this.appendTarget.removeChild(this.popupElm)
  }
  if (!this.popupElm) return
  let parent = this.$refs.input.parentNode
  while (parent) {
    parent.removeEventListener('scroll', this.handleScroll)
    parent = parent.parentNode
  }
}

export default {
  name: 'dateTimePicker',
  components: {
    DatePicker
  },
  inject: {
    formItem: {
      default: undefined
    }
  },
  props: {
    value: {
      type: [String, Number, Date],
      default: null
    },
    format: {
      type: String,
      default: 'YYYY-MM-DD hh:mm:ss'
    },
    formatValue: {
      type: String,
      default: 'YYYY-MM-DD hh:mm:ss'
    },
    type: {
      type: String,
      default: 'datetime'
    },
    clearable: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String
    },
    disabled: {
      type: Boolean,
      default: false
    },
    appendTarget: {
      type: String
    }
  },
  data () {
    return {
      currentPanel: 'NONE',
      calendar: null
    }
  },
  computed: {
    yearRange () {
      const date = new Date()
      return {
        notBefore: `${date.getFullYear()}-01-01`,
        notAfter: `${date.getFullYear()}-12-31`
      }
    },
    parsedChoose () {
      let [date = '', time = ''] = this.format.toLowerCase().split(' ')
      if (this.type === 'time' && !time) {
        time = date
        date = ''
      }
      let parsed = { type: this.type, class: [], format: this.format, valueType: 'timestamp' }
      switch (date) {
        case 'yyyy-mm-dd':
          parsed.type = 'date'
          break
        case 'yyyy-mm':
          parsed.type = 'month'
          break
        case 'mm-dd':
          Object.assign(parsed, {
            type: 'date',
            class: ['m-datepicker-disabled--year'],
            valueType: {
              value2date (v) {
                if (v && typeof v === 'string') {
                  return time ? `${new Date().getFullYear()}-${v}` : new Date(`${new Date().getFullYear()}-${v}`)
                }
                return v
              }
            },
            ...this.yearRange
          })
          if (this.calendar) {
            const m = this.calendar.getMonth() + 1
            if (m >= 12) {
              parsed.class.push('m-datepicker-disabled--nextMonth')
            } else if (m <= 1) {
              parsed.class.push('m-datepicker-disabled--prevMonth')
            }
          }
          break
        case 'mm':
          Object.assign(parsed, { type: 'month', class: ['m-datepicker-disabled--year'] })
          break
        case 'dd':
          Object.assign(parsed, {
            type: 'date',
            class: ['m-datepicker-disabled--year', 'm-datepicker-disabled--month'],
            valueType: {
              value2date (v) {
                if (v && typeof v === 'string') {
                  const value = `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${v}`
                  return time === '' ? new Date(value) : value
                }
                return v
              }
            }
          })
          break
        case 'yyyy':
          Object.assign(parsed, { type: 'year' })
          break
      }
      if (time) {
        if (!date) {
          parsed.type = 'time'
        } else {
          parsed.type = 'datetime'
        }
        switch (time) {
          case 'hh:mm':
            parsed.minuteStep = 1
            Object.assign(parsed, {
              valueType: {
                value2date (v) {
                  if (v && typeof v === 'string') {
                    const value = `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()} ${v}`
                    return time === '' ? new Date(value) : value
                  }
                  return v
                }
              }
            })
            break
          case 'hh':
            const value2date = parsed.valueType?.value2date
            Object.assign(parsed, {
              minuteStep: 60,
              valueType: {
                value2date (v) {
                  if (v && typeof v === 'string') {
                    let value = value2date ? value2date(v) : v
                    return new Date(`${value}:00`)
                  }
                  return v
                }
              },
              class: [...parsed.class, 'm-datepicker-disabled--minute']
            })
            break
        }
      }
      parsed.class = [...parsed.class, `m-datepicker--${this.currentPanel}`]
      return parsed
    }
  },
  created () {
    EventBus.$on('panel-change', this.handleEventPanelChange)
  },
  beforeDestroy () {
    EventBus.$off('panel-change', this.handleEventPanelChange)
  },
  methods: {
    handleChange (v) {
      let value = ''
      if (this.formatValue === 'timestamp') {
        value = v
      } else {
        value = formatDate(v, this.formatValue)
      }
      this.$emit('input', value)
      this.$emit('change', value)
      this.formItem && this.formItem.$emit('change', value)
      this.$forceUpdate()
    },
    handlePanelChange (newPanel, oldPanel) {
      this.currentPanel = newPanel
      if (oldPanel === 'NONE' && newPanel !== 'NONE') {
        this.$emit('panel-show')
      }
      if (newPanel === 'NONE') {
        this.$emit('panel-hide')
      }
      this.$emit('panel-change')
      EventBus.$emit('panel-change', newPanel, oldPanel, this)
    },
    handleEventPanelChange (newPanel, oldPanel, instance) {
      if (instance !== this && newPanel !== 'NONE') {
        this.$refs.datepicker.closePopup()
      }
    },
    handleCalendarChange (v) {
      this.calendar = v
    }
  }
}
</script>
