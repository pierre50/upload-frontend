import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store/store'
import {sync} from 'vuex-router-sync'

import Front from '../components/pages/front/Front.vue'
import Logout from '../components/pages/auth/Logout.vue'
import Profile from '../components/pages/app/profile/Profile.vue'
import App from '../components/pages/app/App.vue'
import FileShow from '../components/pages/file/File.vue'
import Error from '../components/pages/404.vue'

Vue.use(VueRouter);

const routes = [
    {name:'main', path: '/', component: Front, meta: {requiresVisistor: true}},
    {name:'logout', path: '/logout', component: Logout},
    {
        name: 'app',
        path: '/h', 
        component: App, 
        meta: {requiresAuth: true},
        children: [
            {
              name: 'profile',
              path: 'profile',
              component: Profile
            },
        ]
    },
    {name:'file', path: '/file/:hash', component: FileShow},
    {name:'error', path: '*', component: Error},
];


const router = new VueRouter({
    routes,
});

// Sync Vuex and vue-router;
sync(store, router);

/**
 * Authenticated routes
 */
router.beforeEach((to, from, next) => {
    // Check user login status
    store.dispatch('checkLogin')
        .then(() => {
            if (to.matched.some(record => record.meta.requiresVisistor) && store.state.auth.me) {
                // if route requires to be visitor and user is authenticated
                next('/h')
            } else {
                next();
            }
        }).catch(() => {
            if (to.matched.some(record => record.meta.requiresAuth) && ! store.state.auth.me) {
                // if route requires auth and user isn't authenticated
                next('/')
            } else {
                next();
            }
        });

});


export default router;