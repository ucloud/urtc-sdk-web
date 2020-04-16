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

  const Player = function(client, stream, selectFunc) {
    this.client = client;
    this.stream = stream;
    this.element = document.createElement('div');

    // userId
    const uIDElem = document.createElement('div');
    uIDElem.innerHTML = `用户ID：${stream.uid}`;
    uIDElem.style = 'overflow: hidden; text-overflow: ellipsis;';
    this.element.appendChild(uIDElem);

    // streamId
    const sIDElem = document.createElement('div');
    sIDElem.innerHTML = `流ID：${stream.sid}`;
    sIDElem.style = 'overflow: hidden; text-overflow: ellipsis;';
    this.element.appendChild(sIDElem);

    // hint - unsubscribe
    const hintElem = document.createElement('p');
    hintElem.innerHTML = 'unsubscribe';
    hintElem.style = 'display: none;';
    this.hint = hintElem;
    this.element.appendChild(hintElem);

    // container
    const container = document.createElement('div');
    container.className = 'media-player';
    container.id = stream.sid;
    this.container = container;
    this.element.appendChild(container);

    this.handleSelect = function() {
      selectFunc(this.stream);
    }.bind(this);
    this.element.addEventListener('click', this.handleSelect);

    if (stream.mediaStream) {
      this.play();
    }
  }
  Player.prototype.play = function() {
    const isLocalStream = this.stream.type === 'publish';
    this.hint.style.display = 'none';
    this.container.style.display = 'inline-block';
    this.client.play({
      streamId: this.stream.sid,
      container: this.container,
      mirror: isLocalStream
    }, (err) => {
      if (err) {
        console.log(`自动播放失败 ${err}`);
        alert(`自动播放失败 ${err}`);
      }
    })
  }
  Player.prototype.stop = function() {
    const isLocalStream = this.stream.type === 'publish';
    this.container.style.display = 'none';
    if (!isLocalStream) {
      this.hint.style.display = 'block';
    }
  }
  Player.prototype.updateStream = function(stream) {
    this.stream = stream;
    if (stream.mediaStream) {
      this.play();
    } else {
      this.stop();
    }
  }
  Player.prototype.destroy = function() {
    this.element.removeEventListener('click', this.handleSelect);
    this.element.parentNode.removeChild(this.element);
  }

  // 用于维护应用内的状态
  const App = {
    state: {
      roomId: RoomId,
      userId: UserId,
      isJoinedRoom: false,
      selectedStream: null,
      localStreams: [],
      remoteStreams: [],
      players: [],
    },
    client: null,
    renderRoomId: function (roomId) {
      const roomElem = document.querySelector('#roomId');
      roomElem.innerHTML = roomId;
    },
    renderRoomStatus: function (status) {
      const roomStatusElem = document.querySelector('#roomStatus');
      if (status) {
        roomStatusElem.innerHTML = "已加入";
      } else {
        roomStatusElem.innerHTML = "未加入";
      }
    },
    renderSelectedStream: function (selectedStream) {
      const selectedStreamElem = document.querySelector('#selectedStream');
      if (selectedStream) {
        selectedStreamElem.innerHTML = selectedStream.sid;
      } else {
        selectedStreamElem.innerHTML = "未选择";
      }
    },
    renderStream: function (stream) {
      const isLocalStream = stream.type === 'publish';
      let parent;
      if (isLocalStream) {
        parent = document.querySelector('#pushers');
      } else {
        parent = document.querySelector('#pullers');
      }
      const player = new Player(this.client, stream, this.handleSelectStream.bind(this));
      // todo - handleSelectStream
      this.state.players.push(player);
      parent.appendChild(player.element);
    },
    unrenderStream: function (stream) {
      const idx = this.state.players.findIndex(item => item.stream.sid === stream.sid);
      if (idx < 0) {
        console.log('unrender stream - stream not found');
        return;
      }
      const player = this.state.players[idx];
      this.state.players.splice(idx, 1);
      player.destroy();
    },
    rerenderStream: function (stream) {
      const player = this.state.players.find(item => item.stream.sid === stream.sid);
      if (!player) {
        console.log('rerender stream - stream not found');
        return;
      }
      player.updateStream(stream);
    },
    init: function () {
      this.renderRoomId(RoomId);

      const token = UCloudRTC.generateToken(AppId, AppKey, RoomId, UserId);
      this.client = new UCloudRTC.Client(AppId, token);

      // 监听 publish 成功的事件
      this.client.on('stream-published', (localStream) => {
        console.info('stream-published: ', localStream);
        const { localStreams } = this.state;
        localStreams.push(localStream);
        this.renderStream(localStream);
      });
      this.client.on('stream-added', (remoteStream) => {
        console.info('stream-added: ', remoteStream);
        const { remoteStreams } = this.state;
        remoteStreams.push(remoteStream);
        this.renderStream(remoteStream);
        // 自动订阅
        this.client.subscribe(remoteStream.sid, (err) => {
          console.error('自动订阅失败：', err);
        });
      });
      this.client.on('stream-subscribed', (remoteStream) => {
        console.info('stream-subscribed: ', remoteStream);
        const { remoteStreams } = this.state;
        const idx = remoteStreams.findIndex(item => item.sid === remoteStream.sid);
        if (idx >= 0) {
          remoteStreams.splice(idx, 1, remoteStream);
        }
        this.rerenderStream(remoteStream);
      });
      this.client.on('stream-removed', (remoteStream) => {
        console.info('stream-removed: ', remoteStream);
        const { remoteStreams } = this.state;
        const idx = remoteStreams.findIndex(item => item.sid === remoteStream.sid);
        if (idx >= 0) {
          const p = remoteStreams[idx];
          remoteStreams.splice(idx, 1);
          this.unrenderStream(p);
        }
      });
      this.client.on('connection-state-change', ({ previous, current }) => {
        console.log(`连接状态 ${previous} -> ${current}`);
      });
      this.client.on('stream-reconnected', ({previous, current}) => {
        console.log(`流已断开重连`);
        const isLocalStream = previous.type === 'publish';
        const streams = isLocalStream ? this.state.localStreams : this.state.remoteStreams;
        const idx = streams.findIndex(item => item.sid === previous.sid);
        if (idx >= 0) {
          const oldStream = streams.splice(idx, 1, current)[0];
          this.unrenderStream(oldStream);
          streams.push(current);
          this.renderStream(current);
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
        this.renderRoomStatus(true);
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
      this.client.publish({ audio: false, video: false, screen: true }, err => {
        console.error(`发布失败：错误码 - ${err.name}，错误信息 - ${err.message}`);
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
          this.state.selectedStream = null;
          this.renderSelectedStream();
          this.unrenderStream(p);
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
          this.rerenderStream(stream);
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
        this.state.selectedStream = null;
        this.renderSelectedStream();
        const {
          localStreams,
          remoteStreams
        } = this.state;
        localStreams.forEach(item => {
          this.unrenderStream(item);
        });
        remoteStreams.forEach(item => {
          this.unrenderStream(item);
        });
        this.renderRoomStatus(false);
      }, (err) => {
        console.error('离开房间失败：', err);
      });
    },
    handleSelectStream: function (stream) {
      console.log('select stream: ', stream);
      this.state.selectedStream = stream;
      this.renderSelectedStream(stream);
    }
  }

  App.init();
}
