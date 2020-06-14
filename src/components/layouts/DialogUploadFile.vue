<template>
    <el-dialog title="Upload a file"
               :visible.sync="isVisible"
               :before-close="close"
               width="50%">
        <div>
            <upload-file @over="close">
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">Drop file here or <em>click to upload</em></div>
            </upload-file>
        </div>
    </el-dialog>
</template>

<script>
    import {mapGetters, mapActions} from 'vuex';
    import UploadFile from './UploadFile';
    export default {
        components : {UploadFile},
        props : ['isVisible'],
        data() {
            return {
            };
        },
        methods: {
            close(){
                this.$emit('close');
            }
        },
    }
</script>
