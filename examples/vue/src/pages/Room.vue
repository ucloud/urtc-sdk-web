<template>
  <div class="room">
    <label>房间号：{{roomId}}（{{roomStatus}}）</label>
    <p>当前选中的流：{{selectedStreamStatus}}</p>
    <h3>本地（发布）流</h3>
    <div class="stream-container" v-for="stream in localStreams" :key="stream.sid" v-on:click="handleSelectStream(stream)">
      <stream-info v-bind:client="client" v-bind:stream="stream"></stream-info>
      <div class="video-container" :id="stream.sid"></div>
    </div>
    <h3>远端（订阅）流</h3>
    <div class="stream-container" v-for="stream in remoteStreams" :key="stream.sid" v-on:click="handleSelectStream(stream)">
      <stream-info v-bind:client="client" v-bind:stream="stream"></stream-info>
      <div class="video-container" :id="stream.sid"></div>
    </div>
    <h3>操作</h3>
    <button v-on:click="handleJoinRoom">加入房间</button>
    <button v-on:click="handlePublish">发布</button>
    <button v-on:click="handlePublishScreen">屏幕共享</button>
    <button v-on:click="handleUnpublish">取消发布/屏幕共享</button>
    <button v-on:click="handleSubscribe">订阅</button>
    <button v-on:click="handleUnsubscribe">取消订阅</button>
    <button v-on:click="handleLeaveRoom">离开房间</button>
  </div>
</template>

<script>
import sdk, { Client } from 'urtc-sdk';
import StreamInfo from '../components/StreamInfo';

import config from '../config';

const { AppId, AppKey } = config;

// 此处使用固定的房间号的随机的用户ID，请自行替换
const RoomId = 'test';
const UserId = Math.floor(Math.random() * 1000000).toString();

console.log('UCloudRTC sdk version: ', sdk.version);

