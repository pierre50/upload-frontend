<template>
    <div>
        <nav-bar :side-menu-open="false">
            <el-menu-item index="1" :route="{ name: 'main'}">
                <img src="~/assets/images/logotext.png" height="24">
            </el-menu-item>
        </nav-bar>

        <div class="file-main" v-if="file" v-loading="isLoading">
            <div class="file-main__preview">
                <div v-if="allowPreview" class="file-preview" :class="{'transparency' : fileType == 'image'}">
                    <div v-if="fileType == 'image'" class="file-preview__image">
                        <img :src="previewLink">
                    </div>
                    <plyr v-else-if="fileType == 'audio'" class="file-preview__audio">
                        <audio :src="previewLink" controls></audio>
                    </plyr>
                    <plyr v-else-if="fileType =='video'" class="file-preview__video" >
                      <video :src="previewLink" controls></video>  
                    </plyr>
                    <iframe v-else-if="fileType === 'pdf'" :src="previewLink"  class="file-preview__doc" frameborder="0"></iframe>
                </div>
                <div v-else class="file-icon">
                    <div class="file-icon__main">
                        <i :class="file.icon + ' fa-5x'"></i>
                        <div>No preview for this file</div>
                    </div>
                </div>
            </div>
            <div class="file-main__info">
              <div class="file-info__header">
                <el-tooltip class="item" effect="dark" :content="file.filename" placement="bottom-start">
                  <div class="text-ellipses">{{ file.filename }}</div>
                </el-tooltip>
              </div>
              <div class="file-info__body">
                <div class="text-smaller">Uploaded : {{ file.uploaded_date }}</div>
                <div class="text-smaller">Author : {{ file.creator.name }}</div>
                <div class="text-smaller">Size : {{ file.size_format }}</div>
                <div class="text-smaller">Downloads : {{ file.downloads }}</div>
                <el-button size="small" type="primary" @click="downloadFile(file.hash)">Download ({{ file.size_format }})</el-button>
              </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import NavBar from "../../layouts/NavBar.vue";
export default {
  components: { NavBar },
  data() {
    return {
      hash: this.$route.params.hash,
      file: null,
      isLoading: false
    };
  },
  methods: {
    ...mapActions(["showFile", "downloadFile"])
  },
  computed: {
    ...mapGetters(["me"]),
    fileType() {
      return this.file.mime.split("/")[0] === "application"
        ? this.file.mime.split("/")[1]
        : this.file.mime.split("/")[0];
    },
    allowPreview() {
      return Helpers.$utils.allowPreview(this.file.mime);
    },
    previewLink() {
      return Helpers.$config.apiPath + "file/get/" + this.file.hash;
    },
    fileLink() {
      return `${this.url}file/${this.file.hash}`;
    }
  },
  created() {
    this.isLoading = true;
    this.showFile(this.hash)
      .then(result => {
        this.file = result;
        this.isLoading = false;
      })
      .catch(() => {
        this.$router.push( { name : 'error' })
        this.isLoading = false;
      });
  }
};
</script>
