//state
import state from './UIInitialState';

//getters
const getters = {
    blockSelectorOpened: state => ID => state.blockSelector === ID,
    modalState: state => name => state.modals[name],
};

//mutations
const mutations = {
    closeBlockSelector(state) {
        state.blockSelector = -1;
    },
    openBlockSelector(state, rowID) {
        state.blockSelector = rowID;
    },
    setModalState(state, data){
        state.modals[data.name] = data.state;
    }
};


export default {
    state,
    getters,
    mutations
}