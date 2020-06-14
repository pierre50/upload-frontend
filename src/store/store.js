import Vue from 'vue'
import Vuex from 'vuex'
import createLogger from 'vuex/dist/logger';
import auth from './modules/auth/store';
import file from './modules/file/store';
import directory from './modules/directory/store';
import multiple from './modules/multiple/store';
import general from './modules/general/store';

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

export default new Vuex.Store({
    strict: debug,
    plugins: debug ? [createLogger()] : [],
    modules: {
        auth,
        file,
        directory,
        multiple,
        general,
    }
});