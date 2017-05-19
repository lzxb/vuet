import Vue from 'vue'
import VueRouter from 'vue-router'
import vrs from './vrs'
import List from './List'
import Detail from './Detail'

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    {
      path: '/',
      name: 'index',
      component: List
    },
    {
      path: '/:id',
      name: 'detail',
      component: Detail
    }
  ]
})

export default new Vue({
  el: '#app',
  vrs,
  router,
  render (h) {
    return h('router-view')
  }
})
// 调用 vrs.listMixin('myModule') 方法来向组件注入mixin
// 调用 vrs.detailMixin('myModule') 方法来向组件注入mixin
