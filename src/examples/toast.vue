<template>
    <div class="toast-example">
      <button @click="simpleToast" class="btn">提示</button>
      <button @click="successToast" class="btn">成功</button>
      <button @click="warningToast" class="btn">警告</button>
      <button @click="failToast" class="btn">失败</button>
      <button @click="dur" class="btn">自定义时长</button>
      <button @click="dur2" class="btn">不自动消失</button>
      <button @click="multi" class="btn">多实例</button>
      <button @click="clearAll" class="btn">清除所有</button>
      <button @click="clear" class="btn">手动清除</button>
      <button @click="render" class="btn">自定义render</button>
    </div>
</template>

<script>
import { Toast } from '../packages/toast'

export default {
  name: 'toast',
  methods: {
    simpleToast () {
      this.$toast('普通提示信息')
    },
    successToast () {
      this.$toast({
        msg: '成功提示信息',
        type: 'success'
      })
    },
    warningToast () {
      this.$toast({
        msg: '警告提示信息',
        type: 'warning'
      })
    },
    failToast () {
      this.$toast({
        msg: '失败提示信息',
        type: 'fail'
      })
    },
    dur () {
      this.$toast({
        msg: '10秒提示信息',
        type: 'success',
        duration: 10000
      })
    },
    dur2 () {
      this.$toast({
        msg: '不会自动消失',
        type: 'success',
        duration: 0
      })
    },
    multi () {
      Toast.configure({
        multi: true,
        position: 'top'
      })
      this.simpleToast()
    },
    clearAll () {
      Toast.clear()
    },
    clear () {
      const toast = this.$toast({
        msg: '手动清除',
        type: 'success',
        duration: 0
      })
      setTimeout(() => {
        toast.clear()
      }, 5000)
    },
    render () {
      this.$toast({
        render: h => h('div', '111222'),
        type: 'success',
        duration: 2000
      })
    }
  }
}
</script>

<style scoped>
  .toast-example{
    display: flex;
    margin-top: 400px;
    justify-content: space-between;
    flex-wrap: wrap;
    align-content: center;
  }
  .btn{
    display: inline-block;
    margin-bottom: 10px;
    font-size: 14px;
    padding: 10px 20px;
    color: #fff;
    cursor: pointer;
    outline: none;
    background-color: #73adff;
  }
</style>
