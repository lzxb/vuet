import { _key } from './route'
import utils from '../../utils'
import debug from '../../debug'

function mergeScrolls (scrolls) {
  return Object.assign({ x: 0, y: 0 }, scrolls)
}

function initScroll (el, vnode, { path, name }, scrolls) {
  const { context } = vnode
  let scrollPath = context.$vuet[_key].scrolls[path]
  if (!name || !context) return
  if (!scrollPath[name]) {
    scrollPath[name] = mergeScrolls(scrolls)
  }
  scrollTo(el, scrollPath[name])
  return scrollPath[name]
}

function updateScroll (scrolls, event) {
  const { scrollTop, scrollLeft, pageXOffset, pageYOffset } = event.target
  scrolls.x = scrollLeft || pageYOffset || scrollLeft
  scrolls.y = scrollTop || pageXOffset || scrollTop
}

export function syncAllNameScroll (vm, { path, name }) {
  if (!vm) return
  const scrolls = vm.$vuet[_key].scrolls[path][name]
  document.querySelectorAll(`[data-vuet-route-scroll=${name}]`).forEach(el => {
    scrollTo(el, scrolls)
  })
}

function updateWindowScroll (scrolls, event) {
  scrolls.x = window.pageXOffset
  scrolls.y = window.pageYOffset
}

export function scrollTo (el, scrolls) {
  if ('scrollTop' in el && el !== window) {
    el.scrollLeft = scrolls.x
    el.scrollTop = scrolls.y
  } else {
    el.scrollTo(scrolls.x, scrolls.y)
  }
}

function isSelf (modifiers) {
  return modifiers.window !== true || modifiers.self
}

function isWindow (modifiers) {
  return modifiers.window
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
    if (isSelf(modifiers)) {
      if (value.name === '__window__') {
        return debug.error('name not __window__')
      }
      if (!value.name) {
        return debug.error('Name is imperative parameter')
      }
      if (utils.isObject(value.self)) {
        el.__vuetRouteSelfScrolls__ = value.self
      }
      const areaScrolls = initScroll(el, vnode, value, el.__vuetRouteScrolls__)
      el.dataset.vuetRouteScroll = value.name
      el.__vuetRouteSelfScroll__ = event => {
        updateScroll(areaScrolls, event)
        if (utils.isObject(el.__vuetRouteSelfScrolls__)) {
          updateScroll(el.__vuetRouteSelfScrolls__, event)
        }
        syncAllNameScroll(vnode.context, value)
      }
      el.addEventListener('scroll', el.__vuetRouteSelfScroll__, false)
    }

    if (isWindow(modifiers)) {
      if (utils.isObject(value.window)) {
        el.__vuetRouteWindowScrolls__ = value.window
      }
      const windowScrolls = initScroll(
        window,
        vnode,
        Object.assign({}, value, { name: '__window__' }),
        el.__vuetRouteWindowScrolls__
      )
      el.__vuetRouteWindowScroll__ = event => {
        updateWindowScroll(windowScrolls, event)
        if (utils.isObject(el.__vuetRouteWindowScrolls__)) {
          updateWindowScroll(el.__vuetRouteWindowScrolls__, event)
        }
      }
      window.addEventListener('scroll', el.__vuetRouteWindowScroll__, false)
    }
  },
  componentUpdated (el, { modifiers, value }, vnode) {
    if (isSelf(modifiers) && utils.isObject(value.self)) {
      el.__vuetRouteSelfScrolls__ = value.self
      scrollTo(el, el.__vuetRouteSelfScrolls__)
    }
    if (isWindow(modifiers) && utils.isObject(value.window)) {
      el.__vuetRouteWindowScrolls__ = value.window
      scrollTo(window, el.__vuetRouteWindowScrolls__)
    }
  },
  unbind (el) {
    if (typeof el.__vuetRouteSelfScroll__ === 'function') {
      el.removeEventListener('scroll', el.__vuetRouteSelfScroll__, false)
      delete el.__vuetRouteSelfScroll__
      delete el.__vuetRouteSelfScrolls__
    }
    if (typeof el.__vuetRouteWindowScroll__ === 'function') {
      window.removeEventListener('scroll', el.__vuetRouteWindowScroll__, false)
      delete el.__vuetRouteWindowScroll__
      delete el.__vuetRouteWindowScrolls__
    }
  }
}
