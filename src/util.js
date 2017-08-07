const util = {
  isObject (obj) {
    return !!obj && Object.prototype.toString.call(obj) === '[object Object]'
  },
  getArgMerge () {
    let opt = {}
    const args = arguments
    if (typeof args[0] === 'string') {
      opt[args[0]] = args.length > 1 ? args[1] : args[0]
    } else if (args[0] && util.isObject(args[0])) {
      opt = args[0]
    }
    return opt
  },
  isPromise (obj) {
    return !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function'
  }
}

export default util
