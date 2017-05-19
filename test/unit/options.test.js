import test from 'ava'
import options from '../../src/options'

test('default return', t => {
  const opt = options({})
  t.is(opt.pagekey, 'page')
  t.is(opt.queryKey, 'query')
  t.true(typeof opt.fetchBefore === 'function')
  t.true(typeof opt.fetchAfter === 'function')
  t.true(typeof opt.baseData === 'function')
  t.true(typeof opt.baseListData === 'function')
  t.true(typeof opt.baseDetailData === 'function')
  t.true(typeof opt.fetchSuccess === 'function')
  t.deepEqual(opt.modules, {})
})

test('set param', t => {
  const modules = {
    test: {
      list: {},
      detail: {}
    }
  }
  const opt = options({
    pagekey: 'p',
    queryKey: 'q',
    detailKey: 'uuid',
    modules
  })
  t.is(opt.pagekey, 'p')
  t.is(opt.queryKey, 'q')
  t.is(opt.detailKey, 'uuid')
  t.deepEqual(opt.modules, modules)
})
