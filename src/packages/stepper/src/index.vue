<template>
  <div class="m-stepper" :class="{
    'm-stepper--step': enableStep
  }">
    <div
      v-if="enableStep"
      @click="handleMinus"
      :class="[
        `m-stepper__minus`,
        {
          'm-stepper__minus--disabled': disabledMinus,
        }
      ]"
    >
      <svg
        viewBox="0 0 1024 1024"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
      >
        <defs></defs>
        <path d="M863.74455 544.00086 163.424056 544.00086c-17.664722 0-32.00086-14.336138-32.00086-32.00086s14.336138-32.00086 32.00086-32.00086l700.320495 0c17.695686 0 31.99914 14.336138 31.99914 32.00086S881.440237 544.00086 863.74455 544.00086z"></path>
      </svg>
    </div>
    <div class="m-stepper__input">
      <IInput
        v-model="currentValue"
        :disabled="disabled"
        :class="{'m-stepper__inner--disabled': disabled}"
        :placeholder="placeholder"
        class="m-stepper__inner"
        @input="handleChange"
      />
    </div>
    <div
      v-if="enableStep"
      @click="handleAdd"
      :class="[
        `m-stepper__add`,
        {'m-stepper__add--disabled': disabledAdd}
      ]"
    >
      <svg
        viewBox="0 0 1024 1024"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
      >
        <defs></defs>
        <path d="M863.328262 481.340895l-317.344013 0.099772L545.984249 162.816826c0-17.664722-14.336138-32.00086-32.00086-32.00086s-31.99914 14.336138-31.99914 32.00086l0 318.400215-322.368714-0.17718c-0.032684 0-0.063647 0-0.096331 0-17.632039 0-31.935493 14.239806-32.00086 31.904529-0.096331 17.664722 14.208843 32.031824 31.871845 32.095471l322.59234 0.17718 0 319.167424c0 17.695686 14.336138 32.00086 31.99914 32.00086s32.00086-14.303454 32.00086-32.00086L545.982529 545.440667l317.087703-0.099772c0.063647 0 0.096331 0 0.127295 0 17.632039 0 31.935493-14.239806 32.00086-31.904529S880.960301 481.404542 863.328262 481.340895z"></path>
      </svg>
    </div>
  </div>
</template>

<style lang="scss" src="./index.scss"></style>

<script>
import IInput from '../../input'

function accurateAdd(num1, num2) {
  return parseFloat((Number(num1) + Number(num2)).toFixed(10))
}

export default {
  name: 'm-stepper',
  components: {
    IInput,
  },
  inject: {
    formItem: {
      default: undefined
    }
  },
  props: {
    value: null,
    disabled: Boolean,
    min: {
      type: Number,
      default: 0
    },
    max: {
      type: Number,
      default: Infinity
    },
    step: {
      type: Number,
      default: 1
    },
    enableDecimal: {
      type: Boolean,
      default: false
    },
    enableStep: {
      type: Boolean,
      default: false,
    },
    placeholder: {
      type: String,
      default: '',
    }
  },
  computed: {
    currentValue: {
      get() {
        return this.range(this.value)
      },
      set(v) {
        this.$emit('input', v)
        this.$emit('change', v)
        this.formItem && this.formItem.$emit('change', v)
      }
    },
    disabledAdd() {
      if (!this.max && this.max !== 0) return false
      return this.disabled || this.max <= this.currentValue
    },
    disabledMinus() {
      if (!this.min && this.min !== 0) return false
      return this.disabled || this.min >= this.currentValue
    }
  },
  methods: {
    format(val) {
      return String(val).replace(/[^0-9.-]/g, '')
    },
    range(val) {
      const v = this.format(val)
      // if (v > this.max) return this.max
      // if (v < this.min) return this.min
      return v
    },
    handleAdd() {
      if (this.disabledAdd) return
      this.setValue(accurateAdd(this.currentValue, this.step))
    },
    handleMinus() {
      if (this.disabledMinus) return
      this.setValue(accurateAdd(this.currentValue, -this.step))
    },
    handleChange(v) {
      this.setValue(v)
    },
    setValue(val) {
      const v = this.range(val)
      this.currentValue = v
      this.$forceUpdate()
    }
  }
}
</script>
