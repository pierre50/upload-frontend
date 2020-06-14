<template>
    <div>
        <el-form size="small" :model="loginForm" status-icon :rules="rules" ref="loginForm">
            <el-form-item label="Email" prop="email">
                <el-input name="email" type="email" v-model="loginForm.email"></el-input>
            </el-form-item>
            <el-form-item label="Password" prop="password">
                <el-input name="password" type="password" v-model="loginForm.password"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button @click="dialogForgotPasswordVisible = true" type="text">Forgot password ?</el-button>
                <el-button :loading="isLoading" class="btn-large" type="primary" @click="submitForm">Login</el-button>
            </el-form-item>
        </el-form>

        <el-dialog 
            append-to-body
            title="Forgot password"
            :visible.sync="dialogForgotPasswordVisible"
            @close="dialogForgotPasswordClose"
            width="50%">
            <div>
                <p>
                    You forgot you password ? <br>
                    Don't worry, specify your email press Send and you will receive a new password !
                </p>
                <el-form :model="forgotForm" :rules="rulesForgot" ref="forgotForm" size="small">
                    <el-form-item label="Email" prop="email">
                        <el-input  name="email" type="email" v-model="forgotForm.email"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="dialogForgotPasswordClose">Cancel</el-button>
                <el-button size="small" @click="handleForgotPassword" :loading="isSendBtnLoading" type="primary">Send</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {mapGetters, mapActions} from 'vuex'
    export default {
        name: 'login',
        data() {
            return {
                dialogForgotPasswordVisible: false,
                isSendBtnLoading: false,
                loginForm: {
                    email: '',
                    password: '',
                },
                forgotForm: {
                    email: '',
                },
                rules: {
                    email: [
                        { type: 'email', required : true, trigger: 'blur' }
                    ],
                    password: [
                        { required : true, trigger: 'blur' }
                    ],
                },
                rulesForgot:{
                    email: [
                        { type: 'email', required : true, trigger: 'blur' }
                    ],
                },
                isLoading: false,
            };
        },
        computed: {
            ...mapGetters(['me','loading'])
        },
        methods: {
            ...mapActions([
                'login',
                'forgotPassword'
            ]),
            dialogForgotPasswordClose(){
                this.forgotForm.email = "";
                this.dialogForgotPasswordVisible = false;
            },
            handleForgotPassword(){
                this.$refs.forgotForm.validate(valid => {
                    if (valid) {
                        this.isSendBtnLoading = true;
                        this.forgotPassword(this.forgotForm)
                        .then(() => {
                            this.$notify.success({
                                title: "Success",
                                message: "New password sended."
                            });
                            this.forgotForm.email = "";
                            this.isSendBtnLoading = false;
                            this.dialogForgotPasswordVisible = false;
                        })
                        .catch(error => {
                            this.$notify.error({
                                title: "Error",
                                message: error ? error : "Cannot send new password."
                            });
                            this.isSendBtnLoading = false;
                        });
                    }
                });
            },
            submitForm() {
                this.$refs.loginForm.validate(valid => {
                    if (valid) {
                        this.isLoading = true;
                        this.login(this.loginForm)
                            .then((username) => {
                                this.$notify.success({
                                    title: 'Success',
                                    message: `Welcome ${username}, how are you today ?`
                                });
                                this.isLoading = false;
                                this.$router.push( { name : 'app' })
                            })
                            .catch((error) => {
                                this.isLoading = false;
                                this.$notify.error({
                                    title: 'Error',
                                    message: error ? error : 'Wrong email or password'
                                });
                            })
                    } else {
                        return false;
                    }
                });
            },
        }
    }
</script>
