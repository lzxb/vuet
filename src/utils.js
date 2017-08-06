const utils = {
  isObject (obj) {
    return obj && Object.prototype.toString(obj)
  },
  getArgMerge () {
    let opt = {}
    const args = arguments
    if (typeof args[0] === 'string') {
      opt[args[0]] = args.length > 1 ? args[1] : args[0]
    } else if (args[0] && utils.isObject(args[0])) {
      opt = args[0]
    }
    return opt
  }
}

export default utils
