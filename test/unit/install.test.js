import Vue from 'vue'
import test from 'ava'
import install, { _Vue } from '../../src/install'
import index from '../../src/index'

test('install', t => {
  Vue.mixin = function mixin (mixin) {
    t.true(typeof mixin.beforeCreate === 'function')
  }
  install(Vue)
  t.is(Vue, _Vue)
  t.is(index.install, install)
})
