import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    }, {
      path: '/login',
      name: 'login',
      component: () => import('./views/Login')
    }, {
      path: '/menuSetting',
      name: 'menuSetting',
      component: () => import('./views/menuSetting')
    }, {
      path: '/departmentSetting',
      name: 'departmentSetting',
      component: () => import('./views/departmentSetting')
    }, {
      path: '/branchOfficeSetting',
      name: 'branchOfficeSetting',
      component: () => import('./views/branchOfficeSetting')
    }, {
      path: '/uploadData',
      name: 'uploadData',
      component: () => import('./views/uploadData')
    }
  ]
})

