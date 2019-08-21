<template>
  <div class="m-toast">
    <div
      class="m-toast__content"
      :class="[`m-toast__content--${detail.type}`]"
    >
      <div v-if="detail.render"
           ref="content">
      </div>
      <span v-else>{{detail.msg}}</span>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import './index.scss'

export default {
  props: {
    detail: {
      type: Object,
      required: true
    }
  },
  /* eslint-disable no-new */
  mounted () {
    if (this.detail.render) {
      this.ins = new Vue({ render: this.detail.render }).$mount(this.$refs.content)
    }
    if (this.detail.duration) {
      setTimeout(() => {
        this.$emit('destroy', this.detail)
      }, this.detail.duration)
    }
  },
  beforeDestroy () {
    if (this.ins) {
      this.ins.$destroy()
    }
  }
}
</script>
