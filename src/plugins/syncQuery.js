import utils from '../utils'
const name = 'syncQuery'
function syncQuery () {
  if (!this.$vuet) return
  const { syncQuery = 'query' } = this.$vuet.options
  const query = this[syncQuery]
  if (utils.isObject(query)) {
    Object.keys(query).forEach((k) => {
      if (Object.prototype.hasOwnProperty.call(this.$route.query, k)) {
        query[k] = this.$route.query[k]
      }
    })
  }
}

export default {
  name,
  install (Vue, Vuet) {
    Vue.mixin({
      created () {
        syncQuery.call(this)
      },
      watch: {
        $route () {
          syncQuery.call(this)
        }
      }
    })
  }
}
