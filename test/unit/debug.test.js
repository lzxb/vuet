import test from 'ava'
import Vue from 'vue'
import Vuet from '../../src/index'
import debug from '../../src/debug'

test.serial('error', t => {
  try {
    debug.error('ok')
  } catch (e) {
    t.is(e.toString(), 'Error: [vuet] ok')
  }
})

test.serial('warn', t => {
  const warn = console.warn
  let warnCount = 0
  console.warn = (msg) => {
    warnCount++
    warn.call(console, msg)
  }
  debug.warn('ok')
  t.is(warnCount, 1)
  console.warn = warn
  const env = process.env.NODE_ENV
  process.env.NODE_ENV = 'production'
  debug.warn('warn ok')
  process.env.NODE_ENV = env
  t.pass()
})

test.serial('assertVue', t => {
  try {
    debug.assertVue()
  } catch (e) {
    t.is(e.toString(), 'Error: [vuet] must call Vue.use(Vuet) before creating a store instance')
  }
  Vue.use(Vuet)
  debug.assertVue()
})

test.serial('assertModule', t => {
  const vuet = new Vuet()
  vuet.addModules('test', {
    data () {
      return true
    }
  })
  t.true(vuet.getModule('test').state)
  debug.assertModule(vuet, 'test')
  try {
    debug.assertModule(vuet, 'ok')
  } catch (e) {
    t.is(e.toString(), 'Error: [vuet] The \'ok\' module does not exist')
  }
})

test.serial('assertPromise', t => {
  debug.assertPromise()
  const Promise = global.Promise
  global.Promise = undefined
  try {
    debug.assertPromise()
  } catch (e) {
    t.is(e.toString(), 'Error: [vuet] Vuet requires a Promise polyfill in this browser')
  }
  global.Promise = Promise
  debug.assertPromise()
})
