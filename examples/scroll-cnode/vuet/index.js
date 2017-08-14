import Vue from 'vue'
import Vuet from 'vuet'
import vuet from './vuet'
import VuetScroll from 'vuet-scroll'
import VuetRoute from 'vuet-route'
Vue.use(VuetScroll)
Vuet.rule('route', VuetRoute)
export default vuet
