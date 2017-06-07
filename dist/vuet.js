(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.Vuet = global.Vuet || {})));
}(this, (function (exports) { 'use strict';

var toString = Object.prototype.toString;
// Cached type string
var typeStrings = ['Object', 'Function', 'String', 'Undefined', 'Null'];

var utils = {
  getArgMerge: function getArgMerge() {
    var opt = {};
    var args = arguments;
    if (utils.isString(args[0])) {
      opt[args[0]] = args.length > 1 ? args[1] : args[0];
    } else if (args[0] && utils.isObject(args[0])) {
      opt = args[0];
    }
    return opt;
  },
  set: function set(obj, key, value) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: false,
      writable: true,
      configurable: false
    });
  }
};

// Add isXXX function
typeStrings.forEach(function (type) {
  var typeString = '[object ' + type + ']';
  utils['is' + type] = function (obj) {
    return toString.call(obj) === typeString;
  };
});

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
        this._vuet._init(this);
      }
    },
    destroyed: function destroyed() {
      if (!utils.isUndefined(this.$options.vuet)) {
        this._vuet = this.$options.vuet;
        this._vuet.destroy(this);
      }
    }
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

var life = {
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

var need = {
  mixin: function mixin(path) {
    return {
      beforeCreate: function beforeCreate() {
        this.$vuet.fetch(path, { current: this });
      }
    };
  }
};

var name = 'once';
var key = '__' + name + '__';

var once = {
  init: function init(vuet) {
    utils.set(vuet, key, {});
    Object.keys(vuet.store).forEach(function (k) {
      utils.set(vuet[key], k, false);
    });
  },
  mixin: function mixin(path) {
    return {
      beforeCreate: function beforeCreate() {
        var _this = this;

        if (this.$vuet[key][path] === false) {
          this.$vuet.fetch(path, { current: this }).then(function () {
            _this.$vuet[key][path] = true;
          });
        }
      }
    };
  }
};

var name$1 = 'route';
var key$1 = '__' + name$1 + '__';

var route = {
  init: function init(vuet) {
    utils.set(vuet, key$1, {});
    Object.keys(vuet.store).forEach(function (k) {
      utils.set(vuet[key$1], k, []);
    });
  },
  mixin: function mixin(path) {
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

        var _$vuet$_options$modul = this.$vuet._options.modules[path].routeWatch,
            routeWatch = _$vuet$_options$modul === undefined ? 'fullPath' : _$vuet$_options$modul;

        var toWatch = getWatchs(this.$route, routeWatch);
        if (diffWatch(toWatch, this.$vuet[key$1][path])) {
          this.$vuet.reset(path);
          this.$vuet[key$1][path] = toWatch;
        }
        this.$vuet.fetch(path, { current: this }, false).then(function (res) {
          if (diffWatch(toWatch, getWatchs(_this.$route, routeWatch))) return;
          _this.$vuet.setState(path, res);
          _this.$vuet[key$1][path] = toWatch;
        });
      },

      watch: {
        $route: {
          deep: true,
          handler: function handler(to, from) {
            var _this2 = this;

            var _$vuet$_options$modul2 = this.$vuet._options.modules[path].routeWatch,
                routeWatch = _$vuet$_options$modul2 === undefined ? 'fullPath' : _$vuet$_options$modul2;

            var toWatch = getWatchs(to, routeWatch);
            var fromWatch = getWatchs(from, routeWatch);
            if (!diffWatch(toWatch, fromWatch)) return false;
            this.$vuet.fetch(path, { current: this }).then(function (res) {
              if (diffWatch(toWatch, getWatchs(_this2.$route, routeWatch))) return;
              _this2.$vuet.setState(path, res);
              _this2.$vuet[key$1][path] = toWatch;
            });
          }
        }
      }
    };
  }
};

function install$1(_Vue, Vuet) {
  Vuet.mixin('life', life).mixin('need', need).mixin('once', once).mixin('route', route);
}

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



































