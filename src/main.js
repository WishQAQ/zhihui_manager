import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'

import '../public/base.less'

import './utlis/tools'

Vue.config.productionTip = false

import axios from "axios";
Vue.prototype.$axios = axios;

import store from './store'
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
// 请求拦截器
axios.interceptors.request.use(
    config => {
      if(localStorage.token){
        config.headers['token'] = localStorage.token;
      }
      return config;
    },
    error => {
      Promise.reject(error)
    });

//http response拦截器
axios.interceptors.response.use(
    response=>{
      return response;
    },
error=>{
  let errorMessage = JSON.parse(JSON.stringify(error.response))
    switch(errorMessage.status){
      case 400:
        router.replace({
          path:'/login'
        })
    }
  return Promise.reject(err.response.data)//返回接口返回的错误信息。
})

router.beforeEach((to, from, next) => {
  let token= localStorage.token
  if(token === null || token === ''){
    next('/login');
  }else {
    next()
  }
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')