(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.Vuet = global.Vuet || {})));
}(this, (function (exports) { 'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};









var asyncToGenerator = function (fn) {
  return function () {
    var gen = fn.apply(this, arguments);
    return new Promise(function (resolve, reject) {
      function step(key, arg) {
        try {
          var info = gen[key](arg);
          var value = info.value;
        } catch (error) {
          reject(error);
          return;
        }

        if (info.done) {
          resolve(value);
        } else {
          return Promise.resolve(value).then(function (value) {
            step("next", value);
          }, function (err) {
            step("throw", err);
          });
        }
      }

      return step("next");
    });
  };
};

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();







var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};





















var slicedToArray = function () {
  function sliceIterator(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"]) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  return function (arr, i) {
    if (Array.isArray(arr)) {
      return arr;
    } else if (Symbol.iterator in Object(arr)) {
      return sliceIterator(arr, i);
    } else {
      throw new TypeError("Invalid attempt to destructure non-iterable instance");
    }
  };
}();

var name = 'route';

var route = {
  name: name,
  install: function install(Vue, Vuet) {},
  mixin: function mixin(path, moduleName, type) {
    function set$$1(obj, key, value) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: false,
        writable: true,
        configurable: false
      });
    }
    function getOpt() {
      var _path$split = path.split('/'),
          _path$split2 = slicedToArray(_path$split, 3),
          moduleName = _path$split2[0],
          name = _path$split2[1],
          type = _path$split2[2];

      return this.$vuet.options.modules[moduleName][name][type];
    }

    function getWatchs(obj, list) {
      if (typeof list === 'string') {
        list = [list];
      }
      var getObjVal = function getObjVal(obj, str) {
        var arr = str.split('.');
        arr.forEach(function (k) {
          obj = obj[k];
        });
        return obj;
      };
      var arr = [];
      list.forEach(function (val) {
        var value = getObjVal(obj, val);
        if (!isNaN(value)) {
          value = String(value);
        }
        arr.push(JSON.stringify(value));
      });
      return arr;
    }

    function diffWatch(to, from) {
      for (var i = 0; i < to.length; i++) {
        if (to[i] !== from[i]) {
          return true;
        }
      }
      return false;
    }
    return {
      beforeCreate: function beforeCreate() {
        var _this = this;

        return asyncToGenerator(regeneratorRuntime.mark(function _callee() {
          var _getOpt$call, _getOpt$call$watch, watch, toWatch;

          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  if (!_this.$vuet.__route__) {
                    set$$1(_this.$vuet, '__route__', {});
                  }
                  _getOpt$call = getOpt.call(_this), _getOpt$call$watch = _getOpt$call.watch, watch = _getOpt$call$watch === undefined ? 'fullPath' : _getOpt$call$watch;
                  toWatch = getWatchs(_this.$route, watch);

                  if (!_this.$vuet.__route__[path]) {
                    _this.$vuet.__route__[path] = toWatch;
                  }
                  if (diffWatch(toWatch, _this.$vuet.__route__[path])) {
                    _this.$vuet.reset(path);
                    _this.$vuet.__route__[path] = toWatch;
                  }
                  _context.next = 7;
                  return _this.$vuet.fetch(path, { current: _this });

                case 7:
                  _this.$vuet.__route__[path] = toWatch;

                case 8:
                case 'end':
                  return _context.stop();
              }
            }
          }, _callee, _this);
        }))();
      },

      watch: {
        $route: {
          deep: true,
          handler: function handler(to, from) {
            var _this2 = this;

            return asyncToGenerator(regeneratorRuntime.mark(function _callee2() {
              var _getOpt$call2, _getOpt$call2$watch, watch, toWatch, fromWatch;

              return regeneratorRuntime.wrap(function _callee2$(_context2) {
                while (1) {
                  switch (_context2.prev = _context2.next) {
                    case 0:
                      _getOpt$call2 = getOpt.call(_this2), _getOpt$call2$watch = _getOpt$call2.watch, watch = _getOpt$call2$watch === undefined ? 'fullPath' : _getOpt$call2$watch;
                      toWatch = getWatchs(to, watch);
                      fromWatch = getWatchs(from, watch);

                      if (diffWatch(toWatch, fromWatch)) {
                        _context2.next = 5;
                        break;
                      }

                      return _context2.abrupt('return', false);

                    case 5:
                      _context2.next = 7;
                      return _this2.$vuet.fetch(path, _this2);

                    case 7:
                      _this2.$vuet.__route__[path] = toWatch;

                    case 8:
                    case 'end':
                      return _context2.stop();
                  }
                }
              }, _callee2, _this2);
            }))();
          }
        }
      }
    };
  }
};

