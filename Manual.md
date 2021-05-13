# SDK 使用说明 - 简单步骤

## 1. 创建一个 URTC Client

有两种方式：

- 直接在页面中用 script 标签将 SDK 引入，此时会有全局对象 URTC，具体步骤：

1）下载并保存 SDK 中 index.js 的文件到项目目录，使用 script 标签引入

```html
<script type="text/javascript" src="index.js"></script>
```

2）使用全局对象 URTC 创建 client

```js
const client = URTC.createClient(appId);
```

- 使用 npm/yarn 安装，并将 sdk 使用 ES6 语法作为模块引入，具体步骤：

1）使用 [npm](https://www.npmjs.com/) 或 [Yarn](https://yarnpkg.com/) 安装 sdk:

```shell
npm install --save @urtc/sdk-web
```

或

```shell
yarn add @urtc/sdk-web
```

2）项目中引入并创建 client

```js
import { createClient, createStream } from '@urtc/sdk-web';

const client = createClient(appId);
```

> 注：创建 client 时传的 token 需要使用 AppId 和 AppKey 等数据生成，测试阶段，可临时使用 sdk 提供的 generateToken 方法生成，但为保证 AppKey 不暴露于公网，在生产环境中强烈建议自建服务，由服务器按规则生成 token 供 sdk 使用。

## 2. 监听流事件

```js
client.on('stream-published', (evt) => {
  console.log(`流发布完成`, evt.data);
}); // 监听本地流发布成功事件，在当前用户执行 publish 后，与服务器经多次协商，成功后会触发此事件

client.on('stream-subscribed', (evt) => {
  console.log(`流订阅完成`, evt.data);
  evt.data.play(container).catch((err) => {
    console.log(`流播放失败 ${err}`);
  });
  // 此处 container 代表播放发布流的外层容器元素，也可以是这个外层容器元素的 ID，而外层容器一般是一个设置了宽高的 div 元素，请根据实际情况进行传值
}); // 监听远端流订阅成功事件，在当前用户执行 subscribe 后，与服务器经多次协商，成功后会触发此事件

client.on('stream-added', (evt) => {
  console.log(`有远端流加入`, evt.data);
  client.subscribe(evt.data).catch((err) => {
    console.log(`远端流订阅失败 ${err}`);
  });
}); // 监听新增远端流事件，在远端用户新发布流后，服务器会推送此事件的消息。注：当刚进入房间时，若房间已有的正在发布的流，也会通过此事件通知业务侧

client.on('stream-removed', (evt.data) => {
  console.log(`有远端流移除`, evt.data);
  // 请自行删除在页面中删除播放该流的外层容器元素 - container
}); // 监听移除的远端流事件，在远端用户取消推流或流已关闭时，服务器会推送此事件的消息。
```

## 3. 创建一条本地流

```js
const localStream = createStream({audio: true, video: true, screen: false});
localStream.init().then(() => {
  localStream.play(container).catch((err) => { // container 如上面所说
    console.log(`播放失败 ${err}`)
  });
})
.catch((err) => {
  console.log(`本地流初始化 ${err}`); // 可能存在的错误有：无音视频设备、未授权访问音视频设备、设备被其他应用占用等等
});
```

## 4. 加入房间，并发布本地流

```js
client.join('roomId', 'userId', 'token').then(() => { // 默认为会议模式（小班课 - conference），若为直播模式（大班课 - live）时，需要传入第四个参数 { type: 'live' }，更多配置见 sdk API 说明
  client.publish(localStream).catch((err) => {
    console.log(`发布失败 ${err}`);
  });
}).catch((err) => {
  console.log(`加入房间失败 ${err}`);
});
```

## 5. 取消发布本地流或取消订阅远端流

```js
client.unpublish(localStream).then(() => {
  console.log(`取消发布成功`);
  // 可根据需求是否对该流进行销毁，若需销毁，可调用 localStream.destroy();
}).catch((err) => {
  console.log(`取消发布失败 ${err}`);
});
client.unsubscribe(remoteStream).catch((err) => { // 此方法仅处理本端主动取消订阅远端流的操作，对于被远端取消发布的远端流将通过 stream-removed 事件通知到本端，本端不需要额外的 unsubscribe 操作
  console.log(`取消订阅失败 ${err}`);
});
```

## 6. 退出房间

```js
client.leave().then(() => {
  console.log('离开房间成功');
}).catch((err) => {
  console.log(`离开房间失败 ${err}`);
});
```
