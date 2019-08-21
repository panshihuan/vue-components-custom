<template>
<div>
  <button @click="dialog1 = true">dialog</button>
  <button @click="createDialog">弹窗</button>
  <button @click="createAsyncDialog">异步</button>
  <button @click="createDialogs">多弹窗</button>
  <button @click="createAlert">alert</button>
  <m-dialog
    v-model="dialog1"
    title="提示"
    align="center"
  >
    <div>
      这是一段提示内容
    </div>
    <!--<div slot="footer" slot-scope="scope">-->
    <!--<div @click="scope.events.cancel">取消</div>-->
    <!--</div>-->
  </m-dialog>
</div>
</template>

<script>
export default {
  data () {
    return {
      dialog1: false
    }
  },
  methods: {
    createDialog (arg) {
      this.$dialog.confirm({
        title: '标题',
        msg: '123124234334',
        mask: arg !== 1
      })
        .then(() => {
          console.log('ensure')
        })
        .catch(() => {
          console.log('cancel')
        })
    },
    createAsyncDialog () {
      this.$dialog.confirm({
        title: '标题',
        msg: '123124234334',
        async: true
      })
        .then((done) => {
          setTimeout(() => {
            done()
          }, 3000)
          console.log('ensure')
        })
        .catch(() => {})
    },
    createDialogs () {
      let i = 0
      if (this.t) {
        clearInterval(this.t)
      }
      this.t = setInterval(() => {
        i++
        this.createDialog(i)
        if (i >= 3) {
          clearInterval(this.t)
        }
      }, 500)
    },
    createAlert () {
      this.$dialog.alert({
        title: 'alert',
        async: true,
        msg: '123'
      }).then((done) => { setTimeout(done, 1500) }).then(() => {})
    }
  }
}
</script>
