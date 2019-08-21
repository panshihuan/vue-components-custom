<template>
  <div class="demo-slide" :class="{'full': !fullMode}">
    <div class="demo-slide-nav"
    :class="{'full': !fullMode}"
    ref="list">
      <slideNav
        ref="top"
        position="top"
        :visible="fullMode">
        <div class="demo-slide__topnav">slide__topnav</div>
      </slideNav>

      <slideNav
        ref="bottom"
        position="bottom"
        :visible="fullMode">
        <div class="demo-slide__topnav">slide__bottomnav</div>
      </slideNav>

      <div class="demo-slide-nav__hd" ref="xxx">
        <div class="btn" @click="switchMode(true)">全屏模式</div>
        <div class="btn" @click="switchMode(false)">限高模式</div>
      </div>
      <div class="demo-slide-nav__bd">
        <div class="demo-slide-nav__list">
          <div class="demo-slide-nav__item" v-for="item in list" :key="item">
            {{item}}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import slideNav from '../packages/slideNav'

export default {
  components: {
    slideNav
  },
  computed: {
    list () {
      const arr = []
      for (let i = 0; i < 50; i++) {
        arr.push(i)
      }
      return arr
    }
  },
  data () {
    return {
      fullMode: true
    }
  },
  created () {
    console.log(this)
  },
  methods: {
    switchMode (v) {
      this.fullMode = v
      const dom = v ? null : this.$refs.list

      this.$refs.top.scrollHandler(dom)
      this.$refs.bottom.scrollHandler(dom)
    }
  }
}
</script>

<style lang="scss">
  .demo-slide{
    &__topnav{
      width: 100%;
      height: 40px;
      background: #f56c6c;
      color: #fff;
    }
    &.full {
      height: 100%;
      overflow: hidden;
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      margin: auto;
    }
    &-nav{
      &.full {
        height: 100%;
        overflow-y: auto;
        overflow-x: hidden;
      }
      &__hd{
        display: flex;
        flex-direction: column;
        height: 30vh;
        background: linear-gradient(#f78b8b 15%, #f56c6c 70%, #f78b8b);
        align-items: center;
        justify-content: center;
      }
      &__item{
        border-bottom: 1px solid #e2e2e2;
        padding: 12px 20px;
      }
      .btn{
        padding: 4px 20px;
        border: 1px solid #fff;
        color: #fff;
        font-size: 14px;
        cursor: pointer;
        margin-bottom: 20px;
        & + & {
          margin-top: 20px;
        }
      }
    }
  }

</style>
