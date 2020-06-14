const actions = {
    uploadFile({ commit, dispatch }, { file, path }) {
        return new Promise((resolve, reject) => {
            file.uuid = Helpers.$utils.generateUUID()//Math.floor(Math.random() * 90000) + 10000;
            commit("ADD_FILE_UPLOAD_LIST", file)
            let chunkSize = 1 * 1024 * 1024;
            let maxOffset = Math.max(Math.floor(file.size / chunkSize), 1);
            for (let offset = 0; offset < maxOffset; offset++) {
                ResumableChunk(file, offset);
            }
            function ResumableChunk(file, offset) {
                let startByte = offset * chunkSize;
                let endByte = Math.min(file.size, (offset + 1) * chunkSize);
                if (file.size - endByte < chunkSize) {
                    endByte = file.size;
                }
                let func = (file.slice ? 'slice' : (file.mozSlice ? 'mozSlice' : (file.webkitSlice ? 'webkitSlice' : 'slice')));
                let bytes = file[func](startByte, endByte, file.type)
                let formdata = new FormData();
                formdata.append('resumableChunkNumber', offset + 1);
                formdata.append('resumableChunkSize', chunkSize)
                formdata.append('resumableCurrentChunkSize', endByte - startByte);
                formdata.append('resumableTotalSize', file.size);
                formdata.append('resumableType', file.type);
                formdata.append('resumableIdentifier', file.uuid);
                formdata.append('resumableFilename', file.name);
                formdata.append('resumableRelativePath', file.name);
                formdata.append('resumableTotalChunks', maxOffset);
                formdata.append('file', bytes, file.name);
                formdata.append('path', path);

                axios.post(`${Helpers.$config.apiPath}file/chunk`, formdata)
                    .then(response => {
                        if (response.data.uploaded) {
                            commit('UPDATE_FILE_UPLOAD_LIST', { done: 100, status: "success", uuid: file.uuid, hash : response.data.hash });
                            commit('UPDATE_USER_SIZE', response.data.size);
                            resolve();
                        } else {
                            commit('UPDATE_FILE_UPLOAD_LIST', response.data);
                        }
                    })
                    .catch(error => {
                        commit('UPDATE_FILE_UPLOAD_LIST', { done: 0, status: "fail", uuid: file.uuid });
                        let er;
                        if (error.response && error.response.data && error.response.data.message) {
                            er = error.response.data.message
                        }
                        reject(er)
                    })

            }
        })
    },
    updateUploadList({ commit, dispatch }, file) {
        commit('UPDATE_UPLOAD_LIST', file);
    },
    detailFile({ commit, dispatch }, { hash, treeId }) {
        return new Promise((resolve, reject) => {
            axios.get(Helpers.$config.apiPath + 'file/detail/' + hash)
                .then(response => {
                    let file = response.data;
                    file.uploaded_date = Helpers.$utils.timeConverter(file.uploaded_date);
                    file.icon = Helpers.$utils.mimeToIcon(file.mime);
                    file.size_format = Helpers.$utils.formatBytes(file.size);
                    commit('SET_SELECTED_FILE', { file, treeId });
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
    shareFile({ commit, dispatch }, form) {
        return new Promise((resolve, reject) => {
            axios.put(Helpers.$config.apiPath + 'file/share/', form)
                .then(response => {
                    commit('SHARED_FILE', response.data.new_hash);
                    resolve(response.data.new_hash);
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
    showFile({ commit, dispatch }, hash) {
        return new Promise((resolve, reject) => {
            axios.get(Helpers.$config.apiPath + 'file/show/' + hash)
                .then(response => {
                    let file = response.data;
                    file.uploaded_date = Helpers.$utils.timeConverter(file.uploaded_date);
                    file.icon = Helpers.$utils.mimeToIcon(file.mime);
                    file.size_format = Helpers.$utils.formatBytes(file.size);
                    resolve(file);
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
    deleteFile({ commit, dispatch }, hash) {
        return new Promise((resolve, reject) => {
            axios.delete(Helpers.$config.apiPath + 'file/delete/' + hash)
                .then(response => {
                    commit('UPDATE_USER_SIZE', response.data.size);
                    commit('REMOVE_SELECTED_FILE');
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
    downloadFile({ commit, dispatch }, hash) {
        let url = Helpers.$config.apiPath + 'file/download/' + hash;
        window.open(url, '_blank');
    },
    renameFile({ commit, dispatch }, form) {
        return new Promise((resolve, reject) => {
            axios.put(Helpers.$config.apiPath + 'file/rename', form)
                .then(response => {
                    commit('RENAME_FILE_OK', form);
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
    moveFile({ commit, dispatch }, form) {
        return new Promise((resolve, reject) => {
            axios.put(Helpers.$config.apiPath + 'file/move', form)
                .then(response => {
                    commit('MOVE_FILE_OK', response.data);
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
    removeSelectedFile({ commit, dispatch }) {
        let player = document.getElementById("player");
        if (player){
          player.load();
        }
        commit('REMOVE_SELECTED_FILE');
    }
};


export default actions