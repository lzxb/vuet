import Vue from 'vue'
import VueRouter from 'vue-router'
import TopicList from '../pages/topic/List'
import TopicDetail from '../pages/topic/Detail'

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
          name: 'topic-list',
          component: TopicList
        },
        {
          path: '/:id',
          name: 'topic-detail',
          component: TopicDetail
        }
      ]
    }
  ]
})

export default router
