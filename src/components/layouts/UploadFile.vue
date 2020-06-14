<template>
    <el-upload
            :class="'upload-file ' + customClass"
            drag
            action=""
            :on-change="onChange"
            :auto-upload="false"
            :show-file-list="false"
            multiple>
        <slot></slot>
    </el-upload>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  props: ["customClass"],
  methods: {
    ...mapActions(["uploadFile", "updateUploadList"]),
    onChange(file, files) {
      let path = "/";
      let total_space = 0;
      for (let i = 0; i < files.length; i++) {
        total_space += files[i].size;
      }
      if (
        parseInt(this.me.size) + parseInt(total_space) <
        this.me.offer.capacity
      ) {
        let msg =
          files.length === 1
            ? "File is now uploading, check your dashboard."
            : "Files are now uploading, check your dashboard.";
        this.$notify.info({
          title: "Info",
          message: msg
        });
        this.handleUploadFile(file.raw, path);
      } else {
        this.$notify.error({
          title: "Error",
          message: "Not enough space!"
        });
      }
    },
    handleUploadFile(file, path) {
      const file_size = file.size;
      const file_name = file.name;
      if (this.uploadList.some( uploadFile => {
        return uploadFile.status != "success"  && uploadFile.status != "fail" && uploadFile.size === file_size && uploadFile.name === file_name;
      })){
        return;  
      }

      this.uploadFile({ file, path })
        .then(_ => {
          this.$EventBus.$emit('load-files');
          this.$emit('over'); 
        })
        .catch(error => {
          this.$notify.error({
            title: "Error",
            message: error ? error : "Error while uploading file(s)."
          });
        });
    }
  },
  computed: {
    ...mapGetters(["me", "files", "uploadList"]),
    capacityFormat() {
      return Helpers.$utils.formatBytes(this.me.offer.capacity);
    }
  }
};
</script>
