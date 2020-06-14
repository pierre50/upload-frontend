<template>
    <el-container class="detail-content">
        <el-header class="detail-header">
            <div class="detail-header__directory">
                <el-tooltip class="item" effect="dark" :content="selectedDirectory.name" placement="bottom-start">
                    <div class="text-regular text-ellipses">
                        <i v-if="selectedDirectory.isRoot" class="fa fa-star fa-1x" aria-hidden="true"></i>
                        {{ selectedDirectory.name }}
                    </div>
                </el-tooltip>
                <el-dropdown>
                    <span class="el-dropdown-link cursor-pointer">
                        <i class="fa fa-bars"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <div v-if="!selectedDirectory.isRoot" @click="dialogRenameDirectoryVisible = true"><el-dropdown-item>
                            Rename
                        </el-dropdown-item></div>
                        <div v-if="!selectedDirectory.isRoot" @click="dialogSelectPathVisible = true"><el-dropdown-item >
                            Move
                        </el-dropdown-item></div>
                        <div @click="handleDeleteDirectory(selectedDirectory.path)"><el-dropdown-item>Delete</el-dropdown-item></div>
                        <div @click="removeSelectedDirectory"><el-dropdown-item divided>Close</el-dropdown-item></div>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
        </el-header>
        <el-main class="detail-main">
            <div class="detail-main__directory">
                <div class="detail-main__preview">
                    <div class="detail-icon">
                        <div class="detail-icon__main">
                            <i class="fa fa-folder-open-o fa-5x"></i>
                        </div>
                    </div>
                </div>
                <div class="detail-main__detail">
                    <div class="text-smaller">Size : {{ selectedDirectory.size_format }}</div>
                    <div class="text-smaller">Count directories : {{ selectedDirectory.count_directories }}</div>
                    <div class="text-smaller">Count files : {{ selectedDirectory.count_files}}</div>

                    <div class="dashboard-storage">
                        <el-slider class="size-slider"
                                :value="sizePercent" :format-tooltip="formatTooltip" disabled></el-slider>
                        <span class="dashboard-storage-capacity text-smaller">{{ capacityFormat}}</span>
                    </div>

                    <el-tooltip class="item" effect="dark"
                                content="Generate a Zip file of all the files inside the directory"
                                placement="bottom-start">
                        <el-button size="small" @click="handleDownloadDirectory(selectedDirectory.path)"
                                :loading="isDownloadingDirBtnLoading"
                                :disabled="selectedDirectory.count_files === 0"
                                type="primary">
                            Download as Zip ({{ selectedDirectory.size_format }})
                        </el-button>
                    </el-tooltip>
                </div>
            </div>
        </el-main>

        <dialog-rename :is-visible="dialogRenameDirectoryVisible"
                       :old-name="selectedDirectory.name"
                       :btn-loading="isRenameDirBtnLoading"
                       title="Rename your directory"
                       :validator="validator"
                       @confirm="handleRenameDirectory"
                       @cancel="dialogRenameDirectoryVisible=false">
        </dialog-rename>
        <dialog-select-path :is-visible="dialogSelectPathVisible"
                            :btn-loading="isMoveDirBtnLoading"
                            :ids="[ selectedDirectory.treeId ]"
                            title="Move your directory"
                            @cancel="dialogSelectPathVisible = false"
                            @confirm="handleMoveDirectory">
        </dialog-select-path>
    </el-container>
</template>

<script>
    import {mapGetters, mapActions} from 'vuex'
    import DialogSelectPath from '../../../../layouts/DialogSelectPath'
    import DialogRename from '../../../../layouts/DialogRename'

    export default {
        components : {DialogSelectPath, DialogRename},
        data() {
            return {
                url : window.location.protocol + '//' + window.location.host + '/',
                dialogRenameDirectoryVisible : false,
                dialogSelectPathVisible : false,
                validator : Helpers.$validator.validateDirname,
                isRenameDirBtnLoading: false,
                isMoveDirBtnLoading: false,
                isDownloadingDirBtnLoading: false,
            };
        },
        methods: {
            ...mapActions(['removeSelectedDirectory', 'deleteDirectory', 'renameDirectory', 'moveDirectory', 'downloadDirectory']),
            handleDeleteDirectory(path){
                this.$confirm('This will permanently delete the directory and all the files inside. Continue?', 'Warning', {
                    confirmButtonText: 'OK',
                    cancelButtonText: 'Cancel',
                    type: 'warning'
                }).then(() => {
                    this.deleteDirectory(path)
                        .then(() => {
                            this.$notify.success({
                                title: 'Success',
                                message: 'Directory deleted.'
                            });
                            this.$EventBus.$emit('load-files')
                        })
                        .catch(() => {
                            this.$notify.error({
                                title: 'Error',
                                message: 'Cannot delete directory'
                            });
                        })
                }).catch(() => {
                });
            },
            handleDownloadDirectory(path){
                this.isDownloadingDirBtnLoading = true;
                this.downloadDirectory(path)
                    .then(() => {
                        this.$notify.success({
                            title: 'Success',
                            message: 'Zip file generated now downloading.'
                        });
                        this.isDownloadingDirBtnLoading = false;
                        this.$EventBus.$emit('load-files');
                        this.dialogRenameDirectoryVisible = false;
                    })
                    .catch(() => {
                        this.$notify.error({
                            title: 'Error',
                            message: 'Cannot generate Zip file.'
                        });
                        this.isDownloadingDirBtnLoading = false;
                    })
            },
            handleRenameDirectory(name){
                this.isRenameDirBtnLoading = true;
                this.renameDirectory({ path : this.selectedDirectory.path, name : name})
                    .then(() => {
                        this.$notify.success({
                            title: 'Success',
                            message: 'Directory renamed.'
                        });
                        this.isRenameDirBtnLoading = false;
                        this.$EventBus.$emit('load-files');
                        this.dialogRenameDirectoryVisible = false;
                    })
                    .catch((error) => {
                        this.$notify.error({
                            title: 'Error',
                            message: error ? error : 'Cannot rename directory.'
                        });
                        this.isRenameDirBtnLoading = false;
                    })
            },
            handleMoveDirectory(newPath){
                this.isMoveFileBtnLoading = true;
                this.moveDirectory({ oldPath : this.selectedDirectory.path, newPath : newPath})
                    .then(() => {
                        this.$notify.success({
                            title: 'Success',
                            message: 'Directory moved.'
                        });
                        this.isMoveFileBtnLoading = false;
                        this.$EventBus.$emit('load-files');
                        this.dialogSelectPathVisible = false;
                    })
                    .catch((error) => {
                        this.$notify.error({
                            title: 'Error',
                            message: error ? error : 'Cannot move directory.'
                        });
                        this.isMoveFileBtnLoading = false;
                    })
            },
            formatTooltip(val) {
                return Helpers.$utils.formatBytes(val * this.me.offer.capacity / 100);
            }
        },
        computed: {
            ...mapGetters(['me','selectedDirectory', 'files']),
            capacityFormat(){
                return Helpers.$utils.formatBytes(this.me.offer.capacity);
            },
            sizePercent(){
                return this.selectedDirectory.size *100 / this.me.offer.capacity;
            }
        },

    }
</script>
