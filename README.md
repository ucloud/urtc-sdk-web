# UCloudRTC Web SDK API 说明

UCloudRTC 包含以下方法、类或对象：

* [Client 类](#client)
* [getDevices 方法](#getdevices)
* [getSupportProfileNames 方法](#getsupportprofilenames)
* [version 属性](#version)
* [generateToken 方法](#generateToken)
* [Logger 对象](#logger)
* [setServers 方法](#setservers)

> 注： 想要了解使用此 SDK 的简单步骤，请查看 [使用说明](./Manual.md)

---

<a name='client'></a>

## 一、Client 类

Client 类包含以下方法：

* [构建函数 - 创建客户端](#client-constructor)
* [joinRoom 方法 - 加入房间](#client-joinroom)
* [leaveRoom 方法 - 离开房间](#client-leaveroom)
* [publish 方法 - 发布本地流](#client-publish)
* [unpublish 方法 - 取消发布本地流](#client-unpublish)
* [subscribe 方法 - 订阅远端流](#client-subscribe)
* [unsubscribe 方法 - 取消订阅远端流](#client-unsubscribe)
* [on 方法 - 绑定事件处理函数](#client-on)
* [off 方法 - 解绑事件处理函数](#client-off)
* [muteAudio 方法 - 禁用音频轨道](#client-muteaudio)
* [unmuteAudio 方法 - 启用音频轨道](#client-unmuteaudio)
* [muteVideo 方法 - 禁用视频轨道](#client-mutevideo)
* [unmuteVideo 方法 - 启用视频轨道](#client-unmutevideo)
* [startRecording 方法 - 开启服务端录制](#client-startrecording)
* [stopRecording 方法 - 结束服务端录制](#client-stoprecording)
* [getUser 方法 - 获取当前用户信息](#client-getuser)
* [getUsers 方法 - 获取所有远端用户信息](#client-getusers)
* [getStream 方法 - 获取某条流信息](#client-getstream)
* [getLocalStreams 方法 - 获取所有本地流信息](#client-getlocalstreams)
* [getRemoteStreams 方法 - 获取所有远端流信息](#client-getremotestreams)
* [getStreams 方法 - 已废弃](#client-getstreams)
* [getMediaStream 方法 - 获取某条流对应的媒体流](#client-getmediastream)
* [getLocalMediaStream 方法 - 已废弃](#client-getlocalmediastream)
* [getRemoteMediaStream 方法 - 已废弃](#client-getremotemediastream)
* [getMicrophones 方法 - 获取麦克风设备信息](#client-getmicrophones)
* [getCameras 方法 - 获取摄像头设备信息](#client-getcameras)
* [getLoudspeakers 方法 - 获取扬声器设备信息](#client-getloudspeakers)
* [setVideoProfile 方法 - 设置视频属性](#client-setvideoprofile)
* [switchDevice 方法 - 切换音视频输入设备](#client-switchdevice)
* [switchScreen 方法 - 切换屏幕共享](#client-switchscreen)
* [switchImage 方法 - 切换图片推送](#client-switchimage)
* [getAudioVolume 方法 - 获取音频音量](#client-getaudiovolume)
* [setAudioVolume 方法 - 设置音频音量](#client-setaudiovolume)
* [getAudioStats 方法 - 获取音频状态](#client-getaudiostats)
* [getVideoStats 方法 - 获取视频状态](#client-getvideostats)
* [getNetworkStats 方法 - 获取网络状态](#client-getnetworkstats)
* [preloadEffect 方法 - 预加载音效文件](#client-preloadeffect)
* [unloadEffect 方法 - 卸载音效文件](#client-unloadeffect)
* [playEffect 方法 - 开始播放音效](#client-playeffect)
* [pauseEffect 方法 - 暂停播放音效](#client-pauseeffect)
* [resumeEffect 方法 - 恢复播放音效](#client-resumeeffect)
* [stopEffect 方法 - 停止播放音效](#client-stopeffect)
* [setEffectVolume 方法 - 设置播放音效的音量](#client-seteffectvolume)
* [snapshot 方法 - 截屏](#client-snapshot)
* [startPreviewing 方法 - 开启预览](#client-startpreviewing)
* [stopPreviewing 方法 - 停止预览](#client-stoppreviewing)
* [deviceDetection 方法 - 设备可用性检测](#client-devicedetection)

<a name="client-constructor"></a>

### 1. 构建函数

用于创建一个 URTC Client 对象，示例代码：

```
new Client(AppId, Token, Options);
```

#### 参数说明

- AppId: string 类型, 必传，可从 UCloud 控制台查看

- Token: string 类型, 必传，需按规则生成，测试阶段，可使用 [generateToken](#generateToken) 临时生成

- Options: object 类型, 选传，类型说明如下

```
{
  type?: "rtc"|"live",  // 选填，设置房间类型，有两种 "live" 和 "rtc" 类型可选 ，分别对应直播模式和连麦模式，默认为 rtc
  role?: "pull" | "push" | "push-and-pull",   // 选填，设置用户角色，可设 "pull" | "push" | "push-and-pull" 三种角色，分别对应拉流、推流、推+拉流，默认为 "push-and-pull"，特别地，当房间类型为连麦模式（rtc）时，此参数将被忽视，会强制为 "push-and-pull"，即推+拉流
  codec?: "vp8"|"h264", // 选填，设置视频编码格式，可设 "vp8" 或 "h264"，默认为 "vp8"，注：部分老版本浏览器不支持 vp8 的视频编解码时（譬如 macOS 10.14.4 平台的 Safar 12.1 及以上版本才支持 vp8），可选择 h264 编码格式
}
```

<a name="client-joinroom"></a>

### 2. joinRoom 方法

加入房间，示例代码：

```
client.joinRoom(RoomId, UserId, onSuccess, onFailure)
```

#### 参数说明

- RoomId: string 类型，必传，房间号

- UserId: string 类型，必传，用户ID

- onSuccess: function 类型，选传，方法调用成功时执行的回调函数，函数说明如下

```
function onSuccess(Users, Streams) {}
```

函数参数 Users 为返回值，User 类型的数组，代表当前房间内已有的其他用户的信息，User 类型说明见 [User](#user)；函数参数 Streams 为返回值，Stream 类型的数组，代表当前房间内其他用户正在发布的流。Stream 类型说明见 [Stream](#stream)

> 注：当加入房间成功后，当前房间内已有的其他用户的信息以及正在发布的流，都会分别由 `user-added` 和 `stream-added` 事件再进行通知。如需订阅正在发布的流，建议在 `stream-added` 事件函数中统一处理，此处 `onSuccess` 函数的参数 `Users` 和 `Streams` 数据仅用于展示。

- onFailure: 选传，函数类型，方法调用失败时执行的回调函数。

```
function(Err) {}
```
Err 为错误信息

<a name="client-leaveroom"></a>

### 3. leaveRoom 方法

离开房间，示例代码：

```
client.leaveRoom(onSuccess, onFailure)
```

#### 参数说明

- onSuccess: function 类型，选传，方法调用成功时执行的回调函数，函数说明如下

```
function onSuccess() {}
```

- onFailure: 选传，函数类型，方法调用失败时执行的回调函数。

```
function(Err) {}
```
Err 为错误信息

<a name="client-publish"></a>

### 4. publish 方法

发布本地流，自 1.4.0 版本开始支持同时发布两条流（且摄像头，屏幕共享各一条，不可同时为同一类），示例代码：

```
client.publish(Options, onFailure)
```

#### 参数说明

- Options: object 类型，选传，类型说明如下

```
{
  audio: boolean          // 必填，指定是否使用麦克风设备
  video: boolean          // 必填，指定是否使用摄像头设备
  screen: boolean         // 必填，指定是否为屏幕共享，audio, video, screen 不可同时为 true，更不可同时为 false
  microphoneId?: string   // 选填，指定使用的麦克风设备的ID，可通过 getMicrophones 方法查询获得该ID，不填时，将使用默认麦克风设备
  cameraId?: string       // 选填，指定使用的摄像头设备的ID，可以通过 getCameras 方法查询获得该ID，不填时，将使用默认的摄像头设备
  extensionId?: string    // 选填，指定使用的 Chrome 插件的 extensionId，可使 72 以下版本的 Chrome 浏览器进行屏幕共享。
}
```

> 对于屏幕共享各浏览器兼容性，请参见 [getDisplayMedia](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getDisplayMedia) 。
> 特别地，使用 Chrome 浏览器屏幕共享 Tab（浏览器标签）页时，有分享 Tab 页中音频功能（分享弹出框左下脚勾选，Chrome 74 及以上版本可不用安装插件）。
>
> 此外，可使用 audio, video, screen 的配置组合来满足不同场景，如 audio = true, video = false, screen = true 时，可发布麦克风的音频以及屏幕共享的视频流；audio = false，video = true, screen = true 时，可发布屏幕共享中的音频（当屏幕共享有音频时）以及摄像头采集的视频流；audio = false, video = false, screen = true 时，可发布屏幕共享中的音频以及视频（当屏幕共享有音频时）流。

- onFailure: 选传，函数类型，方法调用失败时执行的回调函数。

```
function(Err) {}
```
Err 为错误信息

<a name="client-unpublish"></a>

### 5. unpublish 方法

取消发布本地流，示例代码：

```
client.unpublish(StreamId, onSuccess, onFailure)
```

#### 参数说明
- StreamId: string 类型，选传，不传时，若仅有一条本地流，那么该流将被取消发布，若有两条本地流，那么最早发布的那条本地流将被取消发布

- onSuccess: function 类型，选传，方法调用成功时执行的回调函数，函数说明如下

```
function onSuccess(Stream) {}
```

函数参数 Stream 为返回值，object 类型，为流信息，类型说明见 [Stream](#stream)

- onFailure: 选传，函数类型，方法调用失败时执行的回调函数。

```
function(Err) {}
```
Err 为错误信息

<a name="client-subscribe"></a>

### 6. subscribe 方法

订阅远端流，，示例代码：

```
client.subscribe(StreamId, onFailure)
```

#### 参数说明

- StreamId: string 类型，必传，为需要订阅的远端流的 sid

- onFailure: 选传，函数类型，方法调用失败时执行的回调函数。

```
function(Err) {}
```
Err 为错误信息


<a name="client-unsubscribe"></a>

### 7. unsubscribe 方法

取消订阅远端流，示例代码：

```
client.unsubscribe(StreamId, onSuccess, onFailure)
```

#### 参数说明

- StreamId: string 类型，必传，为需要订阅的远端流的 sid

- onSuccess: function 类型，选传，方法调用成功时执行的回调函数，函数说明如下

```
function onSuccess(Stream) {}
```

函数参数 Stream 为返回值，object 类型，为流信息，类型说明见 [Stream](#stream)

- onFailure: 选传，函数类型，方法调用失败时执行的回调函数。

```
function(Err) {}
```
Err 为错误信息


<a name="client-on"></a>

### 8. on 方法

给事件绑定监听函数，示例代码：

```
client.on(EventType, Listener)
```

#### 参数说明

- EventType: string 类型， 必传，目前有 'user-added' | 'user-removed' |
  'stream-added'|'stream-removed'| 'stream-published' | 'stream-subscribed' |
  'mute-video' | 'unmute-video' | 'mute-audio' | 'unmute-audio' 这些事件可绑定监听函数
- Listener: function 类型，事件监听函数
  - 当事件类型为 'user-added' | 'user-removed' 时，可用 `function Listener(User) {}` 类型的函数，其中函数的参数类型见 [User](#user)
  - 当事件类型为 'stream-added'|'stream-removed'| 'stream-published' | 'stream-subscribed' | 'mute-video' | 'unmute-video' | 'mute-audio' | 'unmute-audio' 时，可用 `function Listener(Stream) {}` 类型的函数，其中函数的参数类型见 [Stream](#stream)


<a name="client-off"></a>

### 9. off 方法

解除绑定事件的监听函数，示例代码：

```
client.off(EventType, Listener)
```

#### 参数说明

- EventType: 参见 on 方法
- Listener: 为调用 on 方法时绑定的监听函数

<a name="client-muteaudio"></a>

### 10. muteAudio 方法

关闭流的音频，示例代码：

```
const result = client.muteAudio(StreamId)
```

#### 参数说明

- StreamId: string 类型，选传，指流的 ID

> 注：StreamId 不传时，为 mute 第一条发布流的音频，并会通知到其他用户；传时，为 mute StreamId 对应的发布或订阅流的音频，若为订阅流时，只是影响到本地订阅的流的音频，并不是指远端流推送或不推送音频。

#### 返回值说明

- result: boolean 类型，成功时为 true，失败时为 false


<a name="client-unmuteaudio"></a>

### 11. unmuteAudio 方法

启用流的音频，示例代码：

```
const result = client.unmuteAudio(StreamId)
```

#### 参数说明

- StreamId: string 类型，选传，指流的 ID

> 注：StreamId 不传时，为 unmute 第一条发布流的音频，并会通知到其他用户；传时，为 unmute StreamId 对应的发布或订阅流的音频，若为订阅流时，只是影响到本地订阅的流的音频，并不是指远端流推送或不推送音频。

#### 返回值说明

- result: boolean 类型，成功时为 true，失败时为 false


<a name="client-mutevideo"></a>

### 12. muteVideo 方法

关闭流的视频，示例代码：

```
const result = client.muteVideo(StreamId)
```

- StreamId: string 类型，选传，指流的 ID

> 注：StreamId 不传时，为 mute 第一条发布流的视频，并会通知到其他用户；传时，为 mute 对应的发布或订阅流的视频，若为订阅流时，只是影响到本地订阅的流的视频，并不是指远端流推送或不推送视频。

#### 返回值说明

- result: boolean 类型，成功时为 true，失败时为 false


<a name="client-unmutevideo"></a>

### 13. unmuteVideo 方法

启用流的视频，示例代码：

```
const result = client.unmuteVideo(StreamId)
```

- StreamId: string 类型，选传，指流的 ID

> 注：StreamId 不传时，为 unmute 发布流的视频，并会通知到其他用户；传时，为 unmute 对应的发布或订阅流的视频，若为订阅流时，只是影响到本地订阅的流的视频，并不是指远端流推送或不推送视频。

#### 返回值说明

- result: boolean 类型，成功时为 true，失败时为 false


<a name="client-startrecording"></a>

### 14. startRecording 方法

开始录制音视频，示例代码：

```
client.startRecording(RecordOptions, onSuccess, onFailure)
```

#### 参数说明

- RecordOptions: object 类型，必传，录制的配置信息，类型说明如下

```
{
  bucket: string  // 必传，存储的 bucket, URTC 使用 UCloud 的 UFile 产品进行在存储，相关信息见控制台操作文档
  region: string  // 必传，存储服务所在的地域
  waterMark?: WaterMarkOptions // 选传，水印的相关配置，不需要添加水印时，不用填写
  mixStream?: MixStreamOptions // 选传，混流的相关配置，无混流时，不用填写
}
```

WaterMarkOptions: object 类型，选传，添加的水印相关配置，类型说明如下

```
{
  position?: 'left-top' | 'left-bottom' | 'right-top' | 'right-bottom' // 选传，指定水印的位置，前面四种类型分别对应 左上，左下，右上，右下，默认 'left-top'
  type?: 'time' | 'image' | 'text' // 选传，水印类型，分别对应时间水印、图片水印、文字水印，默认为 'time'
  remarks?:  string,   // 选传，水印备注，当为时间水印时，传空字符串，当为图片水印时，此处需为图片的 URL（此时必传），当为文字水印时，此处需为水印文字
}
```

MixStreamOptions: object 类型，选传，混流相关配置，类型说明如下

```
{
  uid?: string,        // 选传，指定某用户的流作为主画面，不传时，默认为当前开启录制的用户的流作为主画面
  type?: 'screen' | 'camera',   // 选传，指定主画面使用的流的媒体类型（当同一用户推多路流时），不传时，默认使用 camera
  width?: number,      // 选传，设置混流后视频的宽度，不传时，默认为 1280
  height?: number,     // 选传，设置混流后视频的高度，不传时，默认为 720
  template?: number,   // 选传，指定混流布局模板，可使用 1-9 对应的模板，默认为 1
  isAverage?: boolean, // 选传，是否均分，均分对应平铺风格，不均分对应垂直风格，默认为 true
}
```

> 注：关于混流风格, 请参见详细的模板说明 [录制混流风格](https://github.com/UCloudDocs/urtc/blob/master/cloudRecord/RecordLaylout.md)

- onSuccess: function 类型，选传，方法调用成功时执行的回调函数，函数说明如下

```
function onSuccess(Record) {}
```

函数参数 Record 为返回值，object 类型，为流信息，类型说明如下

```
{
  FileName: string  // 录制到的文件的名称
  RecordId: string  // 录制 ID
}
```

- onFailure: 选传，函数类型，方法调用失败时执行的回调函数。

```
function(Err) {}
```
Err 为错误信息


<a name="client-stoprecording"></a>

### 15. stopRecording 方法

停止录制音视频，示例代码：

```
client.stopRecording(onSuccess, onFailure)
```

#### 参数说明

- onSuccess: function 类型，选传，方法调用成功时执行的回调函数，函数说明如下

```
function onSuccess() {}
```

- onFailure: 选传，函数类型，方法调用失败时执行的回调函数。

```
function(Err) {}
```
Err 为错误信息


<a name="client-getuser"></a>

### 16. getUser 方法

获取本地用户的信息，示例代码：

```
const result = client.getUser()
```

#### 返回值说明

- result: User 类型，类型说明如下

<a name='user'></a>

User:

```
{
  uid: string   // 为用户ID
}
```


<a name="client-getusers"></a>

### 17. getUsers 方法

获取当前加入房间的远端用户的信息，示例代码：

```
const result = client.getUsers()
```

#### 返回值说明

- result: User 类型的数组，User 类型说明见 [User](#user)


<a name="client-getstream"></a>

### 18. getStream 方法

获取单条发布（本地）/订阅（远端）流的信息，示例代码：

```
const result = client.getStream(StreamId)
```

#### 参数说明

- StreamId: string 类型，选传，流的 ID，当不传时，默认返回第一条发布流（当有两条发布流时）

#### 返回值说明

- result: Stream 类型或 undefined（未找到对应流），Stream 类型说明如下

<a name='stream'></a>

Stream:

```
{
  sid: string                     // 流ID
  uid: string                     // 对应的用户的ID
  type: 'publish'|'subscribe'     // 流类型，分别为 publish 和 subscribe 两种，
  video: boolean                  // 是否包含音频
  audio: boolean                  // 是否包含视频
  muteAudio: boolean              // 音频是否静音
  muteVideo: boolean              // 视频是否静音
  mediaType?: 'camera'|'screen'   // 流的媒体类型，当流为发布（本地）流时，存在两种媒体类型 'camera' 及 'screen'，且一种类型的流只能存在一个，以此来区分不同类型的发布流
  mediaStream?: MediaStream       // 使用的媒体流，可用 HTMLMediaElement 进行播放，此属性的值可能为空，当流被正常发布或订阅流，此值有效
}
```


<a name="client-getlocalstreams"></a>

### 19. getLocalStreams 方法

获取所有发布（本地）流的信息（ 1.4.0 及以上版本支持），示例代码：

```
const result = client.getLocalStreams()
```

#### 返回值说明

- result: Stream 类型的数组，Stream 类型说明见 [Stream](#stream)

<a name="client-getremotestreams"></a>

### 20. getRemoteStreams 方法

获取所有订阅流（远端流）的信息（ 1.4.0 及以上版本支持），示例代码：

```
const result = client.getRemoteStreams()
```

#### 返回值说明

- result: Stream 类型的数组，Stream 类型说明见 [Stream](#stream)

<a name="client-getstreams"></a>

### getStreams 方法 - 已废弃

获取订阅流（远端流）的信息，1.4.0 及以上版本请使用 [getRemoteStreams](#client-getremotestreams)


<a name="client-getmediastream"></a>

### 21. getMediaStream 方法

获取发布（本地）/ 订阅（远端）流对应的媒体流（ 1.4.0 及以上版本支持），获取后，可通过 HtmlMediaElement（如：[video](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/video)）进行播放，示例代码：

```
const result = client.getMediaStream(StreamId)
```

#### 参数说明

- StreamId: string 类型，选传，流的 ID，当不传时，默认返回第一条发布流（当有两条发布流时），传时，返回 StreamId 对应的发布或订阅流的的媒体流

#### 返回值说明

- result: MediaStream 类型，类型说明见 [MediaStream](https://developer.mozilla.org/en-US/docs/Web/API/MediaStream)


<a name="client-getlocalmediastream"></a>

### getLocalMediaStream 方法 - 已废弃

获取发布流对应的媒体流，1.4.0 及以上版本请使用 [getMediaStream](#client-getmediastream)


<a name="client-getremotemediastream"></a>

### getRemoteMediaStream 方法 - 已废弃

获取订阅流对应的媒体流，1.4.0 及以上版本请使用 [getMediaStream](#client-getmediastream)


<a name="client-getmicrophones"></a>

### 22. getMicrophones 方法

获取麦克风设备，示例代码：

> 注：若站点未经过用户授权浏览器使用麦克风设备，会弹出提示要求用户进行授权

```
client.getMicrophones(onSuccess, onFailure)
```

#### 参数说明

- onSuccess: function 类型，选传，方法调用成功时执行的回调函数，函数说明如下

```
function onSuccess(MediaDeviceInfos) {}
```

函数参数 MediaDeviceInfos 为返回值，为 MediaDeviceInfo 类型的数组，点击 [MediaDeviceInfo](https://developer.mozilla.org/en-US/docs/Web/API/MediaDeviceInfo) 查看 MediaDeviceInfo 详情


- onFailure: 选传，函数类型，方法调用失败时执行的回调函数。

```
function(Err) {}
```
Err 为错误信息


<a name="client-getcameras"></a>

### 23. getCameras 方法

获取摄像头设备，示例代码：

> 注：若站点未经过用户授权浏览器使用摄像头设备，会弹出提示要求用户进行授权

```
client.getCameras(onSuccess, onFailure)
```

#### 参数说明

- onSuccess: function 类型，选传，方法调用成功时执行的回调函数，函数说明如下

```
function onSuccess(MediaDeviceInfos) {}
```

函数参数 MediaDeviceInfos 为返回值，为 MediaDeviceInfo 类型的数组，点击 [MediaDeviceInfo](https://developer.mozilla.org/en-US/docs/Web/API/MediaDeviceInfo) 查看 MediaDeviceInfo 详情


- onFailure: 选传，函数类型，方法调用失败时执行的回调函数。

```
function(Err) {}
```
Err 为错误信息


<a name="client-getloudspeakers"></a>

### 24. getLoudspeakers 方法

获取音响/声音输出设备，示例代码：

> 注：若站点未经过用户授权浏览器使用音频设备，会弹出提示要求用户进行授权

```
client.getLoudspeakers(onSuccess, onFailure)
```

#### 参数说明

- onSuccess: function 类型，选传，方法调用成功时执行的回调函数，函数说明如下

```
function onSuccess(MediaDeviceInfos) {}
```

函数参数 MediaDeviceInfos 为返回值，为 MediaDeviceInfo 类型的数组，点击 [MediaDeviceInfo](https://developer.mozilla.org/en-US/docs/Web/API/MediaDeviceInfo) 查看 MediaDeviceInfo 详情


- onFailure: 选传，函数类型，方法调用失败时执行的回调函数。

```
function(Err) {}
```
Err 为错误信息


<a name="client-setvideoprofile"></a>

### 25. setVideoProfile 方法

设置视频的 profile（通过getSupportProfileNames获取到视频质量的值）限制 client 使用的视频大小、帧率、带宽等，setVideoProfile须在publish之前设置。示例代码：

```
client.setVideoProfile(Profile, onSuccess, onFailure)
```

#### 参数说明

- onSuccess: function 类型，选传，方法调用成功时执行的回调函数，函数说明如下

```
function onSuccess() {}
```

- onFailure: 选传，函数类型，方法调用失败时执行的回调函数。

```
function(Err) {}
```
Err 为错误信息


<a name="client-switchdevice"></a>

### 26. switchDevice 方法

当发布（本地）流已经发布，可通过此方法在不中断当前发布的情况下，用指定的音视频设备采集的音视频流代替正在发布的音视频流，示例代码：

```
client.switchDevice(SwitchDeviceOptions, onSuccess, onFailure)
```

#### 参数说明

- SwitchDeviceOptions: object 类型，必传，详细类型说明如下

```
{
  streamId?: string       // 选填，发布（本地）流的 ID，不填时，为第一条发布流
  type: 'audio' | 'video' // 必填，指定音频或视频设备
  deviceId: string        // 必填，设备 ID
}
```

- onSuccess: function 类型，选传，方法调用成功时执行的回调函数，函数说明如下

```
function onSuccess() {}
```
- onFailure: 选传，函数类型，方法调用失败时执行的回调函数。

```
function(Err) {}
```
Err 为错误信息


<a name="client-switchscreen"></a>

### 27. switchScreen 方法

当本地流已经发布，可通过此方法在不中断当前发布的情况下，用屏幕共享来代替正在发布的音频（若屏幕共享包含音频）视频流，示例代码：

```
client.switchScreen(StreamId, onSuccess, onFailure)
```

#### 参数说明

- StreamId: string 类型，选传，不传时，为第一条发布流

- onSuccess: function 类型，选传，方法调用成功时执行的回调函数，函数说明如下

```
function onSuccess() {}
```
- onFailure: 选传，函数类型，方法调用失败时执行的回调函数。

```
function(Err) {}
```
Err 为错误信息


<a name="client-switchimage"></a>

### 28. switchImage 方法

当本地流已经发布，可通过此方法在不中断当前发布的情况下，用静态图片来代替正在发布的视频流，示例代码：

```
client.switchImage(SwitchImageOptions, onSuccess, onFailure)
```

#### 参数说明

- SwitchImageOptions: object 类型，必传，详细类型说明如下

```
{
  streamId?: string       // 选填，发布（本地）流的 ID，不填时，为第一条发布流
  filePath: string        // 必填，指图片文件的路径（URL)，支持以下图片格式：PNG，JPEG 以及浏览器支持的其他图片格式，注：当图片文件为其他站点的网络文件时，可能会有跨域访问问题
}
```

- onSuccess: function 类型，选传，方法调用成功时执行的回调函数，函数说明如下

```
function onSuccess() {}
```
- onFailure: 选传，函数类型，方法调用失败时执行的回调函数。

```
function(Err) {}
```
Err 为错误信息


<a name="client-getaudiovolume"></a>

### 29. getAudioVolume 方法

获取音频的音量，返回值范围 [0,100]，示例代码：

```
client.getAudioVolume(StreamId)
```

#### 参数说明

- StreamId: string 类型，选传，本地或远端流的 ID 即 [Stream](#stream) 的 sid 属性值，当不传时，默认获取第一条本地流的音量大小

<a name="client-setaudiovolume"></a>

### 30. setAudioVolume 方法

设置音频的音量，可设置的音量范围 [0,100]，示例代码：

```
client.setAudioVolume(AudioVolumeOptions, callback)
```

#### 参数说明

- AudioVolumeOptions: object 类型，必传，详细类型说明如下

```
{
  streamId?: string   // 选填，发布/订阅流的 ID，不填时，为第一条发布流
  element?: HTMLMediaElement // 播放媒体流的 DOM 元素，当需要设置音量的流为发布（本地）流时，不填，为订阅（远端）流，必填
  volume: number      // 必填，音量大小，取值范围 [0, 100]
}
```

- callback: function 类型，选传，方法的回调函数，函数说明如下

```
function callback(Err) {}
```
Err 为返回值，为空时，说明已执行成功，否则执行失败，值为执行失败的错误信息


<a name="client-getaudiostats"></a>

### 31. getAudioStats 方法

获取流的音频状态，示例代码：

```
client.getAudioStats(StreamId, onSuccess, onFailure)
```

#### 参数说明

- StreamId: string 类型，选传，本地或远端流的 ID 即 [Stream](#stream) 的 sid 属性值，当不传时，默认获取第一条本地流的音频状态
  
- onSuccess: function 类型，选传，方法调用成功时执行的回调函数，函数说明如下

```
function onSuccess(AudioStats) {}
```
函数参数 AudioStats 为返回值，为 object 类型，类型说明如下：

```
{
  br: number        // 码率
  lostpre: number   // 丢包率
  vol: number       // 声音大小
  mime: string      // 编码格式，固定为 opus
}
```

- onFailure: 选传，函数类型，方法调用失败时执行的回调函数。

```
function(Err) {}
```
Err 为错误信息


<a name="client-getvideostats"></a>

### 32. getVideoStats 方法

获取流的视频状态，示例代码：

```
client.getVideoStats(StreamId, onSuccess, onFailure)
```

#### 参数说明

- StreamId: string 类型，选传，本地或远端流的 ID 即 [Stream](#stream) 的 sid 属性值，当不传时，默认获取第一条本地流的视频状态
  
- onSuccess: function 类型，选传，方法调用成功时执行的回调函数，函数说明如下

```
function onSuccess(VideoStats) {}
```
函数参数 VideoStats 为返回值，为 object 类型，类型说明如下：

```
{
  br: number        // 码率
  lostpre: number   // 丢包率
  frt: number       // 帧率
  w: number         // 视频宽度
  h: number         // 视频高度
  mime: string      // 编码格式，'vp8' 或 'h264'
}
```

- onFailure: 选传，函数类型，方法调用失败时执行的回调函数。

```
function(Err) {}
```
Err 为错误信息


<a name="client-getnetworkstats"></a>

### 33. getNetworkStats 方法

获取流的网络状态，示例代码：

```
client.getNetworkStats(StreamId, onSuccess, onFailure)
```

#### 参数说明

- StreamId: string 类型，可选，本地或远端流的 ID 即 [Stream](#stream) 的 sid 属性值，当不传时，默认获取第一条本地流的网络状态
  
- onSuccess: function 类型，选传，方法调用成功时执行的回调函数，函数说明如下

```
function onSuccess(NetworkStats) {}
```
函数参数 NetworkStats 为返回值，为 object 类型，类型说明如下：

```
{
  rtt: number   //  往返时延，单位 ms
}
```

- onFailure: 选传，函数类型，方法调用失败时执行的回调函数。

```
function(Err) {}
```
Err 为错误信息

<a name="client-preloadeffect"></a>

### 34. preloadEffect 方法

预加载音效资源，示例代码：

```
client.preloadEffect(EffectId, FilePath, callback)
```

#### 参数说明

- EffectId: number 类型，必传，指音效资源 ID，须唯一，用于区分不同的音效资源

- FilePath: string 类型，必传，指音效文件的路径（URL)，支持以下音频格式：MP3，AAC 以及浏览器支持的其他音频格式。此外，音效文件不应过大，否则可能会影响通信的流畅性，注：当音效文件为其他站点的网络文件时，可能会有跨域访问问题

- callback: function 类型，选传，方法的回调函数，函数说明如下

```
function callback(Err) {}
```
Err 为返回值，为空时，说明已执行成功，否则执行失败，值为执行失败的错误信息

<a name="client-unloadeffect"></a>

### 35. unloadEffect 方法

卸载音效资源，示例代码：：

```
client.unloadEffect(EffectId)
```

#### 参数说明

- EffectId: number 类型，必传，指音效资源 ID，须唯一，用于区分不同的音效资源

<a name="client-playeffect"></a>

### 36. playEffect 方法

播放音效，示例代码：

```
client.playEffect(EffectOptions, callback)
```

#### 参数说明

<a name='effectoptions'></a>

- EffectOptions: object 类型，必传，详细类型说明如下

```
{
  streamId?: string   // 选填，发布（本地）流的 ID，不填时，为第一条发布流
  effectId: number    // 必填，音效资源 ID
  filePath?: string   // 选填，音效文件的路径，当音效文件已经使用 preloadEffect 进行预加载后，可不填此项
  loop?: boolean      // 选填，是否循环播放音效，默认不循环
  playTime?: number   // 选填，音效从 playTime 秒处开始播放，默认为0，即从头开始
  replace?: boolean   // 选填，是否替换当前音轨，即只使用音效，不混音，默认不替换
}
```

- callback: function 类型，选传，方法的回调函数，函数说明如下

```
function callback(Err) {}
```
Err 为返回值，为空时，说明已执行成功，否则执行失败，值为执行失败的错误信息

<a name="client-pauseeffect"></a>

### 37. pauseEffect 方法

暂停播放音效，示例代码：

```
client.pauseEffect(Options, callback)
```

#### 参数说明

- Options: object 类型, 必传，详细的类型说明如下

```
{
  streamId?: string   // 选填，发布（本地）流的 ID，不填时，为第一条发布流
  effectId: number    // 必填，音效资源 ID
}
```

- callback: function 类型，选传，方法的回调函数，函数说明如下

```
function callback(Err) {}
```
Err 为返回值，为空时，说明已执行成功，否则执行失败，值为执行失败的错误信息

<a name="client-resumeeffect"></a>

### 38. resumeEffect 方法

恢复播放音效，示例代码：

```
client.resumeEffect(Options, callback)
```

#### 参数说明

- Options: object 类型, 必传，详细的类型说明如下

```
{
  streamId?: string   // 选填，发布（本地）流的 ID，不填时，为第一条发布流
  effectId: number    // 必填，音效资源 ID
}
```

- callback: function 类型，选传，方法的回调函数，函数说明如下

```
function callback(Err) {}
```
Err 为返回值，为空时，说明已执行成功，否则执行失败，值为执行失败的错误信息


<a name="client-stopeffect"></a>

### 39. stopEffect 方法

停止播放音效，示例代码：

```
client.stopEffect(Options, callback)
```

#### 参数说明

- Options: object 类型, 必传，详细的类型说明如下

```
{
  streamId?: string   // 选填，发布（本地）流的 ID，不填时，为第一条发布流
  effectId: number    // 必填，音效资源 ID
}
```

- callback: function 类型，选传，方法的回调函数，函数说明如下

```
function callback(Err) {}
```
Err 为返回值，为空时，说明已执行成功，否则执行失败，值为执行失败的错误信息

<a name="client-seteffectvolume"></a>

### 40. setEffectVolume 方法

设置正在播放的音效的音量大小，示例代码：

```
client.setEffectVolume(Options, callback)
```

#### 参数说明

- Options: object 类型, 必传，详细的类型说明如下

```
{
  streamId?: string   // 选填，发布（本地）流的 ID，不填时，为第一条发布流
  effectId: number    // 必填，音效资源 ID
  volume: number      // 必填，音量大小，取值范围 [0, 100]
}
```

- callback: function 类型，选传，方法的回调函数，函数说明如下

```
function callback(Err) {}
```
Err 为返回值，为空时，说明已执行成功，否则执行失败，值为执行失败的错误信息

<a name="client-snapshot"></a>

### 41. snapshot 方法

可将指定的发布（本地）/订阅（远端）流截屏用于页面展示，或下载截屏图片，示例代码：

```
client.snapshot(SnapshotOptions, onSuccess, onFailure);
```

> 注：为保证 API 的易用性，此 API 自 1.4.0 版本进行了重新设计，由于无法做到向前（ 1.3.7 - 1.3.10 版本）兼容，请使用 1.3.7 - 1.3.10 版本的用户调整调用方式。

#### 参数说明

- SnapshotOptions: object 类型，选传，详细的类型说明如下

```
{
  streamId?: string             // 选填，发布/订阅流的 ID，不填时，为第一条发布流，
  download?: boolean 或 string  // 选填，是否要下载图片，或指定下载图片的文件名，传 true 时，可将截屏下载到本地（文件名自动生成），传非空字符串时，将会以该字符串命名下载时保存到本地的图片名，不传或传 false 或空字符串时，都将不下载图片
}
```

- onSuccess: function 类型，选传，方法调用成功时执行的回调函数，函数说明如下

```
function onSuccess(ImgString) {}
```

ImgString: string 类型，是图片转化的 base64 编码的 [Data URLs](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/data_URIs)，可将其赋值给 Image 元素 - 详见 [HTMLImageElement](https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLImageElement) 的 src 属性。


- onFailure: 选传，函数类型，方法调用失败时执行的回调函数。

```
function(Err) {}
```
Err 为错误信息

<a name="client-startpreviewing"></a>

### 42. startPreviewing 方法

启动预览，示例代码：

```
client.startPreviewing(PreviewOptions, onSuccess, onFailure);
```

#### 参数说明

- PreviewOptions: object 类型，选传，详细的类型说明如下

```
{
  audio: boolean          // 必填，指定是否使用麦克风设备
  video: boolean          // 必填，指定是否使用摄像头设备
  microphoneId?: string   // 选填，指定使用的麦克风设备的ID，可通过 getMicrophones 方法查询获得该ID，不填时，将使用默认麦克风设备
  cameraId?: string       // 选填，指定使用的摄像头设备的ID，可以通过 getCameras 方法查询获得该ID，不填时，将使用默认的摄像头设备
}
```

- onSuccess: function 类型，选传，方法调用成功时执行的回调函数，函数说明如下

```
function onSuccess(result) {}
```

- result: MediaStream 类型，类型说明见 [MediaStream](https://developer.mozilla.org/en-US/docs/Web/API/MediaStream)，可通过 HtmlMediaElement（如：[video](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/video)）进行播放

- onFailure: 选传，函数类型，方法调用失败时执行的回调函数。

```
function(Err) {}
```
Err 为错误信息

<a name="client-stoppreviewing"></a>

### 43. stopPreviewing 方法

停止预览，示例代码：

```
client.stopPreviewing();
```

<a name="client-devicedetection"></a>

### 44. deviceDetection 方法

发布本地流或启动预览时，有可能因为麦克风或摄像头设备问题（如驱动问题，或未经授权等），导致无法正常发布或预览。此方法可用于发布或预览前的设备检测，根据检测结果，再自行决定在发布或预览时启用麦克风或摄像头或麦克风和摄像头，示例代码：

```
client.deviceDetection(DeviceDetectionOptions, callback);
```

#### 参数说明

- DeviceDetectionOptions: object 类型, 必传，详细的类型说明如下

```
{
  audio: boolean          // 必填，指定是否检测麦克风设备
  video: boolean          // 必填，指定是否检测摄像头设备
  microphoneId?: string   // 选填，指定需要检测的麦克风设备的ID，可通过 getMicrophones 方法查询获得该ID，不填时，将检测默认的麦克风设备
  cameraId?: string       // 选填，指定需要检测的摄像头设备的ID，可以通过 getCameras 方法查询获得该ID，不填时，将检测默认的摄像头设备
}
```

- callback: function 类型，必传，方法的回调函数，函数说明如下

```
function callback(Result) {
  if (Result.audio && Result.video) {
    // 麦克风和摄像头都可有和，发布或预览时可启用麦克风和摄像头
    // client.publish({audio: true, video: true});
  } else if (Result.audio) {
    // 麦克风可用，发布或预览时能启用麦克风
    // client.publish({audio: true, video: false});
  } else if (Result.video) {
    // 摄像头可用，发布或预览时能启用摄像头
    // client.publish({audio: false, video: true});
  } else {
    // 麦克风和摄像头都不可用
  }
}
```

Result 为返回值，object 类型，详细的类型说明如下

```
{
  audio: boolean, // 指麦克风设备是否可用
  video: boolean  // 指摄像头设备是否可用
}
```

----

<a name='getdevices'></a>

## 二、getDevices 方法

用于获取当前浏览器可访问的音视频设备的设备信息，包括麦克风、摄像头、音频输出设备

> 注：若站点未经过用户授权浏览器使用麦克风、摄像头、音频输出设备，会弹出提示要求用户进行授权

```
UCloudRTC.getDevices(onSuccess, onFailure)
```

#### 参数说明

- onSuccess: 必传，函数类型，方法调用成功时执行的回调函数。

```
function(MediaDeviceInfos) {}
```

函数参数 MediaDeviceInfos 为返回值，MediaDeviceInfo 类型的数组，为一组输入、输出设备的描述信息，点击
[MediaDeviceInfo](https://developer.mozilla.org/en-US/docs/Web/API/MediaDeviceInfo) 查看其详情。

- onFailure: 选传，函数类型，方法调用失败时执行的回调函数。

```
function(Err) {}
```
Err 为错误信息

----

<a name='getsupportprofilenames'></a>

## 三、getSupportProfileNames 方法

用于获取当前 SDK 支持的视频质量的名称

```
const profileNames = UCloudRTC.getSupportProfileNames();
```

#### 返回值说明

profileNames: String 类型的数组，如当前可用的 ["240\*180", "480\*360", "640\*360", "640\*480", "1280\*720", "1920\*1080"]

名称 | 视频宽高 | 帧率 | 视频最大带宽
:-: | :-: | :-: | :-:
"240\*180" | 240\*180 | 20 | 200
"480\*360" | 480\*360 | 20 | 300
"640\*360" | 640\*360 | 20 | 400
"640\*480" | 640\*480 | 20 | 500
"1280\*720" | 1280\*720 | 20 | 1000
"1920\*1080" | 1920\*1080 | 20 | 1500

---

<a name='version'></a>

## 四、version 属性

version 属性用于显示当前 sdk 的版本

---

<a name='generateToken'></a>

## generateToken 方法

generateToken 方法仅用于试用 URTC 产品时替代服务器生成 sdk 所需 token 的方法，正式使用 URTC 产品时，需要搭建后台服务按规则生成 token

```
const token = UCloudRTC.generateToken(AppId, AppKey, RoomId, UserId);
```

#### 参数说明

- AppId: string 类型, 必传，可从 UCloud 控制台查看

- AppKey: string 类型, 必传，可从 UCloud 控制台查看（请注意此 AppKey 不可暴露给其他人）

- RoomId: string 类型, 必传，将要加入的房间的 ID

- UserId: string 类型，必传，将要加入的用户的 ID

---

<a name='logger'></a>

## 六、Logger 对象

Logger 对象用于调试时打印内部日志，包含以下方法：

* [setLogLevel 方法](#logger-setloglevel)
* [debug 方法](#logger-debug)
* [info 方法](#logger-info)
* [warn 方法](#logger-warn)
* [error 方法](#logger-error)

<a name='logger-setloglevel'></a>

### 1. setLogLevel 方法

用于设置 Logger 打印日志的级别

```
Logger.setLogLevel(Level)
```

#### 参数说明

Level: 必传，有 "debug" | "info" | "warn" | "error" 四个日志级别，默认为 "warn" 级别

<a name='logger-debug'></a>

### 2. debug 方法

用于调试代码时，打印 debug 日志

```
Logger.debug(a, ...)  // 可传任意数量的任意类型的变量作为参数
```

<a name='logger-info'></a>

### 3. info 方法

<a name='logger-warn'></a>

### 4. warn 方法

<a name='logger-error'></a>

### 5. error 方法

以上三种方法分别打印对应级别的日志，使用方法与 debug 方法相同

---

<a name='setservers'></a>

## 七、setServers 方法

可配置 URTC 服务的域名，用于私有化部署，目前有房间服务器和日志服务器的两种域名可进行配置，示例代码：

```
UCloudRTC.setServers({
  api: "https://env1.urtc.com",   // api 为 URTC 房间服务的访问域名
  log: "https://env1.urtclog.com" // log 为 URTC 日志服务器的访问域名
})
```
