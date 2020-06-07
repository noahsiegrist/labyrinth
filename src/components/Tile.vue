<template>
    <div class="cell" >
        <button class="right"></button>
        <button class="bottom"></button>
    </div>
</template>

<script>
    export default {
        name: 'Tile',
        props: ['tile']
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
    .cell {
        position: relative;
        display: table-cell;
        border: 2px #c5c5c5 solid;
    }

    .cell:after {
        content: "";
        display: block;
        padding-bottom: 100%;
    }

    button{
        position: absolute;
        opacity: 0.1;

        .right {

            height: 100%;
            width: 50%;
            right: -25%;
            top: 0;
        }
        .bottom{
            height: 50%;
            width: 100%;
            left: 0;
            bottom: -25%;
        }
    }

</style>
