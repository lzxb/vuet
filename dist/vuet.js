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

typeStrings.forEach(function (type) {
  var typeString = '[object ' + type + ']';
  utils['is' + type] = function (obj) {
    return toString.call(obj) === typeString;
  };
});

var debug = {
  error: function error(msg) {
    throw new Error('[vuet] ' + msg);
  },
  warn: function warn(msg) {
    {
      typeof console !== 'undefined' && console.warn('[vuet] ' + msg);
    }
  },
  assertPath: function assertPath(vuet, path) {
    if (path in vuet.store) {
      return;
    }
    this.error('The module does not exist. Call the this.$vuet method in the Vue component to see all module paths');
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



































var toConsumableArray = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  } else {
    return Array.from(arr);
  }
};

var _self = '__vuetScrollSelf__';
var _window = '__vuetScrollWindow__';

var VuetScroll = function () {
  function VuetScroll(opts) {
    classCallCheck(this, VuetScroll);

    this.timer = {};
    this.setOption(opts);
    this.scrollTo();
    this.subScroll();
  }

  createClass(VuetScroll, [{
    key: 'update',
    value: function update(opts) {
      var _this = this;

      this.setOption(opts);
      var key = 'timer-' + this.path + '-' + this.name;
      clearTimeout(this.timer[key]);
      this.timer[key] = setTimeout(function () {
        _this.scrollTo();
        delete _this.timer[key];
      }, 10);
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      this.app.removeEventListener('scroll', this.subScrolling, false);
    }
  }, {
    key: 'setOption',
    value: function setOption(opt) {
      this.app = opt.app;
      this.path = opt.path;
      this.name = opt.name || '';
      this.store = opt.store || { x: 0, y: 0 };
      this.scrolls = opt.scrolls || createScroll(opt);
      function createScroll(opt) {
        if (!opt.store.$scroll) {
          _Vue.set(opt.store, '$scroll', {});
        }
        if (!opt.store.$scroll[opt.name]) {
          _Vue.set(opt.store.$scroll, opt.name, { x: 0, y: 0 });
        }

        return opt.store.$scroll[opt.name];
      }
    }
  }, {
    key: 'scrollTo',
    value: function scrollTo() {
      var app = this.app,
          scrolls = this.scrolls;

      if ('scrollTop' in app && app !== window) {
        app.scrollLeft = scrolls.x;
        app.scrollTop = scrolls.y;
      } else {
        app.scrollTo(scrolls.x, scrolls.y);
      }
    }
  }, {
    key: 'subScroll',
    value: function subScroll() {
      var _this2 = this;

      var app = this.app;

      var newScrolls = { x: 0, y: 0 };
      this.subScrolling = function (event) {
        if (app === window) {
          newScrolls.x = window.pageXOffset;
          newScrolls.y = window.pageYOffset;
        } else {
          var _event$target = event.target,
              scrollTop = _event$target.scrollTop,
              scrollLeft = _event$target.scrollLeft,
              pageXOffset = _event$target.pageXOffset,
              pageYOffset = _event$target.pageYOffset;

          newScrolls.x = scrollLeft || pageYOffset || scrollLeft;
          newScrolls.y = scrollTop || pageXOffset || scrollTop;
        }
        Object.assign(_this2.scrolls, newScrolls);
      };
      app.addEventListener('scroll', this.subScrolling, false);
    }
  }]);
  return VuetScroll;
}();

function isSelf(modifiers) {
  return !!(modifiers.window !== true || modifiers.self);
}

function isWindow(modifiers) {
  return !!modifiers.window;
}