export default {
  name: 'Room',
  components: {
    StreamInfo
  },
  data: function () {
    return {
      roomId: RoomId,
      userId: UserId,
      isJoinedRoom: false,
      selectedStream: null,
      localStreams: [],
      remoteStreams: []
    };
  },
  computed: {
    roomStatus: function () {
      return this.isJoinedRoom ? '已加入' : '未加入';
    },
    selectedStreamStatus: function () {
      return this.selectedStream ? this.selectedStream.sid : '未选择';
    }
  },
  created: function () {
    if (!AppId || !AppKey) {
      alert('请先设置 AppId 和 AppKey');
      return;
    }
    if (!RoomId) {
      alert('请先设置 RoomId');
      return;
    }
    if (!UserId) {
      alert('请先设置 UserId');
    }
  },
  mounted: function () {
    const token = sdk.generateToken(AppId, AppKey, RoomId, UserId);
    this.client = new Client(AppId, token);
    this.client.on('stream-published', (localStream) => {
      console.info('stream-published: ', localStream);
      const { localStreams } = this;
      localStreams.push(localStream);
      this.$nextTick(() => {
        this.client.play({
          streamId: localStream.sid,
          container: localStream.sid
        });
      });
    });
    this.client.on('stream-added', (remoteStream) => {
      console.info('stream-added: ', remoteStream);
      const { remoteStreams } = this;
      remoteStreams.push(remoteStream);
      // 自动订阅
      this.client.subscribe(remoteStream.sid, (err) => {
        console.error('自动订阅失败：', err);
      });
    });
    this.client.on('stream-subscribed', (remoteStream) => {
      console.info('stream-subscribed: ', remoteStream);
      const { remoteStreams } = this;
      const idx = remoteStreams.findIndex(item => item.sid === remoteStream.sid);
      if (idx >= 0) {
        remoteStreams.splice(idx, 1, remoteStream);
      }
      this.$nextTick(() => {
        this.client.play({
          streamId: remoteStream.sid,
          container: remoteStream.sid
        });
      });
    });
    this.client.on('stream-removed', (remoteStream) => {
      console.info('stream-removed: ', remoteStream);
      const { remoteStreams } = this;
      const idx = remoteStreams.findIndex(item => item.sid === remoteStream.sid);
      if (idx >= 0) {
        remoteStreams.splice(idx, 1);
      }
    });
    this.client.on('connection-state-change', ({ previous, current }) => {
      console.log(`连接状态 ${previous} -> ${current}`);
    });
    this.client.on('stream-reconnected', ({ previous, current }) => {
      console.log(`流已断开重连`);
      const isLocalStream = previous.type === 'publish';
      const streams = isLocalStream ? this.localStreams : this.remoteStreams;
      const idx = streams.findIndex(item => item.sid === previous.sid);
      if (idx >= 0) {
        // 更新流的信息
        streams.splice(idx, 1, current);
      }
      this.$nextTick(() => {
        this.client.play({
          streamId: current.sid,
          container: current.sid
        });
      });
    });

    window.addEventListener('beforeunload', this.handleLeaveRoom);
  },
  beforeDestroy: function () {
    console.info('component will destroy');
    window.removeEventListener('beforeunload', this.handleLeaveRoom);
    this.handleLeaveRoom();
  },
  destroyed: function () {
    this.isComponentDestroyed = true;
  },
  methods: {
    handleJoinRoom: function () {
      const { roomId, userId, isJoinedRoom } = this;
      if (isJoinedRoom) {
        alert('已经加入了房间');
        return;
      }
      if (!roomId) {
        alert('请先填写房间号');
        return;
      }
      this.client.joinRoom(roomId, userId, () => {
        console.info('加入房间成功');
        this.isJoinedRoom = true;
      }, (err) => {
        console.error('加入房间失败： ', err);
      });
    },
    handlePublish: function () {
      this.client.publish(err => {
        console.error(`发布失败：错误码 - ${err.name}，错误信息 - ${err.message}`);
      });
    },
    handlePublishScreen: function () {
      this.client.publish({ audio: false, video: false, screen: true }, (err) => {
        console.error(`发布失败：错误码 - ${err.name}，错误信息 - ${err.message}`);
      });
    },
    handleUnpublish: function () {
      const { selectedStream } = this;
      if (!selectedStream) {
        alert('未选择需要取消发布的本地流');
        return;
      }
      this.client.unpublish(selectedStream.sid, (stream) => {
        console.info('取消发布本地流成功：', stream);
        const { localStreams } = this;
        const idx = localStreams.findIndex(item => item.sid === stream.sid);
        if (idx >= 0) {
          localStreams.splice(idx, 1);
        }
        this.selectedStream = null;
      }, (err) => {
        console.error('取消发布本地流失败：', err);
      });
    },
    handleSubscribe: function () {
      const { selectedStream } = this;
      if (!selectedStream) {
        alert('未选择需要订阅的远端流');
        return;
      }
      this.client.subscribe(selectedStream.sid, (err) => {
        console.error('订阅失败：', err);
      });
    },
    handleUnsubscribe: function () {
      const { selectedStream } = this;
      if (!selectedStream) {
        alert('未选择需要取消订阅的远端流');
        return;
      }
      this.client.unsubscribe(selectedStream.sid, (stream) => {
        console.info('取消订阅成功：', stream);
        const { remoteStreams } = this;
        const idx = remoteStreams.findIndex(item => item.sid === stream.sid);
        if (idx >= 0) {
          remoteStreams.splice(idx, 1, stream);
        }
      }, (err) => {
        console.error('订阅失败：', err);
      });
    },
    handleLeaveRoom: function () {
      const { isJoinedRoom } = this;
      if (!isJoinedRoom) {
        return;
      }
      this.client.leaveRoom(() => {
        console.info('离开房间成功');
        this.selectedStream = null;
        this.localStreams = [];
        this.remoteStreams = [];
        this.isJoinedRoom = false;
      }, (err) => {
        console.error('离开房间失败：', err);
      });
    },
    handleSelectStream: function (stream) {
      console.log('select stream: ', stream);
      this.selectedStream = stream;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.room {
  max-width: 640px;
  margin: 0 auto;
}

.room .local-stream,
.room .remote-stream {
  text-align: left;
}
.room button {
  padding: 8px 0;
  display: inline-block;
  width: 100%;
  border-width: 1px;
  border-radius: 6px;
  background-color: #fff;
  cursor: pointer;
  text-align: center;
}

.room input:visited,
.room button:focus,
.room button:visited,
.room button:hover,
.room button:active {
  outline: none;
}

.stream-container {
  display: inline-block;
  margin: 2px;
  width: 300px;
  text-align: left;
  white-space: nowrap;
  cursor: pointer;
}

.stream-container .video-container {
  position: relative;
  height: 200px;
}
</style>
