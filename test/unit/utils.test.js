import test from 'ava'
import utils from '../../src/utils'

test('isObject', t => {
  t.is(utils.isObject({}), true)
})

test('isArray', t => {
  t.is(utils.isArray([]), true)
})

test('isFunction', t => {
  t.is(utils.isFunction(function () {}), true)
})