var utils = {
  isObject: function isObject(obj) {
    return Object.prototype.toString.call(obj) === '[object Object]';
  },
  isFunction: function isFunction(fn) {
    return Object.prototype.toString.call(fn) === '[object Function]';
  },
  forEachObj: function forEachObj(obj, cb) {
    if (!utils.isObject(obj)) return;
    Object.keys(obj).forEach(function (k) {
      cb(obj[k], k);
    });
  }
};

var name$1 = 'syncQuery';
function syncQuery() {
  var _this = this;

  if (!this.$vuet) return;
  var _$vuet$options$syncQu = this.$vuet.options.syncQuery,
      syncQuery = _$vuet$options$syncQu === undefined ? 'query' : _$vuet$options$syncQu;

  var query = this[syncQuery];
  if (utils.isObject(query)) {
    Object.keys(query).forEach(function (k) {
      if (Object.prototype.hasOwnProperty.call(_this.$route.query, k)) {
        query[k] = _this.$route.query[k];
      }
    });
  }
}

var syncQuery$1 = {
  name: name$1,
  install: function install(Vue, Vuet) {
    Vue.mixin({
      created: function created() {
        syncQuery.call(this);
      },

      watch: {
        $route: function $route() {
          syncQuery.call(this);
        }
      }
    });
  }
};

var plugins$1 = {
  route: route,
  syncQuery: syncQuery$1
};

var _Vue = null;

var isDef = function isDef(v) {
  return v !== undefined;
};

function install(Vue) {
  if (install.installed) return;
  install.installed = true;
  _Vue = Vue;
  Object.defineProperty(Vue.prototype, '$vuet', {
    get: function get() {
      return this.$root._vuet;
    }
  });
  Vue.mixin({
    beforeCreate: function beforeCreate() {
      if (isDef(this.$options.vuet)) {
        this._vuet = this.$options.vuet;
        this._vuet.init(this);
      }
    },
    destroyed: function destroyed() {
      if (isDef(this.$options.vuet)) {
        this._vuet = this.$options.vuet;
        this._vuet.destroy(this);
      }
    }
  });
  Object.keys(plugins$1).forEach(function (k) {
    Vuet$1.use(plugins$1[k]);
  });
}

// import debug from './debug'

var plugins = {};

