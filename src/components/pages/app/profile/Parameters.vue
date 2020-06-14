<template>
    <div>
        <el-button size="small" :loading="isDeleteBtnLoading" type="danger" @click="handleDeleteUser">Delete my account</el-button>
    </div>
</template>

<script>
    import {mapGetters, mapActions} from 'vuex'
    export default {
        data() {
            return {
                isDeleteBtnLoading : false,
            }
        },
        computed: {
            ...mapGetters([
                'me'
            ]),
        },
        methods: {
            ...mapActions([
                'deleteUser',
            ]),
            handleDeleteUser() {
                this.$confirm('This will permanently delete your account. Continue?', 'Warning', {
                confirmButtonText: 'OK',
                cancelButtonText: 'Cancel',
                type: 'warning'
                }).then(() => {
                    this.isDeleteBtnLoading = true;
                    this.deleteUser()
                    .then(() => {
                        this.$router.push( { name : 'main' });
                        this.isDeleteBtnLoading = false;
                    })
                    .catch((error) => {
                        this.$notify.error({
                            title: 'Error',
                            message: error ? error : 'Error while deleting account !'
                        });
                        this.isDeleteBtnLoading = false;
                    });
                }).catch(() => {        
                });
            },
        }
    }
</script>