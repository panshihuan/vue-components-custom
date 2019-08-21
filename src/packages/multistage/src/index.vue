<template>
  <div class="m-multistage">
    <template v-for="n in showLevel">
      <MultistageItem
        :key="n"
        :data="optionsGroup[n-1] || {}"
        :values="values"
        :value-index="valueIndex"
        :index="n-1"
        :placeholders="placeholders"
        :disabled="disabled"
        :transfer="transfer"
        :append-target="appendTarget"
        :custome-dropdown-class="customeDropdownClass"
        @change="handleChangeSelect"
      />
    </template>
    <MInput
      v-if="enableEndInput"
      v-model="inputValue"
      :placeholder="endInputPlaceholder"
      class="m-multistage__input"
      type="textarea"
      @input="changeInput"
    />
  </div>
</template>
<script>
// import Vue from 'vue‘
import MultistageItem from './item'
import MInput from '../../input'

const getMaxDepth = (list = [], depth = 1) => {
  let maxDepth = depth
  list.forEach(item => {
    if (item.children && item.children.length) {
      maxDepth = Math.max(maxDepth, getMaxDepth(item.children, depth + 1))
    }
  })
  return maxDepth
}

export default {
  name: 'm-multistage',
  components: {
    MultistageItem,
    MInput
  },
  provide() {
    return {
      multistage: this,
      formItem: undefined
    }
  },
  inject: {
    formItem: {
      default: undefined
    }
  },
  props: {
    value: {
      type: String,
      default: ''
    },
    options: {
      type: Array,
      default: () => []
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
    placeholders: {
      type: Array,
      default: () => []
    },
    separator: {
      type: String,
      default: '-'
    },
    level: {
      type: Number,
      default: 0
    },
    maxLevel: {
      type: Number,
      default: 3
    },
    disabled: Boolean,
    enableEndInput: {
      type: Boolean,
      default: false
    },
    endInputPlaceholder: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      values: [],
      valueIndex: [0],
      inputValue: ''
    }
  },
  computed: {
    showLevel() {
      const level = this.level || getMaxDepth(this.options)
      return level > this.maxLevel ? this.maxLevel : level
    },
    optionsGroup() {
      const result = this.valueIndex.reduce(
        (prev, item, i) => {
          if (i > 0) {
            const v = this.valueIndex[i - 1]
            const target = prev[prev.length - 1].children[v]
            prev.push(target)
          }
          return prev
        },
        [
          {
            children: this.options
          }
        ]
      )
      return result
    }
  },
  watch: {
    value: {
      handler() {
        this.getValues()
      },
      immediate: true
    },
  },
  methods: {
    getValues() {
      const splitValue = this.value ? this.value.split(this.separator) : []
      splitValue.forEach((v, i) => {
        this.$set(this.values, i, v || '')
      })
      // if (this.valueIndex.length !== this.values.length + 1) {
      this.shouldLoadOption()
      // }
      if (this.enableEndInput) {
        this.inputValue = this.values[this.showLevel] || ''
      }
    },
    handleChangeSelect(v, i) {
      if (v !== this.values[i]) {
        const current = this.optionsGroup[i].children.find(
          item => item.value === v
        )
        const currentIndex = this.optionsGroup[i].children.findIndex(
          item => item.value === v
        )
        this.$emit('change', current)
        this.valueIndex.splice(i + 1, this.valueIndex.length, currentIndex)
        this.values.splice(i, this.values.length, v)
        const nv = this.values.join(this.separator)
        this.$emit('input', nv)
        this.$forceUpdate()
      }
    },
    async shouldLoadOption() {
      let arr = this.options
      const valueIndex = []
      for (const item of this.values) {
        const index = arr.findIndex(v => v.value === item)
        if (index >=0 ) {
          valueIndex.push(index)
          const current = arr[index]
          if (current && current.hasChild && !current.children.length) {
            this.$emit('change', current)
            await new Promise(resolve => {
              const unwatch = this.$watch(() => current.children, () => {
                if (current.children.length) {
                  unwatch()
                  resolve()
                }
              })
            })
          }
          arr = current.children
        }
      }
      valueIndex.push(0)
      this.valueIndex = valueIndex
    },
    changeInput(v) {
      this.$set(this.values, this.showLevel, v)
      const nv = this.values.join(this.separator)
      this.$emit('input', nv)
    }
  }
}
</script>

<style lang="scss">
.m-multistage {
  &__item {
    margin-top: 10px;
    &:first-child{
      margin-top: 0;
    }
  }
  &__input{
    margin-top: 10px;
  }
  .m-select {
    width: 100%;
  }
  .m-input {
    display: block;
  }
}
</style>