var scroll = {
  inserted: function inserted(el, _ref, vnode) {
    var modifiers = _ref.modifiers,
        value = _ref.value;

    if (typeof value.path !== 'string') return debug.error('path is imperative parameter and is string type');
    if (value.path === 'window') return debug.error('name cannot be the window name');
    if (isSelf(modifiers)) {
      if (typeof value.name !== 'string') return debug.error('name is imperative parameter and is string type');
      el[_self] = new VuetScroll({
        app: el,
        path: value.path,
        name: value.name,
        store: vnode.context.$vuet.store[value.path],
        scrolls: value.self
      });
    }
    if (isWindow(modifiers)) {
      el[_window] = new VuetScroll({
        app: window,
        path: value.path,
        name: 'window',
        store: vnode.context.$vuet.store[value.path],
        scrolls: value.window
      });
    }
  },
  componentUpdated: function componentUpdated(el, _ref2, vnode) {
    var modifiers = _ref2.modifiers,
        value = _ref2.value;

    if (isSelf(modifiers)) {
      el[_self].update({
        app: el,
        path: value.path,
        name: value.name,
        store: vnode.context.$vuet.store[value.path],
        scrolls: value.self
      });
    }
    if (isWindow(modifiers)) {
      el[_window].update({
        app: window,
        path: value.path,
        name: 'window',
        store: vnode.context.$vuet.store[value.path],
        scrolls: value.window || null
      });
    }
  },
  unbind: function unbind(el, _ref3) {
    var modifiers = _ref3.modifiers;

    if (isSelf(modifiers)) {
      el[_self].destroy();
      delete el[_self];
    }
    if (isWindow(modifiers)) {
      el[_window].destroy();
      delete el[_window];
    }
  }
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
  Vue.directive('vuet-scroll', scroll);
}

var life = {
  rule: function rule(_ref) {
    var path = _ref.path;

    return {
      beforeCreate: function beforeCreate() {
        debug.assertPath(this.$vuet, path);
        this.$vuet.fetch(path, { current: this });
      },
      destroyed: function destroyed() {
        this.$vuet.reset(path, { current: this });
      }
    };
  }
};

function mapManuals(vuet, path) {
  var _vuet$_options$module = vuet._options.modules[path].manuals,
      manuals = _vuet$_options$module === undefined ? {} : _vuet$_options$module;

  var methods = {};
  Object.keys(manuals).forEach(function (k) {
    var fn = manuals[k];
    if (typeof fn === 'function') {
      methods['' + k] = function () {
        for (var _len = arguments.length, arg = Array(_len), _key = 0; _key < _len; _key++) {
          arg[_key] = arguments[_key];
        }

        return fn.apply(methods, [{
          state: vuet.getState(path),
          app: vuet.app,
          vuet: vuet
        }].concat(arg));
      };
    }
  });
  methods.reset = function () {
    for (var _len2 = arguments.length, arg = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      arg[_key2] = arguments[_key2];
    }

    return vuet.reset.apply(vuet, [path].concat(arg));
  };
  methods.getState = function () {
    for (var _len3 = arguments.length, arg = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      arg[_key3] = arguments[_key3];
    }

    return vuet.getState.apply(vuet, [path].concat(arg));
  };
  methods.setState = function () {
    for (var _len4 = arguments.length, arg = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
      arg[_key4] = arguments[_key4];
    }

    return vuet.setState.apply(vuet, [path].concat(arg));
  };
  methods.fetch = function () {
    for (var _len5 = arguments.length, arg = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
      arg[_key5] = arguments[_key5];
    }

    return vuet.fetch.apply(vuet, [path].concat(arg));
  };
  methods.data = function () {
    for (var _len6 = arguments.length, arg = Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
      arg[_key6] = arguments[_key6];
    }

    return vuet.data.apply(vuet, [path].concat(arg));
  };
  methods.mapManuals = function (path) {
    return mapManuals(vuet, path);
  };
  return methods;
}

var manual = {
  install: function install(Vue, Vuet) {
    Vuet.prototype.mapManuals = function (path) {
      return mapManuals(this, path);
    };
  },
  rule: function rule(_ref) {
    var path = _ref.path,
        name = _ref.name;

    return {
      beforeCreate: function beforeCreate() {
        debug.assertPath(this.$vuet, path);
        var _$vuet$_options$modul = this.$vuet._options.modules[path].manuals,
            manuals = _$vuet$_options$modul === undefined ? {} : _$vuet$_options$modul;

        var newName = name || manuals.name || '$' + this.$vuet.names[path];
        this[newName] = mapManuals(this.$vuet, path);
      }
    };
  }
};

