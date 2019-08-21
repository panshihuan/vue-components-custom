<template>
  <form class="m-form" @submit.native.prevent>
    <slot></slot>
  </form>
</template>
<script>
export default {
  name: 'm-form',
  provide () {
    return {
      form: this
    }
  },
  props: {
    model: {
      type: Object,
      default: () => ({})
    },
    rules: {
      type: Object,
      default: () => ({})
    },
    checkAll: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      fields: []
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
      this.fields = this.fields.filter(item => item._uid !== field._uid)
      this.$forceUpdate()
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
          if (!this.checkAll) {
            break
          }
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
    }
  }
}
</script>
