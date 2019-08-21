# 图片懒加载指令


## 配置项
| 名称 | 说明 | 类型 | 默认值 |
| ---- | ---- | ---- | ---- |
| mxPool | 懒加载池容量 | Number | 1000 |
| maxConn | 并发加载数量 | Number| 5 |
| defaultImg | 默认图片 | String | / |
| errorImg | 错误图片 | String | / |


## Demo
####URL链接
```vue
 <img v-lazy="'https://xxxx'">
```
####缩略图
```vue
 <img v-lazy.thumb="{url:'https://xxxx', type:'FIXED_WIDTH', width:200}">
```
##### 缩略图配置项
| 名称 | 说明 | 类型 | 默认值 |
| ---- | ---- | ---- | ---- |
| url | 图片链接 | Number | / |
| type | 缩略图类型 | Number| / |
| width | 图片宽度 | String/Number| / |
| height | 图片高度 | String/Number | / |



