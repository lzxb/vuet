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
      name: 'list',
      component: List
    },
    {
      path: '/:id',
      name: 'detail',
      component: Detail
    }
  ]
})

Vue.prototype.$scrollTo = function scrollTo (el, scrolls) {
  if ('scrollTop' in el && el !== window) {
    el.scrollLeft = scrolls.x
    el.scrollTop = scrolls.y
  } else {
    el.scrollTo(scrolls.x, scrolls.y)
  }
}

export default new Vue({
  el: '#app',
  vuet,
  router,
  render (h) {
    return h('router-view')
  }
})
