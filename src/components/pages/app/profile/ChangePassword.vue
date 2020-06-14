<template>
    <el-form size="small" :model="profileForm" status-icon :rules="rules" ref="profileForm" class="demo-ruleForm">
        <el-form-item label="Old password" prop="old_password">
            <el-input type="password" v-model="profileForm.old_password" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="New password" prop="password">
            <el-input type="password" v-model="profileForm.password" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="Confirm" prop="password_confirmation">
            <el-input type="password" v-model="profileForm.password_confirmation" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" :loading="isLoading" @click="submitForm">Change</el-button>
        </el-form-item>
    </el-form>
</template>

<script>
    import {mapGetters, mapActions} from 'vuex'
    export default {
        data() {
            let validatePasswordConfirmation = (rule, value, callback) => { 
                if (value !== this.profileForm.password) { 
                    callback(new Error('Two inputs don\'t match!')); 
                } else { 
                    callback(); 
                } 
            }; 
            return {
                profileForm: {
                    old_password: '',
                    password: '',
                    password_confirmation: '',
                },
                isLoading: false,
                rules: {
                    old_password: [
                        { required: true, trigger: 'blur' },
                        { validator: Helpers.$validator.validatePassword, trigger: 'blur' }
                    ],
                    password: [
                        { required: true, trigger: 'blur' },
                        { validator: Helpers.$validator.validatePassword, trigger: 'blur' }
                    ],
                    password_confirmation: [
                        { required: true, trigger: 'blur' },
                        { validator: validatePasswordConfirmation, trigger: 'blur' }
                    ],
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
                'changePassword',
            ]),
            submitForm() {
                this.$refs.profileForm.validate((valid) => {
                    if (valid) {
                        this.isLoading = true;
                        this.changePassword({id: this.me.id, form: this.profileForm})
                            .then(() => {
                                this.$notify.success({
                                    title: 'Success',
                                    message: 'Password changed!'
                                });
                                this.isLoading = false;
                                  profileForm = {
                                    old_password: '',
                                    password: '',
                                    password_confirmation: '',
                                };
                            })
                            .catch((error) => {
                                this.$notify.error({
                                    title: 'Error',
                                    message: error ? error : 'Error while changing password!'
                                });
                                this.isLoading = false;
                            });
                    }
                });
            },
        }
    }
</script>