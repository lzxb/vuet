/* @flow */

const toString = Object.prototype.toString
// Cached type string
const typeStrings: Array<string> = ['Object', 'Function', 'String', 'Undefined', 'Null']

const utils: Object = {
  getArgMerge () {
    let opt = {}
    const args = arguments
    if (utils.isString(args[0])) {
      opt[args[0]] = args.length > 1 ? args[1] : args[0]
    } else if (args[0] && utils.isObject(args[0])) {
      opt = args[0]
    }
    return opt
  },
  set (obj: Object, key: string, value: any) {
    Object.defineProperty(obj, key, {
      value,
      enumerable: false,
      writable: true,
      configurable: false
    })
  },
  isPromise (obj) {
    return !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function'
  }
}

typeStrings.forEach((type: string) => {
  const typeString: string = `[object ${type}]`
  utils[`is${type}`] = obj => {
    return toString.call(obj) === typeString
  }
})

export default utils
