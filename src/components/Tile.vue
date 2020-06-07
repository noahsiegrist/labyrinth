<template>
    <div class="cell" v-bind:class="{right: tile.right, bottom: tile.bottom, left: tile.left, top: tile.top}">
        <button class="right" v-on:mouseover="toggleWall({x: tile.x, y: tile.y, side: 'right'})"></button>
        <button class="bottom" v-on:mouseover="toggleWall({x: tile.x, y: tile.y, side: 'bottom'})"></button>
    </div>
</template>

<script>
    import {mapMutations} from 'vuex'

    export default {
        name: 'Tile',
        props: ['tile'],
        methods: {
            ...mapMutations(['toggleWall']),
        },
        updated() {
            console.log('tileupdate')
            console.log(this.tile)
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
    .cell {
        position: relative;
        display: table-cell;
        border: 2px #c5c5c5 solid;

        &.top{
            border-top-color: #000;
        }

        &.right{
            border-right-color: #000;
        }

        &.bottom{
            border-bottom-color: #000;
        }

        &.left{
            border-left-color: #000;
        }
    }

    .cell:after {
        content: "";
        display: block;
        padding-bottom: 100%;
    }

    button{
        position: absolute;
        z-index: 999;
        opacity: 0.1;

        &.right {

            height: 100%;
            width: 50%;
            right: -25%;
            top: 0;
        }
        &.bottom{
            height: 50%;
            width: 100%;
            left: 0;
            bottom: -25%;
        }
    }

</style>