var need = {
  rule: function rule(_ref) {
    var path = _ref.path;

    return {
      beforeCreate: function beforeCreate() {
        debug.assertPath(this.$vuet, path);
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
  rule: function rule(_ref) {
    var path = _ref.path;

    return {
      beforeCreate: function beforeCreate() {
        var _this = this;

        debug.assertPath(this.$vuet, path);
        if (this.$vuet[key][path] === false) {
          this.$vuet.fetch(path, { current: this }).then(function () {
            _this.$vuet[key][path] = true;
          });
        }
      }
    };
  }
};

var _name = 'route';
var _key = '__' + _name + '__';

var route = {
  init: function init(vuet) {
    utils.set(vuet, _key, {
      watchers: {},
      scrolls: {}
    });
    Object.keys(vuet.store).forEach(function (path) {
      utils.set(vuet[_key].watchers, path, []);
      utils.set(vuet[_key].scrolls, path, {});
    });
  },
  rule: function rule(_ref) {
    var path = _ref.path;

    // vuet-scroll
    function resetVuetScroll(vm) {
      var $scroll = vm.$vuet.store[path].$scroll;

      if ($scroll) {
        Object.keys($scroll).forEach(function (k) {
          $scroll[k].x = 0;
          $scroll[k].y = 0;
          $scroll[k].count = $scroll[k].count ? ++$scroll[k].count : 0;
        });
      }
    }

    // route-watch
    function getVuetWatchs(vuet) {
      return vuet[_key].watchers[path];
    }
    function setVuetWatchs(vuet, arr) {
      vuet[_key].watchers[path] = arr;
    }
    function getWatchs(obj, list) {
      if (typeof list === 'string') {
        list = [list];
      }
      var getObjVal = function getObjVal(route, str) {
        var obj = route;
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

        debug.assertPath(this.$vuet, path);
        var _$vuet$_options$modul = this.$vuet._options.modules[path].routeWatch,
            routeWatch = _$vuet$_options$modul === undefined ? 'fullPath' : _$vuet$_options$modul;

        var toWatch = getWatchs(this.$route, routeWatch);
        var watch = diffWatch(toWatch, getVuetWatchs(this.$vuet));
        if (watch) {
          this.$vuet.reset(path);
          setVuetWatchs(this.$vuet, toWatch);
          resetVuetScroll(this);
        }
        this.$vuet.fetch(path, { current: this, routeWatch: watch }, false).then(function (res) {
          if (diffWatch(toWatch, getWatchs(_this.$route, routeWatch))) return;
          _this.$vuet.setState(path, res);
          setVuetWatchs(_this.$vuet, toWatch);
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
            var watch = diffWatch(toWatch, fromWatch);
            if (!watch) return false;
            this.$vuet.fetch(path, { current: this, routeWatch: watch }).then(function (res) {
              if (diffWatch(toWatch, getWatchs(_this2.$route, routeWatch))) return;
              resetVuetScroll(_this2);
              _this2.$vuet.setState(path, res);
              setVuetWatchs(_this2.$vuet, toWatch);
            });
          }
        }
      }
    };
  }
};

function install$1(_Vue, Vuet) {
  Vuet.rule('life', life).rule('manual', manual).rule('need', need).rule('once', once).rule('route', route);
}

var Vuet$1 = function () {
  createClass(Vuet, null, [{
    key: 'install',
    value: function install$$1() {
      install.apply(undefined, arguments);
    }
  }, {
    key: 'rule',
    value: function rule(name, _rule) {
      if (this.options.rules[name]) return this;
      this.options.rules[name] = _rule;
      if (utils.isFunction(_rule.install)) {
        _rule.install(_Vue, Vuet);
      }
      return this;
    }
  }, {
    key: 'mapRules',
    value: function mapRules() {
      for (var _len = arguments.length, paths = Array(_len), _key = 0; _key < _len; _key++) {
        paths[_key] = arguments[_key];
      }

      var opt = utils.getArgMerge.apply(null, arguments);
      var vueRules = [];
      var addRule = function addRule(ruleName, any) {
        var rules = Vuet.options.rules[ruleName];
        if (typeof any === 'string') {
          vueRules.push(rules.rule({ path: any }));
        } else {
          vueRules.push(rules.rule(any));
        }
      };
      Object.keys(opt).forEach(function (ruleName) {
        var any = opt[ruleName];
        if (Array.isArray(any)) {
          return any.forEach(function (item) {
            addRule(ruleName, item);
          });
        }
        addRule(ruleName, any);
      });
      return {
        mixins: vueRules
      };
    }
  }, {
    key: 'mapModules',
    value: function mapModules() {
      var opt = utils.getArgMerge.apply(null, arguments);
      var computed = {};
      Object.keys(opt).forEach(function (k) {
        var path = opt[k];
        computed[k] = {
          get: function get$$1() {
            debug.assertPath(this.$vuet, path);
            return this.$vuet.store[path];
          },
          set: function set$$1(val) {
            debug.assertPath(this.$vuet, path);
            this.$vuet.store[path] = val;
          }
        };
      });
      return { computed: computed };
    }
  }, {
    key: 'use',
    value: function use(plugin, opt) {
      if (utils.isFunction(plugin)) {
        plugin(_Vue, Vuet, opt);
      } else if (utils.isFunction(plugin.install)) {
        plugin.install(_Vue, Vuet, opt);
      }
      return this;
    }
  }, {
    key: 'callRuleHook',
    value: function callRuleHook(hook, vuet) {
      var rules = Vuet.options.rules;

      for (var k in rules) {
        if (utils.isFunction(rules[k][hook])) {
          rules[k][hook](vuet);
        }
      }
    }
  }]);

  function Vuet(options) {
    classCallCheck(this, Vuet);

    if (!_Vue) {
      debug.error('must call Vue.use(Vuet) before creating a store instance');
    }
    if (typeof Promise === 'undefined') {
      debug.error('Vuet requires a Promise polyfill in this browser');
    }
    if (!utils.isObject(options)) {
      debug.error('Parameter is the object type');
    }
    this.version = '0.2.7';
    this.options = options || {};
    this.app = null;
    this.store = {};
    this.names = {};
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
      this._options = _extends({
        data: function data() {
          return {};
        },
        pathJoin: null
      }, this.options, {
        modules: {}
      });
      var keys = ['data', 'fetch', 'routeWatch', 'manuals'];
      var pathJoin = this._options.pathJoin;

      var initModule = function initModule(path, modules) {
        Object.keys(modules).forEach(function (k) {
          var item = modules[k];
          var _path = [].concat(toConsumableArray(path), [k]);
          if (utils.isFunction(item.data)) {
            var newPath = null;
            if (pathJoin) {
              newPath = _path.join(pathJoin);
            } else {
              newPath = [_path[0]];
              for (var i = 1; i < _path.length; i++) {
                newPath.push(_path[i].replace(/^(\w)/, function (v) {
                  return v.toUpperCase();
                }));
              }
              newPath = newPath.join('');
            }
            _this._options.modules[newPath] = item;
            _this.reset(newPath);
            _this.names[newPath] = k;
          }
          if (keys.indexOf(k) === -1 && utils.isObject(item)) {
            initModule(_path, item);
          }
        });
      };
      initModule([], this.options.modules);
      Vuet.callRuleHook('init', this);
    }
  }, {
    key: 'getState',
    value: function getState(path) {
      return this.store[path];
    }
  }, {
    key: 'setState',
    value: function setState(path, newState) {
      if (this.store[path] && Object.prototype.toString.call(this.store[path]) !== Object.prototype.toString.call(newState)) return this;
      if (!this.store[path] || !utils.isObject(newState)) {
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

      var opts = this._options.modules[path];
      if (typeof opts.fetch !== 'function') return Promise.resolve(this.getState(path));
      var data = {
        path: path,
        params: _extends({}, params),
        state: this.getState(path),
        route: this.app.$route || {},
        app: this.app
      };
      var callHook = function callHook(hook) {
        for (var _len2 = arguments.length, arg = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
          arg[_key2 - 1] = arguments[_key2];
        }

        for (var i = 0; i < _this2[hook].length; i++) {
          if (_this2[hook][i].apply(_this2, arg)) {
            return false;
          }
        }
      };
      if (callHook('beforeHooks', data) === false) return Promise.resolve(data.state);
      return opts.fetch.call(this, data).then(function (res) {
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
      var baseData = this._options.data.call(this);
      var data = this._options.modules[path].data;

      if (utils.isFunction(data)) {
        var any = data.call(this, path);
        if (utils.isObject(any)) {
          Object.assign(baseData, any);
          this.setState(path, baseData);
        } else {
          this.setState(path, any);
        }
      }
      return this;
    }
  }, {
    key: 'data',
    value: function data(path) {
      if (!utils.isObject(this._options.modules[path])) return null;
      var data = this._options.modules[path].data;

      return data.call(this);
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      this.vm.$destroy();
      Vuet.callRuleHook('destroy', this);
    }
  }]);
  return Vuet;
}();

Vuet$1.options = {
  rules: {}
};
Vuet$1.use(install$1);

var mapRules = Vuet$1.mapRules.bind(Vuet$1);
var mapModules = Vuet$1.mapModules.bind(Vuet$1);

exports.mapRules = mapRules;
exports.mapModules = mapModules;
exports['default'] = Vuet$1;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=vuet.js.map
