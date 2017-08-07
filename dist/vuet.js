(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.Vuet = global.Vuet || {})));
}(this, (function (exports) { 'use strict';

var debug = {
  error: function error(msg) {
    throw new Error('[vuet] ' + msg);
  },
  warn: function warn(msg) {
    {
      typeof console !== 'undefined' && console.warn('[vuet] ' + msg);
    }
  },
  assertModule: function assertModule(vuet, name) {
    if (name in vuet.modules) {
      return;
    }
    this.error('The \'' + name + '\' module does not exist');
  }
};

var life = {
  rule: function rule(_ref) {
    var path = _ref.path;

    return {
      beforeCreate: function beforeCreate() {
        debug.assertModule(this.$vuet, path);
        this.$vuet.getModule(path).fetch();
      },
      destroyed: function destroyed() {
        this.$vuet.getModule(path).reset();
      }
    };
  }
};

var need = {
  rule: function rule(_ref) {
    var path = _ref.path;

    return {
      beforeCreate: function beforeCreate() {
        debug.assertModule(this.$vuet, path);
        this.$vuet.getModule(path).fetch();
      }
    };
  }
};

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



































var toConsumableArray = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  } else {
    return Array.from(arr);
  }
};

var utils = {
  isObject: function isObject(obj) {
    return !!obj && Object.prototype.toString.call(obj) === '[object Object]';
  },
  getArgMerge: function getArgMerge() {
    var opt = {};
    var args = arguments;
    if (typeof args[0] === 'string') {
      opt[args[0]] = args.length > 1 ? args[1] : args[0];
    } else if (args[0] && utils.isObject(args[0])) {
      opt = args[0];
    }
    return opt;
  },
  isPromise: function isPromise(obj) {
    return !!obj && ((typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object' || typeof obj === 'function') && typeof obj.then === 'function';
  }
};

var once = {
  init: function init(vuet) {
    vuet.__once__ = {};
  },
  rule: function rule(_ref) {
    var path = _ref.path;

    return {
      beforeCreate: function beforeCreate() {
        var _this = this;

        debug.assertModule(this.$vuet, path);
        if (this.$vuet.__once__[path]) return;
        var back = this.$vuet.getModule(path).fetch();
        if (utils.isPromise(back)) {
          return back.then(function (res) {
            _this.$vuet.__once__[path] = true;
          });
        }
        this.$vuet.__once__[path] = true;
      }
    };
  }
};

function install(Vuet) {
  Vuet.rule('life', life).rule('need', need).rule('once', once);
}

var VuetStatic = function (Vuet) {
  Object.assign(Vuet, {
    installed: false,
    options: {
      rules: {}
    },
    install: function install(Vue) {
      if (this.installed) return this;
      this.installed = true;
      this.Vue = Vue;
      Object.defineProperty(Vue.prototype, '$vuet', {
        get: function get$$1() {
          return this.$root._vuet;
        }
      });
      Vue.mixin({
        beforeCreate: function beforeCreate() {
          if (typeof this.$options.vuet !== 'undefined') {
            this._vuet = this.$options.vuet;
            // this._vuet._init(this)
          }
        },
        destroyed: function destroyed() {
          if (typeof this.$options.vuet !== 'undefined') {
            this._vuet = this.$options.vuet;
            this._vuet.destroy(this);
          }
        }
      });
      return this;
    },
    mapModules: function mapModules(opts) {
      var mixins = Object.keys(opts).map(function (alias) {
        var _computed;

        var path = opts[alias];
        return {
          computed: (_computed = {}, defineProperty(_computed, alias, {
            get: function get$$1() {
              debug.assertModule(this.$vuet, path);
              return this.$vuet.modules[path].state;
            },
            set: function set$$1(val) {
              debug.assertModule(this.$vuet, path);
              this.$vuet.modules[path].state = val;
            }
          }), defineProperty(_computed, '$' + alias, {
            get: function get$$1() {
              debug.assertModule(this.$vuet, path);
              return this.$vuet.modules[path];
            },
            set: function set$$1() {}
          }), _computed)
        };
      });
      return {
        mixins: mixins
      };
    },
    mapRules: function mapRules() {
      var opts = utils.getArgMerge.apply(null, arguments);
      var vueRules = [];
      var addRule = function addRule(ruleName, any) {
        var rules = Vuet.options.rules[ruleName];
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
      return this;
    },
    callRuleHook: function callRuleHook(hook, vuet) {
      Object.keys(Vuet.options.rules).forEach(function (k) {
        if (typeof Vuet.options.rules[k][hook] === 'function') {
          Vuet.options.rules[k][hook](vuet);
        }
      });
    }
  });
};

var Vuet$1 = function () {
  function Vuet(opts) {
    var _this = this;

    classCallCheck(this, Vuet);

    this.modules = {};
    this.store = {};
    this.options = {
      pathJoin: '/',
      modules: {}
    };
    this.app = new Vuet.Vue({
      data: {
        modules: this.store
      }
    });
    Object.assign(this.options, opts);
    var initModule = function initModule(paths, modules) {
      Object.keys(modules).forEach(function (path) {
        var newNames = [].concat(toConsumableArray(paths), [path]);
        var newName = newNames.join(_this.options.pathJoin);
        if (!utils.isObject(modules[path])) return;
        if (typeof modules[path].data === 'function') {
          _this.register(newName, modules[path]);
        }
        Object.keys(modules[path]).forEach(function (chlidName) {
          if (utils.isObject(modules[path][chlidName])) {
            initModule(newNames, modules[path]);
          }
        });
      });
    };
    initModule([], this.options.modules);
    Vuet.callRuleHook('init', this);
  }

  createClass(Vuet, [{
    key: '_init',
    value: function _init() {}
  }, {
    key: 'register',
    value: function register(path, opts) {
      var vuet = this;
      Vuet.Vue.set(vuet.store, path, opts.data());
      Object.defineProperty(opts, 'state', {
        get: function get$$1() {
          return vuet.store[path];
        },
        set: function set$$1(val) {
          vuet.store[path] = val;
        }
      });
      Object.assign(opts, {
        reset: function reset() {
          this.state = this.data();
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
      if (utils.isObject(opts.state)) {
        Object.keys(opts.state).forEach(function (k) {
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
      vuet.modules[path] = opts;
      return this;
    }
  }, {
    key: 'getModule',
    value: function getModule(path) {
      return this.modules[path];
    }
  }, {
    key: 'getState',
    value: function getState(path) {
      return this.modules[path].state;
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      this.vm.$destroy();
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
