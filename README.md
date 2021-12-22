# Web SDK

可参考 **[使用说明](./Manual.md)**，并了解使用此 SDK 的简单步骤。
 
## API

以下仅展示**基本的 API 说明**，更详细的 API 及类型说明，请参见 **[Docs](https://ucloud.github.io/urtc-sdk-web)**。

### 主要的类或接口
* [Client](#client) - RTC 客户端，可进行加入、离开房间，发布、订阅流等操作
* [Stream](#stream) - 本地流与远端流的父类
* [LocalStream](#localstream) - 本地流，可用于本地预览，也可用 client 进行发布
* [RemoteStream](#remotestream) - 远端流，房间内其他用户发布的流，可通过 client 进行订阅
* [User](#user) - 用户信息
* [RtcError](https://ucloud.github.io/urtc-sdk-web/classes/rtcerror.html) - 错误信息
* RtcEvent - 事件，主要有以下几类
  *  [RtcUserEvent](https://ucloud.github.io/urtc-sdk-web/index.html#rtcuserevent)
  *  [RtcStreamEvent](https://ucloud.github.io/urtc-sdk-web/index.html#rtcstreamevent)
  *  [RtcPlayerEvent](https://ucloud.github.io/urtc-sdk-web/index.html#rtcplayerevent)
  *  [RtcConnectionEvent](https://ucloud.github.io/urtc-sdk-web/index.html#rtcconnectionevent)

### 全局属性或方法
* [version](https://ucloud.github.io/urtc-sdk-web/index.html#version) - 当前 sdk 的版本号
* [createClient](https://ucloud.github.io/urtc-sdk-web/index.html#createclient) - 创建客户端
* [createStream](https://ucloud.github.io/urtc-sdk-web/index.html#createstream) - 创建本地流
* [deviceDetection](https://ucloud.github.io/urtc-sdk-web/index.html#devicedetection) - 设备可用性检测，创建包含麦克风音频或摄像头视频的本地流时，有可能因为麦克风或摄像头设备问题（如驱动问题，或未经授权等），导致无法正确创建。此方法可用于设备检测，根据检测结果，再决定创建本地流时启用麦克风或摄像头或麦克风和摄像头
* [generateToken](https://ucloud.github.io/urtc-sdk-web/index.html#generatetoken) - 根据 AppId，AppKey，RoomId，UserId 生成 token，用于开发阶段临时快速的加入房间并验证功能，由于 AppKey 不可暴露于公网，因此生产环境中不建议使用此方法生成 token
* [getCameras](https://ucloud.github.io/urtc-sdk-web/index.html#getcameras) - 获取摄像头设备列表
* [getDevices](https://ucloud.github.io/urtc-sdk-web/index.html#getdevices) - 获取音视频输入/输出设备列表
* [getLoudspeakers](https://ucloud.github.io/urtc-sdk-web/index.html#getloudspeakers) - 获取扬声器设备列表
* [getMicrophones](https://ucloud.github.io/urtc-sdk-web/index.html#getmicrophones) - 获取麦克风设备列表
* [isSupportScreenShare](https://ucloud.github.io/urtc-sdk-web/index.html#issupportscreenshare) - 检测浏览器是否支持屏幕共享
* [isSupportWebRTC](https://ucloud.github.io/urtc-sdk-web/index.html#issupportwebrtc) - 检测浏览器是否完全（可访问本地音视频设备）支持 WebRTC
* [getSupportedCodec](https://ucloud.github.io/urtc-sdk-web/index.html#getsupportedcodec) - 检测浏览器支持的WebRTC的音视频编解码格式
* [enableUploadLog](https://ucloud.github.io/urtc-sdk-web/index.html#enableuploadlog) - 开启日志（操作/错误/状态）的上报
* [disableUploadLog](https://ucloud.github.io/urtc-sdk-web/index.html#disableuploadlog) - 关闭日志（操作/错误/状态）的上报
* [setLogLevel](https://ucloud.github.io/urtc-sdk-web/index.html#setloglevel) - 设置日志打印级别，用于打印出更多日志来调试或定位问题
* [setServers](https://ucloud.github.io/urtc-sdk-web/index.html#setservers) - 用于私有化部署时，指定部署的服务器地址

<a name="client"></a>

### Client

Client 对象包含以下方法：

* [getLocalStreams](https://ucloud.github.io/urtc-sdk-web/classes/client.html#getlocalstreams) - 获取当前 Client 已发布的本地流
* [getRemoteStreams](https://ucloud.github.io/urtc-sdk-web/classes/client.html#getremotestreams) - 获取当前 Client 已接收到的远端流（包含已订阅或未订阅的远端流）
* [getRemoteUsers](https://ucloud.github.io/urtc-sdk-web/classes/client.html#getremoteusers) - 获取远端用户信息
* [join](https://ucloud.github.io/urtc-sdk-web/classes/client.html#join) - 加入房间
* [leave](https://ucloud.github.io/urtc-sdk-web/classes/client.html#leave) - 离开房间
* [off](https://ucloud.github.io/urtc-sdk-web/classes/client.html#off) - 取消监听 Client 对象的事件
* [on](https://ucloud.github.io/urtc-sdk-web/classes/client.html#on) - 监听 Client 对象的事件，可监听的事件类型有 [RtcConnectionEventType](https://ucloud.github.io/urtc-sdk-web/index.html#rtcconnectioneventtype)、[RtcStreamEventType](https://ucloud.github.io/urtc-sdk-web/index.html#rtcstreameventtype)、[RtcUserEventType](https://ucloud.github.io/urtc-sdk-web/index.html#rtcusereventtype)
* [publish](https://ucloud.github.io/urtc-sdk-web/classes/client.html#publish) - 发布一条本地流
* [setRole](https://ucloud.github.io/urtc-sdk-web/classes/client.html#setrole) - 修改用户角色
* [subscribe](https://ucloud.github.io/urtc-sdk-web/classes/client.html#subscribe) - 订阅一条远端流
* [unpublish](https://ucloud.github.io/urtc-sdk-web/classes/client.html#unpublish) - 取消发布一条本地流
* [unsubscribe](https://ucloud.github.io/urtc-sdk-web/classes/client.html#unsubscribe) - 取消订阅一条远端流

<a name="stream"></a>

### Stream

Stream 为 LocalStream 及 RemoteStream 的父类

<a name="localstream"></a>

### LocalStream

LocalStream 对象包含以下属性：

* [audioMuted](https://ucloud.github.io/urtc-sdk-web/classes/localstream.html#audiomuted) - 当前流是否 mute 了音频
* [id](https://ucloud.github.io/urtc-sdk-web/classes/localstream.html#id) - 当前流ID
* [mediaStream](https://ucloud.github.io/urtc-sdk-web/classes/localstream.html#mediastream) - 当前流包含的媒体流，关于媒体流，请详见 [MediaStream](https://developer.mozilla.org/en-US/docs/Web/API/MediaStream)
* [videoMuted](https://ucloud.github.io/urtc-sdk-web/classes/localstream.html#videomuted) - 当前流是否 mute 了视频

LocalStream 对象包含以下方法：

* [addTrack](https://ucloud.github.io/urtc-sdk-web/classes/localstream.html#addtrack) - 添加一条媒体轨道（音轨或视轨）到当前流
* [destroy](https://ucloud.github.io/urtc-sdk-web/classes/localstream.html#destroy) - 销毁当前流，一般在本地流不再被使用时，可调用此方法销毁，解除摄像头或麦克风设备的占用
* [getAudioLevel](https://ucloud.github.io/urtc-sdk-web/classes/localstream.html#getaudiolevel) - 获取当前流的音量大小，只有当本地流或远端流中有音频数据才有效
* [getMediaType](https://ucloud.github.io/urtc-sdk-web/classes/localstream.html#getmediatype) - 获取流的媒体类型，主视频流/辅助视频流
* [getStats](https://ucloud.github.io/urtc-sdk-web/classes/localstream.html#getstats) - 获取流发布或订阅后的统计数据
* [hasAudio](https://ucloud.github.io/urtc-sdk-web/classes/localstream.html#hasaudio) - 判断当前流是否有音频
* [hasVideo](https://ucloud.github.io/urtc-sdk-web/classes/localstream.html#hasvideo) - 判断当前流是否有视频
* [init](https://ucloud.github.io/urtc-sdk-web/classes/localstream.html#init) - 初始化本地流对象，将读取麦克风、摄像头、屏幕共享等来初始化媒体流
* [muteAudio](https://ucloud.github.io/urtc-sdk-web/classes/localstream.html#muteaudio) - mute 当前流的音频
* [muteVideo](https://ucloud.github.io/urtc-sdk-web/classes/localstream.html#mutevideo) - mute 当前流的视频
* [off](https://ucloud.github.io/urtc-sdk-web/classes/localstream.html#off) - 取消监听流对象事件
* [on](https://ucloud.github.io/urtc-sdk-web/classes/localstream.html#on) - 监听流对象事件，可监听的事件类型有 [RtcStreamEventType](https://ucloud.github.io/urtc-sdk-web/index.html#rtcstreameventtype)、[RtcPlayerEventType](https://ucloud.github.io/urtc-sdk-web/index.html#rtcplayereventtype)
* [play](https://ucloud.github.io/urtc-sdk-web/classes/localstream.html#play) - 播放当前流
* [removeTrack](https://ucloud.github.io/urtc-sdk-web/classes/localstream.html#removetrack) - 从当前流中删除一条媒体轨道（音轨或视轨）
* [replaceTrack](https://ucloud.github.io/urtc-sdk-web/classes/localstream.html#replacetrack) - 替换当前流中的媒体轨道
* [resume](https://ucloud.github.io/urtc-sdk-web/classes/localstream.html#resume) - 恢复播放流，一般由于浏览器限制无法自动播放时，可提示用户手动触发该方法进行恢复播放
* [setScreenProfile](https://ucloud.github.io/urtc-sdk-web/classes/localstream.html#setscreenprofile) - 设置当前流（屏幕共享时）视频的 Profile，默认 '1080p'
* [setVideoProfile](https://ucloud.github.io/urtc-sdk-web/classes/localstream.html#setvideoprofile) - 设置当前流视频的 Profile，默认 '360p_2'
* [snapshot](https://ucloud.github.io/urtc-sdk-web/classes/localstream.html#snapshot) - 对当前流进行截屏
* [stop](https://ucloud.github.io/urtc-sdk-web/classes/localstream.html#stop) - 停止播放当前流
* [switchDevice](https://ucloud.github.io/urtc-sdk-web/classes/localstream.html#switchdevice) - 切换音视频设备
* [switchImage](https://ucloud.github.io/urtc-sdk-web/classes/localstream.html#switchimage) - 切换图片 - 使用图片生成视频，并将当前流的视频使用其代替
* [unmuteAudio](https://ucloud.github.io/urtc-sdk-web/classes/localstream.html#unmuteaudio) - unmute 当前流的音频
* [unmuteVideo](https://ucloud.github.io/urtc-sdk-web/classes/localstream.html#unmutevideo) - unmute 当前流的视频

<a name="remotestream"></a>

### RemoteStream

RemoteStream 对象包含以下属性：

* [audioMuted](https://ucloud.github.io/urtc-sdk-web/classes/remotestream.html#audiomuted) - 当前流是否 mute 了音频
* [id](https://ucloud.github.io/urtc-sdk-web/classes/remotestream.html#id) - 当前流ID
* [mediaStream](https://ucloud.github.io/urtc-sdk-web/classes/remotestream.html#mediastream) - 当前流包含的媒体流，关于媒体流，请详见 [MediaStream](https://developer.mozilla.org/en-US/docs/Web/API/MediaStream)
* [sourceAudioMuted](https://ucloud.github.io/urtc-sdk-web/classes/remotestream.html#sourceaudiomuted) - 音频源是否已 mute，当源端 mute/unmute 音频时，本端将收到 mute-audio 或 unmute-audio 事件的通知，同时此值将变为对应值
* [sourceVideoMuted](https://ucloud.github.io/urtc-sdk-web/classes/remotestream.html#sourcevideomuted) - 视频源是否已 mute，当源端 mute/unmute 视频时，本端将收到 mute-video 或 unmute-video 事件的通知，同时此值将变为对应值
* [userId](https://ucloud.github.io/urtc-sdk-web/classes/remotestream.html#userid) - 该流所属用户的ID
* [videoMuted](https://ucloud.github.io/urtc-sdk-web/classes/remotestream.html#videomuted) - 当前流是否 mute 了视频

RemoteStream 对象包含以下方法：

* [getAudioLevel](https://ucloud.github.io/urtc-sdk-web/classes/remotestream.html#getaudiolevel) - 获取当前流的音量大小，只有当本地流或远端流中有音频数据才有效
* [getMediaType](https://ucloud.github.io/urtc-sdk-web/classes/remotestream.html#getmediatype) - 获取流的媒体类型
* [getStats](https://ucloud.github.io/urtc-sdk-web/classes/remotestream.html#getstats) - 获取流发布或订阅后的统计数据
* [hasAudio](https://ucloud.github.io/urtc-sdk-web/classes/remotestream.html#hasaudio) - 判断当前流是否有音频
* [hasVideo](https://ucloud.github.io/urtc-sdk-web/classes/remotestream.html#hasvideo) - 判断当前流是否有视频
* [muteAudio](https://ucloud.github.io/urtc-sdk-web/classes/remotestream.html#muteaudio) - mute 当前流的音频
* [muteVideo](https://ucloud.github.io/urtc-sdk-web/classes/remotestream.html#mutevideo) - mute 当前流的视频
* [off](https://ucloud.github.io/urtc-sdk-web/classes/remotestream.html#off) - 取消监听流对象事件
* [on](https://ucloud.github.io/urtc-sdk-web/classes/remotestream.html#on) - 监听流对象事件，可监听的事件类型有 [RtcStreamEventType](https://ucloud.github.io/urtc-sdk-web/index.html#rtcstreameventtype)、[RtcPlayerEventType](https://ucloud.github.io/urtc-sdk-web/index.html#rtcplayereventtype)
* [play](https://ucloud.github.io/urtc-sdk-web/classes/remotestream.html#play) - 播放当前流
* [resume](https://ucloud.github.io/urtc-sdk-web/classes/remotestream.html#resume) - 恢复播放流，一般由于浏览器限制无法自动播放时，可提示用户手动触发该方法进行恢复播放
* [setAudioVolume](https://ucloud.github.io/urtc-sdk-web/classes/remotestream.html#setaudiovolume) - 设置输出音量，默认为 100
* [snapshot](https://ucloud.github.io/urtc-sdk-web/classes/remotestream.html#snapshot) - 对当前流进行截屏
* [stop](https://ucloud.github.io/urtc-sdk-web/classes/remotestream.html#stop) - 停止播放当前流
* [unmuteAudio](https://ucloud.github.io/urtc-sdk-web/classes/remotestream.html#unmuteaudio) - unmute 当前流的音频
* [unmuteVideo](https://ucloud.github.io/urtc-sdk-web/classes/remotestream.html#unmutevideo) - unmute 当前流的视频

### User

* [id](https://ucloud.github.io/urtc-sdk-web/classes/user.html#id) - 用户ID
