<template>
  <div class="login">
    <h1 class="login_title">智慧营销系统</h1>
    <el-card class="login_box">
      <el-form ref="form" label-width="80px">
        <el-form-item label="账号">
          <el-input v-model="counter" placeholder="请输入您的账号"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="password" placeholder="请输入您的密码" show-password></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="submitLogin" v-loading="loading">登录</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
  export default {
    name: "Login",
    data(){
      return {
        loading: false,

        counter: '',
        password: ''
      }
    },
    methods:{
      submitLogin(){
        if(this.counter && this.password){
          this.loading = true
          let data = new FormData()
          data.append('counterNumber',this.counter)
          data.append('password',this.password)
          this.$axios.post('/manager/manager/user/login', data)
              .then(res =>{
                if(res.status === 200){
                  this.$message.success('登录成功')
                  window.localStorage["token"] = res.data.date.token
                  window.localStorage["path"] = '/'
                  localStorage.setItem('userInfo', JSON.stringify(res.data.date.userDto));
                  setTimeout(() =>{
                    this.$router.push('/')
                  },1000)
                }
              })
              .catch(() =>{
                this.$message.warning('登录失败，请稍后重试')
                this.loading = false
              })
        }else {
          this.$message.warning('登录信息请填写完整')
        }
      },
    },
    created() {
      this.$store.state.showHeader = false
    }
  }
</script>

<style scoped lang="less">
  .login{
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    .login_title{
      font-size: 42px;
      margin-bottom: 40px;
    }
    .login_box{
      width: 600px;
      height: 400px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;

    }
  }
</style>