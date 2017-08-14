import Vue from 'vue'
import Vuet from 'vuet'
import vuet from './vuet'
import VuetScroll from '../../../packages/vuet-scroll/src/index'
import VuetRoute from '../../../packages/vuet-route/src/index'

Vue.use(VuetScroll)
Vuet.rule('route', VuetRoute)
console.dir(Vuet)
export default vuet
