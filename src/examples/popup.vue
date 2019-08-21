<template>
  <div class="demo-popup">
    <div class="buttons">
      <button
        class="button button-full"
        @click="open('full')">
        全屏
      </button>
      <button
        class="button button-center"
        @click="open('center')">
        中部弹出
      </button>
      <button
        class="button button-top"
        @click="open('top')">
        上部弹出
      </button>
      <button
        class="button button-bottom"
        @click="open('bottom')">
        底部弹出
      </button>
      <button
        class="button button-left"
        @click="open('left')">
        左侧滑出
      </button>
      <button
        class="button button-right"
        @click="open('right')">
        右侧滑出
      </button>
    </div>

    <m-popup
      v-model="show"
      :position="position"
      :mask-clickable="true"
      :show-close="true"
      :show-mask="true"
      @close="outClose">
      弹出内容
    </m-popup>
  </div>
</template>

<script>
export default {
  data () {
    return {
      show: false,
      position: 'top'
    }
  },
  methods: {
    outClose () {
      console.log('out close')
    },
    open (position) {
      this.show = true
      this.position = position
    }
  }
}
</script>

<style lang="scss">
  .demo-popup {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .buttons {
    display: flex;
    flex-direction: column;
  }
  .button {
    background: linear-gradient(90deg, rgba(109, 198, 255, 1), rgba(38, 142, 255, 1));
    width: calc(100vw - 56px);
    height: 44px;
    margin-bottom: 30px;
    border-radius: 25px;
    border: none;
    color: rgba(255, 255, 255, .9)
  }
  .button:focus {
    outline: none;
  }
</style>
