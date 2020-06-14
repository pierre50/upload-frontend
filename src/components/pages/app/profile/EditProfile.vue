<template>
    <el-form size="small" :model="profileForm" status-icon :rules="rules" ref="profileForm" class="demo-ruleForm">
        <el-form-item label="Name" prop="name">
            <el-input v-model="profileForm.name"></el-input>
        </el-form-item>
        <el-form-item label="Email" prop="email">
            <el-input v-model="profileForm.email"></el-input>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" :loading="isLoading" @click="submitForm">Edit</el-button>
        </el-form-item>
    </el-form>
</template>


<script>
    import {mapGetters, mapActions} from 'vuex'
    export default {
        data() {
            return {
                profileForm: {
                    name: '',
                    email: '',
                },
                isLoading: false,
                rules: {
                    name: [{ required: true, trigger: 'blur' }],
                    email: [{ type: 'email', required: true, trigger:'blur'}]
                },
            }
        },
        computed: {
            ...mapGetters([
                'me'
            ]),
        },
        mounted() {
            this.profileForm.name = this.me.name;
            this.profileForm.email = this.me.email;
        },
        methods: {
            ...mapActions([
                'updateProfile',
            ]),
            submitForm() {
                this.$refs.profileForm.validate((valid) => {
                    if (valid) {
                        this.isLoading = true;
                        this.updateProfile({id: this.me.id, form: this.profileForm})
                            .then(() => {
                               this.$notify.success({
                                    title: 'Success',
                                    message: 'Profile edited!'
                                });
                                this.isLoading = false;
                            })
                            .catch((error) => {
                               this.$notify.error({
                                    title: 'Error',
                                    message: 'Error while editing profile!'
                                });
                                this.isLoading = false;
                            });
                    }
                });
            },
        }
    }
</script>