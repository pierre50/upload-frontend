<template>
    <el-container style="height:100%">
        <list @clicked="open"></list>
        <el-aside v-loading="isLoading" width="350px">
            <detail-file v-if="selectedFile" ></detail-file>
            <detail-directory v-else-if="selectedDirectory"></detail-directory>
            <detail-info v-else></detail-info>
        </el-aside>
    </el-container>
</template>

<script>
    import {mapGetters, mapActions} from 'vuex';
    import DetailFile from './detail/File.vue';
    import DetailDirectory from './detail/Directory.vue';
    import DetailInfo from './detail/Info.vue';
    import List from './list/List.vue';
    export default {
        components : { DetailFile, DetailDirectory, DetailInfo, List },
        data() {
            return {
                isLoading : false,
            };
        },
        computed: {
            ...mapGetters(['selectedFile', 'selectedDirectory']),
        },
        methods:{
            ...mapActions([
                "loadFiles",
                "detailFile",
                "removeSelectedFile",
                "createDirectory",
                "showDirectory"
            ]),
            open(node){
                this.removeSelectedFile();
                this.isLoading = true;
                if (node.hash) {
                    this.detailFile({ 
                        hash: node.hash, 
                        treeId: node.treeId 
                    })
                    .then( _ => { 
                        this.isLoading = false; 
                        this.$EventBus.$emit('set-current-key', node.treeId);
                    })
                    .catch( error => {
                        this.$notify.error({
                            title: "Error",
                            message: error ? error : "Cannot open file."
                        });       
                        this.isLoading = false;  
                    });
                } else {
                    this.showDirectory({
                        path: node.path,
                        treeId: node.treeId
                    })
                    .then( _ => { 
                        this.isLoading = false; 
                        this.$EventBus.$emit('set-current-key', node.treeId);
                    })
                    .catch( error => {
                        this.$notify.error({
                            title: "Error",
                            message: error ? error : "Cannot open directory."
                        });       
                        this.isLoading = false;  
                    });         
                }
            }
        },
        created(){
            if (this.selectedFile){
                this.$EventBus.$emit('set-current-key', this.selectedFile.treeId);
            }
            this.$EventBus.$on("load-file", node => {
                this.open(node);
            });
        },
    

    }
</script>
