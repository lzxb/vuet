import Vue from 'vue'
import Vuet from 'vuet'
import topicList from './topic-list'
import topicDetail from './topic-detail'

Vue.use(Vuet)

const vuet = new Vuet({
  data () {
    return {
      loading: true, // 请求中
      loaderr: false // 请求失败
    }
  },
  pathJoin: '-', // 父子模块的连接路径
  modules: {
    topic: {
      modules: {
        list: topicList,
        detail: topicDetail
      }
    }
  }
})

export default vuet
