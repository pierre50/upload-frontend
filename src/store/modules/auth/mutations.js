const mutations = {

    CHECK_LOGIN_OK(state, user) {
        state.me = user;
    },

    LOGIN_OK(state, user) {
        state.me = user;
    },

    LOGOUT_OK(state) {
        state.me = null;
        state.files = [];
    },

    REGISTER_OK(state, user) {
        state.me = user;
    },

    UPDATE_PROFILE_OK(state, user) {
        state.me = user;
    },

    UPDATE_USER_SIZE(state, size){
        state.me.size = parseInt(size);
    },
    
    SET_FILES(state, files) {
        state.files = files;
    },
};

export default mutations