<template>
  <div ref="select" class="m-select">
    <div
      :class="{
        'is-focus': visible,
        'is-show': visible,
        'is-multiple': multiple,
        'is-multiple--empty': multiple && !selectedValues.length
      }"
      class="m-select__input"
      @click="handleShowDropdown">
      <template v-if="multiple">
        <span class="m-select__selected" v-for="item in selectedValues" :key="item.value">{{item.label}}</span>
      </template>
      <input
        ref="selectInput"
        class="m-select__inner"
        :value="showValue"
        :placeholder="!multiple || !selectedValues.length ? placeholder : ''"
        @blur="blurSelect"
      />
      <i class="m-select__arrow"></i>
    </div>
    <transition v-show="!transfer">
      <SelectDropdown ref="selectDropdown" v-show="visible && !isNotAppendBody">
        <slot></slot>
      </SelectDropdown>
    </transition>
  </div>
</template>
<script>
import Vue from 'vue'
import SelectDropdown from './select-dropdown'

export default {
  name: 'm-select',
  components: {
    SelectDropdown
  },
  provide () {
    return {
      select: this
    }
  },
  inject: {
    form: {
      default: undefined
    },
    formItem: {
      default: undefined
    }
  },
  props: {
    value: {
      default: false
    },
    multiple: {
      type: Boolean,
      default: false
    },
    multipleLimit: {
      type: Number,
      default: 0
    },
    placeholder: String,
    disabled: Boolean,
    checked: {
      type: Boolean,
      default: false
    },
    customeDropdownClass: {
      type: String,
      default: ''
    },
    transfer: {
      type: Boolean,
      default: false
    },
    appendTarget: {},
    name: String,
    id: String
  },
  data () {
    return {
      visible: false,
      options: [],
      dropdownComponent: null,
      isNotAppendBody: false
    }
  },
  computed: {
    showValue () {
      const v = this.value
      if (this.multiple) return ''
      const current = this.options.find(item => item.value === v)
      return current ? current.label : ''
    },
    selectedValues () {
      if (!this.multiple || !Array.isArray(this.value)) return []
      return this.value.reduce((prev, v) => {
        const valid = this.options.find(item => item.value === v)
        if (valid) {
          prev.push(valid)
        }
        return prev
      }, [])
    },
    parentTarget () {
      if (!this.appendTarget) {
        return document.documentElement
      }
      if (this.appendTarget instanceof HTMLElement) {
        return this.appendTarget
      }
      return document.querySelector(this.appendTarget)
    }
  },
  created () {
    this.$on('addOption', (option) => {
      const current = this.options.find(item => item.id === option.id)
      if (current) {
        Object.assign(current, option)
      } else {
        this.options.push(option)
      }
    })
    this.$on('removeOption', (id) => {
      this.options = this.options.filter(
        item => item.id !== id
      )
    })
    this.$on('selectChange', this.handleChange)
    this.$on('stopClose', () => {
      this.visible = true
      clearTimeout(this.timer)
    })
  },
  mounted () {
    document.addEventListener('keyup', this.deleteSelected, false)
  },
  beforeDestroy () {
    if (this.transfer) {
      this.removeScrollEvent()
    }
  },
  methods: {
    handleShowDropdown () {
      if (this.visible) {
        this.$refs.selectInput.blur()
        return
      }
      this.$refs.selectInput.focus()
      this.visible = true
      if (this.transfer) {
        this.createdDropdown()
      }
    },
    blurSelect () {
      this.timer = setTimeout(() => {
        this.visible = false
        this.removeDropdown()
      }, 0)
    },
    createdDropdown () {
      const Dropdown = Vue.extend(SelectDropdown)
      this.dropdownComponent = new Dropdown()
      this.dropdownComponent.$slots.default = this.$slots.default || { text: '' }
      this.dropdownComponent.$parent = this
      this.dropdownComponent.$on('change', (v) => {
        this.handleChange(v)
      })
      this.parentTarget.appendChild(this.dropdownComponent.$mount().$el)
      this.isNotAppendBody = true
      this.handleScroll()
      this.bindScrollEvent()
    },
    removeDropdown () {
      if (this.transfer && this.dropdownComponent) {
        // 此处销毁会导致数据无法选中，未知是何原因
        // this.dropdownComponent.$destroy()
        this.parentTarget.contains(this.dropdownComponent.$el) &&
        this.parentTarget.removeChild(this.dropdownComponent.$el)
        this.isNotAppendBody = false
      }
    },
    bindScrollEvent () {
      let parent = this.$refs.select.parentNode
      while (parent) {
        parent.addEventListener('scroll', this.handleScroll, false)
        parent = parent.parentNode
      }
    },
    removeScrollEvent () {
      let parent = this.$refs.select.parentNode
      while (parent) {
        parent.removeEventListener('scroll', this.handleScroll)
        parent = parent.parentNode
      }
    },
    handleChange (val) {
      let v = val
      // 多选
      if (this.multiple) {
        const values = new Set(Array.isArray(this.value) ? [...this.value] : [])
        if (values.has(val)) {
          values.delete(val)
        } else {
          if (this.multipleLimit && values.size >= this.multipleLimit) return false
          values.add(val)
        }
        const [...arr] = values
        v = arr
      }
      if (!this.multiple) {
        this.removeDropdown()
        this.visible = false
      } else {
        this.$refs.selectInput.focus()
      }
      this.change(v)
    },
    change (v) {
      this.$emit('input', v)
      this.$emit('change', v)
      this.formItem && this.formItem.$emit('change', v)
      this.$refs.selectDropdown.$parent.options = [...this.options]
    },
    handleScroll () {
      const rect = this.$refs.select.getBoundingClientRect()
      const parentRect = this.parentTarget.getBoundingClientRect()
      const $el = this.dropdownComponent.$el
      const scrollTop = this.parentTarget.scrollTop
      $el.style.position = 'absolute'
      $el.style.left = `${rect.left - parentRect.left}px`
      $el.style.top = `${scrollTop + (rect.top - parentRect.top) + rect.height}px`
      $el.style.width = `${rect.width}px`
      $el.style.zIndex = 2000
    },
    deleteSelected (e) {
      if (this.visible && this.multiple && this.selectedValues.length) {
        if (e.keyCode === 8) {
          this.value.pop()
          this.change(this.value)
        }
      }
    }
  }
}
</script>

