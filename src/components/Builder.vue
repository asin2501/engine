<template>
    <div class="builder">
        <transition-group class="builder__rows" name="row-list" tag="ul">
            <li class="builder__row-wrapper"
                v-for="row in rows"
                :key="row.ID"
                ref="dragItemsList"
                :class="[
                    row.order === newOrder ? 'arrow-before' : '',
                    row.order === rowCounter-1 && newOrder === rowCounter ? 'arrow-after' : '',
                    ]">
                <builder-row
                        :parentDragstart="dragstart"
                        :ID="row.ID"
                        :isDragged="draggedItem && row.ID === draggedItem.ID"></builder-row>
            </li>
        </transition-group>
        <button
                @click="addRow"
                title="add row"
                class="btn-green">Add row

        </button>

        <button @click="openRestoreWindowModal" class="btn-red">Clear All History</button>

        <modal :modalName="'resetStoreWindow'" :accept="resetStore">Are you sure?</modal>
    </div>
</template>


<script>
    import BuilderRow from './BuilderRow'
    import {mapGetters} from 'vuex'
    import store from '../store'
    import helpers from '../helpers'
    import dragController from '../dragController'
    import Modal from './Modal.vue'

    export default {
        name: 'builder',
        data(){
            return {
                ...dragController.getInitialData('vertical')
            }
        },
        computed: {
            ...mapGetters({
                rows: 'sortedRows',
                rowCounter: 'rowCounter'
            }),
        },
        components: {BuilderRow, Modal},
        store,
        dragController: dragController,
        methods: {
            addRow(){
                this.$store.commit('addRow', {
                    ID: (new Date()).getTime(),
                    blocks: [],
                    order: this.rowCounter
                })
            },
            openRestoreWindowModal(){
                this.$store.commit('setModalState', {name:'resetStoreWindow', state:true});
            },
            resetStore(){
                    this.$store.commit('resetStore');
//                console.log('reset store');
            },
            dragendCallback(){
                let oldOrder = this.$store.getters.getRow(this.draggedItem.ID).id;

                if (oldOrder !== this.newOrder || oldOrder + 1 !== this.newOrder) {
                    this.$store.commit('changeRowOrder', {ID: this.draggedItem.ID, newOrder: this.newOrder});
                }
            },
            ...dragController.getDragMethods()
        }
    }
</script>


<style lang="scss">
    .builder__row-wrapper {
        position: relative;
        display: block;
        background-color: rgba(green, 0.1);
        margin-bottom: 25px;

        &::before {
            position: absolute;
            content: '';
            display: none;
            top: -15px;
            left: 0;
            background-color: blue;
            height: 5px;
            width: 100%;
        }

        &.arrow-before {
            &::before {
                display: block;
            }
        }

        &.arrow-after {
            &::before {
                display: block;
                top: auto;
                bottom: -15px;
            }
        }
    }

    .row-list-move {
        transition: transform 0.6s;
    }

    .builder {
        padding: 30px;
    }

    .builder__rows {
        margin: 0;
        padding: 0;
    }

</style>
