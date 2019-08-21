<template>
  <div
    :class="{
    'm-validator--error': !valid
  }"
    class="m-validator"
  >
    <slot></slot>
    <div
      v-if="!valid"
      class="m-validator__result"
    >
      {{msg}}
    </div>
  </div>
</template>
<script>
export default {
  name: 'm-validator',
  inject: {
    formItem: {
      default: undefined
    }
  },
  props: {
    value: {
      required: true
    },
    rules: {
      type: Array,
      // example: [
      //   {
      //     type: 'string', // 支持string/number/array/date
      //     message: '', // 错误提示
      //     required: false, // 必填校验
      //     min: -Infinity,
      //     max: Infinity,
      //     pattern: /^\d+$/, // 正则
      //     custom: (val) => {
      //       return val.length >= 6
      //     } // 自定义校验
      //   }
      // ],
      required: true
    },
    immediate: {
      type: Boolean,
      default: false,
      required: false
    }
  },
  data () {
    return {
      valid: true,
      msg: ''
    }
  },
  created () {
    if (this.immediate) {
      this.checkValidator()
    }
  },
  watch: {
    valid (val) {
      this.$emit('valid-change', val)
      this.formItem && this.formItem.$emit('valid-change', val)
    }
  },
  methods: {
    async checkValidator (_v, _rules) {
      const v = typeof _v === 'undefined' ? this.value : _v
      const errs = []
      const rules = _rules || this.rules || []
      let index = 0

      while (rules[index]) {
        const { type, message, custom, ...item } = rules[index]
        let valid = true
        let dataType = type
        if (!dataType) {
          if (typeof v === 'number') {
            dataType = 'number'
          } else if (Array.isArray(v)) {
            dataType = 'array'
          }
        }
        switch (dataType) {
          case 'array':
            valid = this.checkArray(v, item)
            break
          case 'number':
            valid = this.checkNumber(v, item)
            break
          case 'date':
            valid = this.checkDate(v, item)
            break
          case 'string':
            valid = this.checkString(v, item)
            break
          default:
            valid = this.checkAuto(v, item)
            break
        }
        // 自定义校验
        if (valid && typeof custom === 'function') {
          valid = custom(v)
          // 支持异步
          if (valid instanceof Promise) {
            valid = await valid
          }
        }
        if (!valid) {
          this.msg = message
          errs.push({
            type,
            message,
            custom,
            ...item
          })
          break
        }
        index += 1
      }

      if (errs.length === 0) {
        this.msg = ''
        this.valid = true
        return true
      }
      this.valid = false
      return errs
    },
    checkArray (v, { required, min, max }) {
      if (v) {
        if (!Array.isArray(v)) return false
        if (required && !v.length) return false
        if (typeof min === 'number' && v.length < min) return false
        if (typeof max === 'number' && v.length > max) return false
      } else {
        if (required) {
          return false
        }
      }
      return true
    },
    checkNumber (v, { required, min, max, pattern }) {
      if (v) {
        if (isNaN(v)) return false
        if (typeof min === 'number' && v < min) return false
        if (typeof max === 'number' && v > max) return false
        if (pattern && !this.checkPattern(v, pattern)) {
          return false
        }
      } else {
        if (required && v !== 0) return false
      }
      return true
    },

    checkDate (v, { required, min, max }) {
      if (v) {
        if (!(v instanceof Date)) return false
      } else {
        if (required) return false
      }
      return true
    },

    checkString (v, { required, min, max, pattern }) {
      if (v) {
        if (typeof v !== 'string') return false
        if (typeof min === 'number' && v.length < min) return false
        if (typeof max === 'number' && v.length > max) return false
        if (pattern && !this.checkPattern(v, pattern)) {
          return false
        }
      } else {
        if (required) return false
      }
      return true
    },
    checkObject (v, { required }) {
      if (required) {
        if (!v || !Object.keys(v).length) return false
      }
      return true
    },
    checkPattern(v, pattern) {
      const _v = v.toString()
      let result
      if (pattern instanceof RegExp) {
        result = pattern.test(_v)
      } else {
        result = new RegExp(pattern).test(_v)
      }
      return result
    },
    checkAuto (v, item) {
      if (Array.isArray(v)) {
        return this.checkArray(v, item)
      }
      if (typeof v === 'number') {
        return this.checkNumber(v, item)
      }
      if (v instanceof Object) {
        return this.checkObject(v, item)
      }
      return this.checkString(v, item)
    },
    clearValidator () {
      this.valid = true
      this.msg = ''
    }
  }
}
</script>

<style lang="scss">
.m-validator{
  &--error{
    .m-validator__result {
      color: #ff0000;
    }
  }
}
</style>
