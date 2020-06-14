import {makeMutations} from '../../helpers'

const mutations = {

    ...makeMutations([
        'CHECK_LOGIN',
    ], (state) => {
        state.loading = true;
    }),

    ...makeMutations([
        'STOP_LOADING',
        'CHECK_LOGIN_OK',
        'CHECK_LOGIN_FAIL',
    ], (state) => {
        state.loading = false;
    }),

};

export default mutations