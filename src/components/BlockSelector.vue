<template>
    <div class="blockSelector" @click="clickHandler">
        <div>Select section type</div>
        <ul class="blockSelector__blocks">
            <li class="blockSelector__block"
                v-for="(block, key) in blockList"
                @click="selectBlockType(key)">
                {{ block.title }}
            </li>
        </ul>
    </div>
</template>

<script>
    import mapGetters from 'vuex';

    export default {
        name: 'block-selector',
        props: ['setType'],
//        data(){
//           return blockList;
//        },
//        computed: {
//            ...mapGetters({
//                blockList: 'getBlockList'
//            })
//        },

        computed: {
                blockList(){
                    return this.$store.getters.getBlockList
                }
        },
        methods: {
            selectBlockType(blockID){
                this.setType(+blockID);
                this.close();
            },
            close(){
                this.$store.commit('closeBlockSelector');
            },
            clickHandler(e){
                e.stopPropagation();
            }
        }
    }
</script>

<style lang="scss">
    .blockSelector {
        position: absolute;
        z-index: 3;
        background-color: #fff;
        border: 1px solid green;
        padding: 10px;
    }

    .blockSelector__blocks {
        display: flex;
        padding-left: 0;
    }

    .blockSelector__block {
        display: block;
        background-color: #fff;
        border: 1px solid green;
        margin-right: 10px;
        margin-left: 10px;
        padding: 10px;
        cursor: pointer;
        width: 150px;
    }
</style>
