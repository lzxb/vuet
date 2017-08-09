import test from 'ava'
import util from '../../src/util'

test('getArgMerge', t => {
  t.deepEqual(util.getArgMerge('name'), { name: 'name' })
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
  t.false(util.isPromise(null))
  t.false(util.isPromise(true))
  t.false(util.isPromise(false))
  t.false(util.isPromise(0))
  t.false(util.isPromise([]))

  // object
  t.false(util.isPromise({}))
  t.false(util.isPromise({
    then: {}
  }))
  t.true(util.isPromise({
    then () {}
  }))

  // function
  t.false(util.isPromise(function () {}))
  const myPromise = function () {}
  myPromise.then = function () {}
  t.true(util.isPromise(myPromise))
  myPromise.then = []
  t.false(util.isPromise(myPromise))

  // promise
  t.true(util.isPromise(new Promise(function () {})))
  t.true(util.isPromise(Promise.resolve({})))
})
