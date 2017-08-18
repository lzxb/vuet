import test from 'ava'
import Vue from 'vue'
import Vuet, { mapRules } from '../../src/index'
import VuetRoute from '../../packages/vuet-route/src/index'

Vue.use(Vuet)

Vuet.rule('route', VuetRoute)

test.serial('add rule', t => {
  t.is(Vuet.options.rules.route, VuetRoute)
})

test.serial('all error msg', t => {
  const vuet = new Vuet()
  vuet.addModules('test', {
    data () {
      return 0
    },
    fetch () {}
  })
  let errMsg = ''
  let vm = null
  try {
    vm = new Vue({
      vuet,
      mixins: [
        mapRules({
          route: 'test'
        })
      ]
    })
  } catch (e) {
    errMsg = e.toString()
  }
  t.is(errMsg, 'Error: [__name__] The \'vue-router\' module is not installed')
  // Analog routing
  Vue.prototype.$route = new Vue({
    data () {
      return {
        fullPath: '/',
        query: {},
        params: {}
      }
    },
    fetch () {}
  }).$data
  try {
    vm = new Vue({
      vuet,
      mixins: [
        mapRules({
          route: 'test'
        })
      ]
    })
  } catch (e) {
    errMsg = e.toString()
  }
  t.is(errMsg, 'Error: [__name__] \'test\' module state must be the object type')

  vuet.addModules('testFetch', {
    data () {
      return {
        list: []
      }
    }
  })
  try {
    vm = new Vue({
      vuet,
      mixins: [
        mapRules({
          route: 'testFetch'
        })
      ]
    })
  } catch (e) {
    errMsg = e.toString()
  }
  t.is(vm, null)
  t.is(errMsg, 'Error: [__name__] \'testFetch\' module \'fetch\' must be the function type')
})

test.serial('default init', async t => {
  const vuet = new Vuet()
  vuet.addModules('test', {
    data () {
      return {
        list: []
      }
    },
    count: 0,
    fetch () {
      this.count++
      this.list.push(this.list.length)
    }
  })
  t.deepEqual(vuet.__route__, { test: [] })
  t.deepEqual(vuet.getModule('test').state, { list: [] })
  const vm = new Vue({
    vuet,
    mixins: [
      mapRules({
        route: 'test'
      })
    ]
  })
  t.is(vuet.getModule('test').count, 1)
  t.deepEqual(vuet.getModule('test').state, { list: [0], __routeLoaded__: true })
  t.deepEqual(vuet.__route__, { test: [ '"/"' ] })

  Vue.prototype.$route.fullPath = '/test'
  await vm.$nextTick()
  t.is(vuet.getModule('test').count, 2)
  t.deepEqual(vuet.getModule('test').state, { list: [0], __routeLoaded__: true })
  t.deepEqual(vuet.__route__, { test: [ '"/test"' ] })
  Vue.prototype.$route.fullPath = '/'
})

test.serial('setting watch', async t => {
  const vuet = new Vuet()
  vuet.addModules('test', {
    data () {
      return {
        list: []
      }
    },
    count: 0,
    route: {
      watch: 'query'
    },
    fetch () {
      this.count++
      this.list.push(this.list.length)
    }
  })
  t.deepEqual(vuet.__route__, { test: [] })
  t.deepEqual(vuet.getModule('test').state, { list: [] })

  let vm = new Vue({
    vuet,
    mixins: [
      mapRules({
        route: 'test'
      })
    ]
  })
  t.is(vuet.getModule('test').count, 1)
  t.deepEqual(vuet.getModule('test').state, { list: [0], __routeLoaded__: true })
  t.deepEqual(vuet.__route__, { test: [ '{}' ] })

  Vue.prototype.$route.query = { tab: 'all' }
  await vm.$nextTick()
  t.is(vuet.getModule('test').count, 2)
  t.deepEqual(vuet.getModule('test').state, { list: [0], __routeLoaded__: true })
  t.deepEqual(vuet.__route__, { test: [ '{"tab":"all"}' ] })

  Vue.prototype.$route.query = { tab: 'all' }
  await vm.$nextTick()
  t.is(vuet.getModule('test').count, 2)
  t.deepEqual(vuet.getModule('test').state, { list: [0], __routeLoaded__: true })
  t.deepEqual(vuet.__route__, { test: [ '{"tab":"all"}' ] })

  Vue.prototype.$route.query = { tab: 'end' }
  await vm.$nextTick()
  t.is(vuet.getModule('test').count, 3)
  t.deepEqual(vuet.getModule('test').state, { list: [0], __routeLoaded__: true })
  t.deepEqual(vuet.__route__, { test: [ '{"tab":"end"}' ] })

  vm.$destroy()
  vm = new Vue({
    vuet,
    mixins: [
      mapRules({
        route: 'test'
      })
    ]
  })

  t.is(vuet.getModule('test').count, 4)
  t.deepEqual(vuet.getModule('test').state, { list: [0, 1], __routeLoaded__: true })
  t.deepEqual(vuet.__route__, { test: [ '{"tab":"end"}' ] })

  Vue.prototype.$route.query = {}
  await vm.$nextTick()
})

test.serial('setting once=true', async t => {
  const vuet = new Vuet()
  vuet.addModules('test', {
    data () {
      return {
        list: []
      }
    },
    count: 0,
    route: {
      watch: 'query',
      once: true
    },
    fetch () {
      this.count++
      this.list.push(this.list.length)
    }
  })
  t.deepEqual(vuet.__route__, { test: [] })
  t.deepEqual(vuet.getModule('test').state, { list: [] })

  let vm = new Vue({
    vuet,
    mixins: [
      mapRules({
        route: 'test'
      })
    ]
  })
  t.is(vuet.getModule('test').count, 1)
  t.deepEqual(vuet.getModule('test').state, { list: [0], __routeLoaded__: true })
  t.deepEqual(vuet.__route__, { test: [ '{}' ] })

  Vue.prototype.$route.query = { tab: 'all' }
  await vm.$nextTick()
  t.is(vuet.getModule('test').count, 2)
  t.deepEqual(vuet.getModule('test').state, { list: [0], __routeLoaded__: true })
  t.deepEqual(vuet.__route__, { test: [ '{"tab":"all"}' ] })

  Vue.prototype.$route.query = { tab: 'all' }
  await vm.$nextTick()
  t.is(vuet.getModule('test').count, 2)
  t.deepEqual(vuet.getModule('test').state, { list: [0], __routeLoaded__: true })
  t.deepEqual(vuet.__route__, { test: [ '{"tab":"all"}' ] })

  Vue.prototype.$route.query = { tab: 'end' }
  await vm.$nextTick()
  t.is(vuet.getModule('test').count, 3)
  t.deepEqual(vuet.getModule('test').state, { list: [0], __routeLoaded__: true })
  t.deepEqual(vuet.__route__, { test: [ '{"tab":"end"}' ] })

  vm.$destroy()
  vm = new Vue({
    vuet,
    mixins: [
      mapRules({
        route: 'test'
      })
    ]
  })

  t.is(vuet.getModule('test').count, 3)
  t.deepEqual(vuet.getModule('test').state, { list: [0], __routeLoaded__: true })
  t.deepEqual(vuet.__route__, { test: [ '{"tab":"end"}' ] })

  Vue.prototype.$route.query = {}
})
