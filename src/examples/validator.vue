<template>
  <div class="validator">
    <h2>数据检查</h2>
    <div class="validator__item">
      <Validator
        :value="text"
        :rules="ruleText"
        :immediate="true"
      >
      <input
        v-model="text"
      />
      </Validator>
    </div>
    <div class="validator__item">
      <input
        v-model="num"
        type="number"
      />
      <Validator :value="num" :rules="ruleNum" />
    </div>
    <button ref="submit" @click="handleSubmit">提交</button>
  </div>
</template>
<script>
import Validator from '../packages/validator'

export default {
  components: {
    Validator
  },
  data () {
    return {
      text: '',
      num: 2,
      ruleText: [
        {
          type: 'string', // 支持string/number/array/date
          message: '必填项', // 错误提示
          required: true // 必填校验
        },
        {
          type: 'string', // 支持string/number/array/date
          message: '最多输入20字', // 错误提示
          max: 20
        },
        {
          type: 'string', // 支持string/number/array/date
          message: '只能输入字母', // 错误提示
          pattern: /^[A-Za-z]+$/ // 正则
        }
      ],
      ruleNum: [
        {
          type: 'number', // 支持string/number/array/date
          message: '必填项', // 错误提示
          required: true // 必填校验
        },
        {
          type: 'number', // 支持string/number/array/date
          message: '只能输入10-100之间的数', // 错误提示
          required: true, // 必填校验
          min: 10,
          max: 100
        },
        {
          type: 'number', // 支持string/number/array/date
          message: '只能输入偶数', // 错误提示
          custom: val => {
            return val % 2 === 0
          } // 自定义校验
        }
      ]
    }
  },
  methods: {
    handleSubmit () {
      // this.$refs.submit.$parents
    }
  }
}
</script>

<style lang="scss">
.validator{
  padding: 0 20px;
  input{
    width: 200px;
    height: 30px;
    line-height: 30px;
    border: 1px solid #cccccc;
  }
  &__item{
    padding: 0 0 20px;
  }
  .m-validator__error{
    color: #ff0000;
    font-size: 12px;
    padding: 4px 0 0;
  }
}

</style>