<style lang="scss">
%arrow {
  position: absolute;
  width: 0;
  height: 0;
  border-width: 6px;
  border-style: solid;
  border-color: #c0c4cc transparent transparent;
}
.m-select {
  display: inline-block;
  position: relative;
  width: 200px;
  cursor: pointer;
  &__input {
    position: relative;
    display: inline-block;
    width: 100%;
    padding: 0 26px 0 10px;
    transition: border-color 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
    border: 1px solid #dcdfe6;
    box-sizing: border-box;
    &.is-show{
      .m-select__arrow{
        transform: rotateZ(-180deg);
        margin-top: -9px;
      }
    }
    // &.is-focus{
    //   .m-select__inner{
    //     border-color: #57a3f3;
    //     outline: 0;
    //     box-shadow: 0 0 0 2px rgba(45,140,240,.2);
    //   }
    // }
    &.is-multiple{
      .m-select__inner{
        width: 10px;
        vertical-align: top;
      }
      &--empty{
        .m-select__inner{
          width: 100%;
        }
      }
    }
  }
  &__selected{
    display: inline-block;
    font-size: 14px;
    box-sizing: border-box;
    border-color: transparent;
    margin: 6px 6px 0 0;
    background-color: #f0f2f5;
    height: 24px;
    padding: 0 8px;
    line-height: 22px;
    border-radius: 1px;
  }
  &__inner {
    // -webkit-appearance: none;
    background-color: #fff;
    border: none;
    color: #606266;
    display: inline-block;
    font-size: inherit;
    height: 36px;
    line-height: 36px;
    outline: none;
    width: 100%;
    cursor: pointer;
  }
  &__arrow{
    @extend %arrow;
    right: 10px;
    top: 50%;
    margin-top: -3px;
    transition: all .3s;
    &:after{
      content: "";
      @extend %arrow;
      top: -6px;
      left: -5px;
      border-top-color: #fff;
      border-width: 5px;
    }
  }
  &-dropdown {
    margin-top: 10px;
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    max-height: 216px;
    z-index: 1001;
    border: solid 1px #e4e7ed;
    background-color: #fff;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    box-sizing: border-box;
    padding: 6px 0;
    overflow: auto;
  }
}
</style>
