<template>
  <div class="uploadData">
    <el-card class="uploadData_card" v-loading="uploadLoading" element-loading-text="文件上传中，请勿退出此页面">
      <div slot="header" class="clearfix">
        <span>上传省联社数据</span>
        <el-button style="float: right; padding: 3px 0" type="text" @click="submitUpload" :disabled="submitBtnLoading">开始上传</el-button>
      </div>
      <el-upload
          class="upload_main"
          ref="upload"
          :drag="showUploadBox"
          :multiple="false"
          action="/"
          :before-upload="beforeUpload"
          :on-progress="uploadFileProcess"
          :on-change="handleFile"
          :on-remove="handleRemove"
          :on-success="fileUploadSuccess"
          :on-error="fileUploadError"
          :file-list="fileList"
          :headers="myHeaders"
          :auto-upload="false">
        <div v-if="showUploadBox">
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        </div>
      </el-upload>
    </el-card>
  </div>
</template>

<script>
  export default {
    name: "uploadData",
    data(){
      return {
        uploadLoading: false,
        fileList: [],  // 上传文件列表
        showUploadBox: true, // 是否显示上传框

        percentage: 0, // 上传进度条

        uploadUrl: '/manager/manager/polldate/upload/polldate',  // 上传地址
        myHeaders: {Authorization: sessionStorage.token},

        submitBtnLoading: true, // 上传按钮
      }
    },
    methods:{
      /**
       * @Description: 点击上传按钮
       * @author Wish
       * @date 2019/10/10
      */
      submitUpload() {
        this.$refs.upload.submit();
        this.submitBtnLoading = true
        this.uploadLoading = true
        this.showUploadBox = this.fileList.length <= 0

      },
      /**
       * @Description: 上传文件
       * @author Wish
       * @date 2019/10/10
      */
      handleFile(file, fileList){
        this.showUploadBox = fileList.length <= 0;
        this.submitBtnLoading = fileList.length <= 0;
      },

      /**
       * @Description: 开始上传
       * @author Wish
       * @date 2019/10/10
      */
      beforeUpload (file) {
        this.fileList.push(file)
        let data = new FormData()
        data.append('file', file)


        this.$axios({url:'/manager/manager/polldate/upload/polldate',
          method: 'post',
          data: data,
          headers:{'Content-Type': "multipart/form-data"}}
        ).then(res =>{
          if(res.status === 200){
            this.$message.success('上传成功')
            this.showUploadBox = true
            this.submitBtnLoading = true
            this.uploadLoading = false
            this.fileList = []
          }
        })

        return false // 返回false不会自动上传
      },

      /**
       * @Description: 上传进度
       * @author Wish
       * @date 2019/10/10
      */
      uploadFileProcess(event, file, fileList){
        console.log(event, file, fileList);
      },

      /**
       * @Description: 删除文件
       * @author Wish
       * @date 2019/10/10
      */
      handleRemove(file, fileList) {
        if(fileList.length <= 1){
          this.showUploadBox = true
          this.submitBtnLoading = false
        }
      },
      /**
       * @Description: 上传成功回调
       * @author Wish
       * @date 2019/10/10
      */
      fileUploadSuccess(response, file, fileList){
        this.submitBtnLoading = true
      },
      /**
       * @Description: 上传失败回调
       * @author Wish
       * @date 2019/10/10
      */
      fileUploadError(err, file, fileList){
        console.log(JSON.parse(JSON.stringify(err)));
        this.$message.warning('上传失败，请稍后重试')
        this.submitBtnLoading = false
        this.showUploadBox = true
        this.uploadLoading = false
      },
    },
    created() {
      this.$store.state.showHeader = true
    }
  }
</script>

<style scoped lang="less">
  .uploadData{
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    .uploadData_card{
      width: 400px;
      height: 300px;
    }
  }
</style>