import test from 'ava'
import Vue from 'vue'
import Vuet, { mapModules } from '../../src/index'

test.before(() => {
  Vue.use(Vuet)
})

test('is installed', t => {
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
  if (pathJoin !== '/') {
    opts.pathJoin = pathJoin
  }
  const vuet = new Vuet(opts)
  vuet.register('myTest', {
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
  t.deepEqual(Object.keys(vuet.modules), ['test', `test${pathJoin}chlid`, 'myTest'])

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
}

test('base', t => {
  baseExample(t, '/')
})

test('set path join', t => {
  baseExample(t, '-')
})

test('static attrs', t => {
  t.deepEqual(Object.keys(Vuet.options), ['rules'])
  t.deepEqual(Object.keys(Vuet.options.rules), ['temp', 'need', 'once'])
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
  t.deepEqual(Object.keys(Vuet.options.rules), ['temp', 'need', 'once', 'myRule1', 'myRule2'])
})

test('mapModules', t => {
  const mixin = Vuet.mapModules({
    list: 'list',
    detail: 'detail'
  })
  const rules = Vuet.mapRules({
    temp: 'list',
    need: 'detail'
  })
  t.is(JSON.stringify(mixin), '{"mixins":[{"computed":{"list":{}}},{"computed":{"detail":{}}}]}')
  t.is(JSON.stringify(rules), '{"mixins":[{},{}]}')
  t.pass()
})

test('callRuleHook', t => {
  let installed = false
  // let inited = false
  Vuet.rule('myRule', {
    install () {
      t.is(arguments[0], Vuet)
      installed = true
    },
    init () {
      t.true(arguments[0] instanceof Vuet)
      // inited = true
    }
  })
  t.true(installed)
  // t.pass()
})
