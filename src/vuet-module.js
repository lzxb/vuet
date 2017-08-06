import utils from './utils'

export default class VuetModule {
  constructor (opts) {
    this.methods = {}
    this.options = {}

    const state = {
      ...opts,
      reset () {
        this.state = this.data()
      }
    }

    Object.keys(state).forEach(k => {
      if (typeof state[k] === 'function') {
        this.methods[k] = state[k].bind(state)
      } else {
        this.options[k] = state[k]
      }
    })
    this.state = this.methods.data()
    const vtm = this
    Object.defineProperty(state, 'state', {
      get () {
        return vtm.state
      },
      set (val) {
        vtm.state = val
      }
    })
    if (utils.isObject(vtm.state)) {
      Object.keys(vtm.state).forEach(k => {
        Object.defineProperty(state, k, {
          get () {
            return vtm.state[k]
          },
          set (val) {
            vtm.state[k] = val
          }
        })
      })
    }
  }
}
