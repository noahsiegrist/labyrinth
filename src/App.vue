<template>
    <div id="app">
        <ControlPanel/>
        <Matrix/>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import Matrix from './components/Matrix.vue';
    import ControlPanel from './components/ControlPanel.vue';


    @Component({
        components: {
            Matrix,
            ControlPanel,
        },
    })
    export default class App extends Vue {
    }
</script>

<style lang="scss">

</style>
