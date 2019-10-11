<template>
  <div class="branchOfficeSetting" v-loading="loading">
    <table-header :title="'分理处管理'" :btnName="'新增分理处'" v-on:headerBtn="addbranchOfficeBtn"></table-header>
    <el-table
        :data="branchOfficeList"
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
          prop="dockingName"
          label="分理处名称">
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
        :title="dialogType?'新增分理处':'编辑分理处'"
        append-to-body
        :close-on-click-modal="false"
        custom-class="dialog_box"
        :visible.sync="branchOfficeDialog">
      <div class="dialog_main">
        <el-form label-width="90px">
          <el-form-item label="分理处名称" prop="counterNumber">
            <el-input v-model="branchOfficeName" placeholder="请输入分理处名称"></el-input>
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
    name: "branchOfficeSetting",
    components:{
      'TableHeader': () => import('@/components/TableHeader')
    },
    data(){
      return {
        loading: true,
        branchOfficeList: [], // 分理处列表

        branchOfficeDialog: false, // 分理处弹窗
        dialogType: true, // 弹窗状态
        submitLoading: false, // 提交按钮加载

        branchOfficeMessage: {}, // 分理处信息
        branchOfficeId: '', // 分理处Id
        branchOfficeName: '', // 分理处名称

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
        this.$axios.get('/manager/manager/dockingpart/list',{params:data})
            .then(res =>{
              if(res.status === 200){
                this.loading = false
                this.branchOfficeList = res.data.date.list
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
      addbranchOfficeBtn(val){
        this.branchOfficeDialog = val
        this.branchOfficeName = ''
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
       * @Description: 编辑分理处
       * @author Wish
       * @date 2019/10/10
       */
      editBtn(val){
        this.branchOfficeMessage = JSON.parse(JSON.stringify(val))
        this.branchOfficeName = this.branchOfficeMessage.dockingName
        this.branchOfficeId = this.branchOfficeMessage.dockingPartId
        this.branchOfficeDialog = true
        this.dialogType = false
      },

      submitForm(){
        if(this.dialogType){
          let data = new FormData();
          data.append('dockingName',this.branchOfficeName)
          this.$axios.post('/manager/manager/dockingpart/save',data)
              .then(res =>{
                if(res.status === 200){
                  this.$message.success('保存成功')
                  this.getDataList()
                  this.branchOfficeDialog = false
                }
              })
        }else {
          let data = new FormData();
          data.append('dockingName',this.branchOfficeName)
          data.append('dockingPartId',this.branchOfficeId)
          this.$axios.post('/manager/manager/dockingpart/update',data)
              .then(res =>{
                if(res.status === 200){
                  this.$message.success('保存成功')
                  this.getDataList()
                  this.branchOfficeDialog = false
                }
              })
        }
      },

      /**
       * @Description: 删除分理处
       * @author Wish
       * @date 2019/10/10
       */
      deleteBtn(val){
        this.$confirm('此操作将永久删除该分理处信息, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$axios.delete('/manager/manager/dockingpart/delete/'+val.dockingPartId)
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
    }
  }
</script>

<style scoped lang="less">
  .branchOfficeSetting{

  }
  /deep/.dialog_box{
    width:500px;
  }
</style>