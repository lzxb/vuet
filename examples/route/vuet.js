import Vue from 'vue'
import Vuet from 'vuet'

Vue.use(Vuet)

const listData = () => ([
  {
    id: 1,
    title: '1 title',
    content: '1x1 content',
    type: 'good'
  },
  {
    id: 2,
    title: '2 title',
    content: '1x1 content',
    type: 'share'
  },
  {
    id: 3,
    title: '3 title',
    content: '1x1 content',
    type: 'share'
  },
  {
    id: 4,
    title: '4 title',
    content: '1x1 content',
    type: 'good'
  }
])

export default new Vuet({
  data () {
    return {}
  },
  modules: {
    topic: {
      list: {
        data () {
          return {
            list: []
          }
        },
        watch: 'query',
        async fetch () {
          const { type = 'all' } = this.app.$route.query
          let list = listData()
          if (type !== 'all') {
            list = listData().filter((item) => item.type === type)
          }
          await new Promise((resolve, reject) => {
            setTimeout(() => {
              resolve()
            }, 1500)
          })
          return {
            list
          }
        }
      },
      detail: {
        data () {
          return {
            id: null,
            title: null,
            content: null,
            type: null
          }
        },
        watch: 'params.id',
        async fetch () {
          const { id } = this.app.$route.params
          await new Promise((resolve, reject) => {
            setTimeout(() => {
              resolve()
            }, 1500)
          })
          const arr = listData()
          for (let i = 0; i < arr.length; i++) {
            if (arr[i].id === Number(id)) {
              return arr[i]
            }
          }
          return {}
        }
      }
    }
  }
})
