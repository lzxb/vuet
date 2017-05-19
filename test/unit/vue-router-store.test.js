import test from 'ava'
import Vue from 'vue'
import VueRouterStore from '../../src/'

Vue.use(VueRouterStore)
const $route = {
  fullPath: '',
  path: '/',
  query: {},
  params: {}
}
const $routeInit = () => {
  Object.assign($route, {
    fullPath: '',
    path: '/',
    query: {},
    params: {}
  })
}
/* eslint-disable no-new */
new Vue({
  data: {
    route: $route
  }
})
Vue.mixin({
  computed: {
    $route: {
      get () {
        return $route
      },
      set (val) {
        Object.assign($route, val)
      }
    },
    $router () {
      return {
        push (val) {
          Object.assign($route, val)
        }
      }
    }
  }
})

const name = 'article'
const listType = 'list'
const detailType = 'detail'

const createVrs = () => {
  return new VueRouterStore({
    baseData () {
      return {
        loading: true
      }
    },
    baseListData () {
      return {
        list: []
      }
    },
    baseDetailData () {
      return {
        title: ''
      }
    },
    modules: {
      [name]: {
        listMixin: {},
        listData () {
          return {
            keyname: ''
          }
        },
        listFetch (next) {
          next({
            list: [1]
          })
        },
        detailData () {
          return {
            detail: {
              id: null,
              name: 'vue-router-store'
            }
          }
        },
        detailFetch (next) {
          next({
            title: 'title',
            detail: {
              id: 1000,
              name: 'vue'
            }
          })
        }
      }
    }
  })
}

test('store', t => {
  const vrs = createVrs()
  t.deepEqual(vrs.store, {
    article: {
      list: {
        keyname: '',
        list: [],
        loading: true
      },
      detail: {
        loading: true,
        title: '',
        detail: {
          id: null,
          name: 'vue-router-store'
        }
      }
    }
  })
})

test('_getData', t => {
  const vrs = createVrs()
  const listData = vrs._getData(name, listType)
  t.deepEqual(listData, {
    keyname: '',
    list: [],
    loading: true
  })

  const detailData = vrs._getData(name, detailType)
  t.deepEqual(detailData, {
    loading: true,
    title: '',
    detail: {
      id: null,
      name: 'vue-router-store'
    }
  })
})

test('_setStore && _getStore && _clearStore', t => {
  const vrs = createVrs()
  vrs._setStore(name, listType, {
    keyname: 'vue-router-store'
  })
  t.is(vrs._getStore(name, listType).keyname, 'vue-router-store')
  vrs._clearStore(name, listType)
  t.is(vrs._getStore(name, listType).keyname, '')

  vrs._setStore(name, detailType, {
    title: 'vue-router-store'
  })
  t.is(vrs._getStore(name, detailType).title, 'vue-router-store')
  vrs._clearStore(name, detailType)
  t.is(vrs._getStore(name, detailType).title, '')
})

test('_getComputed', t => {
  const vrs = createVrs()
  const listComputed = vrs._getComputed(name, listType)
  t.deepEqual(Object.keys(vrs.store[name][listType]), Object.keys(listComputed))

  const detailComputed = vrs._getComputed(name, detailType)
  t.deepEqual(Object.keys(vrs.store[name][detailType]), Object.keys(detailComputed))
})

test('_setFetchKey && _getFetchKey', t => {
  const vrs = createVrs()
  const listVal = 'list'
  vrs._setFetchKey(name, listType, listVal)
  t.is(listVal, vrs._getFetchKey(name, listType))

  const detailVal = 'detail'
  vrs._setFetchKey(name, detailType, detailVal)
  t.is(detailVal, vrs._getFetchKey(name, detailType))
})

test('vue instanced', t => {
  const vrs = createVrs()
  const vm = new Vue({ vrs })
  t.is(vm._vrs, vrs)
  t.is(vm.$vrs, vrs)
  t.is(vm.$rs, vrs.store)
})

test('listStore ($rsList && init && search && syncQuery)', t => {
  $routeInit()
  const vrs = createVrs()
  const store = vrs._getStore(name, listType)
  const computed = vrs.listStore(name)
  const vm = new Vue({
    vrs,
    mixins: [{ computed }],
    data () {
      return {
        query: {
          type: '',
          date: ''
        }
      }
    }
  })
  t.is(vm.loading, store.loading)
  t.is(vm.list, store.list)
  t.is(vm.keyname, store.keyname)
  vm.keyname = 'changeed'
  t.is(vm.keyname, store.keyname)
  vm.$rsList()
  t.deepEqual(vm.list, [1])
  vm.$rsList.init()
  t.deepEqual(vm.list, [])
  const time = new Date().getTime()
  vm.$rsList.search({
    type: time
  })
  t.is(vm.$route.query.type, time)
  vm.$rsList.syncQuery()
  t.is(vm.query.type, time)
  t.is(vm.query.date, '')
})

