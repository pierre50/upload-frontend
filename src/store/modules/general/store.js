import actions from './actions.js'
import mutations from './mutations'

const state = {
    loading: false,  
};

const getters = {
    loading: (state) => state.loading,
};

const module = {
    state,
    actions,
    getters,
    mutations
};

export default module