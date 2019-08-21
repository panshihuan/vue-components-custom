<template>
  <div class="m-form-item-group">
    <slot></slot>
  </div>
</template>
<script>
export default {
  name: 'm-form-item-group',
  inject: {
    formItem: {
      default: undefined
    }
  },
  provide () {
    return {
      form: this
    }
  },
  data () {
    return {
      fields: [],
    }
  },
  computed: {
    fieldLength () {
      return this.fields.length
    }
  },
  created () {
    this.$on('addField', (field) => {
      if (!this.fields.includes(field)) {
        this.fields.push(field)
      }
    })
    this.$on('removeField', (field) => {
      // 用id替代prop定位元素
      this.fields = this.fields.filter(item => item._uid === field._uid)
    })
    this.$on('change', (field) => {
      this.$nextTick(() => {
        this.updateValues(field)
      })
    })
  },
  methods: {
    async validate () {
      // 表单验证
      if (!this.fieldLength) {
        return true
      }
      const errs = []
      for (let i = 0; i < this.fieldLength; i++) {
        const valid = await this.fields[i].validate()
        if (valid !== true) {
          errs.splice(errs.length, 0, ...valid)
        }
      }
      return !errs.length ? true : errs
    },
    resetFields (prop) {
      if (prop) {
        const currentField = this.fields.find(item => item.prop === prop)
        if (currentField) {
          currentField.resetField()
        }
      } else {
        this.fields.forEach(item => {
          item.resetField()
        })
      }
    },
    updateValues(field) {
      const fieldNum = {}
      const v = this.fields.reduce((prev, { prop, value, $parent }) => {
        if (!prop || $parent.datas.hidden) return prev
        fieldNum[prop] = (fieldNum[prop] || 0) + 1
        const index = fieldNum[prop] - 1
        if (!prev[index]) {
          prev[index] = {}
        }
        prev[index] = {
          ...prev[index],
          [prop]: value
        }
        return prev
      }, [])
      this.formItem && this.formItem.$emit('change', v, field)
      this.form && this.form.$emit('change', v, field)
    }
  }
}
</script>
