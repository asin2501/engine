<template>
    <div class="block" :class="isDragged ? 'block__dragged':''">
        <div>
            <div>Block ID:{{blockData.ID}}</div>
            <!--<div>Block order:{{blockData.order}}</div>-->
            <div>Section type:<b style="color:red">{{blockComponent}}</b></div>
            <component :is="blockComponent"
                       :blockData="blockData.blockData"
                       :updateBlockData="updateBlockData"
            ></component>
        </div>
        <div
                title="hold btn and move mouse"
                @mousedown="dragStartWrapper"
                class="drag-me">drag me</div>
        <button
                @click="remove"
                title="remove section"
                class="btn-red close-block">x</button>
    </div>
</template>


<script>
    import BlockImg from '../blocks/BlockImg';
    import BlockText from '../blocks/BlockText';
    import BlockList from '../blocks/BlockList.vue';


    export default {
        name: 'block',
        components: {
            BlockImg,
            BlockText,
            BlockList
        },
        data(){
            return {}
        },
        computed: {
            blockData(){
                return this.$store.state.blocks[this.ID];
            },
            blockComponent(){
                return this.$store.state.blockList[this.blockData.typeID].component;
            }
        },
        props: [
            'ID',
            'parentDragstart',
            'isDragged'
        ],
        methods: {
            updateBlockData(blockData){
                this.$store.commit('updateBlockData', {
                    ID: this.ID,
                    blockData
                });
            },
            remove(){
                this.$store.commit('removeBlock', this.ID);
            },
            dragStartWrapper(e){
//                console.log(arguments);
                this.parentDragstart(e, {ID:this.ID});
            },
        }
    }
</script>

<style lang="scss" scoped>
    .close-block {
        display: block;
        position: absolute;
        top: -5px;
        right: -5px;
        font-size: 20px;
    }

    .block__dragged{
        opacity: 0.5;
    }

    .block {
        position: relative;
        padding: 10px;
    }
</style>
