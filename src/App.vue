<template>
  <div id="app">
    <Header v-if="$store.state.showHeader"></Header>
    <div class="main">
      <nav-menu v-if="$store.state.showHeader"></nav-menu>
      <router-view class="content"></router-view>
    </div>
  </div>
</template>

<script>
export default {
  name: 'app',
  components:{
    'Header': () => import('@/components/Header'),
    'NavMenu': () => import('@/components/NavMenu')
  }
}
</script>

<style lang="less">
  .main{
    display: flex;
    align-items: flex-start;
    width: 100vw;
    height: calc( 100vh - 80px);
    .content{
      padding: 35px;
      overflow-y: auto;
      width: 100%;
      height: 100%;
    }
  }
</style>
