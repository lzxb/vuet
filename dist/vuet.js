(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.Vuet = global.Vuet || {})));
}(this, (function (exports) { 'use strict';

var name = 'local';

var local = {
  name: name,
  mixin: function mixin(path) {
    return {};
  }
};

var name$1 = 'need';

var need = {
  name: name$1,
  mixin: function mixin(path) {
    return {
      beforeCreate: function beforeCreate() {
        this.$vuet.fetch(path, { current: this });
      }
    };
  }
};

var name$2 = 'once';

var once = {
  name: name$2,
  mixin: function mixin(path) {
    return {
      beforeCreate: function beforeCreate() {
        var _this = this;

        if (this.$vuet.__once__ === false) {
          this.$vuet.fetch(path, { current: this }).then(function () {
            _this.$vuet.__once__ = true;
          });
        }
      }
    };
  },
  install: function install(Vue, Vuet) {},
  init: function init(vuet) {
    vuet.__once__ = false;
  },
  destroy: function destroy(vuet) {
    vuet.__once__ = true;
  }
};

var name$3 = 'route';

var route = {
  name: name$3,
  mixin: function mixin(path) {
    function set(obj, key, value) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: false,
        writable: true,
        configurable: false
      });
    }
    function getOpt() {
      return this.$vuet._options.modules[path];
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

        if (!this.$vuet.__route__) {
          set(this.$vuet, '__route__', {});
        }

        var _getOpt$call = getOpt.call(this),
            _getOpt$call$watch = _getOpt$call.watch,
            watch = _getOpt$call$watch === undefined ? 'fullPath' : _getOpt$call$watch;

        var toWatch = getWatchs(this.$route, watch);
        if (!this.$vuet.__route__[path]) {
          this.$vuet.__route__[path] = toWatch;
        }
        if (diffWatch(toWatch, this.$vuet.__route__[path])) {
          this.$vuet.reset(path);
          this.$vuet.__route__[path] = toWatch;
        }
        this.$vuet.fetch(path, { current: this }).then(function () {
          _this.$vuet.__route__[path] = toWatch;
        });
      },

      watch: {
        $route: {
          deep: true,
          handler: function handler(to, from) {
            var _this2 = this;

            var _getOpt$call2 = getOpt.call(this),
                _getOpt$call2$watch = _getOpt$call2.watch,
                watch = _getOpt$call2$watch === undefined ? 'fullPath' : _getOpt$call2$watch;

            var toWatch = getWatchs(to, watch);
            var fromWatch = getWatchs(from, watch);
            if (!diffWatch(toWatch, fromWatch)) return false;
            this.$vuet.fetch(path, this).then(function () {
              _this2.$vuet.__route__[path] = toWatch;
            });
          }
        }
      }
    };
  }
};

var plugins$1 = {
  local: local,
  need: need,
  once: once,
  route: route
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
  },
  getArgMerge: function getArgMerge() {
    var opt = {};
    if (typeof arguments[0] === 'string') {
      opt[arguments[0]] = arguments[1];
    } else if (utils.isObject(arguments[0])) {
      opt = arguments[0];
    }
    return opt;
  }
};

var debug = {
  error: function error(msg) {
    throw new Error('[vuet] ' + msg);
  },
  warn: function warn(msg) {
    if (process.env.NODE_ENV !== 'production') {
      typeof console !== 'undefined' && console.warn('[vuet] ' + msg);
    }
  }
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

var plugins = {};

var pluginCallHook = function pluginCallHook(vuet, hook) {
  for (var k in plugins) {
    if (utils.isFunction(plugins[k][hook])) {
      plugins[k][hook](vuet);
    }
  }
};

var Vuet$1 = function () {
  function Vuet(options) {
    classCallCheck(this, Vuet);

    if (!utils.isObject(options)) {
      debug.error('Parameter is the object type');
    }
    this.options = options || {};
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
        data: this.options.data || function data() {
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
      pluginCallHook(this, 'init');
    }
  }, {
    key: 'setState',
    value: function setState(path, data) {
      if (!this.store[path]) {
        return _Vue.set(this.store, path, data);
      }
      Object.assign(this.store[path], data);
    }
  }, {
    key: 'getState',
    value: function getState(path) {
      return this.store[path] || {};
    }
  }, {
    key: 'reset',
    value: function reset(path) {
      var data = this.options.data();
      var store = this._options.modules[path];
      if (utils.isFunction(store.data)) {
        Object.assign(data, store.data.call(this, path));
      }
      this.setState(path, data);
    }
  }, {
    key: 'fetch',
    value: function fetch(path, params) {
      var _this2 = this;

      var store = this._options.modules[path];
      if (!utils.isFunction(store.fetch)) return false;
      var data = {
        path: path,
        params: params,
        store: this.getState(path)
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
      if (callHook('beforeHooks', data) === false) return Promise.resolve(data.store);
      return store.fetch.call(this).then(function (res) {
        if (callHook('afterHooks', null, data, res) === false) return data.store;
        _this2.setState(path, res);
        return data.store;
      }).catch(function (e) {
        if (callHook('afterHooks', e, data) === false) return Promise.resolve(data.store);
        return Promise.reject(e);
      });
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      this.vm.$destroy();
      pluginCallHook(this, 'destroy');
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

function mapState() {
  // mapState(xxx, 'xxx/route/xxx')
  // mapState({ xxx, 'xxx/route/xxx', xxx, 'xxx/route/xxx' })
  var opt = utils.getArgMerge.apply(null, arguments);
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
    var pluginName = path.split('/')[1];
    var plugin = plugins[pluginName];
    mixins.push(plugin.mixin(path));
  });
  return mixins;
}

Vuet$1.install = install;

exports['default'] = Vuet$1;
exports.mapState = mapState;
exports.mapMixins = mapMixins;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=vuet.js.map
