const mutations = {
    SET_SELECTED_DIRECTORY(state, {directory, treeId}) {
        directory.treeId = treeId;
        state.selectedDirectory = directory
    },
    REMOVE_SELECTED_DIRECTORY(state){
        state.selectedDirectory = null
    },
};

export default mutations