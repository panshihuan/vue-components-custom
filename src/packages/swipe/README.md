# swipe 组件
## props
| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| ---- | ---- | ---- | ---- | ---- |
| interval-time | 间隔时间 | Number | / | 1000 |
| animation-time | 动画时长 | Number | / | 500 |
| initial-num | 默认索引位置 | Number | / | 0 |
| is-loop | 轮播是否连续循环 | Boolean | / | true |
| show-indicator | 显示指示器 | Boolean | / | true |
| transition | 过度动画效果 | String | / |  |

## events
| 事件名 | 说明 | 回调参数 | 返回值 |
| ---- | ---- | ---- | ---- |
| changeEnd | 轮播完成一次时触发 | index | / |

## function
| 方法名 | 说明 | 回调参数 | 返回值 |
| ---- | ---- | ---- | ---- |
| move | 手动滚动 | index | / |
| stop | 手动停止动画 | index | / |

## slots
| name | 说明 |
| ---- | ---- |
| indicator | 指示器 |

## demos


