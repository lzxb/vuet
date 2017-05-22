import test from 'ava'
import Vue from 'vue'
import Vuet from '../../dist/vuet'

Vue.use(Vuet)

const myModule = 'myModule'
const newVuet = () => {
  return new Vuet({
    data () {
      return {
        laoding: true,
        loaded: true
      }
    },
    modules: {
      [myModule]: {
        route: {
          list: {
            data () {
              return {
                list: []
              }
            }
          },
          detail: {
            data () {
              return {
                detail: {
                  id: null,
                  name: '',
                  age: 0,
                  sex: ''
                }
              }
            }
          }
        }
      }
    }
  })
}

test('install', t => {
  const vuet = newVuet()
  const vm = new Vue({
    vuet
  })
  t.deepEqual(vuet.store, {
    [`${myModule}/route/list`]: {
      laoding: true,
      loaded: true,
      list: []
    },
    [`${myModule}/route/detail`]: {
      laoding: true,
      loaded: true,
      detail: {
        id: null,
        name: '',
        age: 0,
        sex: ''
      }
    }
  })
  t.is(vuet, vm.$options.vuet)
  t.is(vuet, vm._vuet)
  t.is(vuet, vm.$vuet)
})
