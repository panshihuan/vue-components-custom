<template>
  <div :class="clazz">
    <div
      v-for="item in optionList"
      :key="`${clazz}${item.value}${item.label}`"
      :class="[
      {'m-checked': isChecked(item.value) },
      {'m-disabled': item.disabled },
       clazz + '-item'
       ]"
      @click="clickItem(item.value)"
    >
      <slot slot-scope="item">
        <div
          :class="clazz + '-input'"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path :d="pathData[isCheckbox ? 'checkbox' : 'radio'][isChecked(item.value) ? 'checked' : 'general']"></path>
          </svg>
        </div>
        <div
          class="m-radio-label"
        >{{item.label}}
        </div>
      </slot>
    </div>
  </div>
</template>
<style
  lang="scss"
  src="./index.scss">
</style>
<script>

export default {
  props: {
    selectType: {
      type: String,
      default: 'radio'
    },
    value: null,
    optionList: Array
  },
  data () {
    return {
      pathData: {
        radio: {
          general: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z',
          checked: 'M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm0-5C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z'
        },
        checkbox: {
          general: 'M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z',
          checked: 'M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2V5c0-1.1-.89-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z'
        }
      }
    }
  },
  computed: {
    isCheckbox () {
      return this.selectType === 'checkbox'
    },
    clazz () {
      return this.isCheckbox ? 'm-checkbox' : 'm-radio'
    }
  },
  methods: {
    clickItem (value) {
      if (this.isCheckbox) {
        if (this.value && this.value.includes(value)) {
          this.$emit('input', this.value.filter(e => e !== value))
        } else {
          this.$emit('input', [...(this.value || []), value])
        }
      } else {
        this.$emit('input', value)
      }
    },
    isChecked (value) {
      if (this.isCheckbox) {
        return this.value && this.value.includes(value)
      } else {
        return this.value === value
      }
    }
  }
}
</script>
