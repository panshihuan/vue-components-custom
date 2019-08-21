<template>
  <div class="m-indexlist">
    <div
    ref="m-indexlist__content"
    class="m-indexlist__content">
      <div class="m-indexlist__content-group"
        v-for="(item, index) in data"
        :ref="'m-indexlist__content-' + item[navkey]"
        :key="index">
        <slot :row="item"></slot>
      </div>
    </div>
     <!-- @touchend.stop="navTauchEnd"
      @touchmove.stop="navTauchMove" -->
    <div class="m-indexlist__nav"
      ref="navs"
      @touchend.stop="navTauchEnd"
      @touchmove.stop="navTauchMove"
      @touchstart="navTauchStar">
      <div class="m-indexlist__nav-item"
        v-for="(item, index) in data"
        :data-index="item.index"
        :key="index">
          <slot name="nav" :row="item"></slot>
      </div>
    </div>

    <div class="m-indexlist__popkey" v-show="moving">
      {{currentIndicator}}
    </div>
  </div>
</template>

<script>
export default {
  name: 'MIndexList',
  props: {
    data: {
      type: Array
    },
    navkey: {
      type: String,
      default: 'index'
    }
  },
  data () {
    return {
      // data,
      timer: null,
      popKey: '',
      popKeyShow: false,
      moving: false,
      contentStyle: {},
      navX: null,
      navY: null,
      indicatorTime: null,
      currentIndicator: null
    }
  },
  created () {
  },
  methods: {
    guid () {
      function S4 () {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
      }
      return (S4() + S4() + '-' + S4() + '-' + S4() + '-' + S4() + '-' + S4() + S4() + S4())
    },
    navTauchStar (e) {
      if (!e.target.classList.contains('m-indexlist__nav-item')) {
        return false
      }
      this.indicatorTime && clearTimeout(this.indicatorTime)
      this.navX = e.changedTouches[0].clientX
      this.moving = true
      this.scrollList(e.changedTouches[0].clientY)
    },
    navTauchMove (e) {
      console.log('navTauchMove....')
      this.navY = e.changedTouches[0].clientY
      this.scrollList(e.changedTouches[0].clientY)
    },
    navTauchEnd (e) {
      console.log('navTauchEnd....')
      this.indicatorTime = setTimeout(() => {
        this.moving = false
        // this.currentIndicator = ''
      }, 500)
    },
    scrollList (y) {
      const currentItem = document.elementFromPoint(this.navX, y)
      console.log(currentItem)
      if (!currentItem || !currentItem.classList.contains('m-indexlist__nav-item')) {
        return false
      }
      this.currentIndicator = currentItem.getAttribute('data-index')
      const currentGroup = this.$refs['m-indexlist__content-' + this.currentIndicator][0]

      currentGroup && currentGroup.scrollIntoView()
      if (this.currentIndicator !== currentItem.innerText) {
        console.log(currentItem.innerText)
      }
    }
  }
}
</script>

<style lang="scss">
  .m-indexlist{
    height: 100%;
    overflow: hidden;
    &__content{
      overflow: auto;
      height: 100%;
    }
    &__nav{
      position: fixed;
      right: 10px;
      top: 50%;
      transform: translate3d(0, -50%, 0);
      margin: 0;
      max-height: 100%;
      text-align: center;
      padding: 10px;
      &-title{
        font-size: 12px;
        width: 24px;
      }
      &-item{
        padding: 2px 6px;
        font-size: 12px;
        &.active{
          color: #f20000;
        }
      }
    }
    &__popkey{
      padding: 20px;
      background: rgba(0,0,0,.4);
      border-radius: 6px;
      color: #fff;
      font-size: 16px;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate3d(-50%, -50%, 0);
    }
  }
</style>
