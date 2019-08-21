<template>
  <div class="m-select-dropdown">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'm-select-dropdown',
  provide () {
    return {
      dropdown: this
    }
  }
}
</script>
