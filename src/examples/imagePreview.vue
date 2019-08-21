<template>
  <div>
    <button @click="previewImg">
      preview
    </button>
    <ImagePreview :imgList="photos" v-if="showImg"></ImagePreview>
  </div>
</template>

<script>
import ImagePreview from '../packages/imagePreview'

export default {
  components: {
    ImagePreview
  },
  data () {
    return {
      photos: [
        'https://file.31huiyi.com/Uploads/Files/2018/09/21/636731528202595723.jpg',
        'http://pic.58pic.com/58pic/11/68/32/08658PICred.jpg',
        'https://file.31huiyi.com/Uploads/Files/2018/09/21/636731528202595723.jpg',
        'http://pic.58pic.com/58pic/11/68/32/08658PICred.jpg'
      ],
      actives: 1,
      showImg: false
    }
  },
  methods: {
    previewImg () {
      this.showImg = true
    }
  }
}
</script>

<style lang="scss">
</style>
