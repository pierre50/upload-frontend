import actions from './actions.js'
import mutations from './mutations'

const state = {
    me: null, // Logged in user
    files: [],
};

const getters = {
    me: (state) => state.me,
    files: (state) => state.files,
};

const module = {
    state,
    getters,
    actions,
    mutations
};

export default module