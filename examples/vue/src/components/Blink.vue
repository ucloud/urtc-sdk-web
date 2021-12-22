<template>
  <div class="blink">
    <slot></slot>
    <transition name="el-fade-in-linear">
      <div v-show="show" class="transition-box"></div>
    </transition>
  </div>
</template>

<script>
const interval = 1000
export default {
  props: ['blink'],
  data: () => ({
    show: false,
    timer: 0,
  }),
  mounted() {
    if (this.blink) {
      this.start()
    }
  },
  beforeDestroy() {
    this.stop()
  },
  watch: {
    blink(newV) {
      this.stop()
      if (newV) {
        this.start()
      } else {
        this.show = false
      }
    }
  },
  methods: {
    start() {
      this.show = !this.show
      this.timer = setTimeout(() => {
        this.start()
      }, interval)
    },
    stop() {
      if (this.timer) {
        clearTimeout(this.timer)
        this.timer = 0
      }
    }
  }
}
</script>

<style lang="less">
.blink {
  position: relative;

  .transition-box {
    position: absolute;
    top: -6px;
    right: 0px;
    width: 12px;
    height: 12px;
    border-radius: 6px;
    border: 1px solid #fff;
    background-color: #ff4069;
    text-align: center;
    color: #fff;
    box-sizing: border-box;
  }
}
</style>
