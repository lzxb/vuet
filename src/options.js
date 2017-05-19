export default function options (opt = {}) {
  const options = {
    pagekey: 'page', // this.$route.query[pagekey]
    queryKey: 'query', // this.$data[queryKey]
    fetchBefore () {
      // Callback method before requesting to send
      // This points to the component instance
    },
    fetchAfter () {
      // After the request ends, the callback method, regardless of success or failure
      // This points to the component instance
    },
    baseData () {
      // All use
      return {}
    },
    baseListData () {
      // List all use
      return {}
    },
    baseDetailData () {
      // Detail all use
      return {}
    },
    fetchSuccess (res, type) {
      // Request successful callback
    },
    fetchError (e, type) {
      // Request failed callback
    },
    modules: {}
  }
  return Object.assign(options, opt)
}
