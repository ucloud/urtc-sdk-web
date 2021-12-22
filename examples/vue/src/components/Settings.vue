<template>
  <div>
    <el-link :underline="false">
      <i @click="dialogVisible = true" class="el-icon-setting"></i>
    </el-link>
    <el-dialog
      title="更多设置"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :append-to-body="true"
      top="5vh"
      :width="isMobile?'98%':'640px'">
      <el-form class="settings-panel" ref="form" :model="form" label-width="80px">
        <el-form-item label="房间类型">
          <el-select v-model="form.roomType" placeholder="请选择房间类型">
            <el-option label="会议模式" value="conference"></el-option>
            <el-option label="直播模式" value="live"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用户角色">
          <el-select v-model="form.roleType" placeholder="请选择用户角色">
            <el-option label="演讲者" value="speaker"></el-option>
            <el-option label="听众" value="audience"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="麦克风">
          <el-select v-model="form.microphoneId" placeholder="请选择麦克风">
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
          <el-select v-model="form.cameraId" placeholder="请选择摄像头">
            <el-option
              v-for="item in cameras"
              :key="item.deviceId"
              :label="item.label"
              :value="item.deviceId">
            </el-option>
          </el-select>
          <el-button style="margin-left: 10px;" size="mini" icon="el-icon-refresh" circle @click="updateCameras" title="重新获取摄像头列表"></el-button>
        </el-form-item>
        <el-form-item label="视频流">
          <el-select v-model="form.videoProfile" placeholder="请选择视频流分辨率">
            <el-option
              v-for="item in videoProfiles"
              :key="item"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
          (分辨率)
        </el-form-item>
        <el-form-item label="屏幕共享">
          <el-select v-model="form.screenProfile" placeholder="请选择屏幕共享分辨率">
            <el-option
              v-for="item in screenProfiles"
              :key="item"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
          (分辨率)
        </el-form-item>
        <el-form-item label="视频编码">
          <el-select v-model="form.videoCodec" placeholder="请选择视频编码格式">
            <el-option label="vp8" value="vp8"></el-option>
            <el-option label="h264" value="h264"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="AppId">
          <el-input v-model="form.appId"></el-input>
        </el-form-item>
        <el-form-item label="AppKey">
          <el-input v-model="form.appKey" show-password></el-input>
        </el-form-item>
        <el-form-item label="纯音频">
          <el-switch v-model="form.audioMode" active-text="开启" inactive-text="关闭"></el-switch>
        </el-form-item>
        <el-form-item label="屏幕共享">
          <el-switch v-model="form.shareMic" active-text="采集" inactive-text="不采集"></el-switch>
          （麦克风）
          <el-tooltip content="屏幕共享时，将屏幕共享的画面以及麦克风中采集的声音用同一条流推出" placement="top">
            <i class="el-icon-info"/>
          </el-tooltip>
        </el-form-item>
        <el-form-item label="图片流">
          <el-switch v-model="enablePicture" active-text="使用" inactive-text="不使用"></el-switch>
          <el-upload
            v-if="enablePicture"
            action="#"
            list-type="picture-card"
            :limit="1"
            :on-change="handleFileChange"
            :file-list="fileList"
            :disabled="disabledAddFile"
            :auto-upload="false">
              <i slot="default" class="el-icon-plus"></i>
              <div slot="file" slot-scope="{file}">
                <img
                  class="el-upload-list__item-thumbnail"
                  :src="file.url" alt=""
                >
                <span class="el-upload-list__item-actions">
                  <span
                    class="el-upload-list__item-delete"
                    @click="handleRemove(file)"
                  >
                    <i class="el-icon-delete"></i>
                  </span>
                </span>
              </div>
          </el-upload>
        </el-form-item>
        <el-form-item label="Debug">
          <el-switch v-model="form.debugMode" active-text="开启" inactive-text="关闭"></el-switch>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleSave">保存</el-button>
        <el-button @click="reset">恢复默认值</el-button>
        <el-button @click="dialogVisible = false">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { log } from '../utils/logger'
import { store } from '../store'
import { videoProfiles, screenProfiles, smallProfiles } from '../config/profiles'
import { updateMicrophones, updateCameras} from '../rtc'
import { isMobile } from '../utils/browser'
import { getPictureURL } from '../utils/image'

export default {
  data: () => {
    const persistent = store.state.advanceSettings
    return {
      dialogVisible: false,
      isMobile,
      videoProfiles,
      screenProfiles,
      smallProfiles,
      form: {
        roomType: persistent.roomType,
        roleType: persistent.roleType,
        cameraId: persistent.cameraId,
        microphoneId: persistent.microphoneId,
        videoProfile: persistent.videoProfile,
        smallVideoProfile: persistent.smallVideoProfile,
        screenProfile: persistent.screenProfile,
        videoCodec: persistent.videoCodec,
        appId: persistent.appId,
        appKey: persistent.appKey,
        enableSmallStream: persistent.enableSmallStream,
        audioMode: persistent.audioMode,
        debugMode: persistent.debugMode,
        prodEnv: persistent.prodEnv,
        shareMic: persistent.shareMic,
      },
      fileList: [],
      enablePicture: false,
      disabledAddFile: false,
    }
  },
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
    },
    enablePicture(newV) {
      if (!newV) {
        this.fileList = []
        this.disabledAddFile = false
        store.commit('updatePicture', null)
      }
    }
  },
  mounted() {
    if (store.state.picture) {
      getPictureURL(store.state.picture.raw).then(url => {
        this.enablePicture = true
        this.fileList = [ { name: store.state.picture.name, url } ]
      })
    }
  },
  methods: {
    handleSave() {
      const data = {
        roomType: this.form.roomType,
        roleType: this.form.roleType,
        microphoneId: this.form.microphoneId,
        cameraId: this.form.cameraId,
        videoProfile: this.form.videoProfile,
        smallVideoProfile: this.form.smallVideoProfile,
        screenProfile: this.form.screenProfile,
        videoCodec: this.form.videoCodec,
        appId: this.form.appId,
        appKey: this.form.appKey,
        enableSmallStream: this.form.enableSmallStream,
        audioMode: this.form.audioMode,
        debugMode: this.form.debugMode,
        prodEnv: this.form.prodEnv,
        shareMic: this.form.shareMic,
      }
      log('设置参数 ', JSON.stringify(data, ' ', 2))
      store.commit('updateAdvanceSettings', data)
      this.dialogVisible = false
    },
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
    reset() {
      store.commit('resetAdvanceSettings')
      this.form = { ...store.state.advanceSettings }
    },
    handleFileChange(_, fileList) {
      if (fileList.length > 0) {
        this.disabledAddFile = true
      }
      this.fileList = fileList
      store.commit('updatePicture', this.fileList[0])
    },
    handleRemove(file) {
      const idx = this.fileList.findIndex(item => item === file)
      if (idx >= 0) {
        this.fileList.splice(idx, 1)
      }
      this.disabledAddFile = false
      store.commit('updatePicture', null)
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
