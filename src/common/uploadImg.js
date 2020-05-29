import {getToken} from "@/utils/auth";

const UploadImg = {
  data() {
    return {
      headers: {Authorization: "Bearer " + getToken()},
      url: process.env.VUE_APP_BASE_API + "admin/user/import",
      avatarUrl: process.env.VUE_APP_BASE_API + "admin/file/upload/avatar",
      imageUrl: ''
    }
  },
  methods: {
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
      this.temp.avatar = res.data;
      this.temp.logo = res.data;
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/gif';
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG/GIF 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
    },
    handleFileError(err, file, fileList) {
      var errStr = err.toString();
      var msgIndex = errStr.indexOf("{");
      var msgLastIndex = errStr.indexOf("}");
      const errObj = JSON.parse(errStr.substr(msgIndex, msgLastIndex))
      const errMsgStrObj = errObj.msg
      this.dialogUploadVisible = false;
      this.isUploading = false;
      this.$refs.upload.clearFiles();
      this.$alert(errMsgStrObj, "导入结果", {dangerouslyUseHTMLString: true});
      this.getList();
    }
  }
}

export default UploadImg
