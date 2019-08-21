<template>
  <div class="m-list">
    <slot></slot>
  </div>
</template>
<script>
export default {
  name: 'm-list',
  inject: {
    formItem: {
      default: undefined
    }
  },
  props: {
    submitType: {
      type: Number,
      default: 0
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
        if (field.value) {
          this.updateValues()
        }
      }
    })
    this.$on('removeField', (field) => {
      // 用id替代prop定位元素
      this.fields = this.fields.filter(item => item._uid === field._uid)
    })
    this.$on('change', () => {
      this.$nextTick(() => {
        this.updateValues()
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
    updateValues() {
      this.formItem && this.formItem.$emit('change', this.fields.reduce((prev, item) => {
        if (item.value) {
          prev.push(Object.assign(item.$parent.datas.__additionalData, {
            value: item.value
          }))
        }
        return prev
      }, []))
    }
  }
}
</script>
