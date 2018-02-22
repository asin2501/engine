<template>
    <div>
        text form
        <div>
            <textarea type="text" v-model="text"></textarea>
            <button class="btn-green"
                    title="save changes (if no changes - btn disabled)"
                    :disabled="!wasChanged"
                    @click="save">Save Changes
            </button>
            <button class="btn-red"
                    :disabled="!wasChanged"
                    title="remover changes, get old data"
                    @click="reset">Reset
            </button>
        </div>
    </div>
</template>

<script>
    import helpers from '../helpers';

    export default {
        name: 'block-text',
        props: ['blockData', 'updateBlockData'],
        data(){
            return {
                text: this.blockData.text ? this.blockData.text : '',
            }
        },
        computed:{
            wasChanged(){
                return this.text !== this.blockData.text;
            }
        },
        methods: {
            reset(){
                this.text = this.blockData.text ? this.blockData.text : '';
            },
            save(){
                if (this.text === this.blockData.text) {
                    return
                }
                this.updateBlockData({
                    ...this.blockData,
                    text: this.text
                });
            }
        }
    }
</script>

<style>
    textarea {
        width: 200px;
        height: 60px;
        display: block;
        resize: none;
        margin-bottom:15px;
    }
</style>