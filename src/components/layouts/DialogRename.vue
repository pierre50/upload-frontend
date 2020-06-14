<template>
    <el-dialog v-if="form"
               :title="title"
               :visible.sync="isVisible"
               :before-close="cancel"
               width="30%">
        <div>
            <el-form size="small" :model="form" status-icon :rules="rules" ref="form" class="demo-ruleForm">
                <el-form-item label="New name" prop="name">
                    <el-input placeholder="New name" v-model="form.name">
                        <template v-if="form.extension" slot="append">{{ form.extension}}</template>
                    </el-input>
                </el-form-item>
            </el-form>
        </div>
        <div slot="footer" class="dialog-footer">
            <el-button size="small" @click="cancel">Cancel</el-button>
            <el-button size="small" :loading="btnLoading" type="primary" @click="confirm">Confirm</el-button>
        </div>
    </el-dialog>

</template>

<script>
    export default {
        props : {
            oldName: String,
            isVisible: Boolean,
            directories: Array,
            title : String,
            retireExt : {
                type: Boolean,
                default: false
            },
            btnLoading: {
                type: Boolean,
                default: false
            },
            validator: Function
        },
        data() {
            let hasChanged = (rule, value, callback) => {
                if (value === this.realOldName) {
                    callback(new Error('The new name cannot be the same as the old one !'));
                } else {
                    callback();
                }
            };
            return {
                form: null,
                rules: {
                    name: [
                        { required: true, trigger:'blur'},
                        { validator: this.validator, trigger: 'blur'},
                        { validator: hasChanged, trigger: 'blur'}
                    ],
                },
            };
        },
        computed: {
            realOldName(){
                let extension = this.oldName.split('.').pop();
                return this.oldName.replace('.' + extension, '');
            },
        },
        watch:{
            oldName(val){
                this.form = this.getForm();
            }
        },
        created(){
            this.form = this.getForm();
        },
        methods: {
            getForm(){
                if (this.retireExt) {
                    let extension = this.oldName.split('.').pop();
                    let filename = this.oldName.replace('.' + extension, '');
                    return {
                        name: filename,
                        extension: extension
                    };
                }
                return {
                    name : this.oldName,
                }
            },
            confirm(){
                this.$refs['form'].validate((valid) => {
                    if (valid) {
                        let name = this.form.name;
                        if (this.retireExt) {
                            name = this.form.name + '.' + this.form.extension;
                        }
                        this.$emit('confirm', name);
                    }else {
                        return false;
                    }
                });
            },
            cancel(){
                this.form = this.getForm();
                this.$emit('cancel');
            }
        },
    }
</script>
