<template>
  <div>
    <Tabbar
      :items="items"
      @change="changeTab"
    ></Tabbar>
  </div>
</template>

<script>
import Tabbar from '../packages/tabbar/src/index'

export default {
  components: {
    Tabbar
  },
  data () {
    return {
      items: [
        {
          name: '首页',
          active: true,
          icon: 'icon-home',
          activeIcon: 'icon-home-active'
        },
        {
          name: '购物车',
          icon: 'icon-cart',
          activeIcon: 'icon-cart-active'
        },
        {
          name: '个人中心',
          icon: 'icon-user'
        }
      ]
    }
  },
  methods: {
    changeTab () {
      console.log(this.dateRage.start, this.dateRage.end)
    }
  }
}
</script>

<style lang="scss">
</style>
