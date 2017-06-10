import { _key } from './route'
import utils from '../../utils'
import debug from '../../debug'

function initScroll (el, vnode, { path, name }) {
  const { context } = vnode
  let scrollPath = context.$vuet[_key].scrolls[path]
  if (!name || !context) return
  if (!scrollPath[name]) {
    scrollPath[name] = { scrollTop: 0, scrollLeft: 0 }
  }
  const scrolls = scrollPath[name]
  setTimeout(() => {
    scrollTo(el, scrolls)
  }, 0)
  return scrolls
}

function updateScroll (scrolls, event) {
  const { scrollTop, scrollLeft, pageXOffset, pageYOffset } = event.target
  scrolls.scrollLeft = scrollLeft || pageYOffset || scrollLeft
  scrolls.scrollTop = scrollTop || pageXOffset || scrollTop
}

function updateWindowScroll (scrolls, event) {
  scrolls.scrollLeft = window.pageXOffset
  scrolls.scrollTop = window.pageYOffset
}

export function scrollTo (el, scrolls) {
  if ('scrollTop' in el && el !== window) {
    Object.assign(el, scrolls)
  } else {
    el.scrollTo(scrolls.scrollLeft, scrolls.scrollTop)
  }
}

export default {
  inserted (el, { modifiers, value }, vnode) {
    if (process.env.NODE_ENV !== 'production') {
      if (!utils.isObject(value)) {
        return debug.error('Parameter is the object type')
      }
      if (!utils.isString(value.path)) {
        return debug.error('Ptah is imperative parameter')
      }
    }
    if (modifiers.window !== true || modifiers.self) {
      if (value.name === '__window__') {
        return debug.error('name not __window__')
      }
      if (!value.name) {
        return debug.error('Name is imperative parameter')
      }
      const areaScrolls = initScroll(el, vnode, value)
      el.__vuetRouteScroll__ = event => {
        updateScroll(areaScrolls, event)
      }
      el.addEventListener('scroll', el.__vuetRouteScroll__, false)
    }
    if (modifiers.window) {
      const windowScrolls = initScroll(window, vnode, Object.assign({}, value, { name: '__window__' }))
      el.__vuetRouteScrollWindow__ = event => {
        updateWindowScroll(windowScrolls, event)
      }
      window.addEventListener('scroll', el.__vuetRouteScrollWindow__, false)
    }
  },
  unbind (el) {
    if (typeof el.__vuetRouteScroll__ === 'function') {
      el.removeEventListener('scroll', el.__vuetRouteScroll__, false)
      delete el.__vuetRouteScroll__
    }
    if (typeof el.__vuetRouteScrollWindow__ === 'function') {
      window.removeEventListener('scroll', el.__vuetRouteScrollWindow__, false)
      delete el.__vuetRouteScrollWindow__
    }
  }
}
