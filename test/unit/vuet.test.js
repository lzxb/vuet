import test from 'ava'
import Vue from 'vue'
import Vuet, { mapRules, mapModules } from '../../src/index'

test.before(() => {
  Vue.use(Vuet)
})

test('is installed', t => {
  t.true(Vuet.installed)
  Vue.use(Vuet)
  t.true(Vuet.installed)
  Vuet.install(Vue)
  t.true(Vuet.installed)
})

function baseExample (t, pathJoin = '/') {
  const opts = {
    modules: {
      test: {
        data () {
          return {
            count: 0
          }
        },
        plus () {
          this.count++
        },
        modules: {
          chlid: {
            data () {
              return {
                count: 0
              }
            },
            plus () {
              this.count++
            }
          }
        }
      }
    }
  }
  if (pathJoin !== '/') {
    opts.pathJoin = pathJoin
  }
  const vuet = new Vuet(opts)
  vuet.addModules('myTest', {
    data () {
      return {
        count: 0
      }
    },
    plus () {
      this.count++
    }
  })
  t.is(vuet.app, null)
  const vm = new Vue({
    mixins: [
      mapModules({
        test: 'test',
        chlid: `test${pathJoin}chlid`,
        myTest: 'myTest'
      })
    ],
    vuet
  })
  t.is(vuet, vm.$vuet)
  t.is(vuet.app, vm)
  t.true(vuet.vm instanceof Vue)
  t.deepEqual(Object.keys(vuet.modules), [`test${pathJoin}chlid`, 'test', 'myTest'])

  // test => vuet
  const test = vuet.getModule('test')
  test.plus()
  t.is(test.count, 1)
  t.is(test.state.count, 1)
  t.is(vm.test.count, 1)
  t.is(vm.test.state.count, 1)
  test.reset()
  t.is(test.count, 0)
  t.is(test.state.count, 0)
  t.is(vm.test.count, 0)
  t.is(vm.test.state.count, 0)
  // test => vm
  vm.test.plus()
  t.is(test.count, 1)
  t.is(test.state.count, 1)
  t.is(vm.test.count, 1)
  t.is(vm.test.state.count, 1)
  vm.test.reset()
  t.is(test.count, 0)
  t.is(test.state.count, 0)
  t.is(vm.test.count, 0)
  t.is(vm.test.state.count, 0)

  // test => vuet
  const chlid = vuet.getModule(`test${pathJoin}chlid`)
  chlid.plus()
  t.is(chlid.count, 1)
  t.is(chlid.state.count, 1)
  t.is(vm.chlid.count, 1)
  t.is(vm.chlid.state.count, 1)
  chlid.reset()
  t.is(chlid.count, 0)
  t.is(chlid.state.count, 0)
  t.is(vm.chlid.count, 0)
  t.is(vm.chlid.state.count, 0)
  // chlid => vm
  vm.chlid.plus()
  t.is(chlid.count, 1)
  t.is(chlid.state.count, 1)
  t.is(vm.chlid.count, 1)
  t.is(vm.chlid.state.count, 1)
  vm.chlid.reset()
  t.is(chlid.count, 0)
  t.is(chlid.state.count, 0)
  t.is(vm.chlid.count, 0)
  t.is(vm.chlid.state.count, 0)

  // myTest => vuet
  const myTest = vuet.getModule('myTest')
  myTest.plus()
  t.is(myTest.count, 1)
  t.is(myTest.state.count, 1)
  t.is(vm.myTest.count, 1)
  t.is(vm.myTest.state.count, 1)
  myTest.reset()
  t.is(myTest.count, 0)
  t.is(myTest.state.count, 0)
  t.is(vm.myTest.count, 0)
  t.is(vm.myTest.state.count, 0)
  // myTest => vm
  vm.myTest.plus()
  t.is(myTest.count, 1)
  t.is(myTest.state.count, 1)
  t.is(vm.myTest.count, 1)
  t.is(vm.myTest.state.count, 1)
  vm.myTest.reset()
  t.is(myTest.count, 0)
  t.is(myTest.state.count, 0)
  t.is(vm.myTest.count, 0)
  t.is(vm.myTest.state.count, 0)

  // set state
  vm.test.count = 1001
  vm.chlid.count = 1002
  vm.myTest.count = 1003
  t.is(test.count, 1001)
  t.is(chlid.count, 1002)
  t.is(myTest.count, 1003)

  // addModules error
  let errMsg = ''
  try {
    vuet.addModules('notData', {})
  } catch (e) {
    errMsg = e.toString()
  }
  t.is(errMsg, '')

  // set module value error
  try {
    vm.test = 'ok'
  } catch (e) {
    errMsg = e.toString()
  }
  t.is(errMsg, 'Error: [__name__] The\'test\'module is not allowed to assign')
}

