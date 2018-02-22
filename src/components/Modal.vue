<template>
    <div class="popup-shadow" @click="close" v-show="showed">
        <div class="popup" @click="prevent">
            <button class="btn-red popup__close" @click="close">x</button>
            <div class="popup__body">
                <slot>
                    A you sure?
                </slot>
            </div>
            <div class="popup__footer">
                <button @click="accept(); close()" class="btn-green popup__footer-btn">yes</button>
                <button @click="close" class="btn-red popup__footer-btn">no</button>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'modal',
        computed:{
            showed(){
                return this.$store.getters.modalState(this.modalName);
            }
        },
        props: [
            'accept',
            'modalName'
        ],
        methods: {
            close(){
                this.$store.commit('setModalState', {
                    name: this.modalName,
                    state:false
                });

            },
            prevent(e){
                e.stopPropagation()
            }
        },
    }
</script>

<style lang="scss">
    .popup-shadow {
        position: fixed;
        z-index: 100;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background-color: rgba(#000, 0.8);
    }

    .popup {
        position: absolute;
        background-color: #fff;
        width: 200px;
        padding: 20px;
        top: 50%;
        left: 50%;
        margin-top: -100px;
        margin-left: -100px;
    }

    .popup__footer-btn {
        width: 50px;
    }

    .popup__close {
        position: absolute;
        right: -5px;
        top: -5px
    }

    .popup__body {
        margin-bottom: 20px;
    }

    .popup__footer {
        text-align: center;
    }
</style>