export default {
  data: {
    group () {
      return {
        list: []
      }
    }
  },
  modules: {
    myModules: {
      data: {
        group () {

        }
      },
      fetch: {
        group () {
          return {}
        }
      }
    }
  }
}
