<template>
  <div class="m-checkbox-group">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'm-checkbox-group',
  inject: {
    formItem: {
      default: undefined
    }
  },
  provide () {
    return {
      checkGroup: this
    }
  },
  props: {
    value: Array,
    disabled: Boolean,
    multipleLimit: {
      type: Number,
      default: 0
    },
  },
  data () {
    return {
      options: []
    }
  },
  created () {
    this.$on('addOption', (option) => {
      this.options.push(option)
    })
    this.$on('removeOption', (option) => {
      this.options = this.options.filter(item => item._uid === option._uid)
    })
    this.$on('input', (v) => {
      this.formItem && this.formItem.$emit('change', v)
    })
  }
}
</script>
