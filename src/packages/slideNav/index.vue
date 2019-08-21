<template>
  <transition
    :name="transName"
    :duration="500"
  >
    <div
    class="m-slide-nav"
    :class="{'bottom': position === 'bottom','top': position === 'top'}"
    ref="wraper"
    v-show="visible">
      <slot></slot>
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    position: {
      type: String,
      default: 'top'
    }
  },
  computed: {
    transName () {
      return this.position === 'top' ? 'slideup' : 'slidedown'
    }
  },
  data () {
    return {
      visible: true,
      scrollAction: { x: null, y: null },
      scrollDirection: null
    }
  },
  watch: {
    visible (v) {
      v ? this.slideIn() : this.slideOut()
      // this.slideIn()
    }
  },
  methods: {
    slideOut () {
      // Do something...
    },
    slideIn () {
      // Do something...
    },
    scrollHandler (dom) {
      const scrollDom = dom || window
      scrollDom.addEventListener('scroll', (e) => {
        this.domScroll(e)
      })
    },
    domScroll (e) {
      if (typeof this.scrollAction.y === 'undefined') {
        this.scrollAction.y = 0
      }
      const scrollTop = e.target.scrollTop ? e.target.scrollTop : document.scrollingElement.scrollTop
      this.scrollDirection = this.scrollAction.y - scrollTop > 0 ? 'up' : 'down'
      this.scrollAction.y = scrollTop
      this.visible = this.scrollDirection === 'up'
    }
  }
}
</script>

<style lang="scss">
  .m-slide-nav{
    position: fixed;
    left: 0;
    display: flex;
    width: 100%;
    &.top {
      top: 0;
    }
    &.bottom {
      bottom: 0;
    }
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: all 0.5s;
  }
  .fade-enter, .fade-leave-to {
    opacity: 0;
    height: 0;
  }

  .slideup-enter-active,
  .slideup-leave-active {
    transition: all 0.5s;
    transform: translate3d(0, 0, 0);
  }
  .slideup-enter, .slideup-leave-to {
    transform: translate3d(0, -100%, 0);
  }

  .slidedown-enter-active,
  .slidedown-leave-active {
    transition: all 0.5s;
    transform: translate3d(0, 0, 0);
  }
  .slidedown-enter, .slidedown-leave-to {
    transform: translate3d(0, 100%, 0);
  }
</style>
