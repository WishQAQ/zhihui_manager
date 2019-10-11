<template>
  <div class="Header">
    <div class="logo">智慧销售系统</div>
    <div class="user_info">
      <div class="user_name">{{userInfo.userName || '暂无数据'}}</div>
      <el-dropdown trigger="click" @command="handleCommand">
        <div class="el-dropdown-link">
          <div class="login_out"><i class="el-icon-more-outline"></i></div>
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="loginOut">退出登录</el-dropdown-item>
          <el-dropdown-item command="userInfo">个人信息</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>

    <el-dialog
        title="个人信息"
        append-to-body
        custom-class="dialog_box"
        :visible.sync="userInfoDialog">
      <div class="dialog_main">
        <el-form ref="form"  label-width="100px">
          <el-form-item label="用户名称">
            {{userInfo.userName}}
          </el-form-item>
          <el-form-item label="手机号">
            {{userInfo.mobilePhone}}
          </el-form-item>
          <el-form-item label="用户邮箱">
            {{userInfo.email}}
          </el-form-item>
          <el-form-item label="证件号码">
            {{userInfo.counterNumber}}
          </el-form-item>
          <el-form-item label="用户类型">
            {{userInfo.type}}
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  export default {
    name: "Header",
    data(){
      return {
        userInfo: JSON.parse(localStorage.getItem('userInfo')) || {},
        userInfoDialog: false,  // 用户信息弹窗
      }
    },
    mounted(){
      /**
       * @Description: 用户类型修改
       * 1普通用户2客户经理3包片领导4管理员
       * @author Wish
       * @date 2019/10/9
      */
      this.userInfo.type = this.userInfo.type === 1 ? '普通用户':
          this.userInfo.type === 2 ? '客户经理':
              this.userInfo.type === 3 ? '包片领导':
                  this.userInfo.type === 4 ? '管理员': '暂无类型'
    },
    methods:{
      /**
       * @Description: 下拉菜单 退出or个人信息按钮
       * @author Wish
       * @date 2019/10/9
      */
      handleCommand(command){
        if(command === 'loginOut'){
          let data ={
            token: sessionStorage.token
          }
          this.$axios.post('/manager/manager/user/loginout',data)
              .then(res =>{
                if(res.status === 200){
                  this.$message.success('退出成功')
                  localStorage.clear();
                  this.$router.push('/login')
                }else {
                  this.$message.warning('登出错误，请稍后重试')
                }
              }).catch(() =>{
            this.$message.warning('登出错误，请稍后重试')
          })
        }else if(command === 'userInfo'){
          this.userInfoDialog = true
        }
      },
    }
  }
</script>

<style scoped lang="less">
  .Header{
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 80px;
    padding: 0 40px;
    box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
    .logo{
      font-size: 24px;
      cursor: pointer;
    }
    .user_info{
      display: flex;
      align-items: center;
      .user_name{
        margin-right: 30px;
      }
      .login_out{
        cursor: pointer;
        font-size: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 50px;
        height: 50px;
      }
    }
  }
  /deep/.dialog_box{
    width: 500px;
  }
</style>