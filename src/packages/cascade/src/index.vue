<template>
  <div class="cascade">
    <div class="cascade__selected">
      <div
        v-for="(item, index) in selected"
        :key="`tab${item.value}`"
        class="cascade__selected-item"
        :class="{'cascade__selected-item--active': index === currentLevel}"
        @click="selectTab(item, index)">
        {{ item.label }}
      </div>
    </div>

    <div class="cascade__items">
      <div class="cascade__items-container">
        <div
          v-for="item in currentChildren"
          :key="`item${item.value}`"
          class="cascade__items-item"
          @click="selectItem(item)">
          {{ item.label }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import './index.scss'

export default {
  name: 'Cascade',
  data () {
    return {
      cache: {},

      // 已选中项
      selected: [],

      // 当前待选子项
      currentChildren: [],

      // 当前选定级别（第几级）
      currentLevel: 0
    }
  },
  created () {
    this.getList('1')
  },
  methods: {
    async getList (id) {
      // todo 缓存
      this.currentChildren = await [
        {
          label: `0-${id}`,
          value: `0-${id}`
        },
        {
          label: `1-${id}`,
          value: `1-${id}`
        },
        {
          label: `2-${id}`,
          value: `2-${id}`
        },
        {
          label: `3-${id}`,
          value: `3-${id}`
        }
      ]
    },
    async selectTab (item, index) {
      await this.getList(item.value)
      this.currentLevel = index
    },
    async selectItem (item) {
      await this.getList(item.value)
      this.currentLevel++
      if (!this.selected[this.currentLevel] || this.selected[this.currentLevel].value !== item.value) {
        this.selected.splice(this.currentLevel, this.selected.length - this.currentLevel, item)
      }
    }
  }
}
</script>
