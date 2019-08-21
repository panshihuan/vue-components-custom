<template>
  <div class="m-pull-refresh-demo">
    <div class="extra">
      区域滚动的上部
    </div>
    <m-pull-refresh
      class="m-pull-refresh-container"
      v-model="loading"
      :finished="listFinished"
      :up-offset="50"
      @refresh="onRefresh"
      @load="load">
      <p
        v-for="item in data"
        :key="item">
        <span>
          Item {{ item }}
        </span>
      </p>
    </m-pull-refresh>
    <div class="extra">
      区域滚动的上部
    </div>
  </div>
</template>

<script>
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

export default {
  data () {
    return {
      times: 1,
      data: [],
      loading: false
      // listFinished: false
    }
  },
  created () {
    console.log(this.data)
  },
  computed: {
    listFinished () {
      return this.data.length >= 40
    }
  },
  watch: {
    times: {
      handler () {
        this.getList()
      },
      immediate: true
    }
  },
  methods: {
    async getList () {
      // 模拟ajax
      await sleep(1500)
      const res = [...Array(10).keys()].map(v => v + 1 + (this.times - 1) * 10)
      this.data = this.times === 1 ? [...res] : [...this.data, ...res]
    },
    load () {
      this.times++
    },
    onRefresh () {
      this.times = 1
      console.log('outer refresh')
    }
  }
}
</script>

<style lang="scss">
  .m-pull-refresh-container {
    margin: 10px 0;
    height: 40vh;
    box-sizing: border-box;
    border: 1px solid #DEDEDE;
    border-left: none;
    border-right: none;
    p {
      padding-left: 10px;
      padding-right: 10px;
    }
  }
  .extra {
    background: #F7F7F7;
    height: 60px;
    padding: 0 10px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
