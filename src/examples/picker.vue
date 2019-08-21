<template>
  <div>
    <button @click="picker1 = true">picker</button>
    <button @click="picker2 = true">多列</button>
    <Picker
      v-model="picker1Value"
      :data="picker1Data"
      :visible.sync="picker1"
      @change="handleChange1"
    ></Picker>
    <Picker
      v-model="picker2Value"
      :visible.sync="picker2"
      :data="picker2Data"
      @confirm="handleConfirm"
      @change="handleChange2"
    ></Picker>
  </div>
</template>

<script>
export default {
  data () {
    return {
      picker1: false,
      picker2: false,
      picker1Data: Array(10).fill().map((item, index) => ({
        label: index + 1,
        value: index + 1
      })),
      picker2Data: [
        {
          label: '湖北',
          value: 'hubei',
          children: [
            {
              label: '武汉',
              value: 'wuhan',
              children: [
                {
                  label: '武昌',
                  value: 'wuchang'
                },
                {
                  label: '江岸',
                  value: 'jiangan'
                },
                {
                  label: '汉阳',
                  value: 'hanyang'
                },
                {
                  label: '洪山',
                  value: 'hongshan'
                },
                {
                  label: '青山',
                  value: 'qingshan'
                },
                {
                  label: '东西湖',
                  value: 'dongxihu'
                }
              ]
            },
            {
              label: '宜昌',
              value: 'yichang',
              children: [
                {
                  label: '西陵',
                  value: 'xiling'
                },
                {
                  label: '伍家岗',
                  value: 'wujiagang'
                },
                {
                  label: '点军',
                  value: 'dianjun'
                },
                {
                  label: '猇亭',
                  value: 'xiaoting'
                },
                {
                  label: '夷陵',
                  value: 'yiling'
                }
              ]
            },
            {
              label: '襄阳',
              value: 'xiangyang',
              children: [
                {
                  label: '襄城',
                  value: 'xiangcheng'
                },
                {
                  label: '樊城',
                  value: 'fancheng'
                },
                {
                  label: '襄州',
                  value: 'xiangzhou'
                },
                {
                  label: '枣阳',
                  value: 'zaoyang'
                },
                {
                  label: '南漳',
                  value: 'nanzhang'
                }
              ]
            }
          ]
        },
        {
          label: '浙江',
          value: 'zhejiang',
          children: [
            {
              label: '杭州',
              value: 'hangzhou',
              children: [
                {
                  label: '下城',
                  value: 'xiacheng'
                },
                {
                  label: '上城',
                  value: 'shangcheng'
                }
              ]
            }
          ]
        }
      ],
      picker1Value: null,
      picker2Value: []
    }
  },
  methods: {
    handleChange1 () {
      console.log(this.picker1Value)
    },
    handleConfirm () {
      console.log(this.picker2Value)
    },
    handleChange2 (values) {
      console.log(values)
      setTimeout(() => {
        this.picker2Data[0].children.pop()
      }, 2000)
    }
  }
}
</script>
