export default function options (opt = {}) {
  const options = {
    pagekey: 'page', // this.$route.query[pagekey]
    queryKey: 'query', // this.$data[queryKey]
    detailParamsKey: 'id', // this.$route.params[detailParamsKey]
    fetchBefore (name, type) {
      // Callback method before requesting to send
      // This points to the component instance
    },
    fetchAfter (name, type) {
      // After the request ends, the callback method, regardless of success or failure
      // This points to the component instance
    },
    fetchSuccess (res, name, type) {
      // Request successful callback
    },
    fetchError (e, name, type) {
      // Request failed callback
    },
    baseData (name, type) {
      // All use
      return {}
    },
    baseListData (name) {
      // List all use
      return {}
    },
    baseDetailData (name) {
      // Detail all use
      return {}
    },
    modules: {}
  }
  return Object.assign(options, opt)
}
