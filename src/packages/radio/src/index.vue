<template>
  <label
    class="m-radio"
    :id="id"
    :class="[
      { 'is-disabled': isDisabled },
      { 'is-checked': isChecked }
    ]"
  >
    <span
      class="m-radio__input"
      :class="{
        'is-disabled': isDisabled,
        'is-checked': isChecked,
        'is-focus': focus
      }"
    >
      <span class="m-radio__inner"></span>
      <input
        :name="name"
        :checked="isChecked"
        :disabled="isDisabled"
        class="m-radio__original"
        type="checkbox"
        @change="handleChange"
        @focus="focus = true"
        @blur="focus = false"
      />
    </span>
    <span class="m-radio__label">
      <slot>{{label}}</slot>
    </span>
  </label>
</template>
<script>
export default {
  name: 'm-radio',
  inject: {
    form: {
      default: undefined
    },
    formItem: {
      default: undefined
    },
    radioGroup: {
      default: undefined
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
      selfModel: false
    }
  },
  computed: {
    isGroup () {
      return this.radioGroup
    },
    groupValue () {
      return [null, undefined].includes(this.radioGroup.value) ? null : this.radioGroup.value
    },
    isChecked () {
      if (this.isGroup) {
        return this.groupValue === this.value
      }
      return this.value === undefined ? this.selfModel : this.value === true
    },
    isDisabled () {
      return this.disabled || (this.radioGroup || {}).disabled || (this.form || {}).disabled
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
  },
  methods: {
    handleChange (e) {
      const checked = e.target.checked
      let v = checked
      if (this.isGroup) {
        v = checked ? this.value : ''
        this.radioGroup.$emit('input', v)
      } else {
        this.formItem && this.formItem.$emit('change', v)
      }
      this.selfModel = checked
      // 单个radio只支持boolean值
      this.$emit('input', checked)
      this.$emit('change', checked)
    }
  }
}
</script>

<style lang="scss">
.m-radio {
  color: #606266;
  font-weight: 500;
  font-size: 14px;
  position: relative;
  cursor: pointer;
  display: inline-block;
  white-space: nowrap;
  user-select: none;
  &__input{
    white-space: nowrap;
    cursor: pointer;
    outline: none;
    display: inline-block;
    line-height: 1;
    position: relative;
    vertical-align: middle;
  }
  &__label{
    display: inline-block;
    padding-left: 8px;
    line-height: 19px;
    font-size: 14px;
  }
  &__inner{
    border: 1px solid #dcdfe6;
    border-radius: 100%;
    width: 14px;
    height: 14px;
    background-color: #fff;
    position: relative;
    cursor: pointer;
    display: inline-block;
    box-sizing: border-box;
    &:hover {
      border-color: #409EFF;
    }
    &:after {
      width: 4px;
      height: 4px;
      border-radius: 100%;
      background-color: #fff;
      content: "";
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%) scale(0);
      transition: transform .15s ease-in;
    }
  }

  &.is-checked {
    border-color: #409EFF;
    .m-radio{
      &__inner{
        background-color: #409EFF;
        border-color: #409EFF;
        &:after{
          transform: translate(-50%, -50%) scale(1);
        }
      }
    }
  }
  .is-disabled {
    .m-radio{
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
  &+.m-radio {
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
