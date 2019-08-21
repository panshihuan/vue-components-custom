<template>
  <Popup
    class="m-picker"
    v-model="pickerVisible"
    :showMask="showMask"
    :show-close="showClose"
    :mask-clickable="maskClickable"
    position="bottom"
  >
    <div
      v-if="showToolbar"
      class="m-picker-header">
      <div
        class="m-picker-header__btn"
        @click="handleCancel"
      >
        {{ cancelText }}
      </div>
      <div class="m-picker-header__title">
        {{ title }}
      </div>
      <div
        class="m-picker-header__btn"
        @click="handleSubmit"
      >
        {{ confirmText }}
      </div>
    </div>
    <div class="m-picker-body">
      <div class="m-picker-wrapper">
        <PickerColumn
          v-for="(item, index) in columns"
          :key="`picker-${index}`"
          :data="item"
          :value="currentValues[index]"
          @change="handleColumnChange(index, $event)"
        />
      </div>
      <div class="m-picker-indicator"></div>
    </div>
  </Popup>
</template>

<script>
import './index.scss'
import Popup from '../../popup/src/index'
import PickerColumn from './components/pickerColumn'

export default {
  components: {
    Popup,
    PickerColumn
  },
  model: {
    event: 'confirm'
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    data: {
      type: Array,
      default: () => []
    },
    value: {
      type: [Array, Number, String],
      default: () => []
    },
    showClose: {
      type: Boolean,
      default: false
    },
    showMask: {
      type: Boolean,
      default: true
    },
    maskClickable: {
      type: Boolean,
      default: true
    },
    showToolbar: {
      type: Boolean,
      default: true
    },
    title: {
      type: String,
      default: ''
    },
    cancelText: {
      type: String,
      default: '取消'
    },
    confirmText: {
      type: String,
      default: '确定'
    }
  },
  data () {
    return {
      currentValues: []
    }
  },
  computed: {
    pickerVisible: {
      get () {
        return this.visible
      },
      set (val) {
        this.$emit('update:visible', val)
      }
    },
    columns () {
      const self = this
      const columns = []
      function addColumn (data = []) {
        let columnValue = self.currentValues[columns.length]
        let columnChildren
        if (data.length && columnValue === undefined) {
          let [{ children, value }] = data
          columnValue = value
          columnChildren = children
        }
        columns.push(data.map(item => {
          if (columnValue === item.value) {
            columnChildren = item.children
          }
          return { value: item.value, label: item.label }
        }))
        if (columnChildren) {
          addColumn(columnChildren)
        }
      }
      addColumn(this.data)
      return columns
    }
  },
  watch: {
    visible: {
      immediate: true,
      handler (val) {
        if (val) {
          this.currentValues = this.value instanceof Array ? [...this.value] : [this.value]
        }
      }
    }
  },
  methods: {
    diff () {
      return new Promise(resolve => {
        let values = this.columns.map((column, index) => {
          if (this.currentValues[index] === undefined) {
            if (column[0]) {
              return column[0].value
            }
          }
          return this.currentValues[index]
        })
        if (this.columns.length > 1) {
          if (values.some((value, index) => {
            return this.value[index] !== value
          })) {
            resolve(values)
          }
        } else if (values[0] !== this.value) {
          resolve(values[0])
        }
      })
    },
    handleColumnChange (index, val) {
      const values = this.currentValues.slice(0, index + 1)
      values[index] = val
      this.currentValues = values
      this.diff().then(value => {
        this.$emit('change', value)
      })
    },
    handleCancel () {
      this.pickerVisible = false
      this.$emit('cancel')
    },
    handleSubmit () {
      this.diff().then(value => {
        this.$emit('confirm', value)
      })
      this.pickerVisible = false
    }
  }
}
</script>
