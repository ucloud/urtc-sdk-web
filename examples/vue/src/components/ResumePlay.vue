<template>
  <el-dialog
    :visible.sync="open"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :append-to-body="true"
    :show-close="false"
    :center="true"
    :modal="true"
    :modal-append-to-body="true"
    top="25vh"
    width="150px"
    class="resume-dialog">
    <i class="el-icon-video-play" @click="resume"></i>
  </el-dialog>
</template>

<script>
import { getRTCInstance } from '../rtc'

export default {
  props: ['open'],
  methods: {
    resume() {
      getRTCInstance().resumePlay()
    }
  }
}
</script>

<style lang='less'>
.resume-dialog {
  .el-dialog {
    box-shadow: 0 0 0 0;
    background: rgba(0, 0, 0, 0);

    .el-icon-video-play {
      font-size: 100px;
      color: #fff;
      cursor: pointer;
    }
  }
}
</style>
