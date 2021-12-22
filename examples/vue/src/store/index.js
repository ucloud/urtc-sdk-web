import Vue from 'vue'
import Vuex from 'vuex'
import { loadStore, saveStore } from './sessionStore'
import { appId, appKey } from '../config'

Vue.use(Vuex)

const defaultAdvanceSettings = {
  roomType: 'conference', // conference live
  roleType: 'speaker', // "audience" | "speaker"
  microphoneId: '',
  cameraId: '',
  videoProfile: '360p_2',
  smallVideoProfile: '160*90',
  screenProfile: '1080p',
  videoCodec: 'vp8',
  appId: appId,
  appKey: appKey,
  enableSmallStream: false,
  audioMode: false,
  debugMode: false,
  prodEnv: true,
  shareMic: false,
}

const persistent = loadStore() || {}

export const store = new Vuex.Store({
  state: {
    uplinkQuality: -1,
    uplinkDelay: -1,
    downlinkQuality: -1,
    microphones: [],
    cameras: [],
    settings: {
      channel: persistent.channel || '',
      username: persistent.username || '',
    },
    advanceSettings: {
      roomType: persistent.roomType || defaultAdvanceSettings.roomType,
      roleType: persistent.roleType || defaultAdvanceSettings.roleType,
      microphoneId: persistent.microphoneId || defaultAdvanceSettings.microphoneId,
      cameraId: persistent.cameraId || defaultAdvanceSettings.cameraId,
      videoProfile: persistent.videoProfile || defaultAdvanceSettings.videoProfile,
      smallVideoProfile: persistent.smallVideoProfile || defaultAdvanceSettings.smallVideoProfile,
      screenProfile: persistent.screenProfile || defaultAdvanceSettings.screenProfile,
      videoCodec: persistent.videoCodec || defaultAdvanceSettings.videoCodec,
      appId: persistent.appId || defaultAdvanceSettings.appId,
      appKey: persistent.appKey || defaultAdvanceSettings.appKey,
      enableSmallStream: persistent.enableSmallStream || defaultAdvanceSettings.enableSmallStream,
      audioMode: persistent.audioMode || defaultAdvanceSettings.audioMode,
      debugMode: persistent.debugMode || defaultAdvanceSettings.debugMode,
      prodEnv: persistent.prodEnv || defaultAdvanceSettings.prodEnv,
      shareMic: persistent.shareMic || defaultAdvanceSettings.shareMic,
    },
    picture: null,
  },
  mutations: {
    updateUplinkQuality(state, payload) {
      state.uplinkQuality = payload
    },
    updateUplinkDelay(state, payload) {
      state.uplinkDelay = payload
    },
    updateDownlinkQuality(state, payload) {
      state.downlinkQuality = payload
    },
    updateMicrophones(state, payload) {
      state.microphones = payload
    },
    updateCameras(state, payload) {
      state.cameras = payload
    },
    updateSettings(state, payload) {
      state.settings = { ...state.settings, ...payload }
      saveStore({ ...state.settings, ...state.advanceSettings })
    },
    updateAdvanceSettings(state, payload) {
      state.advanceSettings = { ...state.advanceSettings, ...payload }
      saveStore({ ...state.settings, ...state.advanceSettings })
    },
    resetAdvanceSettings(state) {
      state.advanceSettings = { ...defaultAdvanceSettings }
      saveStore({ ...state.settings, ...state.advanceSettings })
    },
    updatePicture(state, payload) {
      state.picture = payload
    },
  }
})
