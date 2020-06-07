<template>
    <div class="table">
        <div class="row" v-for="(row, index) of matrix" :key="index">
            <Tile v-for="(cell, index) of row" :key="index" v-bind:tile="cell" />
        </div>
    </div>
</template>

<script>
    import Tile from './Tile'

    export default {
        name: 'Matrix',
        components: {Tile},
        data() {
            return {
                matrix:
                    [
                        [
                            {
                                right: false,
                                bottom: false,
                            },
                            {
                                right: false,
                                bottom: false,
                            },
                            {
                                right: false,
                                bottom: false,
                            },
                        ],
                        [
                            {
                                right: false,
                                bottom: false,
                            },
                            {
                                right: false,
                                bottom: false,
                            },
                            {
                                right: false,
                                bottom: false,
                            },
                        ],
                        [
                            {
                                right: false,
                                bottom: false,
                            },
                            {
                                right: false,
                                bottom: false,
                            },
                            {
                                right: false,
                                bottom: false,
                            },
                        ],
                    ],
            };
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .table {
        margin: auto;
        display: table;
        max-width: 100%;
        width: 90vh;
        border: 2px #c5c5c5 solid;

    }
    .row {
        display: table-row;
    }

</style>
