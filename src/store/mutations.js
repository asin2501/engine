import Vue from 'vue';
import helpers from './../helpers';
import rootInititalState from './initialState';
import blocksInititalState from './modules/blockListInitialState';
import UIInitialState from './modules/UIInitialState';

export  default {
    resetStore(state){
        // for(let key in inititalState){
        //     // console.log(key);
        //     state[key] = inititalState[state];
        // }
        this.replaceState(JSON.parse(JSON.stringify(
            {
                ...rootInititalState,
                UIState: {
                    ...UIInitialState,
                },
                blockList: {
                    ...blocksInititalState
                }
            })))
    },
    addRow (state, row) {
        Vue.set(state.rows, row.ID, row);
        state.rowsKeys.push(row.ID);
    },
    addBlock(state, block){
        block.blockData = state.blockList[block.typeID].initialData;
        state.rows[block.rowID].blocks.push(block.ID);
        Vue.set(state.blocks, block.ID, block);
    },
    updateBlockData(state, block){
        state.blocks[block.ID].blockData = block.blockData;
    },
    removeRow(state, ID){
        const removedRowOrder = state.rows[ID].order;

        state.rows[ID].blocks.forEach(blockID => {
            Vue.delete(state.blocks, blockID);
        });
        Vue.delete(state.rows, ID);
        helpers.removeItemFromArray(state.rowsKeys, ID);

        state.rowsKeys.forEach(rowID => {
            if (state.rows[rowID].order > removedRowOrder) {
                state.rows[rowID].order--;
            }
        });
    },
    removeBlock(state, ID){
        const rowID = state.blocks[ID].rowID;

        helpers.removeItemFromArray(state.rows[rowID].blocks, ID);
        Vue.delete(state.blocks, ID);
    },
    changeRowOrder(state, currentRow){
        helpers.changeOrder(
            state.rows[currentRow.ID],
            currentRow.newOrder,
            state.rowsKeys.map(rowID => state.rows[rowID])
        );

        sortRows(state);
    },

    changeBlockOrder(state, currentBlock){
        const rowID = state.blocks[currentBlock.ID].rowID;
        helpers.changeOrder(
            state.blocks[currentBlock.ID],
            currentBlock.newOrder,
            state.rows[rowID].blocks.map(blockID => state.blocks[blockID])
        );

        sortBlocks(state, rowID);

    }
}

function sortRows(state) {
    state.rowsKeys.sort((a, b) => state.rows[a].order - state.rows[b].order);
}

function sortBlocks(state, rowId) {
    state.rows[rowId].blocks.sort((a, b) => state.blocks[a].order - state.blocks[b].order);
}