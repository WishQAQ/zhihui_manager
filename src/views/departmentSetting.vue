<template>
  <div class="departmentSetting" v-loading="loading">
    <table-header :title="'挂点部门'" :btnName="'新增部门'" v-on:headerBtn="addDepartmentBtn"></table-header>
    <el-table
        :data="departmentList"
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
          prop="deotName"
          label="部门名称">
      </el-table-column>
      <el-table-column
          prop="createDate"
          sortable
          label="创建时间">
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
        :title="dialogType?'新增部门':'编辑部门'"
        append-to-body
        :close-on-click-modal="false"
        custom-class="dialog_box"
        :visible.sync="departmentDialog">
      <div class="dialog_main">
        <el-form label-width="80px">
          <el-form-item label="部门名称" prop="counterNumber">
            <el-input v-model="departmentName" placeholder="请输入部门名称"></el-input>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="submitForm" v-loading="submitLoading">保存</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  export default {
    name: "departmentSetting",
    components:{
      'TableHeader': () => import('@/components/TableHeader')
    },
    data(){
      return {
        loading: true,
        departmentList: [], // 部门列表

        departmentDialog: false, // 部门弹窗
        dialogType: true, // 弹窗状态
        submitLoading: false, // 提交按钮加载

        departmentMessage: {}, // 部门信息
        departmentId: '', // 部门Id
        departmentName: '', // 部门名称

        paginationList: {},  // 分页数据
        pageCurrent: '',
        pageSize: '',
      }
    },
    methods:{
      getDataList(){
        this.loading = true
        let data = {
          pageNum: this.pageCurrent || null,
          pageSize: this.pageSize || null,
        }
        this.$axios.get('/manager/manager/department/list',{params:data})
            .then(res =>{
              if(res.status === 200){
                this.loading = false
                this.departmentList = res.data.date.list
                this.paginationList = res.data.date.page
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
       * @Description: 头部按钮
       * @author Wish
       * @date 2019/10/10
      */
      addDepartmentBtn(val){
        this.departmentDialog = val
        this.departmentName = ''
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
       * @Description: 编辑部门
       * @author Wish
       * @date 2019/10/10
      */
      editBtn(val){
        this.departmentMessage = JSON.parse(JSON.stringify(val))
        this.departmentName = this.departmentMessage.deotName
        this.departmentId = this.departmentMessage.deptId
        this.departmentDialog = true
        this.dialogType = false
      },

      submitForm(){
        if(this.dialogType){
          let data = new FormData();
          data.append('deotName',this.departmentName)
          this.$axios.post('/manager/manager/department/save',data)
              .then(res =>{
                if(res.status === 200){
                  this.$message.success('保存成功')
                  this.getDataList()
                  this.departmentDialog = false
                }
              })
        }else {
          let data = new FormData();
          data.append('deotName',this.departmentName)
          data.append('deptId',this.departmentId)
          this.$axios.post('/manager/manager/department/update',data)
              .then(res =>{
                if(res.status === 200){
                  this.$message.success('保存成功')
                  this.getDataList()
                  this.departmentDialog = false
                }
              })
        }
      },

      /**
       * @Description: 删除部门
       * @author Wish
       * @date 2019/10/10
      */
      deleteBtn(val){
        this.$confirm('此操作将永久删除该部门信息, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let data = {
            deptIds: val.deptId
          }
          this.$axios.delete('/manager/manager/department/delete/'+val.deptId)
              .then(res =>{
                if(res.status === 200){
                  this.$message.success('删除成功')
                  this.getDataList()
                }
              })

        }).catch(() => {});
      },
    },
    created() {
      this.getDataList()
      this.$store.state.showHeader = true
    }
  }
</script>

<style scoped lang="less">
  .departmentSetting{

  }
  /deep/.dialog_box{
    width:500px;
  }
</style>