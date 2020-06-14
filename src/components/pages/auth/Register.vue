<template>
    <el-form size="small" :model="registerForm" status-icon :rules="rules" ref="registerForm" class="demo-ruleForm">
        <el-form-item label="Name" prop="name">
            <el-input v-model="registerForm.name"></el-input>
        </el-form-item>
        <el-form-item label="Email" prop="email">
            <el-input v-model="registerForm.email"></el-input>
        </el-form-item>
        <el-form-item label="Password" prop="password">
            <el-input type="password" v-model="registerForm.password" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="Confirm" prop="password_confirmation">
            <el-input type="password" v-model="registerForm.password_confirmation" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" :loading="isRegisterBtnLoading" class="btn-large" @click="submitForm">Submit</el-button>
        </el-form-item>
    </el-form>
</template>

<script>
    import {mapActions} from 'vuex';
    export default {
        data() {
            let validatePasswordConfirmation = (rule, value, callback) => {
                if (value !== this.registerForm.password) {
                    callback(new Error('Two inputs don\'t match!'));
                } else {
                    callback();
                }
            };
            return {
                isRegisterBtnLoading: false,
                registerForm: {
                    name: '',
                    email: '',
                    password: '',
                    password_confirmation: '',
                },
                rules: {
                    name: [{ required: true, trigger: 'blur' }],
                    email: [{ type: 'email', required: true, trigger:'blur'}],
                    password: [
                        { required: true, trigger: 'blur' },
                        { validator: Helpers.$validator.validatePassword, trigger: 'blur' }
                    ],
                    password_confirmation: [
                        { required: true, trigger: 'blur' },
                        { validator: validatePasswordConfirmation, trigger: 'blur' }
                    ],
                },
            };
        },

        methods: {
            ...mapActions([
                'register',
            ]),

            submitForm(formName) {
                this.$refs.registerForm.validate((valid) => {
                    if (valid) {
                        this.isRegisterBtnLoading = true;
                        this.register(this.registerForm)
                        .then(username => {
                            this.$notify.success({
                                title: 'Success',
                                message: `Welcome ${username}, how are you today ?`
                            });
                            this.$router.push( { name : 'app' })
                            this.isRegisterBtnLoading = false;
                        })
                        .catch((error) => {
                            this.$notify.error({
                                title: "Error",
                                message: error ? error : "Cannot delete files."
                            });           
                            this.isRegisterBtnLoading = false;                 
                        });
                    }
                });
            },

        }
    }
</script>
