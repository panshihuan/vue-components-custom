<template>
  <m-index-list
    :data="data">
    <template slot-scope="scope">
      <div class="list-title">
        {{scope.row.index}}
      </div>
      <div class="list-item"
        v-for="(item, index) in scope.row.items"
        :key="index">
        {{item}}
      </div>
    </template>
    <template slot="nav" slot-scope="scope">
        {{scope.row.index}}
    </template>
  </m-index-list>
</template>

<script>
// import IndexList from '@/packages/indexList'
import { data } from './data.js'

export default {
  // components: {
  //   IndexList
  // },
  data () {
    return {
      data
    }
  },
  methods: {
    guid () {
      function S4 () {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
      }
      return (S4() + S4() + '-' + S4() + '-' + S4() + '-' + S4() + '-' + S4() + S4() + S4())
    }
  }
}
</script>

<style lang="scss">
  .list{
    &-title{
      padding: 10px 12px;
      background: #efefef;
    }
    &-item{
      padding: 10px 12px;
    }
  }
</style>