test('base', t => {
  const vuet = new Vuet({
    modules: false
  })
  t.deepEqual(vuet.__once__, [])
  baseExample(t, '/')
})

test('set path join', t => {
  baseExample(t, '-')
})

test('static attrs', t => {
  t.deepEqual(Object.keys(Vuet.options), ['rules', 'module'])
  t.deepEqual(Object.keys(Vuet.options.rules), ['need', 'once', 'temp', 'reset'])
  Vuet
    .rule('myRule1', {
      rule ({ path }) {
        return {}
      }
    })
    .rule('myRule2', {
      rule ({ path }) {
        return {}
      }
    })
  t.deepEqual(Object.keys(Vuet.options.rules), ['need', 'once', 'temp', 'reset', 'myRule1', 'myRule2'])
})

test('mapModules', t => {
  const mixin = Vuet.mapModules({
    list: 'list',
    detail: 'detail'
  })
  const rules = Vuet.mapRules({
    temp: 'list',
    need: ['detail', { path: 'myPath' }],
    once: { path: 'myPath' }
  })
  t.is(JSON.stringify(mixin), '{"mixins":[{"computed":{"list":{}}},{"computed":{"detail":{}}}]}')
  t.is(JSON.stringify(rules), '{"mixins":[{},{},{},{}]}')
})

test('callRuleHook', t => {
  let installed = false
  let initBtn = false
  let destroyed = false
  let myCallBtn = false
  const myRule = {
    install () {
      t.is(arguments[0], Vuet)
      installed = !installed
    },
    init () {
      t.true(arguments[0] instanceof Vuet)
      initBtn = !initBtn
    },
    destroy () {
      t.true(arguments[0] instanceof Vuet)
      destroyed = !destroyed
    },
    myCall () {
      t.true(arguments[0] instanceof Vuet)
      myCallBtn = !myCallBtn
    }
  }
  Vuet.rule('myRule', myRule)

  t.true(installed)
  t.false(initBtn)
  t.false(destroyed)
  t.false(myCallBtn)

  const vuet = new Vuet()
  t.true(installed)
  t.true(initBtn)
  t.false(destroyed)
  t.false(myCallBtn)

  new Vue({ vuet }).$destroy()
  t.true(installed)
  t.true(initBtn)
  t.true(destroyed)
  t.false(myCallBtn)

  Vuet.callRuleHook('myCall', vuet)
  t.true(installed)
  t.true(initBtn)
  t.true(destroyed)
  t.true(myCallBtn)

  t.is(Vuet.options.rules.myRule, myRule)
})

