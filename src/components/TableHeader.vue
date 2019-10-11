<template>
  <div class="TableHeader">
    <div class="table_name">{{title}}</div>
    <div class="option"><el-button @click="clickBtn">{{btnName}}</el-button></div>
  </div>
</template>

<script>
  export default {
    name: "TableHeader",
    props: ['title','btnName'],
    methods:{
      clickBtn(){
        this.$emit('headerBtn',true)
      },
    },
  }
</script>

<style scoped lang="less">
  .TableHeader{
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 50px;
    margin-bottom: 25px;
    .table_name{
      font-size: 22px;
    }
  }
</style>