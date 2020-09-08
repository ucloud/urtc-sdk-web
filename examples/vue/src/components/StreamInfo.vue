<template>
  <div :class="classes">
    <div style="overflow: 'hidden'; text-overflow: 'ellipsis';">用户ID: {{stream.uid}}</div>
    <div style="overflow: 'hidden'; text-overflow: 'ellipsis';">流ID: {{stream.sid}}</div>
    <div v-show="stream.mediaStream" style="overflow: 'hidden'; text-overflow: 'ellipsis';">音量: {{volume}} % &nbsp;&nbsp;&nbsp;&nbsp;音频丢包率: {{stats.audioLost}} %</div>
    <div v-show="stream.mediaStream" style="overflow: 'hidden'; text-overflow: 'ellipsis';">视频丢包率: {{stats.videoLost}} % &nbsp;&nbsp;&nbsp;&nbsp;网络延时: {{stats.rtt}} ms</div>
    <p v-show="!stream.mediaStream">unsubscribe</p>
  </div>
</template>

<script>
import classnames from 'classnames';

export default {
  name: 'StreamInfo',
  data: function () {
    const classes = classnames('stream-info', this.className);

    return {
      classes,
      volume: 0,
      stats: {
        audioLost: 0,
        biggestAudioLost: 0,
        videoLost: 0,
        biggestVideoLost: 0,
        rtt: 0,
        biggestRTT: 0
      }
    };
  },
  props: {
    className: {
      type: String,
      default: ''
    },
    stream: {
      type: Object,
      default: function () {
        return {};
      }
    },
    client: {
      type: Object,
      default: function () {
        return null;
      }
    },
    onClick: {
      type: Function,
      default: function () {}
    }
  },
  created: function () {
    this.volumeTimer = 0;
    this.stateTimer = 0;
  },
  mounted: function () {
    this.isComponentDestroyed = false;
    if (this.stream.mediaStream) {
      this.start();
    }
  },
  beforeDestroy: function () {
    this.stop();
  },
  destroyed: function () {
    this.isComponentDestroyed = true;
  },
  watch: {
    'stream.mediaStream': function (val, oldVal) {
      console.log('media stream changed: ', val, oldVal);
      if (val) {
        this.start();
      } else {
        this.stop();
      }
    }
  },
  methods: {
    start: function () {
      this.startGetVolume();
      this.startGetState();
    },
    stop: function () {
      this.stopGetVolume();
      this.stopGetState();
    },
    startGetVolume: function () {
      const { client, stream } = this;
      if (!client || !stream || !stream.audio) {
        return;
      }
      if (this.volumeTimer) {
        clearInterval(this.volumeTimer);
      }
      this.volumeTimer = setInterval(() => {
        this.volume = client.getAudioVolume(stream.sid);
      }, 1000);
    },
    stopGetVolume: function () {
      clearInterval(this.volumeTimer);
    },
    startGetState: function () {
         const { client, stream } = this;
        if (!client || !stream || !stream.video) {
          return;
        }
        if (this.stateTimer) {
          clearInterval(this.stateTimer);
        }
        this.stateTimer = setInterval(() => {
          client.getAudioStats(stream.sid, (_stats) => {
            if (this.isComponentDestroyed) return;
            const { stats } = this;
            stats.audioLost = _stats.lostpre;
            if (stats.biggestAudioLost < _stats.lostpre) {
              stats.biggestAudioLost = _stats.lostpre;
            }
          }, (e) => {
            console.error('get video stats ', stream.sid);
          });
          client.getVideoStats(stream.sid, (_stats) => {
            if (this.isComponentDestroyed) return;
            const { stats } = this;
            stats.videoLost = _stats.lostpre;
            if (stats.biggestVideoLost < _stats.lostpre) {
              stats.biggestVideoLost = _stats.lostpre;
            }
          }, (e) => {
            console.error('get video stats ', stream.sid);
          });
          client.getNetworkStats(stream.sid, (_stats) => {
            if (this.isComponentDestroyed) return;
            const { stats } = this;
            stats.rtt = _stats.rtt;
            if (stats.biggestRTT < _stats.rtt) {
              stats.biggestRTT = _stats.rtt;
            }
          }, (e) => {
            console.error('get network stats ', stream.sid);
          });
        }, 1000);
    },
    stopGetState: function () {
      clearInterval(this.stateTimer);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
