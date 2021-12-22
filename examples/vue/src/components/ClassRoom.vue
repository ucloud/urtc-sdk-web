<template>
  <div class="rtc-container"
    v-loading="isIniting"
    element-loading-text="正在初始化..."
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
    >
    <el-container>
      <el-header class="status-bar">
        <div class="room-id">频道号：{{channel}}</div>
        <status/>
        <resume-play :open="rtc.needResume"/>
      </el-header>
      <el-container class="main-container">
        <el-main v-if="!isMobile" class="main-panel">
          <el-tooltip class="item" effect="dark" content="视频显示区，默认显示本地流或第一条远端流，点选右侧列表中的流，可切换显示该流。" placement="top-start">
            <i class="el-icon-info"/>
          </el-tooltip>
          <video v-if="chosenStream" muted autoplay ref="display" id="big-video-display"></video>
        </el-main>
        <el-aside :class="isMobile?'streams-container mobile':'streams-container'" :width="isMobile?'100%':'300px'">
          <div v-if="rtc.localStream" class="local-streams">
            <stream :stream="rtc.localStream" v-on:choose-stream="onChooseStream"></stream>
          </div>
          <div class="remote-streams">
            <stream :stream="stream" :key="stream.id" v-for="stream in rtc.remoteStreams" v-on:choose-stream="onChooseStream" v-on:before-reload-chosen-stream="onBeforeReloadChosenStream" v-on:reload-chosen-stream="onReloadChosenStream"></stream>
          </div>
        </el-aside>
      </el-container>
      <el-footer v-if="!isMobile" class="menu-bar">
        <el-button type="primary" @click="onLeave">离开房间</el-button>
        <el-button type="success" :disabled="isOnPub" @click="onPub">{{rtc.localStream ? '下麦' : '上麦'}}</el-button>
        <blink :blink="!!rtc.localScreenStream">
          <el-button v-if="rtc.isSupportScreenShare" type="success" :disabled="isOnPubScreen" @click="onPubScreen">{{rtc.localScreenStream ? '停止屏幕共享' : '屏幕共享'}}</el-button>
        </blink>
      </el-footer>
      <el-footer v-if="isMobile" class="menu-bar mobile" height='44px'>
        <el-button type="primary" size="small" icon="el-icon-switch-button" circle @click="onLeave" title="离开房间"></el-button>
        <el-button type="success" size="small" :icon="rtc.localStream?'el-icon-bottom':'el-icon-top'" :disabled="isOnPub" circle @click="onPub" :title="rtc.localStream?'下麦':'上麦'"></el-button>
      </el-footer>
    </el-container>
  </div>
</template>

<script>
import { store } from '../store'
import { getRTCInstance, version } from '../rtc'
import Stream from './Stream.vue'
import Status from './Status.vue'
import Blink from './Blink.vue'
import ResumePlay from './ResumePlay.vue'
import { isMobile } from '../utils/browser'
import { log } from '../utils/logger'

