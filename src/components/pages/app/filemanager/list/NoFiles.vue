<template>
    <upload-file customClass="fullpage">
        <div class="dragFileContainer">
            <div class="el-upload__title">You have no uploaded files yet</div>
            <div class="el-upload__text">Upload files by clicking the buttons above.<br>Drag & drop files from your computer or
                <em>click to upload</em>.
            </div>
            <div class="dragFile"></div>
        </div>
    </upload-file>
</template>

<script>
    import {mapGetters, mapActions} from 'vuex';
    import UploadFile from '../../../../layouts/UploadFile';
    export default {
        components : {UploadFile},
        data() {
            return {
            };
        },
        methods: {
        },
    }
</script>
