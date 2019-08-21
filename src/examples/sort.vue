<template>
  <Sort
    :data="data"
  >
    <DragItem
      v-for="(item, index) in data"
      :key="index"
    >
      <div class="list-item">
        <span>{{ item.label }}</span>
        <Sort
          :data="item.children"
          :overflow="true"
        >
          <DragItem
            v-for="(subItem, i) in item. children"
            :key="`sub-${i}`"
          >
            <div
              class="list-item-sub">
             {{ subItem.label }}
            </div>
          </DragItem>
        </Sort>
      </div>
    </DragItem>
  </Sort>
</template>

<script>
import Sort from '../packages/sort/src/index'
import DragItem from '../packages/sort/src/components/dragItem'

export default {
  components: {
    Sort,
    DragItem
  },
  data () {
    return {
      data: new Array(3).fill(null).map((v, index) => ({
        label: index,
        children: new Array(5).fill(null).map((v, i) => ({
          label: `${index} - ${i}`,
          children: []
        }))
      }))
    }
  }
}
</script>

<style lang="scss">
  .sort-item {
    margin-bottom: 20px;
  }
  .list-item{
    &>span{
      display: block;
      background: #999;
      line-height: 50px;
      cursor: pointer;
      text-align: center;
    }
    &>div{
      padding-left: 20px;
      &>div{
        line-height: 40px;
      }
    }
    &-sub{
      background: #ccc;
    }
  }
</style>
