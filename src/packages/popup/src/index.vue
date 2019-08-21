<template>
  <div
    :class="outerClasses"
    @click.self="clickMask">
    <div
      :class="containerClasses">
      <slot></slot>
      <div
        v-if="showClose"
        class="m-popup__close"
        @click="close">
        <div class="m-popup__close--icon"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MPopup',
  props: {
    // 显示与否
    value: {
      type: Boolean,
      required: true,
      default: false
    },
    // 弹出方位
    position: {
      type: String,
      required: true,
      validator (val) {
        return [
          'full',
          'center',
          'top',
          'bottom',
          'left',
          'right'
        ].includes(val)
      }
    },
    // 是否显示弹层的关闭按钮
    showClose: {
      type: Boolean,
      required: false,
      default: false
    },
    // 是否显示遮罩层
    showMask: {
      type: Boolean,
      required: false,
      default: true
    },
    // 遮罩层是否可点击（关闭）
    maskClickable: {
      type: Boolean,
      required: false,
      default: true
    }
  },
  computed: {
    outerClasses () {
      return [
        'm-popup',
        {
          'm-popup--show': this.value
        },
        {
          'm-popup--mask': this.value && this.showMask
        }
      ]
    },
    containerClasses () {
      return [
        'm-popup__container',
        `m-popup__container--${this.position}`,
        {
          [`m-popup__container--${this.position}--show`]: this.value
        }
      ]
    }
  },
  methods: {
    close () {
      this.$emit('input', false)
      this.$emit('close')
    },
    clickMask () {
      this.maskClickable && this.close()
    }
  }
}
</script>

<style lang="scss">
  @keyframes zoomIn {
    from {
      opacity: 0;
      transform: scale3d(0.3, 0.3, 0.3);
    }
    50% {
      opacity: 1;
    }
  }
  @keyframes zoomOut {
    from {
      opacity: 1;
    }
    50% {
      opacity: 0;
      transform: scale3d(0.3, 0.3, 0.3);
    }
    to {
      opacity: 0;
    }
  }
  .m-popup {
    background: rgba(0, 0, 0, 0);
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    position: fixed;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 19999;
    pointer-events: none;
    transition: background-color .3s ease;
    transform: translateZ(0);
    will-change: opacity;
    &--mask {
      background: rgba(0, 0, 0, .5);
    }
    &--show {
      pointer-events: all;
    }
    &__container {
      background: rgba(255, 255, 255, 1);
      position: absolute;
      transition: transform .3s ease;
      transform: translateZ(0);
      will-change: transform;
      z-index: 20000;
      &--full {
        width: 100vw;
        height: 100vh;
        animation-duration: .3s;
        animation-fill-mode: both;
        animation-name: zoomOut;
        &--show {
          animation-name: zoomIn;
        }
      }
      &--center {
        min-width: 68vw;
        max-width: calc(100vw - 20px);
        min-height: 10vh;
        max-height: 50vh;
        animation-duration: .3s;
        animation-fill-mode: both;
        animation-name: zoomOut;
        &--show {
          animation-name: zoomIn;
        }
      }
      &--top {
        width: 100vw;
        height: 50px;
        top: -50px;
        &--show {
          transform: translateY(50px);
        }
      }
      &--bottom {
        width: 100vw;
        height: 100vw;
        bottom: -100vw;
        &--show {
          transform: translateY(-100vw);
        }
      }
      &--right {
        width: 100vw;
        height: 100vh;
        right: -100vw;
        &--show {
          transform: translateX(-100vw);
        }
      }
      &--left {
        width: 68vw;
        height: 100vh;
        left: -68vw;
        &--show {
          transform: translateX(68vw);
        }
      }
    }
    &__close {
      width: 16px;
      height: 16px;
      position: absolute;
      top: 8px;
      right: 8px;
      &::after {
        position: absolute;
        top: -100%;
        right: -100%;
        bottom: -100%;
        left: -100%;
        content: '';
      }
      &--icon {
        width: 100%;
        height: 100%;
        position: relative;
        &::after, &::before {
          background: rgba(121, 121, 121, 1);
          width: 16px;
          height: 2px;
          position: absolute;
          top: 7px;
          left: 0;
          content: '';
        }
        &::before {
          transform: rotate(45deg);
          transform-origin: center center;
        }
        &::after {
          transform: rotate(135deg);
          transform-origin: center center;
        }
      }
    }
  }
</style>
