<template>
    <div>
      <!--字符串链接-->
      <img v-lazy="url">
      <!--对象-->
      <img v-lazy="objURL">
      <!--缩略图-->
      <img v-lazy.thumb="thumb">
      <!--加载失败-->
      <img v-lazy.thumb="error">
    </div>
</template>

<script>
export default {
  data () {
    return {
      url: 'http://img03.tooopen.com/uploadfile/downs/images/20110714/sy_20110714135215645030.jpg',
      objURL: {
        url: 'http://pic.58pic.com/58pic/11/68/32/08658PICred.jpg'
      },
      thumb: {
        url: 'https://file.31huiyi.com/Uploads/Files/2018/09/21/636731528202595723.jpg',
        type: 'FIXED_WIDTH',
        width: 100
      },
      error: {
        url: 'https://file.31huiyi.com/Uploads/Files/2018/09/21/636731528202595723.jpg',
        type: 'FIXED_WIDTH',
        width: 'auto'
      }
    }
  }
}
</script>

<style scoped>

</style>
