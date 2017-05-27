(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.Vuet = global.Vuet || {})));
}(this, (function (exports) { 'use strict';

var toString = Object.prototype.toString;
// Cached type string
var typeStrings = ['Object', 'Function', 'String', 'Undefined', 'Null'];

var utils = {
  forEachObj: function forEachObj(obj, cb) {
    if (!obj || !utils.isObject(obj)) return;
    Object.keys(obj).forEach(function (k) {
      cb(obj[k], k);
    });
  },
  getArgMerge: function getArgMerge() {
    var opt = {};
    var args = arguments;
    if (utils.isString(args[0])) {
      opt[args[0]] = args.length > 1 ? args[1] : args[0];
    } else if (args[0] && utils.isObject(args[0])) {
      opt = args[0];
    }
    return opt;
  }
};

// Add isXXX function
typeStrings.forEach(function (type) {
  var typeString = '[object ' + type + ']';
  utils['is' + type] = function (obj) {
    return toString.call(obj) === typeString;
  };
});

var name = 'life';

var life = {
  name: name,
  mixin: function mixin(path) {
    return {
      beforeCreate: function beforeCreate() {
        this.$vuet.fetch(path, { current: this });
      },
      destroyed: function destroyed() {
        this.$vuet.reset(path, { current: this });
      }
    };
  }
};

var name$1 = 'local';

var local = {
  name: name$1,
  mixin: function mixin(path) {
    return {};
  }
};

var name$2 = 'need';

var need = {
  name: name$2,
  mixin: function mixin(path) {
    return {
      beforeCreate: function beforeCreate() {
        this.$vuet.fetch(path, { current: this });
      }
    };
  }
};

var name$3 = 'once';

var once = {
  name: name$3,
  mixin: function mixin(path) {
    return {
      beforeCreate: function beforeCreate() {
        var _this = this;

        if (this.$vuet.__fired_once__ === false) {
          this.$vuet.fetch(path, { current: this }).then(function () {
            _this.$vuet.__fired_once__ = true;
          });
        }
      }
    };
  },
  init: function init(vuet) {
    vuet.__fired_once__ = false;
  },
  destroy: function destroy(vuet) {
    vuet.__fired_once__ = true;
  }
};

var name$4 = 'route';

var route = {
  name: name$4,
  mixin: function mixin(path) {
    function set(obj, key, value) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: false,
        writable: true,
        configurable: false
      });
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
        var _$vuet$_options$modul = this.$vuet._options.modules[path].watch,
            watch = _$vuet$_options$modul === undefined ? 'fullPath' : _$vuet$_options$modul;

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

            var _$vuet$_options$modul2 = this.$vuet._options.modules[path].watch,
                watch = _$vuet$_options$modul2 === undefined ? 'fullPath' : _$vuet$_options$modul2;

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

var plugins = {
  life: life,
  local: local,
  need: need,
  once: once,
  route: route
};

var _Vue = null;

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
      if (!utils.isUndefined(this.$options.vuet)) {
        this._vuet = this.$options.vuet;
        this._vuet.init(this);
      }
    },
    destroyed: function destroyed() {
      if (!utils.isUndefined(this.$options.vuet)) {
        this._vuet = this.$options.vuet;
        this._vuet.destroy(this);
      }
    }
  });
  Object.keys(plugins).forEach(function (k) {
    Vuet$1.use(plugins[k]);
  });
}

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

      if (this.app || !app) return;
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
        utils.forEachObj(myModule, function (store, storeName) {
          var path = myModuleName + '/' + storeName;
          _this._options.modules[path] = _this.options.modules[myModuleName][storeName];
          _this.reset(path);
        });
      });

      Vuet.pluginCallHook(this, 'init');
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
      var data = this.options.data.call(this);
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
        params: _extends({}, params),
        store: this.getState(path)
      };
      var callHook = function callHook(hook) {
        for (var _len = arguments.length, arg = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          arg[_key - 1] = arguments[_key];
        }

        for (var i = 0; i < _this2[hook].length; i++) {
          if (_this2[hook][i].apply(_this2, arg)) {
            return false;
          }
        }
      };
      if (callHook('beforeHooks', data) === false) return Promise.resolve(data.store);
      return store.fetch.call(this, data).then(function (res) {
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
      Vuet.pluginCallHook(this, 'destroy');
    }
  }]);
  return Vuet;
}();

Vuet$1.plugins = {};
Vuet$1.pluginCallHook = function (vuet, hook) {
  for (var k in Vuet$1.plugins) {
    if (utils.isFunction(Vuet$1.plugins[k][hook])) {
      Vuet$1.plugins[k][hook](vuet);
    }
  }
};

Vuet$1.use = function (plugin, opt) {
  if (utils.isFunction(plugin.install)) {
    plugin.install(_Vue, Vuet$1, opt);
  }
  if (typeof plugin.name !== 'string' || !plugin.name) return Vuet$1;
  Vuet$1.plugins[plugin.name] = plugin;
  return Vuet$1;
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
  for (var _len = arguments.length, paths = Array(_len), _key = 0; _key < _len; _key++) {
    paths[_key] = arguments[_key];
  }

  var opt = utils.getArgMerge.apply(null, arguments);
  var mixins = [];
  Object.keys(opt).forEach(function (pluginName) {
    var any = opt[pluginName];
    if (Array.isArray(any)) {
      return any.forEach(function (path) {
        var plugin = Vuet$1.plugins[pluginName];
        mixins.push(plugin.mixin(path));
      });
    }
    var plugin = Vuet$1.plugins[pluginName];
    mixins.push(plugin.mixin(any));
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
