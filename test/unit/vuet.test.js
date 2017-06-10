import test from 'ava'
import Vue from 'vue'
import Vuet, { mapModules, mapRules } from '../../dist/vuet'

Vue.use(Vuet)

Object.defineProperty(Vue.prototype, '$route', {
  get () {
    return {
      path: '/',
      fullPath: '/?tab=all',
      query: {},
      params: {}
    }
  }
})

const myModule = 'myModule'
const listPath = `${myModule}List`
const detailPath = `${myModule}Detail`
const listState = {
  laoding: true,
  loaded: true,
  list: []
}
const detailState = {
  laoding: true,
  loaded: true,
  detail: {
    id: null,
    name: '',
    age: 0,
    sex: ''
  }
}
const countState = {
  laoding: true,
  loaded: true,
  count: 0
}
const newVuet = (t) => {
  const vuet = new Vuet({
    data () {
      t.is(vuet, this)
      return {
        laoding: true,
        loaded: true
      }
    },
    modules: {
      [myModule]: {
        list: {
          data () {
            t.is(vuet, this)
            return {
              list: []
            }
          },
          fetch (params) {
            t.is(params.path, listPath)
            t.is(params.state, vuet.getState(listPath))
            t.is(vuet, this)
            return Promise.resolve({ list: [1, 0] })
          }
        },
        detail: {
          data () {
            t.is(vuet, this)
            return {
              detail: {
                id: null,
                name: '',
                age: 0,
                sex: ''
              }
            }
          },
          fetch () {
            t.is(vuet, this)
            return Promise.reject(new Error('Error msg'))
          }
        },
        count: {
          data () {
            return {
              count: 0
            }
          },
          async fetch ({ path }) {
            return { count: ++this.getState(path).count }
          }
        }
      }
    }
  })
  return vuet
}

test('base', async t => {
  const vuet = newVuet(t)
  const vm = new Vue({
    vuet
  })
  t.deepEqual(vuet.store, {
    [`${myModule}List`]: listState,
    [`${myModule}Count`]: countState,
    [`${myModule}Detail`]: detailState
  })
  t.deepEqual(vuet.getState(listPath), listState)
  t.deepEqual(vuet.getState(detailPath), detailState)
  t.deepEqual(Object.keys(vuet._options.modules), Object.keys(vuet.store))
  t.is(vuet, vm.$options.vuet)
  t.is(vuet, vm._vuet)
  t.is(vuet, vm.$vuet)

  vuet.setState(listPath, { list: [0, 1] })
  t.deepEqual(vuet.getState(listPath).list, [0, 1])

  vuet.reset(listPath)
  t.deepEqual(vuet.getState(listPath), listState)

  const store = await vuet.fetch(listPath)
  t.deepEqual(store.list, [1, 0])
  t.deepEqual(vuet.getState(listPath).list, [1, 0])

  let beforeCount = 0
  let afterCount = 0
  let path = listPath
  vuet.beforeEach(function (params) {
    t.is(vuet, this)
    if (beforeCount === 3) return false
    t.is(params.path, path)
    t.is(params.state, vuet.getState(path))
    t.is(params.state, vuet.getState(params.path))
    t.deepEqual(params.route, vuet.app.$route)
    t.deepEqual(params.params, {})
    beforeCount++
    store.laoding = true
    store.loaded = true
  })
  vuet.afterEach(function (err, params) {
    t.is(vuet, this)
    if (afterCount === 2) return false
    t.is(params.path, path)
    t.is(params.state, vuet.getState(path))
    t.is(params.state, vuet.getState(params.path))
    t.deepEqual(params.route, vuet.app.$route)
    t.deepEqual(params.params, {})
    store.loading = false
    store.loaded = (err === null)
    afterCount++
  })
  t.is(beforeCount, 0)
  t.is(afterCount, 0)
  await vuet.fetch(listPath)
  t.is(beforeCount, 1)
  t.is(afterCount, 1)
  t.false(vuet.getState(listPath).loading)
  t.true(vuet.getState(listPath).loaded)

  path = detailPath
  try {
    await vuet.fetch(detailPath)
  } catch (e) {
    t.is(String(e), 'Error: Error msg')
    t.is(beforeCount, 2)
    t.is(afterCount, 2)
    t.false(vuet.getState(listPath).loading)
    t.false(vuet.getState(listPath).loaded)
  }

  path = listPath
  const store2 = await vuet.fetch(listPath)
  t.is(beforeCount, 3)
  t.is(afterCount, 2)
  t.is(vuet.getState(listPath), store2)

  const store3 = await vuet.fetch(listPath)
  t.is(beforeCount, 3)
  t.is(afterCount, 2)
  t.is(vuet.getState(listPath), store3)

  beforeCount = 0
  afterCount = 0
  const store4 = await vuet.fetch(listPath, {}, false)
  t.deepEqual(store4, { list: [1, 0] })
  t.is(beforeCount, 1)
  t.is(afterCount, 1)
})

