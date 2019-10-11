<template>
  <div class="home" v-loading="loading">
    <table-header :title="'用户列表'" :btnName="'新增用户'" v-on:headerBtn="addUserBtn"></table-header>
    <el-table
        :row-class-name="tableRowClassName"
        :data="userInfoList"
        calss="user_info_table"
        border>
      <el-table-column
          label="序号"
          type="index"
          width="50"
          align="center"
          :index="indexMethod">
      </el-table-column>
      <el-table-column
          prop="counterNumber"
          label="账号">
      </el-table-column>
      <el-table-column
          prop="userName"
          label="用户名">
      </el-table-column>
      <el-table-column
          prop="createDate"
          sortable
          label="创建时间">
      </el-table-column>
      <el-table-column
          prop="documentNumber"
          label="证件号码">
      </el-table-column>
      <el-table-column
          prop="email"
          label="邮箱">
      </el-table-column>
      <el-table-column
          prop="mobilePhone"
          label="手机">
      </el-table-column>
      <el-table-column
          label="账号类型">
        <template slot-scope="scope">
          {{scope.row.userType}}
        </template>
      </el-table-column>
      <el-table-column
          width="80"
          label="操作">
        <template slot-scope="scope">
          <el-dropdown trigger="click">
            <div class="el-dropdown-link">
              <el-button size="mini">操作</el-button>
            </div>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item><div @click="infoBtn(scope.row)">详细信息</div></el-dropdown-item>
              <el-dropdown-item><div @click="editBtn(scope.row)">编辑</div></el-dropdown-item>
              <el-dropdown-item><div @click="deleteBtn(scope.row)">删除</div></el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
        class="table_pagination"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[10, 15, 20, 25]"
        :current-page.sync="paginationList.pageNum"
        layout="sizes, prev, pager, next"
        :total="paginationList.total">
    </el-pagination>

    <el-dialog
        :title="addDialogType?'新增用户信息':'编辑用户信息'"
        append-to-body
        :close-on-click-modal="false"
        custom-class="dialog_box"
        :visible.sync="addUserInfo">
      <div class="dialog_main">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="柜员号" prop="counterNumber">
            <el-input v-model="ruleForm.counterNumber" placeholder="请输入柜员号"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="ruleForm.password" show-password placeholder="请输入密码"></el-input>
          </el-form-item>
          <el-form-item label="用户名" prop="userName">
            <el-input v-model="ruleForm.userName" placeholder="请输入用户名"></el-input>
          </el-form-item>
          <el-form-item label="证件号码" prop="documentNumber">
            <el-input v-model="ruleForm.documentNumber" placeholder="请输入证件号码"></el-input>
          </el-form-item>
          <el-form-item label="邮箱">
            <el-input v-model="ruleForm.email" placeholder="请输入邮箱"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="mobilePhone">
            <el-input v-model="ruleForm.mobilePhone" placeholder="请输入手机号" maxlength="11" show-word-limit></el-input>
          </el-form-item>

          <el-form-item label="用户类型" prop="type">
            <el-select v-model="ruleForm.type" placeholder="请选择用户类型">
              <el-option label="普通用户" value="1"></el-option>
              <el-option label="客户经理" value="2"></el-option>
              <el-option label="包片领导" value="3"></el-option>
              <el-option label="管理员" value="4"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')" v-loading="submitLoading">保存</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>

  </div>
</template>

<script>

