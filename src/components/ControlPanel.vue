<template>
    <div class="panel">
        <button v-on:click="findPath">Find Path</button>
    </div>
</template>

<script>
    import PathFinder from '@/services/pathfinder'
    import {mapActions, mapGetters} from 'vuex'

    export default {
        name: 'ControlPanel',
        methods: {
            ...mapActions(["reset"]),
            ...mapGetters(['start']),
            findPath() {
                if (this.start.color !== 0) {
                    console.log('reset')
                    this.reset()
                }
                PathFinder.findPath()
            },
        },
    }
</script>

<style scoped lang="scss">
    .panel {
    }
</style>
