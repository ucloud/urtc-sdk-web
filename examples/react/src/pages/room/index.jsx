import React, { Component } from 'react';
import sdk, { Client } from 'urtc-sdk';

import config from '../../config';
import MediaPlayer from '../../components/MediaPlayer';
import './index.css';

const { AppId, AppKey } = config;

// 此处使用固定的房间号的随机的用户ID，请自行替换
const RoomId = "ssss02";
const UserId = Math.floor(Math.random() * 1000000).toString();

console.log('UCloudRTC sdk version: ', sdk.version);

export default class Room extends Component {
  constructor() {
    super();
    this.state = {
      roomId: RoomId,
      userId: UserId,
      isJoinedRoom: false,
      selectedStream: null,
      localStreams: [],
      remoteStreams: [],
    }
  }

  componentDidMount() {
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
      return;
    }
    const token = sdk.generateToken(AppId, AppKey, RoomId, UserId);
    this.client = new Client(AppId, token);
    this.client.on('stream-published', (localStream) => {
      console.info('stream-published: ', localStream);
      const { localStreams } = this.state;
      localStreams.push(localStream);
      this.setState({ localStreams });
    });
    this.client.on('stream-added', (remoteStream) => {
      console.info('stream-added: ', remoteStream);
      const { remoteStreams } = this.state;
      remoteStreams.push(remoteStream);
      // 自动订阅
      this.client.subscribe(remoteStream.sid, (err) => {
        console.error('自动订阅失败：', err);
      });
      this.setState({ remoteStreams });
    });
    this.client.on('stream-subscribed', (remoteStream) => {
      console.info('stream-subscribed: ', remoteStream);
      const { remoteStreams } = this.state;
      const idx = remoteStreams.findIndex(item => item.sid === remoteStream.sid);
      if (idx >= 0 ) {
        remoteStreams.splice(idx, 1, remoteStream);
      }
      this.setState({ remoteStreams });
    });
    this.client.on('stream-removed', (remoteStream) => {
      console.info('stream-removed: ', remoteStream);
      const { remoteStreams } = this.state;
      const idx = remoteStreams.findIndex(item => item.sid === remoteStream.sid);
      if (idx >= 0 ) {
        remoteStreams.splice(idx, 1);
      }
      this.setState({ remoteStreams });
    });

    window.addEventListener('beforeunload', this.handleLeaveRoom);
  }

  componentWillUnmount() {
    console.info('component will unmout');
    window.removeEventListener('beforeunload', this.handleLeaveRoom);
    this.handleLeaveRoom();
  }

  handleJoinRoom = () => {
    const { roomId, userId, isJoinedRoom } = this.state;
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
      this.setState({ isJoinedRoom: true });
    }, (err) => {
      console.error('加入房间失败： ', err);
    });
  }

  handlePublish = () => {
    this.client.publish(err => {
      console.error('发布失败：', err);
    });
  }
  handlePublishScreen = () => {
    this.client.publish({audio: false, video: false, screen: true}, err => {
      console.error('发布失败：', err);
    });
  }

  handleUnpublish = () => {
    const { selectedStream } = this.state;
    if (!selectedStream) {
      alert('未选择需要取消发布的本地流');
      return;
    }
    this.client.unpublish(selectedStream.sid, (stream) => {
      console.info('取消发布本地流成功：', stream);
      const { localStreams } = this.state;
      const idx = localStreams.findIndex(item => item.sid === stream.sid);
      if (idx >=0) {
        localStreams.splice(idx, 1);
      }
      this.setState({
        localStreams,
        selectedStream: null
      });
    }, (err) => {
      console.error('取消发布本地流失败：', err);
    })
  }
  
  handleSubscribe = () => {
    const { selectedStream } = this.state;
    if (!selectedStream) {
      alert('未选择需要订阅的远端流');
      return;
    }
    this.client.subscribe(selectedStream.sid, (err) => {
      console.error('订阅失败：', err);
    });
  }

  handleUnsubscribe = () => {
    const { selectedStream } = this.state;
    if (!selectedStream) {
      alert('未选择需要取消订阅的远端流');
      return;
    }
    this.client.unsubscribe(selectedStream.sid, (stream) => {
      console.info('取消订阅成功：', stream);
      const { remoteStreams } = this.state;
      const idx = remoteStreams.findIndex(item => item.sid === stream.sid);
      if (idx >=0) {
        remoteStreams.splice(idx, 1, stream);
      }
      this.setState({
        remoteStreams,
      });
    }, (err) => {
      console.error('订阅失败：', err);
    });
  }

  handleLeaveRoom = () => {
    const { isJoinedRoom } = this.state;
    if (!isJoinedRoom) {
      return;
    }
    this.client.leaveRoom(() => {
      console.info('离开房间成功');
      this.setState({
        selectedStream: null,
        localStreams: [],
        remoteStreams: [],
        isJoinedRoom: false,
      });
    }, (err) => {
      console.error('离开房间失败：', err);
    });
  }

  handleSelectStream = (stream) => {
    console.log('select stream: ', stream);
    this.setState({ selectedStream: stream });
  }
  renderLocalStream() {
    const { localStreams } = this.state;
    return localStreams.map(stream => {
      return stream.mediaStream ?
        <MediaPlayer className="local-stream" key={stream.sid} client={this.client} stream={stream} onClick={this.handleSelectStream}/> :
        null;
    });
  }
  renderRemoteStream() {
    const { remoteStreams } = this.state;
    return remoteStreams.map(stream => {
      return stream.mediaStream ?
        <MediaPlayer className="remote-stream" key={stream.sid} client={this.client} stream={stream} onClick={this.handleSelectStream} /> :
        <div className="media-player remote-stream" key={stream.sid} onClick={() => { this.handleSelectStream(stream) }}>
          <div style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>用户ID: {stream.uid}</div>
          <div style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>流ID: {stream.sid}</div>
          <p> unsubscribe </p>
        </div>;
    });
  }

  render() {
    const { selectedStream, isJoinedRoom } = this.state;
    return (
      <div className="room">
        <label>房间号：{RoomId}（{isJoinedRoom ? '已加入' : '未加入'}）</label>
        <p>当前选中的流：{selectedStream ? selectedStream.sid : '未选择'}</p>
        <h3>本地（发布）流</h3>
        {
          this.renderLocalStream()
        }
        <h3>远端（订阅）流</h3>
        {
          this.renderRemoteStream()
        }
        <h3>操作</h3>
        <button onClick={this.handleJoinRoom}>加入房间</button>
        <button onClick={this.handlePublish}>发布</button>
        <button onClick={this.handlePublishScreen}>屏幕共享</button>
        <button onClick={this.handleUnpublish}>取消发布/屏幕共享</button>
        <button onClick={this.handleSubscribe}>订阅</button>
        <button onClick={this.handleUnsubscribe}>取消订阅</button>
        <button onClick={this.handleLeaveRoom}>离开房间</button>
      </div>
    )
  }
}
