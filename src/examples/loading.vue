<template>
    <div>
      <button @click="loading">loading</button>
    </div>
</template>

<script>
export default {
  methods: {
    loading () {
      const loading = this.$loading()
      setTimeout(() => {
        loading.clear()
      }, 1000)
    }
  }
}
</script>

<style scoped>

</style>
