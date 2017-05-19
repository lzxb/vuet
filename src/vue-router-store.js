import { _Vue } from './install'
import options from './options'
import utils from './utils'
import debug from './debug'

export default class VueRouterStore {
  constructor (opt) {
    this.options = options(opt = opt || {})
    this._init()
  }
  _init () {
    const store = {}
    const _fetchKey = {}
    Object.keys(this.options.modules).forEach(name => {
      store[name] = {
        list: this._getData(name, 'list'),
        detail: this._getData(name, 'detail')
      }
      _fetchKey[name] = {
        list: '',
        detail: ''
      }
    })
    this.store = new _Vue({
      data: {
        store
      }
    }).$data.store
    this._fetchKey = _fetchKey
  }
  _getModuleOptions (name, type) {
    const options = this.options.modules[name]
    const defaults = {
      pagekey: this.options.pagekey,
      queryKey: this.options.queryKey,
      paramsKey: this.options.detailParamsKey,
      fetch (next) {
        return {}
      },
      data () {
        return {}
      }
    }
    Object.keys(options).forEach(k => {
      let name = (k.split(type)[1] || '')
      name = name.replace(/^(\w)/, (v) => v.toLowerCase()) // 首字母大写
      if (name) {
        defaults[name] = options[k]
      } else {
        defaults[name] = options[k]
      }
    })
    return defaults
  }
  _returnComput (comput, diy) {
    const obj = {}
    if (!diy.length) return comput
    diy.forEach(k => {
      obj[k] = comput[k]
    })
    return obj
  }
  _getData (name, type) {
    const data = this.options.baseData.call(this, name, type)
    switch (type) {
      case 'list':
        Object.assign(data, this.options.baseListData.call(this, name))
        break
      case 'detail':
        Object.assign(data, this.options.baseDetailData.call(this, name))
        break
    }
    const options = this._getModuleOptions(name, type)
    return Object.assign(data, options.data.call(this))
  }
  _clearStore (name, type) {
    const data = this._getData(name, type)
    this._setStore(name, type, data)
  }
  _getStore (name, type) {
    return this.store[name][type]
  }
  _setStore (name, type, data) {
    const store = this.store[name][type]
    Object.assign(store, data)
  }
  _getComputed (name, type) {
    const store = this.store[name][type]
    const computed = {}
    Object.keys(store).forEach(k => {
      computed[k] = {
        get () {
          return store[k]
        },
        set (val) {
          store[k] = val
        }
      }
    })
    return computed
  }
  _setFetchKey (name, type, val) {
    this._fetchKey[name][type] = String(val)
  }
  _getFetchKey (name, type) {
    return this._fetchKey[name][type]
  }
  listStore (name, ...diy) {
    const self = this
    const type = 'list'
    const options = self._getModuleOptions(name, type)
    const computed = {
      ...self._getComputed(name, type),
      $rsList () {
        const vm = this

        function rsList () {
          const fetch = self._getModuleOptions(name, type).fetch
          if (!utils.isFunction(fetch)) {
            return debug.error(`${type} fetch method is undefined`)
          }
          const fullPath = vm.$route.fullPath
          self.options.fetchBefore.call(vm, name, type)
          utils.next(fetch.bind(vm), (res) => {
            const back = self.options.fetchSuccess.call(vm, res, name, type)
            if (utils.isObject(back)) {
              res = back
            }
            if (fullPath !== vm.$route.fullPath) return
            self._setStore(name, type, res)
            self._setFetchKey(name, type, fullPath)
            self.options.fetchAfter.call(vm, name, type)
          }, (e) => {
            self.options.fetchError.call(vm, e, name, type)
            self.options.fetchAfter.call(vm, name, type)
          })
        }
        rsList.init = function init () {
          self._clearStore(name, type)
        }

        rsList.search = function search (...arg) {
          let query = {}
          /* eslint-disable no-undef */
          if (typeof event === 'object' && event === arg[0]) {
            arg[0] = {}
          }
          if (utils.isObject(arg[0])) { // search({})
            query = arg[0]
          } else if (typeof arg[0] === 'string') { // search('key', val)
            query[arg[0]] = arg[1]
          }
          query = Object.assign({}, vm.$route.query, { [options.pagekey]: '1' }, vm[options.queryKey], query)
          vm.$router.push({
            ...vm.$route,
            query
          })
        }
        rsList.syncQuery = function syncQuery () {
          const query = vm[options.queryKey]
          if (utils.isObject(query)) {
            Object.keys(query).forEach((k) => {
              if (Object.prototype.hasOwnProperty.call(vm.$route.query, k)) {
                query[k] = vm.$route.query[k]
              }
            })
          }
        }
        return rsList
      }
    }
    return this._returnComput(computed, diy)
  }
  listMixin (name) {
    const self = this
    const type = 'list'
    return {
      beforeRouteEnter (to, from, next) {
        const key = self._getFetchKey(name, type)
        const toKey = to.fullPath
        if (!key) {
          self._setFetchKey(name, type, toKey)
        } else if (key !== toKey) {
          self._clearStore(name, type)
          self._setFetchKey(name, type, toKey)
        }
        if (utils.isFunction(next)) {
          next()
        }
      },
      computed: self.listStore(name),
      created () {
        this.$rsList.syncQuery()
        this.$rsList()
      },
      watch: {
        '$route.fullPath' () {
          this.$rsList.syncQuery()
          this.$rsList()
        }
      }
    }
  }
  detailStore (name, ...diy) {
    const self = this
    const type = 'detail'
    const options = self._getModuleOptions(name, type)
    const computed = {
      ...self._getComputed(name, type),
      $rsDetail () {
        const vm = this
        function rsDetail () {
          const key = vm.$route.path
          if (!vm.$route.params[options.paramsKey]) return
          const fetch = options.fetch
          if (!utils.isFunction(fetch)) {
            return debug.error(`${type} fetch method is undefined`)
          }
          self.options.fetchBefore.call(vm, name, type)
          utils.next(fetch.bind(vm), (res) => {
            const back = self.options.fetchSuccess.call(vm, res, name, type)
            if (utils.isObject(back)) {
              res = back
            }
            if (key !== vm.$route.path) return
            self._setStore(name, type, res)
            self._setFetchKey(name, type, key)
            self.options.fetchAfter.call(vm, name, type)
          }, (e) => {
            self.options.fetchError.call(vm, e, name, type)
            self.options.fetchAfter.call(vm, name, type)
          })
        }
        rsDetail.init = function init () {
          self._clearStore(name, type)
        }
        return rsDetail
      }
    }
    return this._returnComput(computed, diy)
  }
  detailMixin (name) {
    const self = this
    const type = 'detail'
    return {
      beforeRouteEnter (to, from, next) {
        const key = self._getFetchKey(name, type)
        if (!key) {
          self._setFetchKey(name, type, to.path)
        } else if (key && key !== to.path) {
          self._clearStore(name, type)
          self._setFetchKey(name, type, to.path)
        }
        if (utils.isFunction(next)) {
          next()
        }
      },
      computed: self.detailStore(name),
      created () {
        this.$rsDetail()
      },
      watch: {
        '$route.path' () {
          this.$rsDetail()
        }
      }
    }
  }
}
