import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../pages/Home'
import Signin from '../pages/Signin'

Vue.use(VueRouter)

const RouterView = {
  render (h) {
    return h('router-view')
  }
}

const router = new VueRouter({
  routes: [
    {
      path: '/',
      component: RouterView,
      children: [
        {
          path: '',
          name: 'home',
          component: Home
        },
        {
          path: '/signin',
          name: 'signin',
          component: Signin
        }
      ]
    }
  ]
})

export default router