export default {
  components: {
    Stream,
    Status,
    Blink,
    ResumePlay,
  },
  data() {
    const rtc = getRTCInstance(this)
    let isIniting = true
    if (!rtc.isJoined) {
      if (!store.state.settings.channel || !store.state.settings.username) {
        this.$router.replace('/')
        return
      }
      rtc.init()
      rtc.join(store.state.settings.channel, store.state.settings.username)
        .then(() => {
          if (store.state.advanceSettings.roleType === 'speaker') {
            // 演讲者自动上麦
            rtc.publish()
              .then(() => {
                this.isIniting = false
                const localStream = rtc.localStream
                this.$nextTick(() => {
                  if (localStream) {
                    this.rtc.playLocalStream(localStream)
                    if (!this.chosenStream) {
                      this.chosenStream = localStream
                    }
                  }
                })
              })
              .catch((err) => {
                this.$notify.error({
                  title: '发布失败',
                  message: `${err}`
                })
              })
          } else {
            this.isIniting = false
          }
        })
    } else {
      if (store.state.advanceSettings.roleType === 'speaker') {
        // 演讲者自动上麦
        rtc.publish()
          .then(() => {
            this.isIniting = false
            const localStream = rtc.localStream
            this.$nextTick(() => {
              if (localStream) {
                this.rtc.playLocalStream(localStream)
                if (!this.chosenStream) {
                  this.chosenStream = localStream
                }
              }
            })
          })
          .catch((err) => {
            this.$notify.error({
              title: '发布失败',
              message: `${err}`
            })
          })
      } else {
        isIniting = false
      }
    }
    return {
      channel: store.state.settings.channel || '',
      username: store.state.settings.username || '',
      isIniting,
      chosenStream: undefined,
      rtc,
      version,
      isRecording: false,
      isRelaying: false,
      isMobile,
      isOnPub: false,
      isOnPubScreen: false,
    }
  },
  mounted() {
    if (this.rtc.localStream) {
      this.chosenStream = this.rtc.localStream
    } else if (this.rtc.remoteStreams.length > 0) {
      this.chosenStream = this.rtc.remoteStreams[0]
    }
  },
  watch: {
    'rtc.localStream': function(newV, oldV) {
      if (!this.chosenStream && newV) {
        this.chosenStream = newV
        return
      }
      if (this.chosenStream === oldV) {
        if (newV) {
          this.chosenStream = newV
        } else if (this.rtc.remoteStreams.length > 0) {
          this.chosenStream = this.rtc.remoteStreams[0]
        } else {
          this.chosenStream = null
        }
      }
    },
    'rtc.remoteStreams': function(newV) {
      if (!this.chosenStream) {
        if (newV.length > 0) {
          this.chosenStream = this.rtc.remoteStreams[0]
        }
      } else {
        if (this.chosenStream.isLocal) return
        const stream = this.rtc.remoteStreams.find(item => item === this.chosenStream)
        if (!stream) {
          if (this.rtc.remoteStreams.length > 0) {
            this.chosenStream = this.rtc.remoteStreams[0]
          } else {
            this.chosenStream = null
          }
        }
      }
    },
    chosenStream: function () {
      this.$nextTick(() => {
        const display = this.$refs['display']
        if (display && this.chosenStream) {
          display.srcObject = this.chosenStream.isSubscribingSmall ? this.chosenStream.small.mediaStream : this.chosenStream.mediaStream
        }
      })
    }
  },
  methods: {
    onPub() {
      this.isOnPub = true
      if (this.rtc.localStream) {
        this.rtc
          .unpublish()
          .catch((err) => {
            this.$notify.error({
              title: '取消发布失败',
              message: `${err}`
            })
          })
          .finally(() => {
            this.isOnPub = false
          })
      } else {
        this.rtc
          .publish()
          .then(() => {
            const localStream = this.rtc.localStream
            if (localStream) {
              this.$nextTick(() => {
                this.rtc.playLocalStream(localStream)
              })
            }
          })
          .catch((err) => {
            this.$notify.error({
              title: '发布失败',
              message: `${err}`
            })
          })
          .finally(() => {
            this.isOnPub = false
          })
      }
    },
    onPubScreen() {
      this.isOnPubScreen = true
      if (this.rtc.localScreenStream) {
        this.rtc
          .unpublishScreen()
          .catch((err) => {
            this.$notify.error({
              title: '取消屏幕共享流失败',
              message: `${err}`
            })
          })
          .finally(() => {
            this.isOnPubScreen = false
          })
      } else {
        this.rtc
          .publishScreen()
          .catch((err) => {
            if (err.code === '3005') {
              log.warn('未授权，停止发布')
            } else {
              this.$notify.error({
                title: '发布屏幕共享流失败',
                message: `${err}`
              })
            }
          })
          .finally(() => {
            this.isOnPubScreen = false
          })
      }
    },
    onLeave() {
      this.rtc.leave()
      this.$router.replace('/')
    },
    onChooseStream: function(stream) {
      this.chosenStream = stream
    },
    onBeforeReloadChosenStream: function(stream) {
      if (stream && stream === this.chosenStream) {
        this.$refs['display'].srcObject = null
      }
    },
    onReloadChosenStream: function(stream) {
      if (stream && stream === this.chosenStream) {
        this.$nextTick(() => {
          this.$refs['display'].srcObject = stream.isSubscribingSmall ? stream.small.mediaStream : stream.mediaStream
        })
      }
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
  .rtc-container {
    display: flex;
    flex: 1;

    .text {
      font-size: 14px;

      &.small {
        transform: scale(.7);
      }

      &.left {
        text-align: left;
        transform-origin: 0%;
      }

      &.right {
        text-align: right;
        transform-origin: 100%;
      }
    }

    .main-container {
      display: flex;
      width: 100%;
      height: calc(100% - 120px);

      .main-panel {
        position: relative;
        padding: 0;
        min-width: 640px;
        height: 100%;
        background-color: #000;
        border-radius: 4px;
        overflow: hidden;

        .el-icon-info {
          position: absolute;
          z-index: 2;
          top: 4px;
          right: 4px;

          &:hover {
            color: #eee;
          }
        }

        video {
          width: 100%;
          height: 100%;
        }
      }
      .streams-container {
        display: flex;
        flex-direction: column;
        height: 100%;
        padding:0 4px;
        .local-streams,
        .remote-streams {
          display: flex;
          flex-direction: column;
          padding: 0 4px;
        }
        .local-streams {
          margin-bottom: 10px;
        }
        .remote-streams {
          overflow-y: auto;
          .stream {
            margin-bottom: 4px;
          }
        }
        &.mobile {
          overflow-y: auto;
          .remote-streams {
            overflow-y: visible;
          }

          .stream {
            min-height: 240px;
          }
        }
      }
    }

    .status-bar {
      display: flex;
      padding: 10px;
      line-height: 30px;
      color: #eee;

      .status {
        margin-left: 20px;
        padding-left: 20px;
        border-left: 1px solid #333;
      }
    }

    .menu-bar {
      display: flex;
      flex-flow: row-reverse;
      padding: 10px;

      button {
        margin: 0 6px;
      }

      &.mobile {
        justify-content: center;
        padding: 6px;

        .el-button.stop {
          border: 1px solid #fff;
        }
        .el-button.stop::before {
          position: absolute;
          content: ' ';
          display: block;
          width: 30px;
          border-top: 1px solid #fff;
          transform: translate(-8px, 5px) rotateZ(45deg);
        }
      }

      .el-badge__content {
        &.is-dot {
          right: 10px;
        }
      }
    }
  }
</style>
