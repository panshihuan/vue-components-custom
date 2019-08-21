<template>
  <main>
    <MSwipe
      :init="list.length"
      class="swipe"
    >
      <div
        v-for="item in list"
        :key="item"
      >
        <img
          :src="item"
          alt="">
      </div>
    </MSwipe>
    <button @click="getData">getData</button>
  </main>
</template>

<script>
import MSwipe from '../packages/swipe/src/index'

export default {
  components: {
    MSwipe
  },
  data () {
    return {
      list: []
    }
  },
  methods: {
    getData () {
      this.list = [
        require('../assets/images.jpg'),
        require('../assets/images2.jpg'),
        require('../assets/images3.jpg')
      ]
    }
  }
}
</script>

<style lang="scss">
  .swipe {
    height: 300px;
  }
</style>
