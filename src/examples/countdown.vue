<template>
  <countdown :value="6"></countdown>
</template>

<script>
import Countdown from '../packages/countdown'

export default {
  components: {
    Countdown
  },
  data () {
    return {}
  }
}
</script>
