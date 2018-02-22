export  default {
    sortedRows: state => {
        return state.rowsKeys.map(ID => state.rows[ID]);
    },
    sortedBlocks: state => rowID => {
        //todo: sorting

        // console.log('----');
        // console.log(state.blocks);
        // console.log();
        return state.rows[rowID].blocks.map(blockID=>state.blocks[blockID]);
    },
    rowCounter: state => Object.keys(state.rows).length,
    getRow: state => ID => {
        return state.rows[ID];
    },
    // getBlock: state => ID => {
    //     return state.blocks[ID];
    // },
}