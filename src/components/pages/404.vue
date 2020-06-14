<template>
    <div class="error-content">
        <nav-bar :side-menu-open="false">
            <el-menu-item index="1" :route="{ name: 'main'}">
                <img src="~/assets/images/logotext.png" height="24">
            </el-menu-item>
        </nav-bar>
    
        <div class="error-main">
            <div class="text-bigger">Oops !</div>
    
            <div>We can't seem to find the page you're looking for.</div>
            <div class="text-smaller"> Error code : 404 </div>
            <router-link :to="{ name : 'main' }">
                <el-button size="small" @click="goHome" type="primary">Go home</el-button>
            </router-link>
        </div>
     </div>
</template>

<script>
    import {mapState, mapActions} from 'vuex';
    import NavBar from '../layouts/NavBar.vue'
    export default {
        components: { NavBar },
        data() {
            return {};
        },
        methods: {
            goHome(){
                this.$router.push( { name : 'app' })
            }
        }
    }
</script>