import Vue from 'vue'
import VueRouter from 'vue-router'
import vuet from './vuet'
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
  vuet,
  router,
  render (h) {
    return h('router-view')
  }
})
