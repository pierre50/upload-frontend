<template>
    <el-container class="detail-content">
        <el-header class="detail-header">
          <div class="detail-header__file">
            <el-tooltip class="item" effect="dark" :content="selectedFile.filename" placement="bottom-start">
                <div class="text-ellipses">{{ selectedFile.filename }}</div>
            </el-tooltip>
            <el-dropdown>
                <span class="el-dropdown-link cursor-pointer">
                    <i class="fa fa-bars"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                    <div @click="dialogRenameFileVisible = true"><el-dropdown-item>Rename</el-dropdown-item></div>
                    <div @click="dialogSelectPathVisible = true"><el-dropdown-item>Move</el-dropdown-item></div>
                    <div @click="handleDeleteFile(selectedFile.hash)"><el-dropdown-item>Delete</el-dropdown-item></div>
                    <div @click="removeSelectedFile"><el-dropdown-item divided>Close</el-dropdown-item></div>
                </el-dropdown-menu>
            </el-dropdown>
          </div>
        </el-header>
        <el-main class="detail-main">
          <div class="detail-main__file">
            <div class="detail-main__preview">
                <div v-if="allowPreview" class="detail-preview">
                    <div v-if="fileType === 'image'" class="detail-preview__image">
                        <img :src="previewLink">
                    </div>
                    <plyr v-if="fileType === 'audio'" class="detail-preview__audio">
                      <audio id="player" :src="previewLink" controls></audio>
                    </plyr>
                    <plyr v-if="fileType === 'video'" class="detail-preview__video">
                      <video id="player" :src="previewLink" controls></video>
                    </plyr>
                    <iframe v-if="fileType === 'pdf'" :src="previewLink" frameborder="0" class="detail-preview__doc"></iframe>
                </div>
                <div v-else class="detail-icon">
                    <div class="detail-icon__main">
                        <i :class="selectedFile.icon + ' fa-3x'"></i>
                        <div>No preview for this file</div>
                    </div>
                </div>
            </div>
            <div class="detail-main__detail">
                <div class="text-smaller">Uploaded : {{ selectedFile.uploaded_date }}</div>
                <div class="text-smaller">Size : {{ selectedFile.size_format }}</div>
                <div class="text-smaller">Downloads : {{ selectedFile.downloads }}</div>
                <div>
                  <span class="text-smaller">Shared : </span>
                  <el-switch
                      @change="handleShareFile"
                      v-model="shared"
                      active-text="On"
                      inactive-text="Off"
                      active-color="#13ce66"
                      inactive-color="#ff4949">
                  </el-switch>
                </div>
                <div v-if="selectedFile.public_hash != ''">
                  <span class="text-smaller">Share link :</span>
                  <el-tag>
                      <a :href="fileLink" target="_blank"> {{ fileLink }}</a>
                  </el-tag>
                  <el-tooltip content="Copy to clipboard" placement="bottom">
                    <el-button size="small" @click="doCopy(fileLink)"><i class="fa fa-clipboard" aria-hidden="true"></i></el-button>
                  </el-tooltip>
                </div>
                <el-button size="small" @click="downloadFile(selectedFile.hash)" type="primary">
                    Download ({{ selectedFile.size_format }})
                </el-button>
            </div>
          </div>
        </el-main>

        <dialog-rename :is-visible="dialogRenameFileVisible"
                       :old-name="selectedFile.filename"
                       :retireExt="true"
                       :btn-loading="isRenameFileBtnLoading"
                       title="Rename your file"
                       :validator="validator"
                       @confirm="handleRenameFile"
                       @cancel="dialogRenameFileVisible=false">
        </dialog-rename>
        <dialog-select-path :is-visible="dialogSelectPathVisible"
                            :btn-loading="isMoveFileBtnLoading"
                            title="Move your file"
                            @cancel="dialogSelectPathVisible = false"
                            @confirm="handleMoveFile">
        </dialog-select-path>
    </el-container>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import DialogSelectPath from "../../../../layouts/DialogSelectPath";
