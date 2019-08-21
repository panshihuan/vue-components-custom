<template>
  <div
    class="m-form-item"
    :class="{'m-form-item--disabled': disabled}"
  >
    <slot></slot>
    <Validator
      ref="validator"
      :value="valueItem"
      :rules="ruleItem"
      :immediate="immediateValidator"
    />
    <slot name="appendItem"></slot>
  </div>
</template>
<script>
import emitter from '@/common/mixins/emitter'
import Validator from '../../validator'

export default {
  name: 'm-form-item',
  mixins: [emitter],
  components: {
    Validator
  },
  inject: {
    form: {
      default: undefined
    }
  },
  provide () {
    return {
      formItem: this
    }
  },
  props: {
    prop: {
      type: String,
      default: ''
    },
    rules: {
      type: Array,
      default: () => []
    },
    value: {},
    immediateValidator: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      ruleItem: []
    }
  },
  computed: {
    // value来源于当前form-item或form组件
    valueItem () {
      if (!this.value) {
        if (
          this.prop &&
          this.form &&
          this.form.model &&
          this.form.model[this.prop]
        ) {
          return this.form.model[this.prop]
        }
      }
      return this.value
    },
    // rules来源于当前form-item或form组件
    eitherRules () {
      if (!this.rules.length) {
        if (
          this.prop &&
          this.form &&
          this.form.rules &&
          this.form.rules[this.prop]
        ) {
          return this.form.rules[this.prop]
        }
      }
      return this.rules
    }
  },
  watch: {
    eitherRules: {
      handler (v) {
        this.ruleItem = v.slice()
      },
      immediate: true
    },
    disabled: {
      handler (v) {
        if (v) {
          this.form && this.form.$emit('addField', this)
        }
      },
      immediate: true
    }
  },
  created () {
    this.form && this.form.$emit('addField', this)
    this.$on('blur', () => {
      this.validate('blur')
    })
    this.$on('change', v => {
      if (v === this.value) return
      this.validate('change', v)
      this.form && this.form.$emit('change', this)
    })
  },
  beforeDestroy () {
    this.form && this.form.$emit('removeField', this)
  },
  methods: {
    async validate (trigger, v) {
      // 禁用字段不走校验
      if (this.disabled) return true
      const rules = this.findRules(trigger)
      this.ruleItem = rules
      const promise = new Promise((resolve) => {
        this.$nextTick(() => {
          const result = this.$refs.validator.checkValidator(v, rules)
          resolve(result)
        })
      })
      const result = await promise
      return result
    },
    resetField () {
      this.broadcast(null, 'resetField')
      this.$refs.validator.clearValidator()
    },
    findRules (trigger) {
      if (!trigger) {
        return this.eitherRules.slice()
      }
      return this.eitherRules.filter(
        item => !item.trigger || trigger === item.trigger
      )
    }
  }
}
</script>

<style lang="scss">
  .m-form-item{
    &--disabled{
      &>*{
        pointer-events: none;
      }
      opacity: 0.5;
    }
  }
</style>
