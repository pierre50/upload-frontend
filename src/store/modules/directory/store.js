import actions from './actions.js'
import mutations from './mutations'

const state = {
    selectedDirectory: null,
};

const getters = {
    selectedDirectory: (state) => state.selectedDirectory,
};

const module = {
    state,
    getters,
    actions,
    mutations
};

export default module;