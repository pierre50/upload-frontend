import actions from './actions.js'
import mutations from './mutations'

const state = {
    selectedFile: null,
    uploadList: []
};

const getters = {
    selectedFile: (state) => state.selectedFile,
    uploadList: (state) => state.uploadList
};

const module = {
    state,
    getters,
    actions,
    mutations
};

export default module;