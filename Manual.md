# SDK 使用说明 - 简单步骤

## 1. 创建一个 URTC Client

有两种方式：

- 使用 npm 安装，并将 sdk 使用 ES6 语法作为模块引入，具体步骤：

1）使用 [npm](https://www.npmjs.com/) 或 [Yarn](https://yarnpkg.com/) 安装 sdk:

```
npm install --save urtc-sdk
```

或

```
yarn add urtc-sdk
```

2）项目中引入并创建 client

```
import { Client } from 'urtc-sdk';

const client = new Client(appId, token); // 默认为连麦模式（小班课），若为直播模式（大班课）时，需要传入第三个参数 { type: 'live' }，更多配置见 sdk API 说明
```

- 直接在页面中用 script 标签将 sdk 引入，此时会有全局对象 UCloudRTC，具体步骤：

1）直接将 sdk 中 lib 目录下的 index.js 使用 script 标签引入

```
<script type="text/javascript" src="index.js"><script>
```

2）使用全局对象 UCloudRTC 创建 client

```
const client = new UCloudRTC.Client(appId, token);
```

> 注：创建 client 时传的 token 需要使用 AppId 和 AppKey 等数据生成，测试阶段，可临时使用 sdk 提供的 generateToken 方法生成，但为保证 AppKey 不暴露于公网，在生产环境中强烈建议自建服务，由服务器按规则生成 token 供 sdk 使用。

## 2. 监听流事件

```
client.on('stream-published', (stream) => {
    // 使用 HtmlMediaElement 播放媒体流。将流的 mediaStream 给 Video/Audio 元素的 srcObject 属性，即可播放，注意设置 autoplay 属性以支持视频的自动播放，其他属性请参见 [<video>](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/video)
    htmlMediaElement.srcObject = stream.mediaStream;
}); // 监听本地流发布成功事件，在当前用户执行 publish 后，与服务器经多次协商，成功后会触发此事件

client.on('stream-subscribed', (stream) => {
    // 使用 HtmlMediaElement 播放媒体流
    htmlMediaElement.srcObject = stream.mediaStream;
}); // 监听远端流订阅成功事件，在当前用户执行 subscribe 后，与服务器经多次协商，成功后会触发此事件

client.on('stream-added', (stream) => {
    client.subscribe(stream.sid);
}); // 监听新增远端流事件，在远端用户新发布流后，服务器会推送此事件的消息。注：当刚进入房间时，若房间已有的正在发布的流，也会通过此事件进行通知业务侧
```

## 3. 加入一个房间，然后发布本地流

```
client.joinRoom(roomId, userId, () => {
    client.publish();
}); // 在 joinRoom 的 onSuccess 回调函数中执行 publish 发布本地流
```

## 4. 取消发布本地流或取消订阅远端流

```
client.unpublish(pubStreamId);
client.unsubscibe(subStreamId);
```

## 5. 退出房间

```
client.leaveRoom();
```
