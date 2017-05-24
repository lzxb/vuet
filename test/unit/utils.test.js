import test from 'ava'
import utils from '../../src/utils'

test('forEachObj', t => {
  const testObj = { name: 'vuet', info: 'test' }
  const newObj = {}
  utils.forEachObj(testObj, (val, k) => {
    newObj[k] = val
  })
  t.deepEqual(testObj, newObj)
})

test('getArgMerge', t => {
  t.deepEqual(utils.getArgMerge('name', 'vuet'), { name: 'vuet' })
  t.deepEqual(utils.getArgMerge({ name: 'vuet' }), { name: 'vuet' })
  t.deepEqual(utils.getArgMerge(), {})
  t.deepEqual(utils.getArgMerge('name'), {})
  t.deepEqual(utils.getArgMerge('name', true), {})
  t.deepEqual(utils.getArgMerge({}), {})
})

test('is type test', t => {
  t.true(utils.isObject({}))
  t.true(utils.isFunction(() => {}))
  t.true(utils.isString(''))
  t.true(utils.isUndefined(undefined))
  t.true(utils.isNull(null))
})
