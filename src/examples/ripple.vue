<template>
  <div>
    <div class="ripple-box"
         v-m-ripple></div>
    <button v-m-ripple>sdlfkjdsf</button>
  </div>
</template>

<script>
import Vue from 'vue'
import ripple from '../packages/ripple/src/index'

Vue.directive('m-ripple', ripple)

export default {}
</script>

<style lang="scss">
  .ripple-box {
    margin: 100px 100px;
    border: 5px solid;
    /*border-bottom-left-radius: 30%;*/
    width: 200px;
    height: 120px;
    background: gainsboro;
    /*position: fixed;*/
  }
</style>
