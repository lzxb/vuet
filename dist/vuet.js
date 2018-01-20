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





var defineProperty = function (obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
};

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

var util = {
  isObject: function isObject(obj) {
    return !!obj && Object.prototype.toString.call(obj) === '[object Object]';
  },
  getArgMerge: function getArgMerge() {
    var opt = {};
    var args = arguments;
    if (typeof args[0] === 'string') {
      opt[args[0]] = args.length > 1 ? args[1] : args[0];
    } else if (args[0] && util.isObject(args[0])) {
      opt = args[0];
    }
    return opt;
  },
  isPromise: function isPromise(obj) {
    return ((typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object' || typeof obj === 'function') && !!obj && typeof obj.then === 'function';
  }
};

var _Vue = void 0;

var VuetStatic = function (Vuet) {
  _extends(Vuet, {
    installed: false,
    options: {
      rules: {},
      module: {
        reset: function reset() {
          this.state = this.data();
          return this;
        }
      }
    },
    install: function install(Vue) {
      if (this.installed) return this;
      this.installed = true;
      _Vue = Vue;
      Object.defineProperty(Vue.prototype, '$vuet', {
        get: function get$$1() {
          return this.$root._vuet;
        }
      });
      Vue.mixin({
        beforeCreate: function beforeCreate() {
          if (typeof this.$options.vuet !== 'undefined') {
            if (this.$options.vuet instanceof Vuet) {
              this._vuet = this.$options.vuet;
              this._vuet._init(this);
            }
          }
        },
        destroyed: function destroyed() {
          if (typeof this.$options.vuet !== 'undefined') {
            if (this.$options.vuet instanceof Vuet) {
              this._vuet.destroy(this);
            }
          }
        }
      });
      return this;
    },
    mapModules: function mapModules(opts) {
      var mixins = Object.keys(opts).map(function (alias) {
        var path = opts[alias];
        return {
          computed: defineProperty({}, alias, {
            get: function get$$1() {
              debug.assertModule(this.$vuet, path);
              return this.$vuet.getModule(path);
            },
            set: function set$$1(val) {
              debug.error('The\'' + path + '\'module is not allowed to assign');
            }
          })
        };
      });
      return {
        mixins: mixins
      };
    },
    mapRules: function mapRules() {
      var opts = util.getArgMerge.apply(null, arguments);
      var vueRules = [];
      var addRule = function addRule(ruleName, any) {
        var rules = Vuet.options.rules[ruleName];
        if (!util.isObject(rules)) debug.error('The\'' + ruleName + '\'rule does not exist. Please make sure that it executes \'Vuet.rule(\'' + ruleName + '\', opts)\' before all components');
        if (typeof any === 'string') {
          vueRules.push(rules.rule({ path: any }));
        } else {
          vueRules.push(rules.rule(any));
        }
      };
      Object.keys(opts).forEach(function (ruleName) {
        var any = opts[ruleName];
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
    },
    rule: function rule() {
      Vuet.options.rules[arguments[0]] = arguments[1];
      if (typeof arguments[1].install === 'function') {
        arguments[1].install(Vuet, _Vue);
      }
      return this;
    },
    callRuleHook: function callRuleHook(hook) {
      for (var _len = arguments.length, arg = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        arg[_key - 1] = arguments[_key];
      }

      Object.keys(Vuet.options.rules).forEach(function (k) {
        if (typeof Vuet.options.rules[k][hook] === 'function') {
          Vuet.options.rules[k][hook].apply(undefined, arg);
        }
      });
    }
  });
};

var NAME = 'vuet';

var debug = {
  error: function error(msg) {
    throw new Error('[' + NAME + '] ' + msg);
  },
  warn: function warn(msg) {
    {
      typeof console !== 'undefined' && console.warn('[' + NAME + '] ' + msg);
    }
  },
  assertModule: function assertModule(vuet, path) {
    if (path in vuet.modules) {
      return;
    }
    this.error('The \'' + path + '\' module does not exist');
  },
  assertVue: function assertVue() {
    if (!_Vue) {
      this.error('must call Vue.use(Vuet) before creating a store instance');
    }
  },
  assertFetch: function assertFetch(vuet, path) {
    this.assertModule(vuet, path);
    if (typeof vuet.getModule(path).fetch !== 'function') {
      this.error('\'' + path + '\' module \'fetch\' must be the function type');
    }
  }
};

var need = {
  rule: function rule(_ref) {
    var path = _ref.path;

    return {
      beforeCreate: function beforeCreate() {
        debug.assertFetch(this.$vuet, path);
        this.$vuet.getModule(path).fetch();
      }
    };
  }
};

var NAME$1 = '__once__';

var once = {
  init: function init(vuet) {
    vuet[NAME$1] = [];
  },
  rule: function rule(_ref) {
    var path = _ref.path;

    return {
      beforeCreate: function beforeCreate() {
        debug.assertFetch(this.$vuet, path);
        var vuet = this.$vuet;
        if (vuet[NAME$1].indexOf(path) > -1) return;
        var back = this.$vuet.getModule(path).fetch();
        if (util.isPromise(back)) {
          return back.then(function (res) {
            vuet[NAME$1].push(path);
          });
        }
        vuet[NAME$1].push(path);
      }
    };
  }
};

var reset = {
  rule: function rule(_ref) {
    var path = _ref.path;

    return {
      beforeCreate: function beforeCreate() {
        debug.assertModule(this.$vuet, path);
      },
      destroyed: function destroyed() {
        this.$vuet.getModule(path).reset();
      }
    };
  }
};

var temp = {
  rule: function rule(_ref) {
    var path = _ref.path;

    return {
      beforeCreate: function beforeCreate() {
        debug.assertFetch(this.$vuet, path);
        this.$vuet.getModule(path).fetch();
      },
      destroyed: function destroyed() {
        this.$vuet.getModule(path).reset();
      }
    };
  }
};

function install(Vuet) {
  Vuet.rule('need', need).rule('once', once).rule('temp', temp).rule('reset', reset);
}

var Vuet$1 = function () {
  function Vuet(opts) {
    var _this = this;

    classCallCheck(this, Vuet);

    debug.assertVue();
    // debug.assertPromise()
    this.version = '1.0.3';
    this.modules = {};
    this.store = {};
    this.options = {
      pathJoin: '/',
      modules: {}
    };
    this.app = null;
    this.vm = new _Vue({
      data: {
        modules: this.store
      }
    });
    _extends(this.options, opts);
    Vuet.callRuleHook('init', this);
    Object.keys(this.options.modules).forEach(function (k) {
      _this.addModules(k, _this.options.modules[k]);
    });
  }

  createClass(Vuet, [{
    key: '_init',
    value: function _init(app) {
      this.app = app;
    }
  }, {
    key: 'addModules',
    value: function addModules(path, modules) {
      var _this2 = this;

      if (util.isObject(modules.modules)) {
        Object.keys(modules.modules).forEach(function (k) {
          _this2.addModules('' + path + _this2.options.pathJoin + k, modules.modules[k]);
        });
      }
      if (typeof modules.data !== 'function') return this;
      var vuet = this;
      var opts = _extends({}, Vuet.options.module, modules);
      _Vue.set(vuet.store, path, opts.data());
      vuet.modules[path] = opts;
      Object.defineProperty(opts, 'vuet', {
        get: function get$$1() {
          return vuet;
        }
      });
      Object.defineProperty(opts, 'app', {
        get: function get$$1() {
          return vuet.app;
        }
      });
      Object.defineProperty(opts, 'state', {
        get: function get$$1() {
          return vuet.store[path];
        },
        set: function set$$1(val) {
          vuet.store[path] = val;
        }
      });
      Object.keys(opts).forEach(function (k) {
        if (typeof opts[k] === 'function') {
          var native = opts[k];
          opts[k] = function proxy() {
            return native.apply(vuet.modules[path], arguments);
          };
        }
      });
      if (util.isObject(opts.state)) {
        Object.keys(opts.state).forEach(function (k) {
          if (k in opts) {
            return debug.warn('\'' + path + '\' the \'' + k + '\' already exists on the object');
          }
          Object.defineProperty(opts, k, {
            get: function get$$1() {
              return vuet.store[path][k];
            },
            set: function set$$1(val) {
              vuet.store[path][k] = val;
            }
          });
        });
      }
      Vuet.callRuleHook('addModule', this, path);
      return this.getModule(path);
    }
  }, {
    key: 'getModule',
    value: function getModule(path) {
      debug.assertModule(this, path);
      return this.modules[path];
    }
  }, {
    key: 'getState',
    value: function getState(path) {
      debug.assertModule(this, path);
      return this.modules[path].state;
    }
  }, {
    key: 'replaceStore',
    value: function replaceStore(store) {
      this.store = this.vm.$data.modules = store;
      return this;
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

VuetStatic(Vuet$1);
install(Vuet$1);
var mapRules = Vuet$1.mapRules.bind(Vuet$1);
var mapModules = Vuet$1.mapModules.bind(Vuet$1);

exports.mapRules = mapRules;
exports.mapModules = mapModules;
exports['default'] = Vuet$1;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=vuet.js.map
