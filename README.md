# simple Swiper

## 简述

基于 Reach Hook 及 CSS 属性 transform: translate(); 的简易 Swiper (仅适用于移动端，若用于 PC 端请作修改)

将项目内的 index.jsx 文件稍作改动即可模块化使用

可转移部分 style 样式至 CSS 文件, 不转不影响直接使用 index.jsx 文件模块化

## 组件组成

此简易 Swiper 由两个组件组成: `Swiper` 与 `SwiperItem`

将 `SwiperItem` 包裹在 `Swiper` 即可，其中 `SwiperItem` 内可包裹任意元素。

## API

### `Swiper`

|    props    |     value      |    type    | mean                                                                                                                      |
| :---------: | :------------: | :--------: | :------------------------------------------------------------------------------------------------------------------------ |
| `direction` | `'X'` \| `'Y'` |  `string`  | `'X'` 为横向滑动， `'Y'` 为纵向滑动，默认为横向                                                                           |
|   `width`   |   `'100vw'`    |  `string`  | 填入任意尺寸字符串，`Swiper` 可视区域宽，默认为 `100vw`                                                                   |
|  `height`   |   `'100vh'`    |  `string`  | `Swiper` 可视区域高，可填入任意尺寸字符串，默认为 `100vh`                                                                 |
| `threshold` |      `64`      |  `number`  | 滑动触发阈值，单位为 px ，默认为 `64`                                                                                     |
| `itemIndex` |      `0`       |  `number`  | 默认页，默认为 `0` 即第一个 `SwiperItem`                                                                                  |
|  `changed`  |    `()=>{}`    | `function` | 回调函数 `changed` 每次触摸结束偏移完页面后即执行，暴露了滑动后的当前页 `currentIndex` 与设置当前页函数 `setCurrentIndex` |

## 使用实例

```jsx
// 简易 Swiper
<Swiper
  direction='X'
  width='100vw'
  height='100vh'
  threshold={64}
  itemIndex={0}
  changed={e => {
    console.log(e);
  }}
>
  <SwiperItem>
    <div>I'm the first page.</div>
  </SwiperItem>
  <SwiperItem>
    <div>I'm the second page.</div>
  </SwiperItem>
  <SwiperItem>
    <div>I'm the third page.</div>
  </SwiperItem>
</Swiper>
```

## TODO

- [ ] 为 index.jsx 编写测试文件 index.test.js

- [ ] 补充组件完整性，如添加指示条，自动播放等...

## 演示

左右横滑演示(纵向请自行修改代码)

[演示地址](https://chickenandfish.github.io/simple-Swiper/)

[演示地址(国内)](https://chickenandfish.gitee.io/simple-swiper/)