var toConsumableArray = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  } else {
    return Array.from(arr);
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
      return this;
    }
  }, {
    key: 'afterEach',
    value: function afterEach(fn) {
      this.afterHooks.push(fn);
      return this;
    }
  }, {
    key: '_init',
    value: function _init(app) {
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
        pathJoin: this.options.pathJoin || '/',
        modules: {}
      };
      var pathJoin = this._options.pathJoin;

      var keys = ['data', 'fetch', 'routeWatch'];
      var initModule = function initModule(path, modules) {
        Object.keys(modules).forEach(function (k) {
          var item = modules[k];
          var _path = [].concat(toConsumableArray(path), [k]);
          if (utils.isFunction(item.data)) {
            _this._options.modules[_path.join(pathJoin)] = item;
            _this.reset(_path.join(pathJoin));
          }
          if (keys.indexOf(k) === -1 && utils.isObject(item)) {
            initModule(_path, item);
          }
        });
      };
      initModule([], this.options.modules);
      callMixinHook('init', this);
    }
  }, {
    key: 'getState',
    value: function getState(path) {
      return this.store[path] || {};
    }
  }, {
    key: 'setState',
    value: function setState(path, newState) {
      if (!this.store[path]) {
        _Vue.set(this.store, path, newState);
        return this;
      }
      Object.assign(this.store[path], newState);
      return this;
    }
  }, {
    key: 'fetch',
    value: function fetch(path, params, setStateBtn) {
      var _this2 = this;

      var module = this._options.modules[path];
      if (!utils.isFunction(module.fetch)) return Promise.resolve(this.getState(path));
      var data = {
        path: path,
        params: _extends({}, params),
        state: this.getState(path)
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
      if (callHook('beforeHooks', data) === false) return Promise.resolve(data.state);
      return module.fetch.call(this, data).then(function (res) {
        if (callHook('afterHooks', null, data, res) === false) return data.state;
        if (setStateBtn === false) return res;
        _this2.setState(path, res);
        return data.state;
      }).catch(function (e) {
        if (callHook('afterHooks', e, data) === false) return Promise.resolve(data.state);
        return Promise.reject(e);
      });
    }
  }, {
    key: 'reset',
    value: function reset(path) {
      var data = this._options.data.call(this);
      var module = this._options.modules[path];
      if (utils.isFunction(module.data)) {
        Object.assign(data, module.data.call(this, path));
      }
      this.setState(path, data);
      return this;
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      this.vm.$destroy();
      callMixinHook('destroy', this);
    }
  }]);
  return Vuet;
}();

Object.assign(Vuet$1, {
  options: {
    mixins: {}
  },
  install: install,
  mixin: function mixin(name, _mixin) {
    if (this.options.mixins[name]) return this;
    this.options.mixins[name] = _mixin;
    callMixinHook('install', _Vue, Vuet$1);
    return this;
  },
  mapMixins: function mapMixins() {
    for (var _len2 = arguments.length, paths = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      paths[_key2] = arguments[_key2];
    }

    var opt = utils.getArgMerge.apply(null, arguments);
    var vueMixins = [];
    Object.keys(opt).forEach(function (mixinName) {
      var any = opt[mixinName];
      if (Array.isArray(any)) {
        return any.forEach(function (path) {
          var mixins = Vuet$1.options.mixins[mixinName];
          vueMixins.push(mixins.mixin(path));
        });
      }
      var mixins = Vuet$1.options.mixins[mixinName];
      vueMixins.push(mixins.mixin(any));
    });
    return vueMixins;
  },
  mapState: function mapState() {
    var opt = utils.getArgMerge.apply(null, arguments);
    var computed = {};
    Object.keys(opt).forEach(function (k) {
      var path = opt[k];
      computed[k] = {
        get: function get$$1() {
          return this.$vuet.store[path];
        },
        set: function set$$1(val) {
          this.$vuet.store[path] = val;
        }
      };
    });
    return computed;
  },
  use: function use(plugin, opt) {
    if (utils.isFunction(plugin)) {
      plugin(_Vue, Vuet$1, opt);
    } else if (utils.isFunction(plugin.install)) {
      plugin.install(_Vue, Vuet$1, opt);
    }
    return this;
  }
});

function callMixinHook(hook) {
  var mixins = Vuet$1.options.mixins;

  for (var _len3 = arguments.length, arg = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
    arg[_key3 - 1] = arguments[_key3];
  }

  for (var k in mixins) {
    if (utils.isFunction(mixins[k][hook])) {
      mixins[k][hook].apply(mixins[k], arg);
    }
  }
}

Vuet$1.use(install$1);

var mapMixins = Vuet$1.mapMixins.bind(Vuet$1);
var mapState = Vuet$1.mapState.bind(Vuet$1);

exports.mapMixins = mapMixins;
exports.mapState = mapState;
exports['default'] = Vuet$1;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=vuet.js.map
