import test from 'ava'
import Vue from 'vue'
import Vuet, { mapState } from '../../dist/vuet'

Vue.use(Vuet)

const myModule = 'myModule'
const listPath = `${myModule}/route/list`
const detailPath = `${myModule}/route/detail`
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
        route: {
          list: {
            data () {
              t.is(vuet, this)
              return {
                list: []
              }
            },
            fetch () {
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
    [`${myModule}/route/list`]: listState,
    [`${myModule}/route/count`]: countState,
    [`${myModule}/route/detail`]: detailState
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
    t.is(params.store, vuet.getState(path))
    t.is(params.store, vuet.getState(params.path))
    t.deepEqual(params.params, {})
    beforeCount++
    store.laoding = true
    store.loaded = true
  })
  vuet.afterEach(function (err, params) {
    t.is(vuet, this)
    if (afterCount === 2) return false
    t.is(params.path, path)
    t.is(params.store, vuet.getState(path))
    t.is(params.store, vuet.getState(params.path))
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
})

test('use plugins', t => {
  const vuet = newVuet(t)
  const arr = ['life', 'local', 'need', 'once', 'route']
  t.deepEqual(Object.keys(Vuet.plugins), arr)
  arr.forEach(name => {
    t.is(Vuet.plugins[name].name, name)
  })

  let useCount = 0
  let initCount = 0
  let destroyCount = 0
  const testPlugin = {
    name: 'testPlugin',
    install (_Vue, _Vuet, opt) {
      useCount++
      t.is(Vue, _Vue)
      t.is(Vuet, _Vuet)
      t.is(testPlugin, this)
      t.deepEqual(opt, { msg: 'ok' })
    },
    init (_vuet) {
      initCount++
      t.is(vuet, _vuet)
      t.is(testPlugin, this)
    },
    destroy (_vuet) {
      destroyCount++
      t.is(vuet, _vuet)
      t.is(testPlugin, this)
    }
  }
  Vuet.use(testPlugin, { msg: 'ok' })
  arr.push('testPlugin')
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
  t.deepEqual(Object.keys(Vuet.plugins), arr)
})

test('mapState object parameter', t => {
  const vuet = newVuet(t)
  let vm = new Vue({
    vuet,
    computed: mapState({
      list: `${myModule}/route/list`,
      detail: `${myModule}/route/detail`
    })
  })
  t.is(vm.list, vuet.getState(listPath))
  t.is(vm.detail, vuet.getState(detailPath))
  t.deepEqual(vm.list, listState)
  t.deepEqual(vm.detail, detailState)
})

test('mapState string parameter', t => {
  const vuet = newVuet(t)
  let vm = new Vue({
    vuet,
    computed: mapState('detail', `${myModule}/route/detail`)
  })
  t.is(vm.detail, vuet.getState(detailPath))
  t.deepEqual(vm.detail, detailState)
})
