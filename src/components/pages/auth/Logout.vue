<template>
</template>

<script>
    import {mapActions} from 'vuex';
    export default {
        mounted() {
            this.logout();
            this.$router.push( { name : 'main' })
        },
        methods: {
            ...mapActions([
                'logout',
            ]),
        }
    }
</script>