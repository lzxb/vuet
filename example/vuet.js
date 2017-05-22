import Vue from 'vue'
import Vuet from 'vuet'

Vue.use(Vuet)

const { fetch } = window

export default new Vuet({
  data () {
    return {}
  },
  modules: {
    cnode: {
      route: {
        list: {
          data () {
            return {
              list: []
            }
          },
          watch: 'query',
          fetch () {
            const search = this.app.$route.fullPath.split('?')[1] || ''
            return fetch(`https://cnodejs.org/api/v1/topics?${search}`)
              .then(response => response.json())
              .then((res) => {
                return { list: res.data }
              })
          }
        },
        detail: {
          data () {
            return {
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
          },
          watch: 'params.id',
          fetch () { // list 类型的会监听 $route.path 改变来更新数据
            // this 指向到组件实例，意味着你可以使用 this.$route 的参数
            return fetch(`https://cnodejs.org/api/v1/topic/${this.app.$route.params.id}`)
              .then(response => response.json())
              .then((res) => {
                return res.data
              })
          }
        }
      }
    }
  }
})