import DialogRename from "../../../../layouts/DialogRename";

export default {
  components: { DialogSelectPath, DialogRename },
  data() {
    return {
      url: window.location.protocol + "//" + window.location.host + "/",
      dialogRenameFileVisible: false,
      dialogSelectPathVisible: false,
      validator: Helpers.$validator.validateFilename,
      isRenameFileBtnLoading: false,
      isMoveFileBtnLoading: false,
    };
  },
  methods: {
    ...mapActions([
      "downloadFile",
      "removeSelectedFile",
      "deleteFile",
      "renameFile",
      "moveFile",
      "shareFile"
    ]),

    handleShareFile(val){
      this.shareFile({ hash : this.selectedFile.hash, status : val})
          .then((public_hash) => {
            if (public_hash === ''){
              this.$notify.warning({
                title: "Warning",
                message: "File not shared anymore."
              });
            }else{
              this.$notify.success({
                title: "Success",
                message: "File shared."
              });
            }
          })
          .catch(error => {
            this.$notify.error({
              title: "Error",
              message: error ? error : "Cannot share file."
            });
          });
    },
    handleDeleteFile(hash) {
      this.$confirm(
        "This will permanently delete the file. Continue?",
        "Warning",
        {
          confirmButtonText: "OK",
          cancelButtonText: "Cancel",
          type: "warning"
        }
      )
        .then(() => {
          this.deleteFile(hash)
            .then(() => {
              this.$notify.success({
                title: "Success",
                message: "File deleted."
              });
              this.$EventBus.$emit("load-files");
            })
            .catch(() => {
              this.$notify.error({
                title: "Error",
                message: "Cannot delete file."
              });
            });
        })
        .catch(() => {});
    },
    handleRenameFile(name) {
      this.isRenameFileBtnLoading = true;
      this.renameFile({ hash: this.selectedFile.hash, name: name })
        .then(() => {
          this.$notify.success({
            title: "Success",
            message: "File renamed."
          });
          this.isRenameFileBtnLoading = false;
          this.$EventBus.$emit("load-files");
          this.dialogRenameFileVisible = false;
        })
        .catch(error => {
          this.$notify.error({
            title: "Error",
            message: error ? error : "Cannot rename file."
          });
          this.isRenameFileBtnLoading = false;
        });
    },
    handleMoveFile(newPath) {
      this.isMoveFileBtnLoading = true;
      this.moveFile({ hash: this.selectedFile.hash, newPath: newPath })
        .then(() => {
          this.$notify.success({
            title: "Success",
            message: "File moved."
          });
          this.isMoveFileBtnLoading = false;
          this.$EventBus.$emit("load-files");
          this.dialogSelectPathVisible = false;
        })
        .catch(error => {
          this.$notify.error({
            title: "Error",
            message: error ? error : "Cannot move file."
          });
          this.isMoveFileBtnLoading = false;
        });
    },
    doCopy(str) {
      this.$copyText(str).then(() => {
        this.$notify.info({
          title: "Info",
          message: "Link copied to your clipboard."
        });
      });
    }
  },
  computed: {
    ...mapGetters(["me", "files", "selectedFile"]),
    fileType() {
      return this.selectedFile.mime.split("/")[0] === "application"
        ? this.selectedFile.mime.split("/")[1]
        : this.selectedFile.mime.split("/")[0];
    },
    allowPreview() {
      return Helpers.$utils.allowPreview(this.selectedFile.mime)
    },
    previewLink() {
      return Helpers.$config.apiPath + "file/get/" + this.selectedFile.hash;
    },
    fileLink() {
      return `${this.url}#/file/${this.selectedFile.public_hash}`;
    },
    shared:{
      get(){
        return this.selectedFile.public_hash != '' ? true : false;
      },
      set(val){
      
      }
    }
  },

};
</script>
