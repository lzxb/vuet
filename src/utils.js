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
  },
  getArgMerge () {
    let opt = {}
    if (typeof arguments[0] === 'string') {
      opt[arguments[0]] = arguments[1]
    } else if (utils.isObject(arguments[0])) {
      opt = arguments[0]
    }
    return opt
  }
}
export default utils
