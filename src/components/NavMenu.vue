<template>
  <el-menu
      :default-active="defaultPath"
      class="NavMenu"
      @open="handleOpen"
      @close="handleClose"
      @select="handleMenu"
      background-color="#545c64"
      text-color="#fff"
      router
      active-text-color="#ffd04b">
    <el-menu-item index="/">
      <i class="el-icon-s-custom"></i>
      <span slot="title">用户列表</span>
    </el-menu-item>
    <el-menu-item index="menuSetting">
      <i class="el-icon-document"></i>
      <span slot="title">菜单管理</span>
    </el-menu-item>
    <el-menu-item index="departmentSetting">
      <i class="el-icon-menu"></i>
      <span slot="title">挂点部门</span>
    </el-menu-item>
    <el-menu-item index="branchOfficeSetting">
      <i class="el-icon-menu"></i>
      <span slot="title">分理处管理</span>
    </el-menu-item>
    <el-menu-item index="uploadData">
      <i class="el-icon-upload"></i>
      <span slot="title">上传省联社数据</span>
    </el-menu-item>
  </el-menu>
</template>

<script>
  export default {
    name: "NavMenu",
    data(){
      return {
        defaultPath: localStorage.getItem('path') || '/'
      }
    },
    methods: {
      /**
       * @Description: 菜单点击
       * @author Wish
       * @date 2019/10/10
      */
      handleMenu( index, indexPath){
        window.localStorage['path'] = indexPath
      },

      handleOpen(key, keyPath) {
        console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
      }
    }
  }
</script>

<style scoped lang="less">
  .NavMenu{
    flex-shrink: 0;
    max-width: 240px;
    width: 100%;
    height: 100%;
  }
</style>