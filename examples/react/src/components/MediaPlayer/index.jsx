import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import classnames from 'unique-classnames';
import './index.css';

export default class MediaPlayer extends Component {
  static propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    stream: PropTypes.object,
    client: PropTypes.object,
    onClick: PropTypes.func,
  };
  static defaultProps = {
    className: '',
    style: {},
    stream: {},
    client: null,
    onClick: () => { },
  };

  constructor(props) {
    super(props);

    this.state = {
      volume: 0,
      stats: {
        audioLost: 0,
        biggestAudioLost: 0,
        videoLost: 0,
        biggestVideoLost: 0,
        rtt: 0,
        biggestRTT: 0,
      },
      showPlayMask: false
    }
    this.volumeTimer = 0;
    this.stateTimer = 0;
  }

  componentDidMount() {
    this.isComponentMounted = true;
    const { stream } = this.props;
    if (stream.mediaStream) {
      this.play();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.stream.mediaStream) {
      this.stop();
    } else if (nextProps.stream.mediaStream !== this.props.stream.mediaStream) {
      this.play();
    }
  }

  componentWillUnmount() {
    this.stop();
    this.isComponentMounted = false;
  }

  play() {
    const { client, stream } = this.props;
    const mirror = stream.type === 'publish';
    client.play({
      streamId: stream.sid,
      container: stream.sid,
      mirror: mirror
    }, (err) => {
      if (err) {
        this.setState({
          showPlayMask: true
        });
      }
    });
    this.startGetVolume();
    this.startGetState();
  }
  stop() {
    this.stopGetVolume();
    this.stopGetState();
  }

  startGetVolume() {
    const { client, stream } = this.props;
    if (!client || !stream || !stream.audio) {
      return;
    }
    if (this.volumeTimer) {
      clearInterval(this.volumeTimer);
    }
    this.volumeTimer = setInterval(() => {
      const vol = client.getAudioVolume(stream.sid);
      this.setState({ volume: vol })
    }, 1000);
  }
  stopGetVolume() {
    clearInterval(this.volumeTimer);
  }

  startGetState() {
    const { client, stream } = this.props;
    if (!client || !stream || !stream.video) {
      return;
    }
    if (this.stateTimer) {
      clearInterval(this.stateTimer);
    }
    this.stateTimer = setInterval(() => {
      client.getAudioStats(stream.sid, (_stats) => {
        if (!this.isComponentMounted) return;
        const { stats } = this.state;
        stats.audioLost = _stats.lostpre;
        if (stats.biggestAudioLost < _stats.lostpre) {
          stats.biggestAudioLost = _stats.lostpre;
        }
        this.setState({ stats });
      }, (e) => {
        console.error('get video stats ', stream.sid);
      });
      client.getVideoStats(stream.sid, (_stats) => {
        if (!this.isComponentMounted) return;
        const { stats } = this.state;
        stats.videoLost = _stats.lostpre;
        if (stats.biggestVideoLost < _stats.lostpre) {
          stats.biggestVideoLost = _stats.lostpre;
        }
        this.setState({ stats });
      }, (e) => {
        console.error('get video stats ', stream.sid);
      });
      client.getNetworkStats(stream.sid, (_stats) => {
        if (!this.isComponentMounted) return;
        const { stats } = this.state;
        stats.rtt = _stats.rtt;
        if (stats.biggestRTT < _stats.rtt) {
          stats.biggestRTT = _stats.rtt;
        }
        this.setState({ stats });
      }, (e) => {
        console.error('get network stats ', stream.sid);
      });
    }, 1000);
  }
  stopGetState() {
    clearInterval(this.stateTimer);
  }

  handleClick = () => {
    const { stream, onClick } = this.props;
    onClick && onClick(stream);
  }

  renderStats = () => {
    const { stream } = this.props;
    const { volume, stats } = this.state;
    return stream.mediaStream
      ? <Fragment>
          <div style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>音量: {volume} % &nbsp;&nbsp;&nbsp;&nbsp;音频丢包率: {stats.audioLost} %</div>
          <div style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>视频丢包率: {stats.videoLost} % &nbsp;&nbsp;&nbsp;&nbsp;网络延时: {stats.rtt} ms</div>
        </Fragment>
      : null;
  }

  handlePlay = () => {
    const { client, stream } = this.props;
    client.resume(stream.sid, (err) => {
      if (err) {
        console.log(`播放失败 ${err}`);
        alert(`播放失败 ${err}`);
      } else {
        this.setState({
          showPlayMask: false
        });
      }
    });
  }

  renderVideoMask = () => {
    const { showPlayMask } = this.state;
    return showPlayMask ? (
      <div className="play-mask">
        <div className="mask-content">
          <div className="hint">由于当前浏览器不支持视频自动播放，请点击下面的按钮来播放</div>
          <button onClick={this.handlePlay}>播放</button>
        </div>
      </div>
    ) : null;
  }

  render() {
    const { stream, className, style } = this.props;

    const classes = classnames('media-player', className);
    const hasMediaStream = !!stream.mediaStream;

    return (
      <div className={classes} style={style} onClick={this.handleClick}>
        <div style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>用户ID: {stream.uid}</div>
        <div style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>流ID: {stream.sid}</div>
        { this.renderStats() }
        <div className="video-container" id={stream.sid} style={{ display: hasMediaStream ? 'block' : 'none' }}>
          { this.renderVideoMask() }
        </div>
        <p style={{ display: hasMediaStream ? 'none' : 'block' }}> unsubscribe </p>
      </div>
    )
  }
}
