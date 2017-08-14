import Vue from 'vue'
import Vuet from 'vuet'
import VuetScroll from 'vuet-scroll'
import VuetRoute from 'vuet-route'
import topicList from './topic-list'
import topicDetail from './topic-detail'

Vue
  .use(Vuet)
  .use(VuetScroll)
Vuet
  .rule('route', VuetRoute)

export default new Vuet({
  modules: {
    topic: {
      modules: {
        list: topicList,
        detail: topicDetail
      }
    }
  }
})
