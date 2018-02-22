<template>
    <div class="builder-row" :class="isDragged ? 'builder-row__dragged':''">
        order:{{rowDate.order}} ID:{{ID}}


        <transition-group class="builder-row__blocks" name="block-list" tag="ul">
            <li v-for="(block, index) in blocks"
                :key="block.ID"
                class="builder-row__block-wrap"
                ref="dragItemsList"
                :class="[
                    block.order === newOrder ? 'arrow-before' : '',
                    block.order === blocks.length-1 && newOrder === blocks.length ? 'arrow-after' : '',
                    ]">
                <block
                        :ID="block.ID"
                        :parentDragstart="dragstart"
                        :isDragged="draggedItem && block.ID === draggedItem.ID"
                ></block>
            </li>
        </transition-group>
        <button
                title="add section"
                @click="openBlockSelector"
                class="btn-green">add section

        </button>
        <button
                @click="removeRow"
                class="btn-red close-block">x

        </button>
        <div
                title="hold btn and move mouse"
                @mousedown="dragStartWrapper"
                class="drag-me">drag me

        </div>
        <block-selector
                v-if="blockSelectorOpened"
                :setType="addBlock"
        ></block-selector>
    </div>

</template>

<script>
    import Block from './BuilderBlock';
    import BlockSelector from './BlockSelector.vue';
    import dragController from '../dragController'

    export default {
        name: 'builder-row',
        props: [
            'ID',
            'isDragged',
            'parentDragstart'
        ],
        data(){
            return dragController.getInitialData('horizontal')
        },
        components: {
            Block,
            BlockSelector
        },
        computed: {
            rowDate(){
                return this.$store.state.rows[this.ID];
            },
            blocks(){
                return this.$store.getters.sortedBlocks(this.ID);
            },
            blockSelectorOpened(){
                return this.$store.getters.blockSelectorOpened(this.ID);
            }
        },
        methods: {
            dragStartWrapper(e){
                this.parentDragstart(e, {
                    ID: this.ID
                });
            },
            openBlockSelector(e){
                e.stopPropagation();
                this.$store.commit('openBlockSelector', this.ID);
                document.body.addEventListener('click', this.closeBlockSelector);
            },
            closeBlockSelector(){
                this.$store.commit('closeBlockSelector');
                document.body.removeEventListener('click', this.closeBlockSelector);
            },
            removeRow(){
                this.$store.commit('removeRow', this.ID);
            },
            dragendCallback(){
                let oldOrder = this.$store.state.blocks[this.draggedItem.ID].order;

                if (oldOrder !== this.newOrder || oldOrder + 1 !== this.newOrder) {
                    this.$store.commit('changeBlockOrder', {ID: this.draggedItem.ID, newOrder: this.newOrder});
                }
            },
            addBlock(typeID){
                this.$store.commit('addBlock', {
                    ID: (new Date()).getTime(),
                    rowID: this.ID,
                    typeID,
                    order: Object.keys(this.blocks).length
                })
            },
            ...dragController.getDragMethods()
        }
    }
</script>

<style lang="scss">

    .builder-row {
        position: relative;
        padding: 10px;
    }

    .close-block {
        display: block;
        position: absolute;
        top: -5px;
        right: -5px;
        font-size: 20px;
    }

    .builder-row__blocks {
        display: flex;
        margin-top: 10px;
        margin-bottom: 15px;
        padding: 0;
    }

    .builder-row__dragged {
        opacity: 0.4;
    }

    .builder-row__block-wrap {
        position: relative;
        display: block;
        /*margin-right: 10px;*/
        /*margin-left: 10px;*/
        background-color: rgba(blue, 0.2);

        & + .builder-row__block-wrap {
            margin-left: 25px;
        }

        &::before {
            position: absolute;
            content: '';
            display: none;
            top: 0;
            left: -15px;
            background-color: blue;
            height: 100%;
            width: 5px;
        }

        &.arrow-before {
            &::before {
                display: block;
            }
        }

        &.arrow-after {
            &::before {
                display: block;
                left: auto;
                right: -15px;
            }
        }

    }

    .drag-me {
        position: absolute;
        background-color: yellow;
        padding: 7px;
        right: 20px;
        top: -5px;
        cursor: move; /* fallback if grab cursor is unsupported */
        cursor: grab;
        cursor: -moz-grab;
        cursor: -webkit-grab;
        &:active {
            cursor: grabbing;
            cursor: -moz-grabbing;
            cursor: -webkit-grabbing;
        }

    }

    .block-list-move {
        transition: transform 0.5s;
    }

    .drag-in-progress {
        cursor: grabbing;
        cursor: -moz-grabbing;
        cursor: -webkit-grabbing;
    }
</style>
