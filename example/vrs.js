import Vue from 'vue'
import VueRouterStore from 'vue-router-store'

Vue.use(VueRouterStore)

export default new VueRouterStore({
  modules: {
    cnode: {
      listData () { // list 类型的会监听 $route.fullPath 改变来更新数据
        return {
          list: []
        }
      },
      listFetch (next) {
        console.log(this)
        // this 指向到组件实例，意味着你可以使用 this.$route 的参数
        const search = this.$route.fullPath.split('?')[1] || ''
        fetch(`https://cnodejs.org/api/v1/topics?${search}`)
        .then(response => response.json())
        .then((res) => {
          next({
            list: res.data
          })
        })
      },
      detailData () {
        return {
          detail: {
            id: '',
            author_id: '',
            tab: '',
            content: '',
            title: '',
            last_reply_at: '',
            good: false,
            top: false,
            reply_count: 0,
            visit_count: 0,
            create_at: '',
            author: {
              loginname: '',
              avatar_url: ''
            },
            replies: [],
            is_collect: false
          }
        }
      },
      detailFetch (next) { // list 类型的会监听 $route.path 改变来更新数据
        // this 指向到组件实例，意味着你可以使用 this.$route 的参数
        fetch('https://cnodejs.org/api/v1/topic/5433d5e4e737cbe96dcef312')
        .then(response => response.json())
        .then((res) => {
          next({
            detail: res.data
          })
        })
      }
    }
  }
})
