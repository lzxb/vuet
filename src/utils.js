const toString = Object.prototype.toString
// Cached type string
const typeStrings = ['Object', 'Function', 'String', 'Undefined', 'Null']

const utils = {
  forEachObj (obj, cb) {
    if (!obj || !utils.isObject(obj)) return
    Object.keys(obj).forEach(k => {
      cb(obj[k], k)
    })
  },
  getArgMerge () {
    let opt = {}
    const args = arguments
    if (utils.isString(args[0]) && utils.isString(args[1])) {
      opt[args[0]] = args.length > 1 ? args[1] : args[0]
    } else if (args[0] && utils.isObject(args[0])) {
      opt = args[0]
    }
    return opt
  }
}

// Add isXXX function
typeStrings.forEach(type => {
  const typeString = `[object ${type}]`
  utils[`is${type}`] = obj => {
    return toString.call(obj) === typeString
  }
})

export default utils
