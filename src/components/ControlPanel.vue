<template>
    <div class="panel">
        <button v-on:click="findPath">Find Path</button>
    </div>
</template>

<script>
    import PathFinder from '@/services/pathfinder'
    import {mapActions, mapGetters, mapMutations} from 'vuex'

    export default {
        name: 'ControlPanel',
        methods: {
            ...mapActions(["reset"]),
            ...mapGetters(['start']),
            ...mapMutations(['clearDrawState']),
            findPath() {
                if (this.start.color !== 0) {
                    console.log('reset')
                    this.reset()
                }
                PathFinder.findPath()
            },
        },
        mounted() {
            window.addEventListener('keyup', (e) => {
                if (e.key === 'Shift') {
                    this.clearDrawState();
                }
            })
        },
    }
</script>

<style scoped lang="scss">
    .panel {
    }
</style>
