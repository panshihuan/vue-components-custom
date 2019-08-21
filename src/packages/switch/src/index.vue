<template>
  <div
    :class="[
    clazz,
    clazz + (value ? '-on' : '-off'),
    disabled ? `${clazz}-disabled` : ''
    ]"
    @click="switchOn"
  >
    <span :class="clazz + '-circle'"></span>
  </div>
</template>
<style
  lang="scss"
  src="./index.scss">
</style>
<script>

export default {
  props: {
    value: null,
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      clazz: 'm-switch'
    }
  },
  computed: {
  },
  methods: {
    switchOn () {
      this.$emit('input', !this.value)
    }
  }
}
</script>
