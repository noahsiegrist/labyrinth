<template>
  <div id="app">
    <Matrix />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Matrix from './components/Matrix.vue';


@Component({
  components: {
    Matrix,
  },
})
export default class App extends Vue {}
</script>

<style lang="scss">

</style>
