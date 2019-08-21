<template>
  <div
    v-if="data"
    class="m-multistage__item"
  >
    <MInput
      v-if="data.showInput"
      v-model="values[index]"
      :placeholder="placeholders[index]"
      class="m-multistage__input"
      type="textarea"
    />
    <template v-else>
      <MSelect
        v-if="!values.length || (data.children && data.children.length)"
        v-bind="$attrs"
        :refs="`select${index}`"
        :value="values[index]"
        :placeholder="placeholders[index]"
        class="m-multistage__select"
        @change="(v) => $emit('change', v, index)"
      >
        <MOption
          v-for="(option, i) in data.children"
          :key="`option${i}${option.value}`"
          :value="option.value"
          :label="option.label"
        ></MOption>
      </MSelect>
      <MInput
        v-if="showNextInput"
        v-model="values[index + 1]"
        :placeholder="placeholders[index + 1]"
        class="m-multistage__input"
        type="textarea"
      />
    </template>
  </div>
</template>

<script>
import MSelect from '../../select'
import MOption from '../../option'
import MInput from '../../input'

export default {
  components: {
    MSelect,
    MOption,
    MInput
  },
  props: {
    data: {
      type: Object,
      required: true
    },
    values: {
      type: Array,
      required: true
    },
    valueIndex: {
      type: Array,
      required: true
    },
    index: {
      type: Number,
      required: true
    },
    placeholders: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    showNextInput () {
      const current = this.data?.children?.find(
        item => item.value === this.values[this.index]
      )
      return (
        current &&
        current.showInput &&
        !current.hasChild &&
        !current.children?.length
      )
    }
  }
}
</script>