test.cb('rules', t => {
  const vuet = new Vuet()
  const opts = {
    data () {
      return 0
    },
    fetch () {
      this.state++
    }
  }
  vuet.addModules('need', opts)
  vuet.addModules('once', opts)
  vuet.addModules('temp', opts)
  vuet.addModules('reset', opts)
  vuet.addModules('oncePromise', {
    data () {
      return 0
    },
    async fetch () {
      return new Promise((resolve) => {
        setTimeout(() => {
          this.state++
          resolve()
        }, 30)
      })
    }
  })
  let vm = new Vue({
    vuet,
    mixins: [
      mapRules({
        need: 'need',
        once: ['once', 'oncePromise'],
        temp: 'temp',
        reset: 'reset'
      })
    ],
    beforeCreate () {
      this.$vuet.getModule('reset').fetch()
    }
  })

  t.is(vuet.getState('need'), 1)
  t.is(vm.$vuet.getState('need'), 1)
  t.is(vuet.getState('once'), 1)
  t.is(vm.$vuet.getState('once'), 1)
  t.is(vuet.getState('oncePromise'), 0)
  t.is(vm.$vuet.getState('oncePromise'), 0)
  t.is(vuet.getState('temp'), 1)
  t.is(vm.$vuet.getState('temp'), 1)
  t.is(vuet.getState('reset'), 1)
  t.is(vm.$vuet.getState('reset'), 1)

  vm.$destroy()
  t.is(vuet.getState('need'), 1)
  t.is(vm.$vuet.getState('need'), 1)
  t.is(vuet.getState('once'), 1)
  t.is(vm.$vuet.getState('once'), 1)
  t.is(vuet.getState('oncePromise'), 0)
  t.is(vm.$vuet.getState('oncePromise'), 0)
  t.is(vuet.getState('temp'), 0)
  t.is(vm.$vuet.getState('temp'), 0)
  t.is(vuet.getState('reset'), 0)
  t.is(vm.$vuet.getState('reset'), 0)

  vm = new Vue({
    mixins: [
      mapRules({
        need: 'need',
        once: 'once',
        temp: 'temp',
        reset: 'reset'
      })
    ],
    vuet
  })

  vm.$vuet.getModule('reset').fetch()

  t.is(vuet.getState('need'), 2)
  t.is(vm.$vuet.getState('need'), 2)
  t.is(vuet.getState('once'), 1)
  t.is(vm.$vuet.getState('once'), 1)
  t.is(vuet.getState('oncePromise'), 0)
  t.is(vm.$vuet.getState('oncePromise'), 0)
  t.is(vuet.getState('temp'), 1)
  t.is(vm.$vuet.getState('temp'), 1)
  t.is(vuet.getState('reset'), 1)
  t.is(vm.$vuet.getState('reset'), 1)

  setTimeout(() => {
    t.is(vuet.getState('need'), 2)
    t.is(vm.$vuet.getState('need'), 2)
    t.is(vuet.getState('once'), 1)
    t.is(vm.$vuet.getState('once'), 1)
    t.is(vuet.getState('oncePromise'), 1)
    t.is(vm.$vuet.getState('oncePromise'), 1)
    t.is(vuet.getState('temp'), 1)
    t.is(vm.$vuet.getState('temp'), 1)
    t.is(vuet.getState('reset'), 1)
    t.is(vm.$vuet.getState('reset'), 1)

    vm.$destroy()
    t.is(vuet.getState('need'), 2)
    t.is(vm.$vuet.getState('need'), 2)
    t.is(vuet.getState('once'), 1)
    t.is(vm.$vuet.getState('once'), 1)
    t.is(vuet.getState('oncePromise'), 1)
    t.is(vm.$vuet.getState('oncePromise'), 1)
    t.is(vuet.getState('temp'), 0)
    t.is(vm.$vuet.getState('temp'), 0)
    t.is(vuet.getState('reset'), 0)
    t.is(vm.$vuet.getState('reset'), 0)
    t.end()
  }, 100)
})

test('attr', t => {
  const vuet = new Vuet()
  t.is(vuet.app, null)
  const vm = new Vue({ vuet })
  t.is(vuet.app, vm)
  t.true(vuet.vm instanceof Vue)

  vuet.addModules('test', {
    data () {
      return {
        count: 0
      }
    }
  })
  t.deepEqual(vuet.store.test, { count: 0 })
  t.deepEqual(vuet.getState('test'), { count: 0 })
  t.is(vuet.store.test, vuet.getState('test'))
  t.is(vuet.getModule('test').app, vm)
  t.is(vuet.getModule('test').app, vuet.app)
  t.is(vuet.getModule('test').vuet, vuet)
})

test('already exists on the object', t => {
  const warn = console.warn
  let warnMsg = 0
  console.warn = (msg) => {
    warnMsg = msg
    warn.call(console, msg)
  }
  const vuet = new Vuet({
    modules: {
      test: {
        data () {
          return {
            data: []
          }
        }
      }
    }
  })
  t.is(warnMsg, '[__name__] \'test\' the \'data\' already exists on the object')
  console.warn = warn

  t.true(typeof vuet.getModule('test').data === 'function')
  t.true(Array.isArray(vuet.getModule('test').state.data))
})

test('root vue app', t => {
  const vuet = new Vuet()
  const vm = new Vue({
    vuet
  })
  t.is(vm._vuet, vm.$vuet)
  vm.$destroy()
  t.is(vm._vuet, vm.$vuet)

  const vm2 = new Vue({
    vuet: Vuet
  })
  t.is(vm2._vuet, undefined)
  t.is(vm2.$vuet, undefined)
  vm2.$destroy()
  t.is(vm2._vuet, undefined)
  t.is(vm2.$vuet, undefined)
})

test('The rule does not exist', t => {
  let errMsg = ''
  try {
    mapRules({
      notRule: 'test'
    })
  } catch (e) {
    errMsg = e.toString()
  }
  t.is(errMsg, 'Error: [__name__] The\'notRule\'rule does not exist. Please make sure that it executes \'Vuet.rule(\'notRule\', opts)\' before all components')
})

test('add module public function', t => {
  Vuet.options.module.plus = function () {
    this.count++
  }

  const vuet = new Vuet({
    modules: {
      test: {
        data () {
          return {
            count: 0
          }
        }
      }
    }
  })
  const vtm = vuet.getModule('test')
  t.is(vtm.count, 0)
  vtm.plus()
  t.is(vtm.count, 1)
  vtm.reset()
  t.is(vtm.count, 0)
})
