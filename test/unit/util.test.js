import test from 'ava'
import util from '../../src/util'

test('getArgMerge', t => {
  t.deepEqual(util.getArgMerge('name', 'vuet'), { name: 'vuet' })
  t.deepEqual(util.getArgMerge({ name: 'vuet' }), { name: 'vuet' })
  t.deepEqual(util.getArgMerge(), {})
  t.deepEqual(util.getArgMerge({}), {})
})

test('is object', t => {
  t.true(util.isObject({}))
  t.false(util.isObject(null))
})

test('is promise', t => {
  t.true(util.isPromise(Promise.resolve()))
})
