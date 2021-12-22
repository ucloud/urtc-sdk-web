<template>
  <div class="status" title="网络上行质量及延迟"><i :title="signalText" :class="['iconfont', 'icon-phone-signal-full', signalClass]"/> {{uplinkDelay | formatUplinkDelay}}</div>
</template>

<script>
export default {
  computed: {
    uplinkDelay() {
      return this.$store.state.uplinkDelay
    },
    signalText() {
      switch (this.$store.state.uplinkQuality) {
        case '1':
          return '优秀'
        case '2':
          return '良好'
        case '3':
          return '一般'
        case '4':
          return '较差'
        case '5':
          return '糟糕'
        case '6':
          return '断开'
        case '0':
        default:
          return '未知'
      }
    },
    signalClass() {
      switch (this.$store.state.uplinkQuality) {
        case '1':
          return 'signal-1'
        case '2':
          return 'signal-2'
        case '3':
          return 'signal-3'
        case '4':
          return 'signal-4'
        case '5':
          return 'signal-5'
        case '6':
          return 'signal-6'
        case '0':
        default:
          return ''
      }
    }
  },
  filters: {
    formatUplinkDelay: function(val) {
      if (val < 0 || val === undefined) {
        return 'N/A'
      } else {
        return val + 'ms'
      }
    }
  }
}
</script>

<style scoped lang='less'>
.status {
  .icon-phone-signal-full {
    color: #fff;
    &.signal-1 {
      color: rgb(129 234 134);
    }
    &.signal-2 {
      color: rgb(129 234 134);
    }
    &.signal-3 {
      color: rgb(82 148 85);
    }
    &.signal-4 {
      color: rgb(224 191 92);
    }
    &.signal-5 {
      color: rgb(244 67 54);
    }
    &.signal-6 {
      color: rgb(177 175 175);
    }
  }
}
</style>
