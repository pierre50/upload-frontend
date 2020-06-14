const actions = {
    deleteFiles({ commit, dispatch }, files) {
        return new Promise((resolve, reject) => {
            axios.put(Helpers.$config.apiPath + 'multiple/delete/', files)
                .then(response => {
                    commit('UPDATE_USER_SIZE', response.data.size);
                    commit('REMOVE_SELECTED_FILE');
                    commit('REMOVE_SELECTED_DIRECTORY');
                    resolve();
                })
                .catch(error => {
                    let er;
                    if (error.response && error.response.data && error.response.data.message) {
                        er = error.response.data.message
                    }
                    reject(er)
                })
        })
    },
    moveFiles({ commit, dispatch }, data) {
        return new Promise((resolve, reject) => {
            axios.put(Helpers.$config.apiPath + 'multiple/move', data)
                .then(response => {
                    resolve();
                })
                .catch(error => {
                    let er;
                    if (error.response && error.response.data && error.response.data.message) {
                        er = error.response.data.message
                    }
                    reject(er)
                })
        })
    },
};


export default actions