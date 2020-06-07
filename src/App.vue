<template>
  <div id="app">
    <Matrix />
  </div>
</template>

<script>
import Matrix from './components/Matrix.vue'

export default {
  name: 'App',
  components: {
    Matrix
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
