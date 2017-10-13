import Vue from 'vue'
import Vuet from 'vuet'
import VuetRoute from 'vuet-route'

Vuet.rule('route', VuetRoute)

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
    content: '2x1 content',
    type: 'share'
  },
  {
    id: 3,
    title: '3 title',
    content: '3x1 content',
    type: 'share'
  },
  {
    id: 4,
    title: '4 title',
    content: '4x1 content',
    type: 'good'
  }
])

export default new Vuet({
  data () {
    return {}
  },
  modules: {
    topic: {
      modules: {        
        list: {
          data () {
            return {
              list: [],
              fetchCount: 0
            }
          },
          route: {
            watch: 'query'
          },
          async fetch () {
            const { type = 'all' } = this.app.$route.query
            let list = listData()
            if (type !== 'all') {
              list = listData().filter((item) => item.type === type)
            }
            await new Promise((resolve, reject) => {
              setTimeout(() => {
                resolve()
              }, 1000)
            })
            this.list = list
            this.fetchCount++ 
          }
        },
        detail: {
          data () {
            return {
              id: null,
              title: null,
              content: null,
              type: null,
              fetchCount: 0
            }
          },
          route: {
            watch: 'params.id'
          },
          async fetch ({ state }) {
            const { id } = this.app.$route.params
            await new Promise((resolve, reject) => {
              setTimeout(() => {
                resolve()
              }, 1000)
            })
            const arr = listData()
            for (let i = 0; i < arr.length; i++) {
              if (arr[i].id === Number(id)) {
                Object.assign(this, { ...arr[i], fetchCount: ++this.fetchCount })
              }
            }
          }
        }
      }
    }
  }
})
