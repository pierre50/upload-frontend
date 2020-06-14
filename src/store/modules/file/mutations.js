const mutations = {

    SET_SELECTED_FILE(state, {file, treeId}) {
        file.treeId = treeId;
        state.selectedFile = file;
    },

    REMOVE_SELECTED_FILE(state){
        state.selectedFile = null;
    },

    ADD_FILE_UPLOAD_LIST(state, file){
        let info = {
            mime: file.type,
            uuid: file.uuid,
            name: file.name,
            size: file.size,
            done: 0,
            status: "uploading",
            hash: null
        }
        state.uploadList.push(info);
    },
    SHARED_FILE(state, public_hash){
        state.selectedFile.public_hash = public_hash;
    },
    UPDATE_FILE_UPLOAD_LIST(state, data){
        let index = state.uploadList.findIndex( f => f.uuid === data.uuid);
        if (index !== -1){
            if (data.done){
                state.uploadList[index].done = data.done;
            }
            if (data.status){
                state.uploadList[index].status = data.status;
            }
            if (data.hash){
                state.uploadList[index].hash = data.hash;  
            }
        }
    },
    RENAME_FILE_OK(state, form){
        if (state.selectedFile.hash === form.hash){
            state.selectedFile.filename = form.name;
        }
    }
};

export default mutations