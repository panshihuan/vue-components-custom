<template>
  <div
    :class="{
      'm-option--active': isSelected
    }"
    class="m-option"
    @click="updateOption"
    @mousedown.prevent
  >
    <slot
      :stopClose="handleStopClose"
      :change="updateOption"
    >
      {{label}}</slot>
  </div>
</template>
<script>
export default {
  name: 'm-option',
  inject: {
    select: {
      default: undefined
    },
    dropdown: {
      default: undefined
    }
  },
  provide () {
    return {
      option: this
    }
  },
  props: {
    value: {},
    label: {}
  },
  data () {
    return {
      id: Math.random().toString(32)
    }
  },
  computed: {
    isSelected () {
      if (this.select.multiple) {
        if (!Array.isArray(this.select.value)) return false
        return this.select.value?.includes(this.value)
      }
      return this.select.value === this.value
    }
  },
  watch: {
    value () {
      this.createOption()
    },
    label () {
      this.createOption()
    }
  },
  created () {
    this.createOption()
    this.$on('externalChange', () => {
      this.updateOption()
    })
  },
  beforeDestroy () {
    this.removeOption()
  },
  methods: {
    createOption () {
      this.select &&
      this.select.$emit('addOption', {
        label: this.label,
        value: this.value,
        id: this.id
      })
    },
    removeOption () {
      this.select &&
      this.select.$emit('removeOption', this.id)
    },
    updateOption () {
      this.$emit('change', this.value)
      this.createOption()
      this.select && this.select.$emit('selectChange', this.value)
      this.dropdown && this.dropdown.$emit('change', this.value)
    },
    handleStopClose () {
      this.select && this.select.$emit('stopClose')
    }
  }
}
</script>
<style lang="scss">
.m-option {
  font-size: 14px;
  padding: 0 20px;
  position: relative;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #606266;
  height: 34px;
  line-height: 34px;
  box-sizing: border-box;
  cursor: pointer;
  &:hover {
    background-color: #f5f7fa;
  }
  &--active {
    color: #409eff;
  }
}
</style>
