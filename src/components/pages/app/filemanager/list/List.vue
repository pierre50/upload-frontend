<template>
  <el-container class="file-list-content"  v-loading="isFilesLoading">
    <div v-if="files.length > 0" class="dropping-zone">
      <div class="file-list__header">
        <span>Selected files : {{ checkedFiles.length }}</span>
        <el-button size="small" type="primary" :disabled="checkedFiles.length == 0 || rootSelected" @click="dialogSelectPathVisible = true">Move file(s)</el-button>
        <el-button size="small" :disabled="checkedFiles.length == 0" :loading="isDeleteBtnLoading" @click="handleDeleteFiles">Delete file(s)</el-button>
      </div>
      <el-tree :data="files"
                empty-text=""
                @check="checkChanged"
                check-strictly
                show-checkbox
                @node-click="handleNodeClick"
                :filter-node-method="filterNode"
                ref="files"
                node-key="treeId"
                default-expand-all
                :expand-on-click-node="false"
                highlight-current>
        <div class="el-tree-node__body" :id="data.treeId" slot-scope="{ node, data }">
          <!--<img v-if="getFormatIcon(data.mime) === 'fa fa-file-image-o'" 
                :src="getFilePreview(data.hash)" style="padding: 0px 6px;" width="14" height="14">-->
          <i v-if="data.size" :class="getFormatIcon(data.mime)"></i>
          <i v-else :class="node.expanded ? 'fa fa-folder-open-o' : 'fa fa-folder-o'"></i>
          <el-tooltip :content="data.label" placement="bottom">
            <span class="el-tree-node__name text-regular text-ellipses">
              {{ data.label }}
            </span>
          </el-tooltip>
          <span v-if="data.size" class="el-tree-node__size text-smaller">
            {{ getFormatSize(data.size) }}
          </span>
          <span v-if="data.uploadDate" class="el-tree-node__date text-smaller">
            {{ getFormatTime(data.uploadDate) }}
          </span>
        </div>
      </el-tree>
       <div v-if="!filterFoundFile && !isFilesLoading" class="no-file-found">
        There are no results that match your search
      </div>
      </div>
      <no-files v-else-if="files.length <= 0 && !isFilesLoading">
      </no-files>
      <dialog-select-path :is-visible="dialogSelectPathVisible"
                          :btn-loading="isMoveFileBtnLoading"
                          title="Move your file"
                          :ids="checkedIds"
                          @cancel="dialogSelectPathVisible = false"
                          @confirm="handleMoveFiles">
      </dialog-select-path>
  </el-container>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import NoFiles from "./NoFiles";
