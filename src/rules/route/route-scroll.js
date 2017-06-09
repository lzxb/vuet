import { _key } from './route'

function initScroll (el, vnode, path) {
  const id = el.id
  const { context } = vnode
  let scrollPath = context.$vuet[_key].scrolls[path]
  if (!id || !context) return
  if (!scrollPath[id]) {
    scrollPath[id] = { scrollTop: 0, scrollLeft: 0 }
  }
  const scrolls = scrollPath[id]
  setTimeout(() => {
    scrollTo(el, scrolls)
  }, 0)
  return scrolls
}

export function scrollTo (el, scrolls) {
  if ('scrollTop' in el) {
    Object.assign(el, scrolls)
  } else {
    el.scrollTo(scrolls.scrollTop, scrolls.scrollLeft)
  }
}

export default {
  inserted (el, { value }, vnode) {
    const scrolls = initScroll(el, vnode, value)
    el.__routeScroll__ = event => {
      const { scrollTop, scrollLeft, pageXOffset, pageYOffset } = event.target
      scrolls.scrollTop = scrollTop || pageXOffset || scrollTop
      scrolls.scrollLeft = scrollLeft || pageYOffset || scrollLeft
    }
    el.addEventListener('scroll', el.__routeScroll__, false)
  },
  unbind (el) {
    el.removeEventListener('scroll', el.__routeScroll__, false)
    delete el.__routeScroll__
  }
}
