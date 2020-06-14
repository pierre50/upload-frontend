<template>
<div>
    <el-menu class="el-menu-red el-menu-fixed" router mode="horizontal">
        <slot>
        </slot>
        <el-menu-item v-if="!me" index="4" :route="'#'" @click="manualSideMenu = true; showSideMenu = true; section='login';" style="float:right;">Login</el-menu-item>
        <el-menu-item v-if="!me" index="5"  :route="'#'" @click="manualSideMenu = true; showSideMenu = true; section='register';" style="float:right;">Register</el-menu-item>
        <el-submenu v-else-if="me" index="6"  :route="'#'" style="float:right;">
            <template slot="title">
                <img class="io-avatar io-avatar-margin" src="~/assets/images/avatar.png" width="26" height="26">
                Hi, {{ me.name }}
            </template>
            <router-link :to="{ name : 'profile' }">
                <el-menu-item index="6-1">Profile</el-menu-item>
            </router-link>
            <router-link :to="{ name : 'logout' }">
                <el-menu-item index="6-2">Logout</el-menu-item>
            </router-link>
        </el-submenu>
    </el-menu>

    <transition name="slide">
            <div v-if="showSideMenu && !me" class="el-sidemenu">
                <div v-if="manualSideMenu" 
                        @click="manualSideMenu=false;showSideMenu=false;"
                        class="btn-close">
                        <i class="el-icon-close"></i>
                </div>
                <div v-if="section=='login'" >
                    <div class="el-sidemenu-title">
                        <h3>Login</h3>
                        <span>or <a v-on:click="section='register'">register ?</a></span>
                    </div>
                    <login></login>
                </div>
                <div v-else-if="section=='register'">
                    <div class="el-sidemenu-title">
                        <h3>Register</h3>
                        <span>or <a v-on:click="section='login'">login ?</a></span>
                    </div>
                    <register></register>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
    import {mapGetters, mapActions} from 'vuex'
    import Login from '../pages/auth/Login.vue'
    import Register from '../pages/auth/Register.vue'
    export default {
        components : { Login, Register},
        props: ["sideMenuOpen"],
        data() {
            return {
                section : 'login',
                showSideMenu : this.sideMenuOpen,
                manualSideMenu : false,
            }
        },
        computed: {
            ...mapGetters([
                'me'
            ]),
        },
        methods: {
            handleScroll () {
                if (window.scrollY > (window.outerHeight/2) && this.manualSideMenu == false){
                    this.showSideMenu = false;
                }else{
                    this.showSideMenu = true;
                }
            }
        },
        created () {
            window.addEventListener('scroll', this.handleScroll);
        },
        destroyed () {
            window.removeEventListener('scroll', this.handleScroll);
        }
    }
</script>
