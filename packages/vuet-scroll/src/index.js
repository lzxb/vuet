import debug from '../../../src/debug'
import util from '../../../src/util'

let _Vue
const _self = '__vuetScrollSelf__'
const _window = '__vuetScrollWindow__'

class VuetScroll {
  constructor (opts) {
    this.timer = {}
    this.setOption(opts)
    this.scrollTo()
    this.subScroll()
  }
  update (opts) {
    this.setOption(opts)
    const key = `timer-${this.path}-${this.name}`
    clearTimeout(this.timer[key])
    this.timer[key] = setTimeout(() => {
      this.scrollTo()
      delete this.timer[key]
    }, 10)
  }
  destroy () {
    this.app.removeEventListener('scroll', this.subScrolling, false)
  }
  setOption (opt) {
    this.app = opt.app
    this.path = opt.path
    this.name = opt.name || ''
    this.store = opt.store || { x: 0, y: 0 }
    this.scrolls = opt.scrolls || createScroll(opt)
    function createScroll (opt) {
      if (!opt.store.$scroll) {
        _Vue.set(opt.store, '$scroll', {})
      }
      if (!opt.store.$scroll[opt.name]) {
        _Vue.set(opt.store.$scroll, opt.name, { x: 0, y: 0 })
      }

      return opt.store.$scroll[opt.name]
    }
  }
  scrollTo () {
    const { app, scrolls } = this
    if ('scrollTop' in app && app !== window) {
      app.scrollLeft = scrolls.x
      app.scrollTop = scrolls.y
    } else {
      app.scrollTo(scrolls.x, scrolls.y)
    }
  }
  subScroll () {
    const { app } = this
    const newScrolls = { x: 0, y: 0 }
    this.subScrolling = (event) => {
      if (app === window) {
        newScrolls.x = window.pageXOffset
        newScrolls.y = window.pageYOffset
      } else {
        const { scrollTop, scrollLeft, pageXOffset, pageYOffset } = event.target
        newScrolls.x = scrollLeft || pageYOffset || scrollLeft
        newScrolls.y = scrollTop || pageXOffset || scrollTop
      }
      Object.assign(this.scrolls, newScrolls)
    }
    app.addEventListener('scroll', this.subScrolling, false)
  }
}

function isSelf (modifiers) {
  return !!(modifiers.window !== true || modifiers.self)
}

function isWindow (modifiers) {
  return !!(modifiers.window)
}

const directive = {
  inserted (el, { modifiers, value }, vnode) {
    if (typeof value.path !== 'string') return debug.error('path is imperative parameter and is string type')
    if (value.path === 'window') return debug.error('name cannot be the window name')
    const store = vnode.context.$vuet.getState(value.path)
    if (!util.isObject(store)) return debug.error(`'${value.path}' The module is not an object`)
    if (isSelf(modifiers)) {
      if (typeof value.name !== 'string') return debug.error('name is imperative parameter and is string type')
      el[_self] = new VuetScroll({
        app: el,
        path: value.path,
        name: value.name,
        store,
        scrolls: value.self
      })
    }
    if (isWindow(modifiers)) {
      el[_window] = new VuetScroll({
        app: window,
        path: value.path,
        name: 'window',
        store,
        scrolls: value.window
      })
    }
  },
  componentUpdated (el, { modifiers, value }, vnode) {
    const store = vnode.context.$vuet.getState(value.path)
    if (!util.isObject(store)) return debug.error(`'${value.path}' The module is not an object`)
    if (isSelf(modifiers)) {
      el[_self].update({
        app: el,
        path: value.path,
        name: value.name,
        store,
        scrolls: value.self
      })
    }
    if (isWindow(modifiers)) {
      el[_window].update({
        app: window,
        path: value.path,
        name: 'window',
        store,
        scrolls: value.window || null
      })
    }
  },
  unbind (el, { modifiers }) {
    if (isSelf(modifiers)) {
      el[_self].destroy()
      delete el[_self]
    }
    if (isWindow(modifiers)) {
      el[_window].destroy()
      delete el[_window]
    }
  }
}

export default {
  install (Vue) {
    _Vue = Vue
    Vue.directive('vuet-scroll', directive)
  }
}
