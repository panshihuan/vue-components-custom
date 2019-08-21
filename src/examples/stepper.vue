<template>
  <div :class="$style.box">
    <section>
      <h5>常规</h5>
      <MStepper :min="-100"
                    v-model="data1"
      />
      <span>{{data1}}</span>
    </section>
    <section>
      <h5>disableInput</h5>
      <MStepper :disableInput="true"
                    v-model="data3"
      />
      <span>{{data3}}</span>
    </section>
    <section>
      <h5>disable</h5>
      <MStepper :disabled="true"
                    v-model="data4"
      />
      <span>{{data4}}</span>
    </section>
    <section>
      <h5>step = 0.1</h5>
      <MStepper :step="0.1"
                    v-model="data5"
      />
      <span>{{data5}}</span>
    </section>
    <section>
      <h5>async</h5>
      <MStepper :asyncChange="true"
                    v-model="data6"
                    @change="asyncChange"
      />
      <span>{{data6}}</span>
    </section>
  </div>
</template>

<script>
import MStepper from '../packages/stepper/src/index'

export default {
  components: {
    MStepper
  },
  data () {
    return {
      data1: 0,
      data2: 0,
      data3: 0,
      data4: 0,
      data5: 0,
      data6: 0
    }
  },
  methods: {
    asyncChange (val) {
      setTimeout(() => {
        this.data6++
      }, 2000)
      console.log(val)
    }
  }
}
</script>

<style module
       lang="scss"
>
  .box {
    margin: 10px;
    .switch {
      > main {
        display: flex;
        > div {
          margin-right: 10px;
        }
      }
    }
  }
</style>
