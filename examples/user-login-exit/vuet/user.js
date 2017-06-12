export default {
  data () {
    return {
      name: null,
      age: null,
      sex: null,
      count: 0
    }
  },
  async fetch ({ state }) {
    if (state.name === null) return
    return {
      name: 'Vuet',
      age: 18,
      sex: 'male',
      count: ++state.count
    }
  },
  manuals: {
    async signin ({ state }, from) {
      if (from.name === 'Vuet' && from.pass === '2017') {
        return {
          success: true,
          msg: 'Login was successful',
          data: {
            name: 'Vuet',
            age: 18,
            sex: 'male',
            count: ++state.count
          }
        }
      }
      return {
        success: false,
        msg: 'Logon failure',
        data: null
      }
    },
    async sigout () {
      this.reset()
    }
  }
}
