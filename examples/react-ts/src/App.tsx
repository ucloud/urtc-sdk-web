import React from 'react';
import sdk, { Client, User, Stream } from 'urtc-sdk';
import styled from 'styled-components';
import config from './config';
import './App.css';

const StreamComponent = styled.div`
  position: relative;
  width: 400px;
  height: 300px;
  text-align: left;
`;

const roomId = 'test';
const userId = `${Math.random()}`;

function useClient(appId: string, token: string): Client {
  const [client] = React.useState<Client>(() => {
    const client = new Client(appId, token);
    (window as any).c = client;
    return client;
  });
  return client;
}

function useRoomStatus(client: Client): {
  joined: boolean;
  join: Function;
  leave: Function;
} {
  const [joined, setJoined] = React.useState<boolean>(false);
  function join(roomId: string, userId: string) {
    if (joined) return;
    client.joinRoom(roomId, userId, (users: User[], streams: Stream[]) => {
      console.log('demo - join ', users, streams);
      setJoined(true);
    }, (err: Error) => {
      console.error('demo - join ', err);
    });
  }
  function leave() {
    if (!joined) return;
    client.leaveRoom(undefined, (): void => {
      setJoined(false);
      console.log('离开房间');
    }, (err: Error): void => {
      console.error('离开房间 ', err);
    });
  }
  return { joined, join, leave };
}

function useLocalStream(client: Client, joined: boolean): Stream | undefined {
  const [stream, setStream] = React.useState<Stream>();
  React.useEffect(() => {
    if (joined) {
      // 加入房间立即推流
      client.publish({audio: true, video: true, screen: false}, (err: any) => {
        console.error('demo - publish ', err)
      });
    } else {
      setStream(undefined);
    }
    function handlePublished(stream: Stream): void {
      console.log('stream-published ', stream);
      setStream(stream);
      client.play({
        container: stream.sid,
        streamId: stream.sid,
      }, (err) => {
        if (err) {
          console.error('play publish stream ', err);
        }
      });
    }
    client.on('stream-published', handlePublished);
    return function() {
      client.off('stream-published', handlePublished);
    }
  }, [client, joined]);
  return stream;
}

function useRemoteStreams(client: Client, joined: boolean): Stream[] {
  const [remoteStreams, setRemoteStreams] = React.useState<Stream[]>([]);
  React.useEffect(() => {
    if (!joined) {
      setRemoteStreams([]);
    }
    function handleStreamAdded(stream: Stream): void {
      console.log('stream-added ', stream);
      client.subscribe(stream.sid, (err) => console.error('demo - subscribe ', err));
      // remoteStreams.push(stream);
      setRemoteStreams((preStreams: Stream[]): Stream[] => (preStreams.concat(stream)));
    }
    function handleSubscribed(stream: Stream): void {
      console.log('stream-subscribed ', stream);
      client.play({
        container: stream.sid,
        streamId: stream.sid,
      }, (err) => {
        if (err) {
          console.error('play subscribe stream ', err);
        }
      });
    }
    function handleStreamRemoved(stream: Stream): void {
      console.log('stream-removed ', stream);
      // client.subscribe(stream.sid, (err) => console.error('demo - subscribe ', err));
      setRemoteStreams((preStreams: Stream[]): Stream[] => (preStreams.filter((item) => item.sid !== stream.sid)));
    }
    client.on('stream-added', handleStreamAdded);
    client.on('stream-subscribed', handleSubscribed);
    client.on('stream-removed', handleStreamRemoved);
    return function() {
      client.off('stream-subscribed', handleSubscribed);
      client.off('stream-added', handleStreamAdded);
      client.off('stream-removed', handleStreamRemoved);
    }
  }, [client, joined]);
  return remoteStreams;
}

function URTC() {
  console.log('demo - start', sdk.version);
  const token = sdk.generateToken(config.AppId, config.AppKey, roomId, userId);

  const client = useClient(config.AppId, token);
  const { joined, join, leave } = useRoomStatus(client);
  const stream = useLocalStream(client, joined);
  const remoteStreams = useRemoteStreams(client, joined);

  return (
    <div>
      <label>
        房间号：{roomId}（{joined ? "已加入" : "未加入"}）
        {joined ? <button onClick={() => leave()}>离开</button> : <button onClick={() => join(roomId, userId)}>加入</button> }
        </label>
      <h5>本地流</h5>
      {
        stream
          ? <StreamComponent className="stream" id={stream.sid}></StreamComponent>
          : null
      }
      <h5>远端流</h5>
      {remoteStreams.map(stream => <StreamComponent className="stream" key={stream.sid} id={stream.sid}></StreamComponent>)}
    </div>
  )
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <URTC></URTC>
      </header>
    </div>
  );
}

export default App;