import DialogSelectPath from "../../../../layouts/DialogSelectPath";
export default {
  components: { NoFiles, DialogSelectPath },
  data() {
    return {
      url: window.location.protocol + "//" + window.location.host + "/",
      isFilesLoading: false,
      filterFoundFile: true,
      totalFounded: 0,
      checkedFiles: [],
      dialogSelectPathVisible: false,
      isMoveFileBtnLoading: false,
      isDeleteBtnLoading: false,
    };
  },

  methods: {
    ...mapActions([
      "uploadFile",
      "loadFiles",
      "createDirectory",
      "moveFiles",
      "deleteFiles"
    ]),
    getFormatIcon(mime) {
      return Helpers.$utils.mimeToIcon(mime);
    },
    getFormatSize(size) {
      return Helpers.$utils.formatBytes(size);
    },
    getFormatTime(time) {
      return Helpers.$utils.timeConverter(time);
    },
    getFilePreview(hash) {
      return Helpers.$config.apiPath + "file/get/" + hash;
    },
    handleNodeClick(prop, node) {
      if (!node.hash){
        node.path = Helpers.$utils.findPath(node)
      }
      this.$emit('clicked', node.data);
    },
    handleMoveFiles(newPath){
      this.isMoveFileBtnLoading = true;
      let files = this.checkedFiles.filter( checkedFile => {
        return !checkedFile.ignore;
      }).map( checkedFile =>{
        return checkedFile.hash ? { hash : checkedFile.hash} : { path : checkedFile.path}
      })
      this.moveFiles({ files, newPath})
        .then(files => {
          this.$notify.success({
            title: "Success",
            message: "File moved."
          });
          this.isMoveFileBtnLoading = false;
          this.$EventBus.$emit("load-files");
          this.dialogSelectPathVisible = false;
        })
        .catch(error => {
          this.isMoveFileBtnLoading = false;
          this.$notify.error({
            title: "Error",
            message: error ? error : "Cannot move files."
          });
        });
    },
    handleDeleteFiles(){
     this.isDeleteBtnLoading = true;
      let files = this.checkedFiles.filter( checkedFile => {
        return !checkedFile.ignore;
      }).map( checkedFile =>{
        return checkedFile.hash ? { hash : checkedFile.hash} : { path : checkedFile.path}
      })
      this.$confirm(
        "This will permanently delete the file(s). Continue?",
        "Warning",
        {
          confirmButtonText: "OK",
          cancelButtonText: "Cancel",
          type: "warning"
        }
      )
        .then(() => {
          this.deleteFiles({ files })
            .then(files => {
              this.$notify.success({
                title: "Success",
                message: "Files deleted."
              });
              this.isDeleteBtnLoading = false;
              this.$EventBus.$emit("load-files");
            })
            .catch(error => {
              this.isDeleteBtnLoading = false;
              this.$notify.error({
                title: "Error",
                message: error ? error : "Cannot delete files."
              });
            });
        });
    },
    handleUploadFile(file, path) {
      const file_size = file.size;
      const file_name = file.name;
      if (this.uploadList.some( uploadFile => {
        return uploadFile.status != "success" && uploadFile.status != "fail" && uploadFile.size === file_size && uploadFile.name === file_name;
      })){
        return;  
      }
      this.uploadFile({ file, path })
        .then(_ => {
          this.$notify.success({
            title: "Success",
            message: "File uploaded."
          });
          this.handleLoadFiles();
        })
        .catch(error => {
          this.$notify.error({
            title: "Error",
            message: error ? error : "Error while uploading file(s)."
          });
        });
    },
    handleLoadFiles() {
      this.isFilesLoading = true;
      this.loadFiles()
        .then(files => {
          this.isFilesLoading = false;
          this.checkedFiles = [];
          if (this.selectedFile){
            let node = Helpers.$utils.findNodeWithHash(JSON.parse(JSON.stringify(this.files[0])), this.selectedFile.hash);
            if (this.$refs.files){
              this.$refs.files.setCurrentKey(node.treeId);
            }
          }
        })
        .catch(error => {
          this.isFilesLoading = false;
          this.$notify.error({
            title: "Error",
            message: error ? error : "Cannot load files."
          });
        });
    },
    checkChanged(node, data){
      let checked = this.$refs.files.getNode(node).checked;
      if (node.children){
        if (checked){
          let keys = [];
          recursChild(node, keys)
          this.$refs.files.setCheckedKeys(keys);
        }else{
          let keys = [];
          recursChild(node, keys)
          let keysFiltered = this.$refs.files.getCheckedKeys().filter( keyFiltered => {
            return !keys.some( key => {
              return key === keyFiltered;
            })
          });
          this.$refs.files.setCheckedKeys(keysFiltered);
        }
      }else{
        if (!checked){
          let el = this.$refs.files.getNode(node);
          let parents = [];
          while (el.parent) {
            el = el.parent;
            parents.push(el.data.treeId)
          }
          let keys = this.$refs.files.getCheckedKeys().filter( key => {
            return !parents.some( parent => {
              return parent === key;
            })
          });
          this.$refs.files.setCheckedKeys(keys);
        }
      }
      let keysExcluded = [];
      this.$refs.files.getCheckedNodes().forEach( checkedFile => {
        let node = this.$refs.files.getNode(checkedFile);
        if (node && node.data && node.data.children){
          node.data.children.forEach( child => {
            keysExcluded.push(child.treeId);
          })
        }
      })
      this.checkedFiles = this.$refs.files.getCheckedNodes().map( node => {
        if (keysExcluded.some( keyExcluded => {
            return keyExcluded === node.treeId;
          })){
          node.ignore = true;
        }else{
          node.ignore = false;
        }
        return node;
      })
      function recursChild(currnode, keys){
        keys.push(currnode.treeId);
        if (currnode.children){
          for (let i = 0; i < currnode.children.length; i += 1) {
            recursChild(currnode.children[i], keys);
          }
        }
      }
    },
    filterNode(value, data) {
      if (!value) {
        this.totalFounded++;
        this.filterFoundFile = true;
        return true;
      }
      if (!data.size) {
        return false;
      }
      if (data.label.toLowerCase().indexOf(value.toLowerCase()) >= 0) {
        this.totalFounded++;
        this.filterFoundFile = true;
        return true;
      }

      return false;
    },
    getFiltered(val) {}
  },
  computed: {
    ...mapGetters(["me", "files", "selectedFile", "selectedDirectory", "uploadList"]),
    rootSelected(){
      return this.checkedFiles.some( checkedFile => {
        return checkedFile.path.split('/').filter( val => { return val }).length == 1;
      });
    },
    checkedIds(){
      return this.checkedFiles.map( checkedFile => {
        return checkedFile.treeId;
      })
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.handleLoadFiles();
      document.addEventListener("dragover", event => event.preventDefault());
      document.addEventListener(
        "dragenter",
        event => {
          // Met en surbrillance la cible de drop potentielle lorsque l'élément glissable y entre
          let element = event.target.closest(".el-tree-node__body");
          if (element) {
            element.className += " dropping";
          }
        },
        false
      );
      document.addEventListener(
        "drop",
        event => {
          event.preventDefault();
          let element = event.target.closest(".el-tree-node__body");
          let content = event.target.closest(".dropping-zone");
          let total_space = 0;
          for (let i = 0; i < event.dataTransfer.files.length; i++) {
            total_space += event.dataTransfer.files[i].size;
          }
          if (
            parseInt(this.me.size) + parseInt(total_space) <
            this.me.offer.capacity
          ) {
            if (element) {
              let node = this.$refs.files.getNode(element.id);
              let path = Helpers.$utils.getRealPath(node.data.path) || "/";
              let msg =
                event.dataTransfer.files.length === 1
                  ? "File is now uploading, check your dashboard."
                  : "Files are now uploading, check your dashboard.";
              this.$notify.info({
                title: "Info",
                message: msg
              });
              let real_path = path.includes('.') ? Helpers.$utils.dirname('/' + path) : path;
              for (let i = 0; i < event.dataTransfer.files.length; i++) {  
                this.handleUploadFile(event.dataTransfer.files[i], real_path);
              }

              element.className = "el-tree-node__body";
            } else if (content) {
              for (let i = 0; i < event.dataTransfer.files.length; i++) {
                this.handleUploadFile(event.dataTransfer.files[i], "/");
              }
            }
          } else {
            this.$notify.error({
              title: "Error",
              message: "Not enough space!"
            });
          }
        },
        false
      );

      document.addEventListener(
        "dragleave",
        event => {
          // réinitialisation de l'arrière-plan des potentielles cible du drop lorsque les éléments glissables les quittent
          let element = event.target.closest(".el-tree-node__body");
          if (element) {
            element.className = "el-tree-node__body";
          }
        },
        false
      );

      this.$EventBus.$on("set-current-key", key => {
        if (this.$refs.files){
          this.$refs.files.setCurrentKey(key);
        }
      });
      this.$EventBus.$on("load-files", $event => {
        this.handleLoadFiles();
      });
      this.$EventBus.$on("search-files", val => {
        if (val == "") {
          this.totalFounded = 1;
          this.filterFoundFile = true;
        }
        this.totalFounded = 0;
        if (this.$refs.files) {
          this.$refs.files.filter(val);
        }
        if (this.totalFounded === 0) {
          this.filterFoundFile = false;
        }
      });
    });
  }
};
</script>
