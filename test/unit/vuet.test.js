import test from 'ava'
import Vue from 'vue'
import Vuet from '../../dist/vuet'

Vue.use(Vuet)

const myModule = 'myModule'
const listPath = `${myModule}/route/list`
const detailPath = `${myModule}/route/detail`
const newVuet = () => {
  return new Vuet({
    data () {
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
              return {
                list: []
              }
            },
            fetch () {
              return Promise.resolve({ list: [1, 0] })
            }
          },
          detail: {
            data () {
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
              return Promise.reject(new Error('Error msg'))
            }
          }
        }
      }
    }
  })
}

test('base', async t => {
  const vuet = newVuet()
  const vm = new Vue({
    vuet
  })
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
  t.deepEqual(vuet.store, {
    [`${myModule}/route/list`]: listState,
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
  vuet.beforeEach((params) => {
    t.is(params.path, path)
    t.is(params.store, vuet.getState(path))
    t.is(params.store, vuet.getState(params.path))
    t.deepEqual(params.params, {})
    beforeCount++
    store.laoding = true
    store.loaded = true
  })
  vuet.afterEach((err, params) => {
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
})

test('use plugins', t => {
  const vuet = newVuet()
  const arr = ['life', 'local', 'need', 'once', 'route']
  t.deepEqual(Object.keys(Vuet.plugins), arr)
  arr.forEach(name => {
    t.is(Vuet.plugins[name].name, name)
  })

  let useCount = 0
  let initCount = 0
  let destroyCount = 0
  Vuet.use({
    name: 'testPlugin',
    install (_Vue, _Vuet, opt) {
      useCount++
      t.is(Vue, _Vue)
      t.is(Vuet, _Vuet)
      t.deepEqual(opt, { msg: 'ok' })
    },
    init (_vuet) {
      initCount++
      t.is(vuet, _vuet)
    },
    destroy (_vuet) {
      destroyCount++
      t.is(vuet, _vuet)
    }
  }, { msg: 'ok' })
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
