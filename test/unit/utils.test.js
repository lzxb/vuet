import test from 'ava'
import utils from '../../src/utils'

test('getArgMerge', t => {
  t.deepEqual(utils.getArgMerge('name', 'vuet'), { name: 'vuet' })
  t.deepEqual(utils.getArgMerge({ name: 'vuet' }), { name: 'vuet' })
  t.deepEqual(utils.getArgMerge(), {})
  t.deepEqual(utils.getArgMerge({}), {})
})

test('is object', t => {
  t.true(utils.isObject({}))
  t.false(utils.isObject(null))
})
