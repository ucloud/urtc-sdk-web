# 关于浏览器的自动播放问题的说明及处理

---

## 问题说明

出于用户体验考虑，为了防止网页在用户非自愿的情况下主动播放声音，浏览器对 audio 或 video 标签的自动播放（autoplay）功能做了限制：需要在用户交互操作之前不允许有声音的媒体播放。


## 具体表现

不同浏览器告警或报错信息不同，基本可以归纳为两类：

1. 调用 audio 或 video 的 play 方法时，会报类似于 `DOMException: play() failed because the user didn’t interact with the document first.` 的错误信息。

2. 开启 audio 或 video 的 autoplay 时，即标签上填有 'autoplay' 属性，如 `<audio autoplay/>`，浏览器控制台会有类似于 `The AudioContext was not allowed to start` 的告警信息。此时，如果页面中使用的是 video 标签，一般会处于 `白屏` 状态。


## 解决方法

1. 调用 `play` 方法播放失败时，绕开 autoplay 的限制

此时可引导用户点击页面上的某个位置，譬如模态框上的确定按钮，再在该  `click`  事件的监听函数里调用 `resume` 方法。示例代码：

```js
client.play({
  streamId: 'xxx',
  container: 'xxx',
}, (err) => {
  if (err) {
    console.log('播放失败', err);
    client.resume('xxx', (err) => {
      if (err) {
        console.log('恢复播放失败', err);
      }
    });
  }
});
```

> 注：在调用 URTC sdk 的 `play` 方法失败时，会自动显示音视频播放元素的控制面板，面板里会有播放按钮等操作工具，您也可以不调用 `resume` 方法，仅提示用户点击音视频播放元素的控制面板上的播放按钮进行播放。

2. 直接绕开 autoplay 的限制

由于浏览器限制的是声音的自动播放，在以静音状态进行播放时，是不受 autoplay 的限制的，此时可在调用 `play` 方法时，传的参数中携带 mute: true，并在页面中提示用户，由用户来决定是否与页面进行交互并调用 `resume` 方法来恢复播放声音。示例代码：

```html
<span id="unmuteBtn" class="unmute-btn"></span>
```

```js
let unmuteBtn = document.querySelector('#unmuteBtn');
client.play({
  streamId: 'xxx',
  container: 'xxx,
  mute: true
}, (err) => {
  if (err) {
    console.log('播放失败', err);
  }
});
unmuteBtn.onclick = function() {
  client.resume('xxx', (err) => {
    if (err) {
      console.log('恢复播放失败', err);
    }
  });
}
```

3. 提前检测浏览器是否能自动播放

在用 URTC 创建 client 前，可使用 [can-autoplay](https://www.npmjs.com/package/can-autoplay) 第三方库进行检测，若不支持，可引导用户点击页面上的某个位置（譬如模态框上的确定按钮）来触发用户与页面的交互（即解锁 `the user didn’t interact with the document first`），然后再用 URTC 创建 client 并 joinRoom。示例代码：

```js
canAutoplay.video().then(res => {
  const { result } = res;
  if (!result) {
    // 弹出模态框提示用户点击
  }
});
```

FAQ

Q: 为什么有时可以播放，有时不行？
A: 1. 部分浏览器会有自动播放的限制（如 Chrome 70 及以上和 Safari 浏览器）。2.因为页面不是 100% 被 Autoplay 限制，随着用户使用这个页面的次数增加，部分浏览器会把这个页面加入自己的 Autoplay 白名单列表中。3. 在推+拉流时，若客户端先推流（读取麦克风设备），再拉流，可以绕开 autoplay 的限制。

Q: 为什么别的产品可以自动播放，URTC 却不可以？
A: 排查问题时可先确定客户端是不是先推流再拉流（参考上面的问题）。如果是仅拉流，由于这是浏览器级别的限制，所有同类产品都会受到这个 autoplay 限制的影响，解决办法无外乎上面几种。