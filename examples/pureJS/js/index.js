window.onload = function () {
  const {
    AppId,
    AppKey
  } = window.config || {};

  // 此处使用固定的房间号的随机的用户ID，请自行替换
  const RoomId = "ssss02";
  const UserId = Math.floor(Math.random() * 1000000).toString();

  if (!AppId || !AppKey) {
    alert('请先设置 AppId 和 AppKey');
    return;
  }
  if (!RoomId) {
    alert('请先设置 RoomId');
    return;
  }

  console.log('UCloudRTC sdk version: ', UCloudRTC.version);

  // 用于维护应用内的状态
  const App = {
    state: {
      roomId: RoomId,
      userId: UserId,
      isJoinedRoom: false,
      selectedStream: null,
      localStreams: [],
      remoteStreams: []
    },
    client: null,
    setState: function (key, value) {
      const keys = Object.keys(this.state);
      if (keys.includes(key)) {
        this.state[key] = value;
      }
      switch (key) {
        case 'roomId':
          this.renderRoomId();
          break;
        case 'isJoinedRoom':
          this.renderRoomStatus();
          break;
        case 'selectedStream':
          this.renderSelectedStream();
          break;
        case 'localStream-add':
          this.loadStream(value, 'pusher');
          break;
        case 'localStream-remove':
          this.unloadStream(value, 'pusher');
          break;
        case 'remoteStream-add':
          this.loadStream(value, 'puller');
          break;
        case 'remoteStream-remove':
          this.unloadStream(value, 'puller');
          break;
        case 'remoteStream-update':
          this.rerenderStream(value);
          break;
        default:
      }
    },
    renderRoomId: function () {
      const { roomId } = this.state;
      const roomElem = document.querySelector('#roomId');
      roomElem.innerHTML = roomId;
    },
    renderRoomStatus: function () {
      const { isJoinedRoom } = this.state;
      const roomStatusElem = document.querySelector('#roomStatus');
      if (isJoinedRoom) {
        roomStatusElem.innerHTML = "已加入";
      } else {
        roomStatusElem.innerHTML = "未加入";
      }
    },
    renderSelectedStream: function () {
      const { selectedStream } = this.state;
      const selectedStreamElem = document.querySelector('#selectedStream');
      if (selectedStream) {
        selectedStreamElem.innerHTML = selectedStream.sid;
      } else {
        selectedStreamElem.innerHTML = "未选择";
      }
    },
    loadStream: function (stream, type) {
      let parent;
      let isPuller;
      switch (type) {
        case 'pusher':
          parent = document.querySelector('#pushers');
          break;
        case 'puller':
          parent = document.querySelector('#pullers');
          isPuller = true;
          break;
        default:
          return;
      }
      const player = document.createElement('div');
      player.className = 'media-player';
      player.id = stream.sid;
      const uIDElem = document.createElement('div');
      uIDElem.innerHTML = `用户ID：${stream.uid}`;
      uIDElem.style = 'overflow: hidden; text-overflow: ellipsis;';
      const sIDElem = document.createElement('div');
      sIDElem.innerHTML = `流ID：${stream.sid}`;
      sIDElem.style = 'overflow: hidden; text-overflow: ellipsis;';
      player.append(uIDElem);
      player.append(sIDElem);
      if (isPuller) {
        const pElem = document.createElement('p');
        pElem.innerHTML = 'unsubscribe';
        player.append(pElem);
      } else {
        const videoElem = document.createElement('video');
        videoElem.autoplay = true;
        videoElem.playsinline = true;
        videoElem.srcObject = stream.mediaStream;
        player.append(videoElem);
      }
      player.addEventListener('click', function() {
        this.handleSelectStream(stream);
      }.bind(this));
      parent.append(player);
    },
    unloadStream: function (stream, type) {
      let parent;
      switch (type) {
        case 'pusher':
          parent = document.querySelector('#pushers');
          break;
        case 'puller':
          parent = document.querySelector('#pullers');
          break;
        default:
          return;
      }
      const player = document.querySelector('#' + stream.sid);
      parent.removeChild(player);
    },
    rerenderStream: function (stream) {
      const player = document.querySelector('#' + stream.sid);
      if (stream.mediaStream) {
        const videoElem = document.createElement('video');
        videoElem.autoplay = true;
        videoElem.playsinline = true;
        videoElem.srcObject = stream.mediaStream;
        const pElem = player.querySelector('p');
        player.removeChild(pElem);
        player.appendChild(videoElem);
      } else {
        const videoElem = player.querySelector('video');
        const pElem = document.createElement('p');
        pElem.innerHTML = 'unsubscribe';
        player.removeChild(videoElem);
        player.appendChild(pElem);
      }
    },
    init: function () {
      const token = UCloudRTC.generateToken(AppId, AppKey, RoomId, UserId);
      this.client = new UCloudRTC.Client(AppId, token);

      // 监听 publish 成功的事件
      this.client.on('stream-published', (localStream) => {
        console.info('stream-published: ', localStream);
        const { localStreams } = this.state;
        localStreams.push(localStream);
        this.setState('localStream-add', localStream);
      });
      this.client.on('stream-added', (remoteStream) => {
        console.info('stream-added: ', remoteStream);
        const { remoteStreams } = this.state;
        remoteStreams.push(remoteStream);
        // 自动订阅
        this.client.subscribe(remoteStream.sid, (err) => {
          console.error('自动订阅失败：', err);
        });
        this.setState('remoteStream-add', remoteStream);
      });
      this.client.on('stream-subscribed', (remoteStream) => {
        console.info('stream-subscribed: ', remoteStream);
        const { remoteStreams } = this.state;
        const idx = remoteStreams.findIndex(item => item.sid === remoteStream.sid);
        if (idx >= 0) {
          remoteStreams.splice(idx, 1, remoteStream);
        }
        this.setState('remoteStream-update', remoteStream);
      });
      this.client.on('stream-removed', (remoteStream) => {
        console.info('stream-removed: ', remoteStream);
        const { remoteStreams } = this.state;
        const idx = remoteStreams.findIndex(item => item.sid === remoteStream.sid);
        if (idx >= 0) {
          const p = remoteStreams.splice(idx, 1)[0];
          this.setState('remoteStream-remove', p);
        }
      });

      document.querySelector('#joinRoomBtn').addEventListener('click', this.handleJoinRoom.bind(this));
      document.querySelector('#publishBtn').addEventListener('click', this.handlePublish.bind(this));
      document.querySelector('#publishScreenBtn').addEventListener('click', this.handlePublishScreen.bind(this));
      document.querySelector('#unPublishBtn').addEventListener('click', this.handleUnpublish.bind(this));
      document.querySelector('#subscribeBtn').addEventListener('click', this.handleSubscribe.bind(this));
      document.querySelector('#unSubscribeBtn').addEventListener('click', this.handleUnsubscribe.bind(this));
      document.querySelector('#leaveRoomBtn').addEventListener('click', this.handleLeaveRoom.bind(this));

      window.addEventListener('beforeunload', this.handleLeaveRoom.bind(this));
    },
    // 操作
    handleJoinRoom: function () {
      const {
        roomId,
        userId,
        isJoinedRoom
      } = this.state;
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
        this.setState('isJoinedRoom', true);
      }, (err) => {
        console.error('加入房间失败： ', err);
      });
    },
    handlePublish: function () {
      this.client.publish(err => {
        console.error('发布失败：', err);
      });
    },
    handlePublishScreen: function () {
      this.client.publish({
        audio: true,
        video: false,
        screen: true
      }, err => {
        console.error('发布失败：', err);
      });
    },
    handleUnpublish: function () {
      const {
        selectedStream
      } = this.state;
      if (!selectedStream) {
        alert('未选择需要取消发布的本地流');
        return;
      }
      this.client.unpublish(selectedStream.sid, (stream) => {
        console.info('取消发布本地流成功：', stream);
        const {
          localStreams
        } = this.state;
        const idx = localStreams.findIndex(item => item.sid === stream.sid);
        if (idx >= 0) {
          const p = localStreams.splice(idx, 1)[0];
          this.setState('selectedStream', null);
          this.setState('localStream-remove', p);
        }
      }, (err) => {
        console.error('取消发布本地流失败：', err);
      })
    },
    handleSubscribe: function () {
      const {
        selectedStream
      } = this.state;
      if (!selectedStream) {
        alert('未选择需要订阅的远端流');
        return;
      }
      this.client.subscribe(selectedStream.sid, (err) => {
        console.error('订阅失败：', err);
      });
    },
    handleUnsubscribe: function () {
      const {
        selectedStream
      } = this.state;
      if (!selectedStream) {
        alert('未选择需要取消订阅的远端流');
        return;
      }
      this.client.unsubscribe(selectedStream.sid, (stream) => {
        console.info('取消订阅成功：', stream);
        const {
          remoteStreams
        } = this.state;
        const idx = remoteStreams.findIndex(item => item.sid === stream.sid);
        if (idx >= 0) {
          remoteStreams.splice(idx, 1, stream);
          this.setState('remoteStream-update', stream);
        }
      }, (err) => {
        console.error('订阅失败：', err);
      });
    },
    handleLeaveRoom: function () {
      const {
        isJoinedRoom
      } = this.state;
      if (!isJoinedRoom) {
        return;
      }
      this.client.leaveRoom(() => {
        console.info('离开房间成功');
        this.setState('selectedStream', null);
        const {
          localStreams,
          remoteStreams
        } = this.state;
        localStreams.forEach(item => {
          this.setState('localStream-remove', item);
        });
        remoteStreams.forEach(item => {
          this.setState('remoteStream-remove', item);
        });
        this.setState('isJoinedRoom', false);
      }, (err) => {
        console.error('离开房间失败：', err);
      });
    },
    handleSelectStream: function (stream) {
      console.log('select stream: ', stream);
      this.setState('selectedStream', stream);
    }
  }

  App.init();
}