import test from 'ava'
import Vue from 'vue'
import Vuet, { mapRules, mapModules } from '../../src/index'
import VuetStore from '../../packages/vuet-store/src/index'

Vue.use(Vuet)

Vuet.rule('store', VuetStore)

global.localStorage = {
  store: {},
  getItem (key) {
    return this.store[key] || null
  },
  setItem (key, data) {
    console.log(key, data, '======')
    this.store[key] = data
  }
}

const delay = (time) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, time)
  })
}

test.serial('one', async t => {
  const vuet = new Vuet()
  vuet.addModules('test', {
    data () {
      return {
        count: 0
      }
    },
    fetch () {
      this.count = 1000
    },
    plus () {
      this.count++
    },
    reduce () {
      this.count--
    }
  })
  const vm = new Vue({
    vuet,
    mixins: [
      mapModules({
        test: 'test' // { 别名： '模块路径' }
      }),
      mapRules({
        store: [{ path: 'test' }], // { 规则: ['模块路径'] }
        once: [{ path: 'test' }]
      })
    ]
  })

  const vtm = vuet.getModule('test')

  t.is(vtm.count, 1000)
  t.is(vm.test.count, 1000)
  await delay(20)
  t.is(localStorage.getItem('__vuet_store_test__'), '{"count":1000}')

  vtm.plus()
  t.is(vtm.count, 1001)
  t.is(vm.test.count, 1001)
  await delay(20)
  t.is(localStorage.getItem('__vuet_store_test__'), '{"count":1001}')

  vtm.reduce()
  t.is(vtm.count, 1000)
  t.is(vm.test.count, 1000)
  await delay(20)
  t.is(localStorage.getItem('__vuet_store_test__'), '{"count":1000}')

  vtm.reset()
  t.is(vtm.count, 0)
  t.is(vm.test.count, 0)
  await delay(20)
  t.is(localStorage.getItem('__vuet_store_test__'), '{"count":0}')

  vtm.fetch()
  t.is(vtm.count, 1000)
  t.is(vm.test.count, 1000)
  await delay(20)
  t.is(localStorage.getItem('__vuet_store_test__'), '{"count":1000}')

  vtm.count = 6666
  t.is(vtm.count, 6666)
  t.is(vm.test.count, 6666)
  await delay(20)
  t.is(localStorage.getItem('__vuet_store_test__'), '{"count":6666}')
})

test.serial('two', async t => {
  const vuet = new Vuet()
  vuet.addModules('test', {
    data () {
      return {
        count: 0
      }
    },
    fetch () {
      this.count = 1000
    },
    plus () {
      this.count++
    },
    reduce () {
      this.count--
    }
  })

  const vtm = vuet.getModule('test')

  t.is(vtm.count, 6666)
  await delay(20)
  t.is(localStorage.getItem('__vuet_store_test__'), '{"count":6666}')

  const vm = new Vue({
    vuet,
    mixins: [
      mapModules({
        test: 'test' // { 别名： '模块路径' }
      }),
      mapRules({
        store: [{ path: 'test' }], // { 规则: ['模块路径'] }
        once: [{ path: 'test' }]
      })
    ]
  })

  t.is(vtm.count, 1000)
  t.is(vm.test.count, 1000)
  await delay(20)
  t.is(localStorage.getItem('__vuet_store_test__'), '{"count":1000}')

  vtm.plus()
  t.is(vtm.count, 1001)
  t.is(vm.test.count, 1001)
  await delay(20)
  t.is(localStorage.getItem('__vuet_store_test__'), '{"count":1001}')

  vtm.reduce()
  t.is(vtm.count, 1000)
  t.is(vm.test.count, 1000)
  await delay(20)
  t.is(localStorage.getItem('__vuet_store_test__'), '{"count":1000}')

  vtm.reset()
  t.is(vtm.count, 0)
  t.is(vm.test.count, 0)
  await delay(20)
  t.is(localStorage.getItem('__vuet_store_test__'), '{"count":0}')

  vtm.fetch()
  t.is(vtm.count, 1000)
  t.is(vm.test.count, 1000)
  await delay(20)
  t.is(localStorage.getItem('__vuet_store_test__'), '{"count":1000}')
})
