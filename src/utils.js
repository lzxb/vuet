const utils = {
  isObject (obj) {
    return Object.prototype.toString.call(obj) === '[object Object]'
  },
  isFunction (fn) {
    return Object.prototype.toString.call(fn) === '[object Function]'
  },
  forEachObj (obj, cb) {
    if (!utils.isObject(obj)) return
    Object.keys(obj).forEach(k => {
      cb(obj[k], k)
    })
  }
}
export default utils
