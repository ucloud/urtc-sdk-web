<template>
  <div class="stream-stats">
    <div class="audio">
      <p>延迟: {{stats.network.rtt}} ms </p>
      <p>码率: {{stats.audio.bitrate}} bps </p>
      <p>丢包: {{stats.audio.packetLossRate}} % </p>
      <p>音量: {{stats.audio.volume}} % </p>
      <p>编码: {{stats.audio.codec}} </p>
    </div>
    <div class="video">
      <p>码率: {{stats.video.bitrate}} bps </p>
      <p>帧率: {{stats.video.framerate}} fps</p>
      <p>丢包: {{stats.video.packetLossRate}} % </p>
      <p>宽度: {{stats.video.width}} </p>
      <p>高度: {{stats.video.height}} </p>
      <p>编码: {{stats.video.codec}} </p>
    </div>
  </div>
</template>

<script>
export default {
  props: ['stream'],
  data: () => {
    return {
      stats: {
        audio: {
          bitrate: -1,
          packetLossRate: -1,
          volume: -1,
          codec: '',
        },
        video: {
          bitrate: -1,
          framerate: -1,
          packetLossRate: -1,
          width: -1,
          height: -1,
          codec: '',
        },
        network: {
          rtt: -1,
        },
        biggestRTT: -1,
      },
      volume: -1,
    }
  },
  mounted() {
    this.isComponentMounted = true
    if (this.stream) {
      this.start()
    }
  },
  beforeDestroy() {
    this.stop()
    this.isComponentMounted = false
  },
  computed: {
    isStreamChanged() {
      return !!this.stream
    },
  },
  watch: {
    isStreamChanged(newV) {
      if (newV) {
        this.start()
      } else {
        this.stop()
      }
    },
  },
  methods: {
    start() {
      this.startGetVolume()
      this.startGetState()
    },
    stop() {
      this.stopGetVolume()
      this.stopGetState()
    },
    startGetVolume() {
      const { stream } = this
      if (this.volumeTimer) {
        clearInterval(this.volumeTimer)
      }
      this.volumeTimer = setInterval(() => {
        const vol = stream.getAudioLevel()
        this.volume = vol
      }, 1000)
    },
    stopGetVolume() {
      clearInterval(this.volumeTimer)
    },
    startGetState() {
      const { stream } = this
      if (this.stateTimer) {
        clearInterval(this.stateTimer)
      }
      this.stateTimer = setInterval(() => {
        stream.getStats()
          .then((resp) => {
            const { audio, video, network } = resp
            this.stats.audio = audio
            this.stats.video = video
            this.stats.network = network
            if (this.stats.biggestRTT < network.rtt) {
              this.stats.biggestRTT = network.rtt
            }
          })
      }, 1000)
    },
    stopGetState() {
      clearInterval(this.stateTimer)
      this.stats.audio = {
        bitrate: -1,
        packetLossRate: -1,
        volume: -1,
        codec: '',
      }
      this.stats.video = {
        bitrate: -1,
        framerate: -1,
        packetLossRate: -1,
        width: -1,
        height: -1,
        codec: '',
      }
      this.stats.network = { rtt: -1 }
    },
  },
}
</script>

<style scoped lang='less'>
.stream-stats {
  position: absolute;
  top: 22px;
  left: 0;
  z-index: 1;
  text-align: left;
  display: flex;

  .audio,
  .video {
    padding: 4px 0;
    background-color: rgba(0, 0, 0, 0.2);
    color: #fff;
  }

  p {
    margin: 0;
    font-size: 12px;
    transform: scale(0.8);
    line-height: 1;
  }
}
</style>