test('use mixins', t => {
  const vuet = newVuet(t)
  const arr = ['life', 'manual', 'need', 'once', 'route']
  t.deepEqual(Object.keys(Vuet.options.rules), arr)

  let useCount = 0
  let initCount = 0
  let destroyCount = 0
  const testRule = {
    install (_Vue, _Vuet) {
      useCount++
      t.is(Vue, _Vue)
      t.is(Vuet, _Vuet)
      t.is(testRule, this)
    },
    init (_vuet) {
      initCount++
      t.is(vuet, _vuet)
      t.is(testRule, this)
    },
    destroy (_vuet) {
      destroyCount++
      t.is(vuet, _vuet)
      t.is(testRule, this)
    }
  }
  Vuet.rule('testRule', testRule)
  arr.push('testRule')
  t.is(useCount, 1)
  t.is(initCount, 0)
  t.is(destroyCount, 0)
  const vm = new Vue({
    vuet
  })
  t.is(useCount, 1)
  t.is(initCount, 1)
  t.is(destroyCount, 0)
  t.is(vm.$vuet, vuet)
  t.is(vm._vuet, vuet)
  vm.$destroy()
  t.is(useCount, 1)
  t.is(initCount, 1)
  t.is(destroyCount, 1)

  Vuet.use({
    name: '',
    install () {}
  })
  t.deepEqual(Object.keys(Vuet.options.rules), arr)
})

test('mapModules object parameter', t => {
  const vuet = newVuet(t)
  let vm = new Vue({
    vuet,
    mixins: [
      mapModules({
        list: `${myModule}List`,
        detail: `${myModule}Detail`
      })
    ]
  })
  t.is(vm.list, vuet.getState(listPath))
  t.is(vm.detail, vuet.getState(detailPath))
  t.deepEqual(vm.list, listState)
  t.deepEqual(vm.detail, detailState)
})

test('mapModules string parameter', t => {
  const vuet = newVuet(t)
  let vm = new Vue({
    vuet,
    mixins: [
      mapModules('detail', `${myModule}Detail`)
    ]
  })
  t.is(vm.detail, vuet.getState(detailPath))
  t.deepEqual(vm.detail, detailState)
})

test('mapRules', async t => {
  const test = (rules) => {
    const vuet = newVuet(t)
    const vm = new Vue({
      vuet,
      mixins: [
        rules
      ]
    })
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        t.deepEqual(vuet.getState(listPath), { laoding: true, loaded: true, list: [1, 0] })
        t.is(vm.$vuet, vuet)
        t.is(vm._vuet, vuet)
        t.is(vm._vuet, vm.$vuet)
        resolve()
      }, 300)
    })
  }
  await test(mapRules('route', `${myModule}List`))
  await test(mapRules('route', [`${myModule}List`]))
  await test(mapRules({ route: `${myModule}List` }))
})

test('pathJoin', t => {
  const vuet = new Vuet({
    pathJoin: '-',
    modules: {
      test1: {
        test2: {
          test3: {
            data () {
              return {
                ok: true
              }
            },
            fetch () {
              return {
                ok: false
              }
            }
          }
        }
      }
    }
  })
  const vm = new Vue({
    vuet
  })
  t.deepEqual(vuet.getState('test1-test2-test3'), {
    ok: true
  })
  t.is(vm.$vuet, vuet)
})
