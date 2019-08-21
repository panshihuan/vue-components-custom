<template>
  <div class="m-radio-group">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'm-radio-group',
  provide () {
    return {
      radioGroup: this
    }
  },
  props: {
    value: {},
    disabled: Boolean
  }
}
</script>
