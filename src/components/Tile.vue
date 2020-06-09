<template>
    <div
            class="cell"
            v-bind:class="{right: tile.right, bottom: tile.bottom, left: tile.left, top: tile.top, active: active}"

    >
        <div class="overflow-wrapper">
            <div class="circle"
                 v-bind:style="{backgroundColor: color}"
            ></div>
        </div>
        <button
                class="right"
                v-on:mouseover.shift="toggleWall({x: tile.x, y: tile.y, side: 'right'})"
                v-on:click="toggleWall({x: tile.x, y: tile.y, side: 'right'})"
        ></button>
        <button
                class="bottom"
                v-on:mouseover.shift="toggleWall({x: tile.x, y: tile.y, side: 'bottom'})"
                v-on:click="toggleWall({x: tile.x, y: tile.y, side: 'bottom'})"
        ></button>
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
        computed: {
            color() {
                switch (this.tile.color) {
                    case 1:
                        return '#4194ff';
                    case 2:
                        return '#cc4048';
                    case 3:
                        return '#71db5e';
                    case 4:
                        return '#fff15d';
                    case 5:
                        return '#ffaa3f';
                    default:
                        return 'transparent';
                }
            },
            active(){return this.tile.color !== 0},
        },
        updated() {
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
    .cell {
        position: relative;
        display: table-cell;
        border: 2px #c5c5c5 solid;
        transition: border-color 0.25s;

        .overflow-wrapper {
            position: absolute;
            width: 100%;
            height: 100%;
            overflow: hidden;

            .circle {
                width: 100%;
                height: 100%;
                border-radius: 50%;
                transform: scale(0);
                transition: all 1s cubic-bezier(0.1, 0.2, 0.4, 1) 0ms;
            }

        }

        &.active .circle {
            transform: scale(1.5);
        }

        &.top {
            border-top-color: #000;
        }

        &.right {
            border-right-color: #000;
        }

        &.bottom {
            border-bottom-color: #000;
        }

        &.left {
            border-left-color: #000;
        }
    }

    .cell:after {
        content: "";
        display: block;
        padding-bottom: 100%;
    }

    button {
        position: absolute;
        z-index: 999;
        opacity: 0;
        border: none;
        background-color: black;
        padding: 0;

        &.right {
            height: 60%;
            width: 10px;
            right: -7px;
            top: 3px;
        }

        &.bottom {
            height: 10px;
            width: 60%;
            left: 3px;
            bottom: -7px;
        }
    }

</style>
