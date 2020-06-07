<template>
    <div class="table">
        <div class="row" v-for="(row, index) of matrix" :key="index">
            <Tile v-for="(cell, index) of row" :key="index" v-bind:tile="cell" />
        </div>
    </div>
</template>

<script>
    import Tile from './Tile'
    import { mapActions, mapGetters } from 'vuex'

    export default {
        name: 'Matrix',
        components: {Tile},
        methods: {
            ...mapActions(["init"]),
        },
        computed: {
            ...mapGetters(["matrix"])
        },
        created() {
            console.log('initate the matrix')
            this.init();
        }
    }
</script>

<style scoped lang="scss">
    .table {
        margin: auto;
        display: table;
        max-width: 100%;
        width: 90vh;
        border: 2px #000 solid;

    }
    .row {
        display: table-row;
    }

</style>
