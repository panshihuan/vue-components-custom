<template>
  <label
    class="m-checkbox"
    :id="id"
    :class="[
      { 'is-disabled': isDisabled },
      { 'is-checked': isChecked }
    ]"
  >
    <span
      class="m-checkbox__input"
      :class="{
        'is-disabled': isDisabled,
        'is-checked': isChecked,
        'is-focus': focus
      }"
    >
      <span class="m-checkbox__inner"></span>
      <input
        :name="name"
        :checked="isChecked"
        :disabled="isDisabled"
        class="m-checkbox__original"
        type="checkbox"
        @change="handleChange"
        @focus="focus = true"
        @blur="focus = false"
      />
    </span>
    <span class="m-checkbox__label">
      <slot>{{label}}</slot>
    </span>
  </label>
</template>
<script>
export default {
  name: 'm-checkbox',
  inject: {
    form: {
      default: undefined
    },
    formItem: {
      default: undefined
    },
    checkGroup: {
      default: undefined
    }
  },
  provide () {
    return {
      checkbox: this
    }
  },
  props: {
    value: {},
    label: {},
    disabled: Boolean,
    checked: {
      type: Boolean,
      default: false
    },
    name: String,
    id: String
  },
  data () {
    return {
      focus: false,
      isLimitExceeded: false,
      selfModel: false
    }
  },
  computed: {
    isGroup () {
      return this.checkGroup
    },
    groupValue () {
      return this.isGroup ? this.checkGroup.value || [] : []
    },
    isChecked () {
      if (this.isGroup) {
        return this.groupValue.includes(this.value)
      }
      return this.value === undefined ? this.selfModel : this.value
    },
    isDisabled () {
      return this.disabled || (this.checkGroup || {}).disabled || (this.form || {}).disabled
    }
  },
  created () {
    if (this.isGroup) {
      this.checked = false
    } else {
      if (this.checked) {
        this.selfModel = true
        this.$emit('input', this.checked)
      }
    }
    this.createOption()
  },
  beforeDestroy () {
    this.removeOption()
  },
  methods: {
    handleChange (e) {
      const checked = e.target.checked
      if (this.isGroup) {
        const values = new Set(Array.isArray(this.checkGroup.value) ? this.checkGroup.value : [])
        if (this.checkGroup.multipleLimit && values.size >= this.checkGroup.multipleLimit) return false
        if (checked) {
          values.add(this.value)
        } else {
          values.delete(this.value)
        }
        let [...v] = values
        this.checkGroup.$emit('input', v)
      } else {
        this.formItem && this.formItem.$emit('change', checked)
      }
      this.selfModel = checked
      const value = checked ? this.value || true : false
      this.$emit('input', value)
      this.$emit('change', value)
    },
    createOption () {
      this.isGroup &&
      this.checkGroup.$emit('addOption', this)
    },
    removeOption () {
      this.isGroup &&
      this.checkGroup.$emit('removeOption', this)
    }
  }
}
</script>

<style lang="scss">
.m-checkbox {
  color: #606266;
  font-weight: 500;
  font-size: 14px;
  position: relative;
  cursor: pointer;
  vertical-align: middle;
  display: inline-flex;
  flex-direction: row;
  align-items: flex-start;
  user-select: none;
  &__input{
    white-space: nowrap;
    cursor: pointer;
    outline: none;
    display: inline-block;
    vertical-align: middle;
    line-height: 1;
    position: relative;
    vertical-align: middle;
  }
  &__label{
    display: inline-block;
    vertical-align: middle;
    padding-left: 8px;
    line-height: 1;
    font-size: 14px;
    user-select: none;
  }
  &__inner{
    display: inline-block;
    vertical-align: top;
    position: relative;
    border: 1px solid #dcdfe6;
    border-radius: 2px;
    box-sizing: border-box;
    width: 14px;
    height: 14px;
    background-color: #fff;
    z-index: 1;
    transition: border-color 0.25s cubic-bezier(0.71, -0.46, 0.29, 1.46), background-color 0.25s cubic-bezier(0.71, -0.46, 0.29, 1.46);
    &:hover {
      border-color: #409EFF;
    }
    &:after {
      box-sizing: content-box;
      content: "";
      border: 1px solid #fff;
      border-left: 0;
      border-top: 0;
      height: 7px;
      left: 4px;
      position: absolute;
      top: 1px;
      transform: rotate(45deg) scaleY(0);
      width: 3px;
      transition: transform .15s ease-in .05s;
      transform-origin: center;
    }
  }

  &.is-checked {
    border-color: #409EFF;
    .m-checkbox{
      &__inner{
        background-color: #409EFF;
        border-color: #409EFF;
        &:after{
          transform: rotate(45deg) scaleY(1);
        }
      }
    }
  }
  .is-disabled {
    .m-checkbox{
      &__inner{
        background-color: #edf2fc;
        border-color: #dcdfe6;
        cursor: not-allowed;
        &:after{
          cursor: not-allowed;
          border-color: #c0c4cc;
        }
      }
      &__label{
        color: #c0c4cc;
        cursor: not-allowed;
      }
    }
  }
  &+.m-checkbox {
    margin-left: 10px;
  }
  &__original{
    width: 0 !important;
    height: 0 !important;
    opacity: 0;
    outline: none;
    position: absolute;
    margin: 0;
    z-index: -1;
  }
  &-group{
    font-size: 0;
  }
}
</style>
