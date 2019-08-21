<template>
  <div
    ref="wrapper"
    class="m-pull-refresh"
    @touchstart.capture.stop="onTouchStart($event)"
    @touchmove.capture.stop="onTouchMove($event)"
    @touchend.capture.stop="onTouchEnd($event)">
    <div
      ref="topFlag"
      class="m-pull-refresh__flag m-pull-refresh__flag--top">
    </div>
    <slot></slot>
    <div
      v-if="openUp"
      class="m-pull-refresh__load">
      {{ upLoadTip }}
    </div>
    <div
      ref="bottomFlag"
      class="m-pull-refresh__flag m-pull-refresh__flag--bottom">
    </div>
    <div
      v-if="openDown"
      class="m-pull-refresh__refresh"
      :style="refreshStyle">
      <div class="m-pull-refresh__refresh-icon"></div>
      <div class="m-pull-refresh__refresh-tip">
        {{ tip }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MPullRefresh',
  props: {
    // 是否正在加载
    value: {
      type: Boolean,
      default: false
    },
    // 开启上拉（加载）
    openUp: {
      type: Boolean,
      default: true
    },
    // 开启下拉（刷新）
    openDown: {
      type: Boolean,
      default: true
    },
    // 下拉阈值
    downHeight: {
      type: Number,
      default: 50
    },
    downStartTip: {
      type: String,
      default: '下拉刷新'
    },
    downOverTip: {
      type: String,
      default: '松开刷新'
    },
    downRefreshTip: {
      type: String,
      default: '正在刷新'
    },
    // 下拉阈值
    upOffset: {
      type: Number,
      default: 50
    },
    upStartTip: {
      type: String,
      default: '上拉加载'
    },
    upOverTip: {
      type: String,
      default: '松开加载'
    },
    upLoadingTip: {
      type: String,
      default: '正在加载'
    },
    finishedTip: {
      type: String,
      default: '没有更多数据了'
    },
    finished: {
      type: Boolean,
      default: false
    }
  },
  // mounted () {
  //   this.$nextTick(() => {
  //     console.log(
  //       this.$refs.wrapper.getBoundingClientRect(),
  //       this.$refs.bottomFlag.getBoundingClientRect()
  //     )
  //   })
  // },
  data () {
    return {
      yPoint: 0,
      // y轴移动距离
      yMoveOffset: 0,
      // downPointGap: 0,
      // 下拉时内容区已滚动
      downInitGap: 0,
      // wrapperTop: 0,
      // contentTop: 0,

      refreshStyle: [],
      tip: ''
      // upLoadTip: ''
    }
  },
  computed: {
    upLoadTip () {
      return this.finished
        ? this.finishedTip
        : ''
    }
  },
  methods: {
    onTouchStart (e) {
      console.log(
        e.touches,
        e.touches[0]
      )
      this.yPoint = e.touches[0].pageY
      this.downInitGap = this.$refs.wrapper.getBoundingClientRect().y - this.$refs.topFlag.getBoundingClientRect().y
    },
    onTouchMove (e) {
      // console.log(this.$refs.wrapper.getBoundingClientRect())
      // console.log(this.$refs.topFlag.getBoundingClientRect())
      if (
        this.openDown &&
        (this.yMoveOffset = e.touches[0].pageY - this.yPoint) > 0 &&
        this.$refs.wrapper.getBoundingClientRect().y === this.$refs.topFlag.getBoundingClientRect().y
      ) {
        // console.log('到顶了还在继续下拉')
        // console.log(this.yMoveOffset)
        this.refreshStyle = {
          // transform: `translateY(${Math.min((this.yMoveOffset - this.downInitGap), this.downHeight)}px)`,
          transform: `translateY(${(this.yMoveOffset - this.downInitGap)}px)`,
          opacity: Math.min(1, (this.yMoveOffset - this.downInitGap) / this.downHeight)
        }
        this.tip = this.yMoveOffset - this.downInitGap >= this.downHeight ? this.downOverTip : this.downStartTip
        e.cancelable && e.preventDefault()
      }
    },
    onTouchEnd (e) {
      console.log(
        'this.yMoveOffset',
        this.yMoveOffset
      )
      const { bottom: wrapperBottom } = this.$refs.wrapper.getBoundingClientRect()
      const { top: bottomFlagTop } = this.$refs.bottomFlag.getBoundingClientRect()
      console.log(
        wrapperBottom,
        bottomFlagTop
      )
      // 判断是否达到触发上拉加载的条件：向上滚动 且 还有数据待加载 且 达到触底阈值
      if (this.yMoveOffset < 0 && !this.finished && wrapperBottom + this.upOffset >= bottomFlagTop) {
        console.log('可以触发加载')
        this.$emit('load')
      }

      if (this.yMoveOffset - this.downInitGap >= this.downHeight) {
        this.$emit('refresh')
        this.refreshStyle = {
          transform: `translateY(${this.downHeight}px)`,
          opacity: 1,
          transition: 'all .3s ease'
        }
        this.tip = this.downRefreshTip
      } else {
        this.refreshStyle = {
          transform: `translateY(0px)`,
          opacity: 0,
          transition: 'all .3s ease'
        }
        this.tip = ''
      }
    }
  }
}
</script>

<style lang="scss">
  .m-pull-refresh {
    width: 100%;
    height: 100%;
    padding-top: 10px;
    box-sizing: border-box;
    position: relative;
    overflow-y: scroll;

    &__flag {
      &--top {
        position: absolute;
        top: 0;
      }
    }

    &__refresh {
      width: 100%;
      height: 60px;
      position: absolute;
      top: 0;
      left: 0;
      /*transition: all .3s ease;*/
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;

      &-icon {
        background: url(img/icon-reload.svg) no-repeat 0 0 transparent;
        background-size: 40px 40px;
        width: 40px;
        height: 40px;
      }
    }

    &__load {
      background: #F3F3F3;
      height: 48px;
      display: flex;
      justify-content: center;
      align-items: center;
      font: {
        size: 12px;
      }
      color: #666;
    }
  }
</style>
