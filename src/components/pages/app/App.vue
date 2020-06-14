<template>
    <el-container style="height: 100%;">
        <dashboard></dashboard>
        <div class="app">
            <div class="app-header">
                <header-menu></header-menu>
            </div>
            <div class="app-main">
                <file-manager v-if="$route.name=='app'"></file-manager>
                <router-view></router-view>
            </div>
        </div>
    </el-container>
</template>

<script>
    import {mapGetters, mapActions} from 'vuex'
    import FileManager from './filemanager/FileManager'
    import Dashboard from './Dashboard'
    import HeaderMenu from './HeaderMenu'
    export default {
        components: {FileManager, Dashboard, HeaderMenu},
        data() {
            return {
            };
        },
    }
</script>