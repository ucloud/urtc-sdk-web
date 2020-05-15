import React, { Component } from "react";
import sdk, { Client } from "urtc-sdk";

import config from "../../config";
import StreamInfo from "../../components/StreamInfo";
import "./index.css";

const { AppId, AppKey } = config;

// 此处使用固定的房间号的随机的用户ID，请自行替换
const RoomId = "ssss022";
const UserId = Math.floor(Math.random() * 1000000).toString();

console.log("UCloudRTC sdk version: ", sdk.version);

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
    };
    this.bucket = "urtc-test";
    this.region = "cn-bj";
  }

  componentDidMount() {
    if (!AppId || !AppKey) {
      alert("请先设置 AppId 和 AppKey");
      return;
    }
    if (!RoomId) {
      alert("请先设置 RoomId");
      return;
    }
    if (!UserId) {
      alert("请先设置 UserId");
      return;
    }
    const token = sdk.generateToken(AppId, AppKey, RoomId, UserId);
    this.client = new Client(AppId, token);
    this.client.on("stream-published", (localStream) => {
      console.info("stream-published: ", localStream);
      const { localStreams } = this.state;
      localStreams.push(localStream);
      this.setState({ localStreams }, () => {
        this.client.play({
          streamId: localStream.sid,
          container: localStream.sid,
        });
      });
    });
    this.client.on("stream-added", (remoteStream) => {
      console.info("stream-added: ", remoteStream);
      const { remoteStreams } = this.state;
      remoteStreams.push(remoteStream);
      // 自动订阅
      this.client.subscribe(remoteStream.sid, (err) => {
        console.error("自动订阅失败：", err);
      });
      this.setState({ remoteStreams });
    });
    this.client.on("stream-subscribed", (remoteStream) => {
      console.info("stream-subscribed: ", remoteStream);
      const { remoteStreams } = this.state;
      const idx = remoteStreams.findIndex(
        (item) => item.sid === remoteStream.sid
      );
      if (idx >= 0) {
        remoteStreams.splice(idx, 1, remoteStream);
      }
      this.setState({ remoteStreams }, () => {
        this.client.play({
          streamId: remoteStream.sid,
          container: remoteStream.sid,
        });
      });
    });
    this.client.on("stream-removed", (remoteStream) => {
      console.info("stream-removed: ", remoteStream);
      const { remoteStreams } = this.state;
      const idx = remoteStreams.findIndex(
        (item) => item.sid === remoteStream.sid
      );
      if (idx >= 0) {
        remoteStreams.splice(idx, 1);
      }
      this.setState({ remoteStreams });
    });
    this.client.on("connection-state-change", ({ previous, current }) => {
      console.log(`连接状态 ${previous} -> ${current}`);
    });
    this.client.on("stream-reconnected", ({ previous, current }) => {
      console.log(`流已断开重连`);
      const isLocalStream = previous.type === "publish";
      const streams = isLocalStream
        ? this.state.localStreams
        : this.state.remoteStreams;
      const idx = streams.findIndex((item) => item.sid === previous.sid);
      if (idx >= 0) {
        // 更新流的信息
        streams.splice(idx, 1, current);
      }
      const playFunc = () => {
        this.client.play({
          streamId: current.sid,
          container: current.sid,
        });
      };
      if (isLocalStream) {
        this.setState({ localStreams: streams }, playFunc);
      } else {
        this.setState({ remoteStreams: streams }, playFunc);
      }
    });

    window.addEventListener("beforeunload", this.handleLeaveRoom);
  }

  componentWillUnmount() {
    console.info("component will unmout");
    window.removeEventListener("beforeunload", this.handleLeaveRoom);
    this.handleLeaveRoom();
  }

  handleJoinRoom = () => {
    const { roomId, userId, isJoinedRoom } = this.state;
    if (isJoinedRoom) {
      alert("已经加入了房间");
      return;
    }
    if (!roomId) {
      alert("请先填写房间号");
      return;
    }
    this.client.joinRoom(
      roomId,
      userId,
      () => {
        console.info("加入房间成功");
        this.setState({ isJoinedRoom: true });
      },
      (err) => {
        console.error("加入房间失败： ", err);
      }
    );
  };

  handlePublish = () => {
    this.client.publish((err) => {
      console.error(
        `发布失败：错误码 - ${err.name}，错误信息 - ${err.message}`
      );
    });
  };
  handlePublishScreen = () => {
    this.client.publish({ audio: false, video: false, screen: true }, (err) => {
      console.error(
        `发布失败：错误码 - ${err.name}，错误信息 - ${err.message}`
      );
    });
  };

  handleUnpublish = () => {
    const { selectedStream } = this.state;
    if (!selectedStream) {
      alert("未选择需要取消发布的本地流");
      return;
    }
    this.client.unpublish(
      selectedStream.sid,
      (stream) => {
        console.info("取消发布本地流成功：", stream);
        const { localStreams } = this.state;
        const idx = localStreams.findIndex((item) => item.sid === stream.sid);
        if (idx >= 0) {
          localStreams.splice(idx, 1);
        }
        this.setState({
          localStreams,
          selectedStream: null,
        });
      },
      (err) => {
        console.error("取消发布本地流失败：", err);
      }
    );
  };

  handleSubscribe = () => {
    const { selectedStream } = this.state;
    if (!selectedStream) {
      alert("未选择需要订阅的远端流");
      return;
    }
    this.client.subscribe(selectedStream.sid, (err) => {
      console.error("订阅失败：", err);
    });
  };

  handleUnsubscribe = () => {
    const { selectedStream } = this.state;
    if (!selectedStream) {
      alert("未选择需要取消订阅的远端流");
      return;
    }
    this.client.unsubscribe(
      selectedStream.sid,
      (stream) => {
        console.info("取消订阅成功：", stream);
        const { remoteStreams } = this.state;
        const idx = remoteStreams.findIndex((item) => item.sid === stream.sid);
        if (idx >= 0) {
          remoteStreams.splice(idx, 1, stream);
        }
        this.setState({
          remoteStreams,
        });
      },
      (err) => {
        console.error("订阅失败：", err);
      }
    );
  };

  handleLeaveRoom = () => {
    const { isJoinedRoom } = this.state;
    if (!isJoinedRoom) {
      return;
    }
    this.client.leaveRoom(
      () => {
        console.info("离开房间成功");
        this.setState({
          selectedStream: null,
          localStreams: [],
          remoteStreams: [],
          isJoinedRoom: false,
        });
      },
      (err) => {
        console.error("离开房间失败：", err);
      }
    );
  };

  handleSelectStream = (stream) => {
    console.log("select stream: ", stream);
    this.setState({ selectedStream: stream });
  };
  renderLocalStream() {
    const { localStreams } = this.state;
    return localStreams.map((stream) => {
      return stream.mediaStream ? (
        <div
          className="stream-container"
          key={stream.sid}
          onClick={() => this.handleSelectStream(stream)}
        >
          <StreamInfo client={this.client} stream={stream}></StreamInfo>
          <div className="video-container" id={stream.sid}></div>
        </div>
      ) : null;
    });
  }
  renderRemoteStream() {
    const { remoteStreams } = this.state;
    return remoteStreams.map((stream) => {
      return stream.mediaStream ? (
        <div
          className="stream-container"
          key={stream.sid}
          onClick={() => this.handleSelectStream(stream)}
        >
          <StreamInfo client={this.client} stream={stream}></StreamInfo>
          <div className="video-container" id={stream.sid}></div>
        </div>
      ) : null;
    });
  }

  handleRecord = () => {
    console.log("handleRecord >>>");
    this.client.startRecord(
      {
        bucket: this.bucket,
        region: this.region,
      },
      (error, result) => {
        if (!error) {
          console.log("handleRecord success >>>>", result);
        }else{
          console.log("handleRecord fail >>>>", error)
        }
      }
    );
  };

  handleStopRecord = () => {
    console.log("handleStopRecord");
    this.client.stopRecord((error, result) => {
      if (!error) {
        console.log("handleStopRecord success >>>>", result);
      }else{
        console.log("handleStopRecord fail >>>>", error)
      }
    });
  };

  handleRelay = () => {
    console.log("handleRelay");
    this.client.startRelay(
      {
        pushURL:[
          'rtmp://xupush.ugslb.com/xuapp/test'
        ]
      },
      (error, result) => {
        if (!error) {
          console.log("handleRelay success >>>>", result);
        }else{
          console.log("handleRelay fail >>>>", error)
        }
      }
    );
  };

  handleStopRelay = () => {
    console.log("handleStopRelay");
    this.client.stopRelay((error, result) => {
      if (!error) {
        console.log("handleStopRelay success >>>>", result);
      }else{
        console.log("handleStopRelay fail >>>>", error)
      }
    });
  };

  render() {
    const { selectedStream, isJoinedRoom } = this.state;
    return (
      <div className="room">
        <label>
          房间号：{RoomId}（{isJoinedRoom ? "已加入" : "未加入"}）
        </label>
        <p>当前选中的流：{selectedStream ? selectedStream.sid : "未选择"}</p>
        <h3>本地（发布）流</h3>
        {this.renderLocalStream()}
        <h3>远端（订阅）流</h3>
        {this.renderRemoteStream()}
        <h3>操作</h3>
        <button onClick={this.handleJoinRoom}>加入房间</button>
        <button onClick={this.handlePublish}>发布</button>
        <button onClick={this.handlePublishScreen}>屏幕共享</button>
        <button onClick={this.handleUnpublish}>取消发布/屏幕共享</button>
        <button onClick={this.handleSubscribe}>订阅</button>
        <button onClick={this.handleUnsubscribe}>取消订阅</button>

        <button onClick={this.handleRecord}>录制</button>
        <button onClick={this.handleStopRecord}>停止录制</button>

        <button onClick={this.handleRelay}>转推</button>
        <button onClick={this.handleStopRelay}>停止转推</button>

        <button onClick={this.handleLeaveRoom}>离开房间</button>
      </div>
    );
  }
}
