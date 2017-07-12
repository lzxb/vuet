/* @flow  */

import { _Vue } from '../install'
import debug from '../debug'

const _self: string = '__vuetScrollSelf__'
const _window: string = '__vuetScrollWindow__'

class VuetScroll {
  app: Object
  path: string
  name: string
  store: Object
  timer: Object
  scrolls: { x: number, y: number }
  subScrolling: Function
  constructor (opt: Object) {
    this.app = {}
    this.path = ''
    this.name = ''
    this.store = {}
    this.timer = {}
    this.scrolls = { x: 0, y: 0 }
    this.setOption(opt)
    this.scrollTo()
    this.subScroll()
  }
  update (opt: Object) {
    this.setOption(opt)
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
    const newScrolls: { x?: number, y?: number } = {}
    this.subScrolling = (event: Object) => {
      if (app === window) {
        newScrolls.x = window.pageXOffset
        newScrolls.y = window.pageYOffset
      } else {
        const { scrollTop, scrollLeft, pageXOffset, pageYOffset }: Object = event.target
        newScrolls.x = scrollLeft || pageYOffset || scrollLeft
        newScrolls.y = scrollTop || pageXOffset || scrollTop
      }
      Object.assign(this.scrolls, newScrolls)
    }
    app.addEventListener('scroll', this.subScrolling, false)
  }
}

function isSelf (modifiers: { self?: boolean, window?: boolean }): boolean {
  return !!(modifiers.window !== true || modifiers.self)
}

function isWindow (modifiers: { self?: boolean, window?: boolean }): boolean {
  return !!(modifiers.window)
}

export default {
  inserted (el: Object, { modifiers, value }: DirectiveParams, vnode: Vnode) {
    if (typeof value.path !== 'string') return debug.error('path is imperative parameter and is string type')
    if (value.path === 'window') return debug.error('name cannot be the window name')
    if (isSelf(modifiers)) {
      if (typeof value.name !== 'string') return debug.error('name is imperative parameter and is string type')
      el[_self] = new VuetScroll({
        app: el,
        path: value.path,
        name: value.name,
        store: vnode.context.$vuet.store[value.path],
        scrolls: value.self
      })
    }
    if (isWindow(modifiers)) {
      el[_window] = new VuetScroll({
        app: window,
        path: value.path,
        name: 'window',
        store: vnode.context.$vuet.store[value.path],
        scrolls: value.window || null
      })
    }
  },
  componentUpdated (el: Object, { modifiers, value }: DirectiveParams, vnode: Vnode) {
    if (isSelf(modifiers)) {
      el[_self].update({
        app: el,
        path: value.path,
        name: value.name,
        store: vnode.context.$vuet.store[value.path],
        scrolls: value.self
      })
    }
    if (isWindow(modifiers)) {
      el[_window].update({
        app: window,
        path: value.path,
        name: 'window',
        store: vnode.context.$vuet.store[value.path],
        scrolls: value.window || null
      })
    }
  },
  unbind (el: Object, { modifiers }: DirectiveParams) {
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
