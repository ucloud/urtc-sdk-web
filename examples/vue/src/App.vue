<template>
  <div id="app">
    <Room/>
    <br/>
    <a href="https://github.com/ucloud/urtc-sdk-web" target="_blank" rel="noopener noreferrer">
      API 文档请看这里
    </a>
  </div>
</template>

<script>
import Room from './pages/Room.vue';

export default {
  name: 'app',
  components: {
    Room
  }
};
</script>

<style>
#app {
  margin-top: 60px;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
