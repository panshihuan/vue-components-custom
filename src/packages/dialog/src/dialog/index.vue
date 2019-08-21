<template>
  <transition name="m-dialog">
    <div
      v-if="value"
      class="m-dialog"
      :class="{'m-dialog--with-mask': mask }"
    >
      <div class="m-dialog__mask" @click="maskClick"></div>
      <div class="m-dialog__content">
        <slot name="header" v-if="title">
          <div class="m-dialog__header">{{title}}</div>
        </slot>
        <div
          class="m-dialog__body"
          :style="{'text-align': align}">
          <slot>
            {{msg}}
          </slot>
        </div>
        <slot name="footer" :events="events">
          <div class="m-dialog__footer">
            <div
              v-if="type === 'confirm'"
              class="m-dialog__button"
              @click="cancel">取消</div>
            <div
              class="m-dialog__button m-dialog__button--primary"
              @click="ensure">
              确定
            </div>
          </div>
        </slot>
        <div
          v-if="loading"
          class="m-dialog__async">
          <svg viewBox="25 25 50 50" class="m-loading__circular">
            <circle cx="50" cy="50" r="20" fill="none" class="m-loading__path"></circle>
          </svg>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import './index.scss'

export default {
  props: {
    value: {
      type: Boolean,
      default: false
    },
    mask: {
      type: Boolean,
      default: true
    },
    maskClickAble: {
      type: Boolean,
      default: true
    },
    async: {
      type: Boolean,
      default: false
    },
    msg: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    align: {
      type: String,
      default: 'left',
      validator (val) {
        return ['left', 'center', 'right'].includes(val)
      }
    },
    type: {
      type: String,
      default: 'confirm',
      validator (val) {
        return ['confirm', 'alert'].includes(val)
      }
    }
  },
  data () {
    return {
      loading: false
    }
  },
  computed: {
    events () {
      return {
        cancel: this.cancel,
        ensure: this.ensure
      }
    }
  },
  methods: {
    hide () {
      this.$emit('input', false)
    },
    cancel () {
      this.hide()
      this.$emit('cancel')
    },
    ensure () {
      if (this.async) {
        this.loading = true
      } else {
        this.hide()
      }
      this.$emit('ensure')
    },
    maskClick () {
      if (this.maskClickAble) {
        this.cancel()
      }
    }
  }
}
</script>
