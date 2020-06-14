<template>
    <div class="dashboard theme-darkgrey">
        <div class="dashboard-item dashboard-user">
            <img class="io-avatar" src="~/assets/images/avatar.png" width="32" height="32">
            <div :class="{'link-selected' : currentRoute === 'profile'}">
                <router-link :to="{ name : 'profile' }" tag="span">
                    Hi, {{ me.name }}
                </router-link>
                <el-dropdown>
                    <div class="el-dropdown-link">
                        <i class="el-icon-arrow-down el-icon--right"></i>
                    </div>
                    <el-dropdown-menu slot="dropdown">
                        <router-link :to="{ name : 'profile' }">
                            <el-dropdown-item>Profile</el-dropdown-item>
                        </router-link>
                        <router-link :to="{ name : 'logout' }">
                            <el-dropdown-item>Logout</el-dropdown-item>
                        </router-link>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
        </div>
        <router-link class="dashboard-item" :to="{ name : 'app' }" tag="div">
            <span :class="{'link-selected' : currentRoute === 'app'}">My files</span>
        </router-link>
        <div class="dashboard-uploads nopadding">
            <div class="dashboard-uploads__title">Last uploaded files</div>

            <div class="dashboard-uploads__files">
                <div v-for="(file, index) in reverseUploadList" @click="handleOpenFile(file)" :key="index" class="dashboard-file" :class="{'cursor-pointer' : file.hash}">
                    <div class="dashboard-file-name">
                        <el-tooltip class="item" effect="dark" :content="file.name" placement="bottom-start">
                            <div class="text-regular text-ellipses">{{ file.name }}</div>
                        </el-tooltip>
                    </div>
                    <div class="dashboard-file-size text-smaller">
                        {{ getFormatSize(file.size) }}
                    </div>
                    <div class="dashboard-file-status">
                        <i v-if="file.status === 'fail'" class="el-icon-error"></i>
                        <i v-else-if="file.status === 'success'" class="el-icon-success"></i>
                        <span v-else-if="file.done > 0" class="text-smaller">
                            {{ file.done + '%' }}
                        </span>
                        <i v-else class="el-icon-loading"></i>
                    </div>
                    <div v-if="file.status === 'uploading'" class="dashboard-file-slider">
                        <div class="dashboard-file-slider-bar"
                                :style="{ width: file.done + '%' }"></div>
                    </div>
                </div>
                 <div v-if="uploadList.length == 0" class="dashboard-uploads__nodata text-smaller">
                    You have not uploading files yet
                </div>
            </div>
           
        </div>
        <div class="dashboard-item">
            <span>Total storage</span>
            <div class="dashboard-storage">
                <el-slider class="size-slider"
                            :value="sizePercent" :format-tooltip="getFormatTooltip" disabled></el-slider>
                <span class="dashboard-storage-capacity text-smaller">{{ capacityFormat}}</span>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  data() {
    return {};
  },
  methods: {
    ...mapActions(["detailFile"]),
    getFormatTooltip(val) {
      return Helpers.$utils.formatBytes(val * this.me.offer.capacity / 100);
    },
    getFormatSize(size) {
      return Helpers.$utils.formatBytes(size);
    },
    getFormatIcon(mime) {
      return Helpers.$utils.mimeToIcon(mime);
    },
    handleOpenFile(file) {
        let node = Helpers.$utils.findNodeWithHash(JSON.parse(JSON.stringify(this.files[0])), file.hash);
        this.$EventBus.$emit('load-file', node);
    }
  },
  computed: {
    ...mapGetters(["me", "files", "uploadList"]),
    capacityFormat() {
      return Helpers.$utils.formatBytes(this.me.offer.capacity);
    },
    sizePercent() {
      return this.me.size * 100 / this.me.offer.capacity;
    },
    currentRoute() {
      return this.$route.name;
    },
    reverseUploadList() {
      return this.uploadList.slice().reverse();
    }
  }
};
</script>