test('listMixin beforeRouteEnter', t => {
  $routeInit()
  const vrs = createVrs()
  const mixin = vrs.listMixin(name)
  const store = vrs._getStore(name, listType)
  $route.query = { keyname: 'vue' }
  store.keyname = 'test'
  mixin.beforeRouteEnter($route, {}, () => {})
  t.is(store.keyname, 'test')
  vrs._setFetchKey(name, listType, 'test')
  mixin.beforeRouteEnter($route, {}, () => {})
  t.is(store.keyname, '')
  store.keyname = 'test'
  vrs._setFetchKey(name, listType, 'keyname=vue')
  t.is(store.keyname, 'test')
})

test('listMixin computed', t => {
  const vrs = createVrs()
  const mixin = vrs.listMixin(name)
  t.deepEqual(Object.keys(mixin.computed), Object.keys(vrs.listStore(name)))
})

test.cb('listMixin （created && watch）', t => {
  $routeInit()
  const vrs = createVrs()
  const mixin = vrs.listMixin(name)
  $route.query = { keyname: 'vue' }
  const vm = new Vue({
    mixins: [mixin],
    data: {
      query: {
        keyname: ''
      }
    }
  })
  t.is(vm.query.keyname, vm.$route.query.keyname)
  t.deepEqual(vm.list, [1])
  const time = new Date().getTime()
  vm.$router.push({
    time,
    keyname: 'watch'
  })
  vm.$nextTick(() => {
    t.is(vm.query.keyname, vm.$route.query.keyname)
    t.false(Object.prototype.hasOwnProperty.call(vm.query, 'time'))
    t.deepEqual(vm.list, [1])
    vrs._clearStore(name, listType)
    vm.$router.push({
      fullPath: `/${name}?keyname=watch&time=${time}`,
      time,
      keyname: 'watch'
    })
    vm.$nextTick(() => {
      t.is(vm.query.keyname, vm.$route.query.keyname)
      t.false(Object.prototype.hasOwnProperty.call(vm.query, 'time'))
      t.deepEqual(vm.list, [1])
      t.end()
    })
  })
})

test('detailStore ($rsDetail && init)', t => {
  const vrs = createVrs()
  const computed = vrs.detailStore(name)
  const vm = new Vue({
    computed
  })
  t.true(vm.loading)
  t.is(vm.title, '')
  t.deepEqual(vm.detail, {
    id: null,
    name: 'vue-router-store'
  })
  vm.$router.push({
    path: `/${name}/1000`,
    params: {
      id: 1000
    }
  })
  vm.$rsDetail()
  t.is(vm.title, 'title')
  t.deepEqual(vm.detail, {
    id: 1000,
    name: 'vue'
  })
  vm.$rsDetail.init()
  t.true(vm.loading)
  t.is(vm.title, '')
  t.deepEqual(vm.detail, {
    id: null,
    name: 'vue-router-store'
  })
})

test.cb('detailMixin (beforeRouteEnter && computed)', t => {
  const vrs = createVrs()
  const mixin = vrs.detailMixin(name, detailType)
  const store = vrs._getStore(name, detailType)
  mixin.beforeRouteEnter({
    path: `/${name}/1000`
  })
  t.is(vrs._getFetchKey(name, detailType), `/${name}/1000`)
  t.deepEqual(store, vrs._getData(name, detailType))
  vrs._setStore(name, detailType, {
    loading: false,
    title: 'two',
    detail: {
      id: 1000,
      name: 'store'
    }
  })
  mixin.beforeRouteEnter({
    path: `/${name}/1000`
  })
  t.deepEqual(store, {
    loading: false,
    title: 'two',
    detail: {
      id: 1000,
      name: 'store'
    }
  })
  mixin.beforeRouteEnter({
    params: {
      id: 1000
    }
  })
  t.deepEqual(store, vrs._getData(name, detailType))
  const vm = new Vue({
    mixins: [mixin]
  })
  t.is(vm.title, store.title)
  t.is(vm.title, 'title')
  t.is(vm.detail, store.detail)
  t.deepEqual(vm.detail, {
    id: 1000,
    name: 'vue'
  })
  vm.$rsDetail.init()
  t.deepEqual(store, vrs._getData(name, detailType))
  vm.$router.push({
    path: `${name}/1000`
  })
  vm.$nextTick(() => {
    t.is(vm.title, store.title)
    t.is(vm.title, 'title')
    t.is(vm.detail, store.detail)
    t.deepEqual(vm.detail, {
      id: 1000,
      name: 'vue'
    })
    t.end()
  })
})
