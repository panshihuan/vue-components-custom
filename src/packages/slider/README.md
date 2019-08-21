# Form 组件

## 配置参数
| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| ---- | ---- | ---- | ---- | ---- |
| multi | 是否多消息实例 | Boolean | / | false |
| position | 消息弹出位置 | String | top/center | center |

## 参数说明
| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| ---- | ---- | ---- | ---- | ---- |
| msg | 显示的消息 | String | / | / |
| type | 消息类型 | String | success/fail/warn/info | info |
| duration | 显示时长 | Number | / | 1500 |
| render | 渲染函数 | Function | / | / |

## 方法
| 事件名 | 说明 | 回调参数 | 返回值 |
| ---- | ---- | ---- | ---- |
| clear | 关闭某个消息 | toast句柄 | / |
| clearAll | 关闭所有消息 | / | / |

