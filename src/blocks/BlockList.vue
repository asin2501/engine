<template>
    <div>
        list form


        <div>
            <transition-group class="list-form" name="block-list" tag="ul">
                <li v-for="(item, index) in list"
                    :key="item.ID"
                    :data-id="item.ID"
                    ref="dragItemsList">
                    <!-- Comment @keydown.13="newLine(index)" -->
                    <span>{{item.order}}</span>
                    <input
                            v-model="item.text"
                            type="text"
                            ref="inputs"
                    >
                    <span class="drag-me" @mousedown="dragstart($event, item)">drag</span>
                    <button @click="removeItem(index)" class="btn-red">x</button>
                </li>
            </transition-group>

            <button class="btn-green"
                    title="add additional list item"
                    @click="addItem"
            >
                Add item

            </button>

            <button class="btn-green"
                    @click="save"
                    :disabled="!wasChanged"
                    title="save changes (if no changes - btn disabled)"
            >Save Changes

            </button>

            <button class="btn-red"
                    :disabled="!wasChanged"
                    title="remover changes, get old data"
                    @click="reset"
            >Reset

            </button>
        </div>
    </div>
</template>

<script>
    import dragController from '../dragController'
    import helpers from '../helpers';

    export default {
        name: 'block-list',
        props: ['blockData', 'updateBlockData'],
        data(){
            return {
                list: this.blockData.list ? helpers.copyObj(this.blockData.list) : [],
                ...dragController.getInitialData('steps')
            }
        },
        computed: {
            wasChanged(){

                if (this.list.length !== this.blockData.list.length) {
                    return true;
                }

                for (let i = 0; i < this.list.length; i++) {
                    if (this.list[i].text !== this.blockData.list[i].text) {
                        return true;
                    }
                }

                return false;
            }
        },
        methods: {
            getEmptyListItem(){
                return {
                    ID: (new Date()).getTime(),
                    order: this.list.length,
                    text: ''
                }
            },
            addItem(){
                this.list.push(this.getEmptyListItem());
            },
            reset(){
                this.list = this.blockData.list ? helpers.copyObj(this.blockData.list) : [];
            },
            removeItem(index){
                this.list.splice(index, 1);
                this.list.forEach(item, i => item.order = i);
            },
            dragmoveCallback(){
                helpers.changeOrder(this.list.find(item => item.ID === this.draggedItem.ID),
                    this.newOrder,
                    this.list);

                this.list.sort((a, b) => a.order - b.order)
            },
            save(){
                this.list = this.list.filter(item => item.text.trim() !== '');
                this.updateBlockData({
                    list: helpers.copyObj(this.list)
                });
            },
            ...dragController.getDragMethods()
        }
    }
</script>

<style lang="scss" scoped>
    .drag-me {
        padding-top: 3px;
        padding-bottom: 3px;
        position: static;
    }

    ul {
        padding-left: 0;
    }

    li {
        display: flex;
        align-items: flex-start;
        padding-bottom: 10px;

        & > * + * {
            margin-left: 5px;
        }
    }

    .block-list-move {
        transition: transform 0.2s;
    }
</style>