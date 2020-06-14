<template>
    <el-dialog v-if="directories"
               :title="title"
               :visible.sync="isVisible"
               :before-close="cancel"
               width="30%">
        <div>
            <slot></slot>
            Choose a directory
            <el-tree :data="directories"
                     @node-click="handleNodeClick"
                     :render-content="renderContent"
                     ref="directories"
                     default-expand-all
                     class="small"
                     :expand-on-click-node="false"
                     highlight-current>
            </el-tree>
        </div>
        <div slot="footer" class="dialog-footer">
            <el-button size="small" @click="cancel">Cancel</el-button>
            <el-button size="small" :loading="btnLoading" :type="btnType" @click="confirm">{{ btnText }}</el-button>
        </div>
    </el-dialog>
</template>

<script>
    import {mapGetters, mapActions} from 'vuex'
    export default {
        props : {
            title : String,
            isVisible: Boolean,
            btnLoading: {
                type: Boolean,
                default: false
            },
            btnType: {
                type: String,
                default: 'primary'
            },
            btnText: {
                type: String,
                default: 'Confirm'
            },
            ids: Array,
        },
        data() {
            return {
                path:'/',
            };
        },
        computed:{
            ...mapGetters(['files']),
            directories(){
                return Helpers.$utils.keepDirectoriesOnly(JSON.parse(JSON.stringify(this.files)), this.ids || []);
            }
        },
        methods: {
            renderContent(h, { node, data, store }) {
                return h('div', {attrs: {'class': 'el-tree-node__body', 'id' : data.treeId}}, [
                    h('i', {attrs: {'class': node.expanded ? 'fa fa-folder-open-o' : 'fa fa-folder-o' }}),
                    h('span', {attrs: {'class': 'el-tree-node__name'}}, data.label)
                ])
            },
            handleNodeClick(prop, node){
                this.path = Helpers.$utils.findPath(node);
            },
            confirm(){
                this.$emit('confirm', this.path)
            },
            cancel(){
                this.$emit('cancel')
            }
        },
    }
</script>
