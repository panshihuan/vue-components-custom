<template>
  <div class="form">
    <h2>表单校验</h2>
    <Form
      :rules="rules"
      :check-all="true"
      ref="testForm"
    >
      <FormItem
        :value="value1"
        prop="rule1"
      >
        <Input v-model="value1" />
      </FormItem>
      <FormItem
        :value="value2"
        prop="rule2"
      >
        <Input v-model="value2" />
      </FormItem>
      <FormItem
        :value="value3"
        prop="rule2"
        :rules="[
          {
            type: 'number', // 支持string/number/array/date
            message: '必填项', // 错误提示
            required: true, // 必填校验
            trigger: 'blur'
          }
        ]"
      >
        <Input v-model="value3" />
      </FormItem>
      <FormItem>
        <Input v-model="value4" />
      </FormItem>
    </Form>
    <button
      ref="submit"
      @click="handleSubmit"
    >提交</button>
    <Form
      :rules="rules"
      :model="formData"
      ref="testForm2"
    >
      <FormItem prop="value1">
        <Input v-model="formData.value1" />
      </FormItem>
      <FormItem prop="rulessss">
        {{formData.checkes}}
        <CheckboxGroup v-model="formData.checkes">
          <Checkbox
            v-for="item in value5"
            :key="item.label"
            :value="item.value"
            :label="item.label"
          />
        </CheckboxGroup>
        {{formData.checked}}
        <br />
        <Checkbox
          v-model="formData.checked"
          :disabled="true"
          label="测试单个"
        />
      </FormItem>
      <FormItem>
        {{formData.selected}}
        <Select v-model="formData.selected" append-to-body>
          <Option
            v-for="item in value6"
            :key="item.label"
            :value="item.value"
            :label="item.label"
          ></Option>
          <Option
            :value="value8"
            label="其他"
          >
            <template slot-scope="scope">
              其他<span @click.stop>
                <Input
                  v-model="value8"
                  @focus="scope.stopClose"
                  @keyup.enter.native="scope.change"
                  />
              </span>
            </template>
          </Option>
        </Select>
      </FormItem>
      <FormItem>
        {{formData.radio}}
        <RadioGroup v-model="formData.radio">
          <Radio
            v-for="item in value7"
            :key="item.label"
            :value="item.value"
            :label="item.label"
          ></Radio>
        </RadioGroup>
        <Radio>1111</Radio>
      </FormItem>
      <!-- <FormItem>
        {{formData.multistage}}
        <Multistage v-model="formData.multistage" :options="value9"></Multistage>
      </FormItem> -->
      <FormItem>
        {{formData.slider}}
        <Slider v-model="formData.slider" proportion></Slider>
        <br />
        <Slider v-model="formData.slider1"></Slider>
        <br />
        <Slider v-model="formData.slider2" range></Slider>
      </FormItem>
    </Form>
    <button
      ref="submit"
      @click="handleSubmit2"
    >提交</button>
  </div>
</template>
<script>
import Form from '../packages/form'
import FormItem from '../packages/form-item'
import Input from '../packages/input'
import Checkbox from '../packages/checkbox'
import CheckboxGroup from '../packages/checkbox-group'
import Select from '../packages/select'
import Option from '../packages/option'
import Radio from '../packages/radio'
import RadioGroup from '../packages/radio-group'
// import Multistage from '../packages/multistage'
import Slider from '../packages/slider'

export default {
  components: {
    Form,
    FormItem,
    Input,
    Checkbox,
    CheckboxGroup,
    Select,
    Option,
    Radio,
    RadioGroup,
    // Multistage,
    Slider
  },
  data () {
    return {
      value1: '',
      value2: '',
      value3: '',
      value4: '',
      value5: [
        {
          label: 'Apple',
          value: 1
        },
        {
          label: 'Android',
          value: 2
        }
      ],
      value6: [
        {
          label: '菜单一',
          value: 10
        },
        {
          label: '菜单2',
          value: 20
        }
      ],
      value7: [
        {
          label: '是',
          value: 10
        },
        {
          label: '否',
          value: 20
        }
      ],
      value8: '',
      value9: [
        {
          label: '北京',
          value: '北京'
        },
        {
          label: '上海',
          value: '上海',
          children: [
            {
              label: '巴彦图',
              value: '巴彦图',
              children: [
                {
                  label: '张三',
                  value: '张三'
                }
              ]
            },
            {
              label: '携程',
              value: '携程'
            }
          ]
        }
      ],
      formData: {
        value1: '',
        checkes: [1, 2],
        checked: true,
        selected: 0,
        radio: '',
        multistage: '上海',
        slider: [4, 8, 12],
        slider1: 50,
        slider2: [20, 50]
      },
      rules: {
        value1: [
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
        rule1: [
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
        rule2: [
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
              return new Promise((resolve) => {
                setTimeout(() => {
                  resolve(val % 2 === 0)
                }, 100)
              })
            } // 自定义校验
          }
        ]
      }
    }
  },
  methods: {
    handleSubmit () {
      this.$refs.testForm.validate().then(valid => {
        console.log(valid)
      }).catch(err => {
        console.log(err)
      })
    },
    handleSubmit2 () {
      this.$refs.testForm2.validate().then(valid => {
        console.log(valid)
      }).catch(err => {
        console.log(err)
      })
    },
    handleClickSelectInput () {
      console.log(2)
    }
  }
}
</script>

<style lang="scss">
.form {
  padding: 0 20px;
  .m-form-item {
    margin: 0 0 20px;
  }
  .m-validator__error {
    color: #ff0000;
    font-size: 12px;
    padding: 4px 0 0;
  }
}
</style>
