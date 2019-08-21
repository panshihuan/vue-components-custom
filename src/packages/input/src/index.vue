<template>
  <input
    v-if="!rows && type === 'input'"
    v-bind="$attrs"
    :disabled="disabled"
    :readonly="readonly"
    :value="inputValue"
    :class="{
      'm-input--focus': focused
    }"
    :placeholder="placeholder"
    ref="input"
    class="m-input"
    @input="handleInput"
    @focus="focus"
    @blur="blur"
    @click="click"
  />
  <textarea
    v-else
    v-bind="$attrs"
    :disabled="disabled"
    :readonly="readonly"
    :value="inputValue"
    :rows="rows"
    :class="{
      'm-input--focus': focused
    }"
    :placeholder="placeholder"
    ref="input"
    class="m-input m-input--textarea"
    @input="handleInput"
    @focus="focus"
    @blur="blur"
    @click="click"
  >
  </textarea>
</template>
<script>
export default {
  name: 'm-input',
  inject: {
    formItem: {
      default: undefined
    }
  },
  props: {
    value: {
      type: [String, Number]
    },
    type: {
      type: String,
      default: 'input'
    },
    rows: {
      type: Number,
      default: 0
    },
    placeholder: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    readonly: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      focused: false
    }
  },
  computed: {
    inputValue () {
      return this.value || ''
    }
  },
  methods: {
    handleInput (e) {
      const v = e.target.value
      if (v === this.inputValue) return
      this.$emit('input', v)
      this.$refs.input.value = v
      if (this.formItem) {
        this.formItem.$emit('input', v)
        this.formItem.$emit('change', v)
      }
    },
    focus (e) {
      this.focused = true
      this.$emit('focus', e)
      this.formItem && this.formItem.$emit('focus', e)
    },
    blur (e) {
      this.focused = false
      this.$emit('blur', e)
      this.formItem && this.formItem.$emit('blur', e)
    },
    click(e) {
      this.$emit('click', e)
    }
  }
}
</script>
<style lang="scss">
.m-input{
  padding: 4px 10px;
  width: 100%;
  box-sizing: border-box;
  border: 1px solid #dcdfe6;
  color: #606266;
  &::-webkit-input-placeholder{
    color: #c5c8ce;
  }
}
</style>
