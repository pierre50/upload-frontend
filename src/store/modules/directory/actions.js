const actions = {
    createDirectory({commit, dispatch}, dir) {
        return new Promise((resolve, reject) => {
            axios.post(Helpers.$config.apiPath + 'directory/create', dir)
                .then(response => {
                        resolve()
                    })
                .catch(error => {
                    let er;
                    if (error.response && error.response.data && error.response.data.message){
                        er = error.response.data.message
                    }
                    reject(er)
                })
        })
    },
    showDirectory({commit, dispatch}, { path, treeId }) {
        return new Promise((resolve, reject) => {
            axios.post(Helpers.$config.apiPath + 'directory/show', { path })
                .then(
                    response => {
                        let dir = response.data;
                        if (!dir.name) {
                            dir.isRoot = true;
                            dir.name = 'Root';
                            dir.path = '/'
                        }
                        dir.size_format = Helpers.$utils.formatBytes(dir.size);
                        commit('SET_SELECTED_DIRECTORY', {directory : dir, treeId});
                        commit('REMOVE_SELECTED_FILE');
                        resolve()
                    })
                .catch(error => {
                    reject(error.response)
                })
        })
    },
    deleteDirectory({commit, dispatch}, path) {
        return new Promise((resolve, reject) => {
            axios.put(Helpers.$config.apiPath + 'directory/delete', { path : path })
                .then(
                    response => {
                        commit('UPDATE_USER_SIZE', response.data.size);
                        commit('REMOVE_SELECTED_DIRECTORY');
                        resolve()
                    })
                .catch(error => {
                    reject(error.response);
                })
        })
    },
    renameDirectory({commit, dispatch}, form){
        return new Promise((resolve, reject) => {
            axios.put(Helpers.$config.apiPath + 'directory/rename', form)
                .then(response => {
                    commit('RENAME_DIRECTORY_OK', response.data);
                    resolve()
                })
                .catch(error => {
                    let er;
                    if (error.response && error.response.data && error.response.data.message){
                        er = error.response.data.message
                    }
                    reject(er)
                })
        })
    },
    moveDirectory({commit, dispatch}, form){
        return new Promise((resolve, reject) => {
            axios.put(Helpers.$config.apiPath + 'directory/move', form)
                .then(response => {
                    commit('MOVE_DIRECTORY_OK', response.data);
                    resolve()
                })
                .catch(error => {
                    let er;
                    if (error.response && error.response.data && error.response.data.message){
                        er = error.response.data.message
                    }
                    reject(er)
                })
        })
    },
    downloadDirectory({commit, dispatch}, path){
        commit('DOWNLOAD_DIRECTORY');
        return new Promise((resolve, reject) => {
            axios.post(Helpers.$config.apiPath + 'directory/download', {path: path})
                .then(response => {
                    let url = Helpers.$config.apiPath + 'directory/download/' + response.data.temp_id;
                    window.open(url, '_blank');
                    commit('DOWNLOAD_DIRECTORY_OK', response);
                    resolve()
                })
                .catch(error => {
                    commit('DOWNLOAD_DIRECTORY_FAIL');
                    reject(error.response)
                })
        })
    },
    removeSelectedDirectory({commit, dispatch}){
        commit('REMOVE_SELECTED_DIRECTORY')
    }
};


export default actions