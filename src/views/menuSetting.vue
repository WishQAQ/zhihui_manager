<template>
  <div class="menuSetting">
    <div class="menu_tree" v-loading="treeLoading">
      <el-tree
          show-checkbox
          check-strictly
          :data="treeData"
          :props="defaultProps"
          @node-click="handleNodeClick">
      </el-tree>

    </div>
    <el-card class="menu_main" v-loading="formLoading">
      <el-form ref="form" label-width="80px">
        <div class="form_title">{{openInput?'新增菜单':'编辑菜单'}}</div>
        <el-form-item label="菜单名称">
          <el-input v-model="menuName"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="submitBtn" :disabled="menuId === ''">保存</el-button>
        </el-form-item>
      </el-form>

    </el-card>

  </div>
</template>

<script>
  export default {
    name: "menuSetting",
    data(){
      return {
        treeLoading: true, // 列表加载
        treeData: [],  // 列表数据

        treeMessage: '', // 节点数据
        formLoading: false,  // 信息加载

        openInput: true,  // input输入框开关
        menuName: '', // 节点名称
        menuId: '', // 节点ID

        defaultProps: {
          children: 'childs',
          label: 'levelName'
        }
      }
    },
    methods: {
      getDataList(){
        this.treeLoading = true
        this.$axios.get('/manager/manager/menu')
            .then(res =>{
              if(res.status === 200){
                this.treeData = res.data.date.childs

                this.treeData.forEach(list =>{
                  return list['disabled'] = true
                })
                this.treeLoading = false
              }
            })
      },

      /**
       * @Description: 点击节点获取详细信息
       * @author Wish
       * @date 2019/10/10
      */
      handleNodeClick(data) {
        this.treeMessage = JSON.parse(JSON.stringify(data))
        this.menuId = this.treeMessage.levelMenuId
        if(!data.disabled){
          this.openInput = false
          this.menuName = this.treeMessage.levelName
        }else {
          this.openInput = true
          this.menuName = ''
        }
      },

      /**
       * @Description: 提交节点资料
       * @author Wish
       * @date 2019/10/10
      */
      submitBtn(){
        this.formLoading = true
        if(this.openInput){
          let data ={
            levelMenuId: this.menuId,
            levelName: this.menuName
          }
          this.$axios({url:'/manager/manager/menu/save',
            method: 'post',
            data: data,
            headers:{'Content-Type': "application/json;charset=utf-8"}}
          ).then(res =>{
            if(res.status === 200){
              this.getDataList()
              this.$message.success('保存成功')
              this.formLoading = false
            }
          })
        }else {
          let data = new FormData();
          data.append('levelMenuId',this.menuId)
          data.append('levelName',this.menuName)
          this.$axios.post('/manager/manager/menu/update',data)
              .then(res =>{
            if(res.status === 200){
              this.getDataList()
              this.$message.success('保存成功')
              this.formLoading = false

            }
          })
        }

      },
    },
    created() {
      this.getDataList()
    }
  }
</script>

<style scoped lang="less">
  .menuSetting{
    display: flex;
    align-items: flex-start;
    .menu_tree{
      flex: 1;
      margin-right: 40px;
    }
    .menu_main{
      flex: 1;
      .form_title{
        font-size: 20px;
        margin-bottom: 35px;
      }
    }
  }
</style>