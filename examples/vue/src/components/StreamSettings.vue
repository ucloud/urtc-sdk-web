<template>
  <div>
    <el-link :underline="false">
      <i @click="dialogVisible = true" class="el-icon-setting" style="color: #fff;"></i>
    </el-link>
    <el-dialog
      title="设置"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :append-to-body="true"
      :width="isMobile?'98%':'420px'">
      <el-form class="settings-panel" ref="form" :model="form" label-width="60px">
        <el-form-item label="麦克风">
          <el-select v-model="form.microphoneId" placeholder="切换麦克风" @change="handleMicrophoneChange">
            <el-option
              v-for="item in microphones"
              :key="item.deviceId"
              :label="item.label"
              :value="item.deviceId">
            </el-option>
          </el-select>
          <el-button style="margin-left: 10px;" size="mini" icon="el-icon-refresh" circle @click="updateMicrophones" title="重新获取麦克风列表"></el-button>
        </el-form-item>
        <el-form-item label="摄像头">
          <el-select v-model="form.cameraId" placeholder="切换摄像头" @change="handleCameraChange">
            <el-option
              v-for="item in cameras"
              :key="item.deviceId"
              :label="item.label"
              :value="item.deviceId">
            </el-option>
          </el-select>
          <el-button style="margin-left: 10px;" size="mini" icon="el-icon-refresh" circle @click="updateCameras" title="重新获取摄像头列表"></el-button>
        </el-form-item>
        <el-form-item label="分辨率">
          <el-select v-model="form.videoProfile" placeholder="切换分辨率" @change="handleVideoProfileChange">
            <el-option
              v-for="item in videoProfiles"
              :key="item"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { log } from '../utils/logger'
import { store } from '../store'
import { videoProfiles } from '../config/profiles'
import { updateMicrophones, updateCameras } from '../rtc'
import { isMobile } from '../utils/browser'

export default {
  props: ['stream'],
  computed: {
    isOpened() {
      return this.dialogVisible
    },
    microphones() {
      return this.$store.state.microphones
    },
    cameras() {
      return this.$store.state.cameras
    }
  },
  watch: {
    isOpened(newV) {
      if (newV) {
        if (this.microphones.length < 1) {
          this.updateMicrophones()
        }
        if (this.cameras.length < 1) {
          this.updateCameras()
        }
      }
    }
  },
  data: () => {
    return {
      dialogVisible: false,
      isMobile,
      videoProfiles,
      form: {
        microphoneId: store.state.advanceSettings.microphoneId,
        cameraId: store.state.advanceSettings.cameraId,
        videoProfile: store.state.advanceSettings.videoProfile,
      }
    }
  },
  methods: {
    updateMicrophones() {
      updateMicrophones(this).then((microphones) => {
        const microphone = microphones.find((item) => item.deviceId === this.form.microphoneId)
        if (!microphone) {
          this.form.microphoneId = microphones[0] && microphones[0].deviceId
        }
      })
    },
    updateCameras() {
      updateCameras(this).then((cameras) => {
        const camera = cameras.find((item) => item.deviceId === this.form.cameraId)
        if (!camera) {
          this.form.cameraId = cameras[0] && cameras[0].deviceId
        }
      })
    },
    handleMicrophoneChange() {
      log('切换麦克风', this.form.microphoneId)
      this.stream
        .switchDevice('audio', this.form.microphoneId)
        .then(() => {
          log('切换麦克风成功')
          store.commit('updateAdvanceSettings', {microphoneId: this.form.microphoneId})
        })
        .catch((err) => {
          log('切换麦克风失败', err)
          this.$notify.error({
            title: '切换麦克风失败',
            message: `${err}`
          })
        })
    },
    handleCameraChange() {
      log('切换摄像头', this.form.cameraId)
      this.stream
        .switchDevice('video', this.form.cameraId)
        .then(() => {
          log('切换摄像头成功')
          store.commit('updateAdvanceSettings', {cameraId: this.form.cameraId})
        })
        .catch((err) => {
          log('切换摄像头失败', err)
          this.$notify.error({
            title: '切换摄像头失败',
            message: `${err}`
          })
        })
    },
    handleVideoProfileChange() {
      log('切换分辨率', this.form.videoProfile)
      this.stream
        .setVideoProfile(this.form.videoProfile)
        .then(() => {
          log('切换分辨率成功')
          store.commit('updateAdvanceSettings', {videoProfile: this.form.videoProfile})
        })
        .catch((err) => {
          log('切换分辨率失败', err)
          this.$notify.error({
            title: '切换分辨率失败',
            message: `${err}`
          })
        })
    },
  }
}
</script>

<style scoped lang='less'>
.settings-panel {
  display: flex;
  flex-direction: column;
}
</style>
