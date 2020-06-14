<template>
    <div class="app-header-menu">
        <router-link :to="{ name : 'app' }">
            <img src="~/assets/images/logotext.png" height="24">
        </router-link>
        <el-input size="small" placeholder="Search a file" v-model="filterText" prefix-icon="el-icon-search" class="el-input-search"></el-input>
        <el-button size="small" @click="dialogUploadFileVisible = true">Upload a file</el-button>
        <el-button size="small" type="primary" @click="dialogSelectPathVisible = true">Create a directory</el-button>
        
        <dialog-upload-file :is-visible="dialogUploadFileVisible"
                            @close="dialogUploadFileVisible = false">
        </dialog-upload-file>
        <dialog-select-path :is-visible="dialogSelectPathVisible"
                            title="Create a directory"
                            :btn-loading="isCreateDirBtnLoading"
                            btn-type="success"
                            btn-text="Create"
                            @cancel="closeDialogSelectPath"
                            @confirm="handleCreateDirectory">
            <el-form size="small" :model="directoryForm" status-icon :rules="rules" ref="directoryForm" class="demo-ruleForm">
                <el-form-item label="Directory name" prop="name">
                    <el-input placeholder="New directory name" v-model="directoryForm.name"></el-input>
                </el-form-item>
            </el-form>
        </dialog-select-path>
    </div>
</template>


<script>
    import {mapGetters, mapActions} from 'vuex'
    import DialogSelectPath from '../../layouts/DialogSelectPath'
    import DialogUploadFile from '../../layouts/DialogUploadFile'
    export default {
        components: {DialogSelectPath, DialogUploadFile},
        data() {
            return {
                dialogSelectPathVisible: false,
                dialogUploadFileVisible: false,
                directoryForm: {name: ''},
                rules: {
                    name: [
                        {required: true, trigger: 'blur'},
                        {validator: Helpers.$validator.validateDirname, trigger: 'blur'}
                    ],
                },
                isCreateDirBtnLoading: false,
                filterText: '',
            };
        },
        watch: {
            filterText(val) {
                this.$EventBus.$emit('search-files', val);
            },
        },
        methods: {
            ...mapActions(['uploadFile', 'loadFiles', 'showFile', 'createDirectory', 'showDirectory']),
            handleCreateDirectory(path) {
                this.$refs.directoryForm.validate((valid) => {
                    if (valid) {
                        this.isCreateDirBtnLoading = true;
                        let dir = {
                            name: this.directoryForm.name,
                            path: path
                        };
                        this.createDirectory(dir)
                            .then(() => {
                                this.$notify.success({
                                    title: 'Success',
                                    message: 'Directory created.'
                                });
                                this.isCreateDirBtnLoading = false;
                                this.$EventBus.$emit('load-files');
                                this.closeDialogSelectPath();
                            })
                            .catch((error) => {
                                this.isCreateDirBtnLoading = false;
                                this.$notify.error({
                                    title: 'Error',
                                    message: error ? error : 'Cannot create directory.'
                                });
                            })
                    }
                })
            },
            closeDialogSelectPath() {
                this.directoryForm.name = '';
                this.dialogSelectPathVisible = false;
            },
        },
        computed: {
        },
    }
</script>