// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

import Vue from 'vue';
import App from './App';
import router from './router';
import 'babel-polyfill';
import axios from 'axios';
import ElementUI from 'element-ui';
import locale from 'element-ui/lib/locale/lang/en';
import './scss/main.scss';
import store from './store/store';
import VueClipboard from 'vue-clipboard2';
import Helpers from '../static/helpers';
import vueScrollto from 'vue-scrollto'
import VuePlyr from 'vue-plyr';
import 'vue-plyr/dist/vue-plyr.css';

Vue.use(VuePlyr)
Vue.use(vueScrollto)
Vue.use(VueClipboard);
Vue.use(ElementUI, {locale});

window.Helpers = Helpers;
window.axios = axios;
window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
window.axios.defaults.headers.common['Access-Control-Allow-Headers'] = 'Origin, X-Requested-With, Content-Type, Accept';

// Authorization header
window.axios.interceptors.request.use(function(config) {
    const token = localStorage.getItem('access_token');
    if ( token != null ) {
        config.headers.Accept = 'application/json';
        config.headers.Authorization = `Bearer ${token}`;
        config.headers = {
            'Authorization' : `Bearer ${token}`,
            'Accept' : 'application/json',
            'Content-Type' : 'application/json',
            'X-CSRF-TOKEN': 'fa42YelxLx0xdL0D1BmAL6IKn6bQcK4rBhevL1e8',
            'X-Requested-With' : 'XMLHttpRequest'
        }
    }
    return config;
});

Vue.prototype.$http = window.axios;

Vue.config.productionTip = false;

export const EventBus = new Vue();
Object.defineProperties(Vue.prototype, {
    $EventBus: {
        get: function () {
            return EventBus
        }
    }
});

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,
    template: '<App/>',
    components: { App }
});