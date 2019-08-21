<template>
  <div :class="$style.box">
    <section>
      <header>radio</header>
      <MRadio
        v-model="value"
        :option-list="optionList"
      >
      </MRadio>
      {{value}}
    </section>
    <section>
      <header>Checkbox</header>
      <MRadio
        v-model="checkboxValue"
        :option-list="checkboxOptionList"
        selectType="checkbox"
      >
      </MRadio>
      {{checkboxValue}}
    </section>
    <section :class="$style.switch">
      <header>Switch</header>
      <main>
        <MSwitch
          v-model="switchValue"
        />
        <MSwitch
          :disabled="true"
          v-model="switchValue"
        />
      </main>
      {{switchValue}}
    </section>
    <hr />
    {{value3}}
    <Select v-model="value3">
      <Option
        v-for="item in value2"
        :key="item.label"
        :value="item.value"
        :label="item.label"
      ></Option>
    </Select>
    {{value1}}
    <Select v-model="value1" multiple>
      <Option
        v-for="item in value2"
        :key="item.label"
        :value="item.value"
        :label="item.label"
      ></Option>
    </Select>
  </div>
</template>

<script>
import MRadio from '../packages/radio/src/index'
import MSwitch from '../packages/switch/src/index'
import Select from '../packages/select'
import Option from '../packages/option'

export default {
  components: {
    MRadio,
    MSwitch,
    Select,
    Option
  },
  data () {
    return {
      value: null,
      optionList: [
        { value: 1, label: '按钮一' },
        { value: 2, label: '按钮二' },
        { value: 3, label: '按钮三', disabled: true },
        { value: 2, label: '按钮四', disabled: true }
      ],
      checkboxValue: null,
      checkboxOptionList: [
        { value: 'c1', label: '按钮一' },
        { value: 'c2', label: '按钮二' },
        { value: 'c3', label: '按钮三', disabled: true },
        { value: 'c2', label: '按钮四', disabled: true }
      ],
      switchValue: false,
      value1: [],
      value2: [
        { value: 1, label: '选项一' },
        { value: 2, label: '选项二' },
        { value: 3, label: '选项三' },
        { value: 4, label: '选项四' },
        { value: 5, label: '选项五' },
        { value: 6, label: '选项六' }
      ],
      value3: ''
    }
  }
}
</script>

<style module
       lang="scss">
  .box {
    margin: 10px;
    .switch {
      >main {
        display: flex;
        >div {
          margin-right: 10px;
        }
      }
    }
  }
</style>
