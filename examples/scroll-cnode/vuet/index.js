import Vue from 'vue'
import Vuet from 'vuet'
import VuetScroll from 'vuet-scroll'
import VuetRoute from 'vuet-route'
import vuet from './vuet'

Vue.use(VuetScroll)
Vuet.rule('route', VuetRoute)

export default vuet
