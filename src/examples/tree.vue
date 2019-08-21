<template>
  <div>
    <MTree
      name="test-tree"
      :datas="datas"
    >
      <template slot-scope="scope">
        <div class="test-tree__item">
          {{scope.node.name}}
          <a
            class="test-tree__del"
            href="javascript:;"
            @click="handleDel(scope.index, scope.parents)"
          >删除</a>
        </div>
      </template>
    </MTree>
  </div>
</template>

<script>
import MTree from '../packages/tree/src/index'

export default {
  components: {
    MTree
  },
  data () {
    return {
      datas: [
        {
          id: 1,
          name: '张三',
          showChild: true,
          children: [
            {
              id: 1001,
              name: '张三-1',
              children: [
                {
                  id: 10001,
                  name: '张三-1-1'
                }
              ]
            },
            {
              id: 1002,
              name: '张三-2'
            },
            {
              id: 1003,
              name: '张三-3'
            }
          ]
        },
        {
          id: 2,
          name: '李四'
        },
        {
          id: 3,
          name: '王五',
          children: [
            {
              id: 3001,
              name: '王五-1'
            },
            {
              id: 3002,
              name: '王五-2'
            }
          ]
        }
      ]
    }
  },
  methods: {
    handleDel (i, parents) {
      parents.splice(i, 1)
    }
  }
}
</script>

<style lang="scss">
.test-tree {
  &__ul {
    margin: 0;
    padding: 0 0 0 10px;
  }
  &__li {
    list-style: none;
    position: relative;
    & > ul {
      display: none;
    }
    &--showchild {
      & > ul {
        display: block;
      }
    }
  }
  &__toggle {
    position: absolute;
    left: 0;
    top: 0;
    font-style: normal;
    height: 20px;
    line-height: 20px;
    &:before {
      content: '';
      font-size: 14px;
      color: #333333;
      vertical-align: top;
    }
    &--up {
      &:before {
        content: '-';
      }
    }
    &--down {
      &:before {
        content: '+';
      }
    }
  }
  &__item {
    padding-left: 15px;
    height: 20px;
    line-height: 20px;
  }
  &__del {
    font-size: 12px;
    color: #999999;
    padding-left: 10px;
  }
}
</style>
