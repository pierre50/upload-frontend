<template>
    <el-container>
        <el-main>
            <el-tabs tab-position="left">
                <el-tab-pane label="Edit profile"><edit-profile></edit-profile></el-tab-pane>
                <el-tab-pane label="Change password"><change-password></change-password></el-tab-pane>
                <el-tab-pane label="Parameters"><parameters></parameters></el-tab-pane>
                <el-tab-pane label="Offers" disabled></el-tab-pane>
            </el-tabs>
        </el-main>
    </el-container>
</template>

<script>
    import {mapGetters, mapActions} from 'vuex'
    import EditProfile from './EditProfile.vue'
    import ChangePassword from './ChangePassword.vue'
    import Parameters from './Parameters.vue'
    export default {
        components : { EditProfile, ChangePassword, Parameters },
        data() {
            return {
            }
        },
        computed: {
            ...mapGetters([
                'me'
            ]),
        },
        methods: {
        }
    }
</script>