export default {
  name: 'home',
  components: {
    'TableHeader': () => import('@/components/TableHeader')
  },
  data(){
    let telPhone = (rule, value, callback) => {
      if (value === '' || value === undefined || !this.$telPhone(this.ruleForm.mobilePhone)) {
        callback(new Error('请输入手机号'));
      }else {
        callback()
      }
    };

    let counterNumber = (rule, value, callback) => {
      if (value === '' || value === undefined || !this.$checkAccount(this.ruleForm.counterNumber)) {
        callback(new Error('请输入柜员号'));
      }else {
        callback()
      }
    };

    return {
      loading: true,
      userInfoList: [],  // 用户列表数据
      paginationList: {},  // 分页数据
      pageCurrent: '',
      pageSize: '',

      addDialogType: true, // 添加状态
      addUserInfo: false, // 添加弹窗

      ruleForm: {}, // 用户信息

      submitLoading: false,  //提交按钮加载

      rules: {  // 验证信息
        counterNumber: [
          { required: true, validator: counterNumber, trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ],
        userName: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        documentNumber: [
          { required: true, message: '请输入证件号码', trigger: 'blur' }
        ],
        mobilePhone: [
          { required: true, validator: telPhone, trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请输入选择用户类型', trigger: 'change' }
        ],
      }
    }
  },
  methods:{
    getDataList(){
      this.loading = true
      let data = {
        pageNum: this.pageCurrent || null,
        pageSize: this.pageSize || null,
      }
      this.$axios.get('/manager/manager/user/list',{params:data})
          .then(res =>{
            if(res.status === 200){
              this.userInfoList = res.data.date.list
              this.paginationList = res.data.date.page
              this.loading = false

              /**
               * @Description: 处理用户类型
               * @author Wish
               * @date 2019/10/9
              */
              this.userInfoList.forEach(res =>{
                res['userType'] = res.type === 1 ? '普通用户':
                    res.type === 2 ? '客户经理':
                        res.type === 3 ? '包片领导':
                            res.type === 4 ? '管理员': '暂无类型'
              })
            }
          })
    },

    /**
     * @Description: 表格序号
     * @author Wish
     * @date 2019/10/9
    */
    indexMethod(index) {
      return index + 1;
    },

    /**
     * @Description: 列表中显示个人，判断userId 以添加一个active的类名
     * @author Wish
     * @date 2019/10/9
    */
    tableRowClassName({row, rowIndex}) {
      if(row.userId === JSON.parse(localStorage.getItem('userInfo')).userId){
        return 'active';
      }
      return '';
    },

    /**
     * @Description: 分页器
     * @author Wish
     * @date 2019/10/10
    */
    // 每页条数
    handleSizeChange(size) {
      this.pageSize = size
      this.getDataList()
    },
    // 跳转页面
    handleCurrentChange(current) {
      this.pageCurrent = current
      this.getDataList()
    },

    /**
     * @Description: 添加用户按钮 打开弹窗
     * @author Wish
     * @date 2019/10/9
    */
    addUserBtn(val){
      this.addDialogType = true
      this.addUserInfo = val
      this.closeFormData()
    },

    /**
     * @Description: 清空form表单
     * @author Wish
     * @date 2019/10/10
    */
    closeFormData(){
      this.ruleForm = {}
    },

    /**
     * @Description: 表单提交按钮
     * @author Wish
     * @date 2019/10/9
    */
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if(this.addDialogType){
            this.submitLoading = true
            this.$axios({url:'/manager/manager/user/save',
              method: 'post',
              data: this.ruleForm,
              headers:{'Content-Type': "application/json;charset=utf-8"}}
            ).then(res =>{
              if(res.status === 200){
                this.submitLoading = false
                this.$message.success('保存成功')
                this.getDataList()
                this.addUserInfo = false
              }
            }).catch(() =>{
              this.$message.warning('保存失败')
              setTimeout(() =>{
                this.submitLoading = false
              },1500)
            })
          }else {
            this.submitLoading = true
            delete this.ruleForm['createBy']
            delete this.ruleForm['createDate']
            delete this.ruleForm['updateBy']
            delete this.ruleForm['updateDate']
            delete this.ruleForm['userType']
            this.$axios({url:'/manager/manager/user/update',
              method: 'post',
              data: this.ruleForm,
              headers:{'Content-Type': "application/json;charset=utf-8"}}
            ).then(res =>{
              if(res.status === 200){
                this.submitLoading = false
                this.$message.success('保存成功')
                this.getDataList()
                this.addUserInfo = false
              }
            }).catch(() =>{
              this.$message.warning('保存失败')
              setTimeout(() =>{
                this.submitLoading = false
              },1500)
            })
          }

        } else {
          return false;
        }
      });
    },

    /**
     * @Description: 详细信息
     * @author Wish
     * @date 2019/10/9
    */
    infoBtn(val){
      console.log(val);
    },

    /**
     * @Description: 编辑用户信息
     * @author Wish
     * @date 2019/10/9
    */
    editBtn(val){
      console.log(val);
      val.type = val.userType
      this.ruleForm = JSON.parse(JSON.stringify(val))
      this.addUserInfo = true
      this.addDialogType = false
    },

    /**
     * @Description: 删除用户
     * @author Wish
     * @date 2019/10/9
    */
    deleteBtn(val){
      console.log(val);
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$axios.delete('/manager/manager/user/delete/'+ val.userId)
            .then(res =>{
              if(res.status === 200){
                this.$message.success('删除成功');
                this.getDataList()
              }
            })
      }).catch(() => {});
    }
  },
  created() {
    this.getDataList()
    this.$store.state.showHeader = true
  }
}
</script>

<style scoped lang="less">
  .home{
    .user_info_table{
      /deep/.active{
        background: #f0f9eb;
      }
    }
  }
  /deep/.el-table .active {
    background: #f0f9eb;
  }
</style>