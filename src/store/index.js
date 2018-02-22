import Vuex from 'vuex';
import Vue from 'vue';
import mutations from './mutations';
import getters from './getters';
import UIState from './modules/UIState';
import blockList from './modules/blockList';
import inititalState from './initialState';


Vue.use(Vuex);

let state = localStorage.getItem('engine');


state = state ? JSON.parse(state) : inititalState;

const store = new Vuex.Store({
    strict: true, // only for dev not for production todo: remove in production
    state,
    mutations,
    getters,
    plugins: [saver],
    modules: {UIState, blockList}
});

function saver(store) {
    store.subscribe((mutation, state) => {
        localStorage.setItem('engine', JSON.stringify(state));
    })
}

export default store;