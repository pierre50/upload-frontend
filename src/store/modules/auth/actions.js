const actions = {

    checkLogin({commit, dispatch}) {
        commit('CHECK_LOGIN');
        const access_token = localStorage.getItem('access_token');
        return new Promise((resolve, reject) => {
            if (! access_token) {
                commit('CHECK_LOGIN_FAIL');
                return reject();
            }
            axios.get(Helpers.$config.apiPath + 'user/me')
                .then(response => {
                    commit('CHECK_LOGIN_OK', response.data);
                    resolve();
                })
                .catch(error => {
                    localStorage.removeItem('access_token');
                    commit('CHECK_LOGIN_FAIL');
                    let er;
                    if (error.response && error.response.data && error.response.data.message) {
                        er = error.response.data.message
                    }
                    reject(er)
                })
        })
    },

    login({commit, dispatch}, form) {
        return new Promise((resolve, reject) => {
            axios.post(Helpers.$config.apiPath + 'auth/login', form)
                .then( response => {
                    localStorage.setItem('access_token', response.data.access_token);
                    commit('LOGIN_OK', response.data.user);
                    resolve(response.data.user.name);
                })
                .catch( error => {
                    let er;
                    if (error.response && error.response.data && error.response.data.message) {
                        er = error.response.data.message
                    }
                    reject(er)
                })
        })
    },

    deleteUser({commit, dispatch}) {
        return new Promise((resolve, reject) => {
            axios.delete(Helpers.$config.apiPath + 'user/delete')
                .then( response => {
                    commit('LOGOUT_OK');
                    resolve();
                })
                .catch( error => {
                    reject(error.response);
                })
        })
    },

    forgotPassword({commit, dispatch}, form) {
        return new Promise((resolve, reject) => {
            axios.post(Helpers.$config.apiPath + 'auth/forgot', form)
                .then( response => {
                    resolve(response.data);
                })
                .catch( error => {
                    reject(error.response);
                })
        })
    },

    logout({commit, dispatch}) {
        commit('LOGOUT_OK');
        localStorage.removeItem('access_token');
    },

    register({commit, dispatch}, form) {
        commit('REGISTER');
        form.offer_id = 1;
        return new Promise((resolve, reject) => {
            axios.post(Helpers.$config.apiPath + 'auth/register', form)
                .then( response => {
                    const access_token = response.data.access_token;
                    localStorage.setItem('access_token', access_token);
                    commit('REGISTER_OK', response.data.user);
                    resolve(response.data.user.name);
                })
                .catch( error => {
                    let er;
                    if (error.response && error.response.data && error.response.data.message) {
                        er = error.response.data.message
                    }
                    if (error.response && error.response.data && error.response.data.errors){
                        let ers = [];
                        for (var key in error.response.data.errors){
                            ers.push(error.response.data.errors[key][0]);
                        }
                        er = ers.join(', ');
                    }
                    reject(er)
                })
        })
    },

    updateProfile({commit, dispatch}, {id, form}) {
        return new Promise((resolve, reject) => {
            axios.put(Helpers.$config.apiPath + 'user/' + id, form)
                .then( response => {
                        commit('UPDATE_PROFILE_OK', response.data.user);
                        resolve();
                    })
                .catch( error => {
                        commit('UPDATE_PROFILE_FAIL');
                        reject(error.response);
                    })
        })
    },

    changePassword({commit, dispatch}, {id, form}) {
        return new Promise((resolve, reject) => {
            axios.put(Helpers.$config.apiPath + 'user/password/' + id, form)
                .then( response => {
                        resolve();
                    })
                .catch( error => {
                        let er = null;
                        if (error.response && error.response.data && error.response.data.errors){
                            er = error.response.data.errors[Object.keys(error.response.data.errors)[0]][0];
                        }
                        reject(er);
                    })
        })
    },

    loadFiles({commit, dispatch}) {
        return new Promise((resolve, reject) => {
            axios.get(Helpers.$config.apiPath + 'user/files')
                .then(response => {
                    let result = Helpers.$utils.joinPaths(response.data);
                    commit('SET_FILES', result);
                    resolve(result);
                })
                .catch(error => {
                    reject(error.response);
                })
        })
    },

};

export default actions