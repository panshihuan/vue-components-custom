# tree 组件
## props
| 参数 | 说明 | 类型 | 可选值 | 默认值 | 是否必须 |
| ---- | ---- | ---- | ---- | ---- | ---- |
| name | 命名空间 | String | / | tree | 否 |
| datas | 数据源 | Array | / | / | 是 |
| child | 子节点key | String | / | 'children' | 否 |
| toggle | 是否显示展开关闭 | Boolean | / | true | 否 |
| checkCurrent | 校验高亮 | Function | / | / | 否 |
| level | 层级 | Number | / | 1 | 否 |

## slots
| name | 说明 |
| ---- | ---- |
| 无 | 节点自定义内容 |

## slot-scope
| 参数 | 说明 |
| ---- | ---- |
| node | 当前节点对象 |
| parents | 当前节点所在数组 |
| index | 当前节点所在数组中的索引 |
| level | 当前节点所处层级 |
