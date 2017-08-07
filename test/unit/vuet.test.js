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
  t.deepEqual(Object.keys(vuet.modules), ['test', `test${pathJoin}chlid`, 'myTest'])

  // test => vuet
  vuet.getModule('test').plus()
  t.deepEqual(vuet.getState('test'), { count: 1 })
  t.deepEqual(vm.test, { count: 1 })
  vuet.getModule('test').reset()
  t.deepEqual(vuet.getState('test'), { count: 0 })
  t.deepEqual(vm.test, { count: 0 })
  //  test => vm
  vm.$test.plus()
  t.deepEqual(vuet.getState('test'), { count: 1 })
  t.deepEqual(vm.test, { count: 1 })
  vm.$test.reset()
  t.deepEqual(vuet.getState('test'), { count: 0 })
  t.deepEqual(vm.test, { count: 0 })

  // test/chlid => vuet
  vuet.getModule(`test${pathJoin}chlid`).plus()
  t.deepEqual(vuet.getState(`test${pathJoin}chlid`), { count: 1 })
  t.deepEqual(vm.chlid, { count: 1 })
  vuet.getModule(`test${pathJoin}chlid`).reset()
  t.deepEqual(vuet.getState(`test${pathJoin}chlid`), { count: 0 })
  t.deepEqual(vm.chlid, { count: 0 })
  //  test/chlid => vm
  vm.$chlid.plus()
  t.deepEqual(vuet.getState(`test${pathJoin}chlid`), { count: 1 })
  t.deepEqual(vm.chlid, { count: 1 })
  vm.$chlid.reset()
  t.deepEqual(vuet.getState(`test${pathJoin}chlid`), { count: 0 })
  t.deepEqual(vm.chlid, { count: 0 })

  // myTest => vuet
  vuet.getModule('myTest').plus()
  t.deepEqual(vuet.getState('myTest'), { count: 1 })
  t.deepEqual(vm.myTest, { count: 1 })
  vuet.getModule('myTest').reset()
  t.deepEqual(vuet.getState('myTest'), { count: 0 })
  t.deepEqual(vm.myTest, { count: 0 })
  //  myTest => vm
  vm.$myTest.plus()
  t.deepEqual(vuet.getState('myTest'), { count: 1 })
  t.deepEqual(vm.myTest, { count: 1 })
  vm.$myTest.reset()
  t.deepEqual(vuet.getState('myTest'), { count: 0 })
  t.deepEqual(vm.myTest, { count: 0 })
}

test('base', t => {
  baseExample(t, '/')
})

test('set path join', t => {
  baseExample(t, '-')
})

test('static attrs', t => {
  t.deepEqual(Object.keys(Vuet.options), ['rules'])
  t.deepEqual(Object.keys(Vuet.options.rules), ['life', 'need', 'once'])
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
  t.deepEqual(Object.keys(Vuet.options.rules), ['life', 'need', 'once', 'myRule1', 'myRule2'])
})
