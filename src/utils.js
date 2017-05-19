const utils = {
  isObject (obj) {
    return Object.prototype.toString.call(obj) === '[object Object]'
  },
  isArray (arr) {
    return Object.prototype.toString.call(arr) === '[object Array]'
  },
  isFunction (arr) {
    return Object.prototype.toString.call(arr) === '[object Function]'
  },
  next (fn, resolve, reject = (e) => {}) {
    let btn = false
    const back = fn(resolve, reject)
    if (typeof back === 'object' && utils.isFunction(back.then)) {
      back
        .then((res) => {
          if (btn) return
          btn = true
          resolve(res)
        })
        .catch(reject)
    }
  }
}
export default utils