var Vuet$1 = function () {
  function Vuet() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    classCallCheck(this, Vuet);

    this.options = options;
    this.app = null;
    this.store = {};
    this.beforeHooks = []; // Before the request begins
    this.afterHooks = []; // After the request begins
    this.vm = null;
  }

  createClass(Vuet, [{
    key: 'beforeEach',
    value: function beforeEach(fn) {
      this.beforeHooks.push(fn);
    }
  }, {
    key: 'afterEach',
    value: function afterEach(fn) {
      this.afterHooks.push(fn);
    }
  }, {
    key: 'init',
    value: function init(app) {
      var _this = this;

      if (this.app) return;
      this.app = app;
      this.vm = new _Vue({
        data: {
          store: this.store
        }
      });
      this._options = {
        data: this.options.data || function () {
          return {};
        },
        modules: {}
      };
      utils.forEachObj(this.options.modules, function (myModule, myModuleName) {
        utils.forEachObj(myModule, function (plugin, pluginName) {
          utils.forEachObj(plugin, function (store, storeName) {
            var path = myModuleName + '/' + pluginName + '/' + storeName;
            _this._options.modules[path] = _this.options.modules[myModuleName][pluginName][storeName];
            _this.reset(path);
          });
        });
      });
    }
  }, {
    key: 'setStore',
    value: function setStore(path, data) {
      if (!this.store[path]) {
        return _Vue.set(this.store, path, data);
      }
      Object.assign(this.store[path], data);
    }
  }, {
    key: 'getStore',
    value: function getStore(path) {
      return this.store[path];
    }
  }, {
    key: 'reset',
    value: function reset(path) {
      var data = this.options.data();
      var store = this._options.modules[path];
      if (utils.isFunction(store.data)) {
        Object.assign(data, store.data.call(this, path));
      }
      this.setStore(path, data);
    }
  }, {
    key: 'fetch',
    value: function fetch(path, params) {
      var _this2 = this;

      var store = this._options.modules[path];
      var data = {
        path: path,
        params: params,
        store: this.getStore(path)
      };
      var callHook = function callHook(hook) {
        for (var _len = arguments.length, arg = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          arg[_key - 1] = arguments[_key];
        }

        for (var i = 0; i < _this2[hook].length; i++) {
          var _hook$i;

          if ((_hook$i = _this2[hook][i]).call.apply(_hook$i, [_this2].concat(arg))) {
            return false;
          }
        }
      };
      if (callHook('beforeHooks', data) === false) Promise.resolve(data.store);
      return store.fetch.call(this).then(function (res) {
        if (callHook('afterHooks', null, data) === false) return data.store;
        _this2.setStore(path, res);
        return data.store;
      }).catch(function (e) {
        if (callHook('afterHooks', e, data) === false) return Promise.resolve(data.store);
        return Promise.reject(e);
      });
    }
  }, {
    key: 'search',
    value: function search(data, action) {
      var _app$$route = this.app.$route,
          hash = _app$$route.hash,
          query = _app$$route.query,
          params = _app$$route.params,
          name = _app$$route.name;
      /* eslint-disable no-undef */

      if ((typeof event === 'undefined' ? 'undefined' : _typeof(event)) === 'object' && event === data || !utils.isObject(data)) {
        data = {};
      }
      var route = {
        hash: hash,
        query: _extends({}, query, data),
        params: _extends({}, params),
        name: name
      };
      if (action) {
        this.app.$router.replace(route);
      } else {
        this.app.$router.push(route);
      }
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      this.vm.$destroy();
    }
  }]);
  return Vuet;
}();

Vuet$1.use = function use(plugin, opt) {
  if (utils.isFunction(plugin.install)) {
    plugin.install(_Vue, Vuet$1, opt);
  }
  if (typeof plugin.name !== 'string' && !plugin.name) return this;
  plugins[plugin.name] = plugin;
  return this;
};

function mapStores() {
  // mapStores(xxx, 'xxx/route/xxx')
  // mapStores({ xxx, 'xxx/route/xxx', xxx, 'xxx/route/xxx' })
  var opt = {};
  if (typeof arguments[0] === 'string') {
    opt[arguments[0]] = arguments[1];
  } else if (utils.isObject(arguments[0])) {
    opt = arguments[0];
  }
  var computed = {};
  Object.keys(opt).forEach(function (k) {
    var path = opt[k];
    computed[k] = {
      get: function get() {
        return this.$vuet.store[path];
      },
      set: function set(val) {
        this.$vuet.store[path] = val;
      }
    };
  });
  return computed;
}

function mapMixins() {
  // mapMixins('xxx/route/xxx')
  // mapMixins(['xxx/route/xxx', 'xxx/route/xxx'])
  var mixins = [];

  for (var _len = arguments.length, paths = Array(_len), _key = 0; _key < _len; _key++) {
    paths[_key] = arguments[_key];
  }

  paths.forEach(function (path) {
    var _path$split = path.split('/'),
        _path$split2 = slicedToArray(_path$split, 3),
        moduleName = _path$split2[0],
        pluginName = _path$split2[1],
        type = _path$split2[2];

    var plugin = plugins[pluginName];
    mixins.push(plugin.mixin(path, moduleName, type));
  });
  return mixins;
}

Vuet$1.install = install;

exports['default'] = Vuet$1;
exports.mapStores = mapStores;
exports.mapMixins = mapMixins;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=vuet.js.map
