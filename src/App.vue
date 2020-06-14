<template>
    <div id="app" v-loading.fullscreen.lock="loading">
        <router-view></router-view>
    </div>
</template>

<script>
    import {mapGetters, mapActions} from 'vuex'
    export default {
        name: 'app',
        computed: {
            ...mapGetters(['loading']),
        },
    }
</script>