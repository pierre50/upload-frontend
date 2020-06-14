<template>
    <el-container class="detail-content">
        <el-header class="detail-header">
          <i class="el-icon-info"/>  Need some help ?
        </el-header>
        <el-main class="detail-main">
          <div class="detail-main__info">
            <el-collapse accordion>
              <el-collapse-item v-for="(helper, index) in helpers" :key="helper.title" :title="helper.title" :name="index">
                {{ helper.content }}
              </el-collapse-item>
            </el-collapse>
          </div>
        </el-main>
    </el-container>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  data() {
    return {
      helpers:[
        { title : "Upload a file",content : "To upload a file click on the button above or drag and drop a file in the zone beside."},
        { title : "Create a directory",content : "Click on the create a directory button above."},
        { title : "Display file or directory detail",content : "Open a uploaded file or directory by clicking on the name."},
        { title : "Edit your profile",content : "In the left side menu, click on your name or the arrow icon beside to access your profile."},
        { title : "Change your password",content : "Go to your profile, then the change password section."},
        { title : "Download a directory as a zip file",content : "You will find the download zip button in the detail of the directory, be sure nothing block the pop-up."},
        { title : "Share a file",content : "In the details of a file, there is a switch, when it's 'ON' you can manually copy the share link or use the copy clipboard button then share this link else your file is not public."},
        { title : "Move, delete, rename file or directory",content : "In the detail section of your file/directory, click on the burger menu button beside the name, to display actions."},
      ]
    };
  },
  methods: {
  },
  computed: {
    ...mapGetters(["me", "files"]),
  },
};
</script>
