<template>
  <div
    class="m-tabbar"
    :class="{
      'm-tabbar--fixed': fixed
    }"
  >
    <template v-for="(item, i) in items">
      <div
        :key="`tabar${item.name}${i}`"
        class="m-tabbar__item"
        :class="{
        'm-tabbar__item--active': item.active
      }"
        @click="handleClick(item)"
      >
        <slot scope="item">
          <i
            class="m-tabbar__icon"
            :class="`${item.icon} ${item.active ? (item.activeIcon || '') : ''}`"
          ></i>
          <span class="m-tabbar__text">{{item.name}}</span>
        </slot>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  name: 'tabbar',
  props: {
    fixed: {
      type: Boolean,
      default: true
    },
    items: {
      type: Array,
      required: true
    }
  },
  methods: {
    handleClick (item) {
      this.items.forEach(v => {
        v.active = false
      })
      this.$set(item, 'active', true)
      this.$emit('change', item)
    }
  }
}
</script>

<style lang="scss">

</style>
