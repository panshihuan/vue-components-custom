<template>
  <div>
    <button @click="previewImg">
      preview
    </button>
    <br />
    <br />
    <br />
    <br />
    {{initPage}}
    <Pagination
      :total = "total"
      v-model="initPage"
      @change="changePage"
    />

  </div>
</template>

<script>
/* eslint-disable */
  import ImgPreview from '../packages/imgPreview'
  import Pagination from '../packages/pagination'

export default {
    components: {
      Pagination
    },
    data () {
      return {
        photos: [
          require('../assets/images.jpg'),
          // require('../assets/images2.jpg'),
          // require('../assets/images3.jpg')
        ],
        showImg: false,
        total: 52,
        initPage: 1,
        page: null
      }
    },
    methods: {
      previewImg () {
        ImgPreview(this.photos, 0)
      },
      changePage(val) {
        console.log('change:::', val)
      }
    }
}
</script>

<style lang="scss">
</style>
