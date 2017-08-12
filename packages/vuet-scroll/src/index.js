import VuetScroll from './vuet-scroll'

export default {
  install (Vuet, Vue) {
    Vue.directive('vuet-scroll', VuetScroll)
  }
}
