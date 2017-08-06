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
  assertPath: function assertPath(vuet, name) {
    if (name in vuet.modules) {
      return;
    }
    this.error('The \'' + name + '\' module does not exist');
  }
};

var life = {
  rule: function rule(_ref) {
    var name = _ref.name;

    return {
      beforeCreate: function beforeCreate() {
        debug.assertPath(this.$vuet, name);
        this.$vuet.signin(name).fetch();
      },
      destroyed: function destroyed() {
        this.$vuet.signin(name).reset();
      }
    };
  }
};

var need = {
  rule: function rule(_ref) {
    var name = _ref.name;

    return {
      beforeCreate: function beforeCreate() {
        debug.assertPath(this.$vuet, name);
        this.$vuet.signin(name).fetch();
      }
    };
  }
};

function install(Vuet) {
  Vuet.rule('life', life).rule('need', need);
}

var utils = {
  isObject: function isObject(obj) {
    return obj && Object.prototype.toString(obj);
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

        var name = opts[alias];
        return {
          computed: (_computed = {}, defineProperty(_computed, alias, {
            get: function get$$1() {
              debug.assertPath(this.$vuet, name);
              return this.$vuet.modules[name].state;
            },
            set: function set$$1(val) {
              debug.assertPath(this.$vuet, name);
              this.$vuet.modules[name].state = val;
            }
          }), defineProperty(_computed, '$' + alias, {
            get: function get$$1() {
              debug.assertPath(this.$vuet, name);
              return this.$vuet.modules[name];
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
          vueRules.push(rules.rule({ name: any }));
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
    rule: function rule(name, opts) {
      Vuet.options.rules[name] = opts;
      return this;
    }
  });
};

var Vuet$1 = function () {
  function Vuet(opts) {
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
  }

  createClass(Vuet, [{
    key: '_init',
    value: function _init() {}
  }, {
    key: 'register',
    value: function register(name, opts) {
      var vuet = this;
      Vuet.Vue.set(vuet.store, name, opts.data());
      Object.defineProperty(opts, 'state', {
        get: function get$$1() {
          return vuet.store[name];
        },
        set: function set$$1(val) {
          vuet.store[name] = val;
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
            return native.apply(vuet.modules[name], arguments);
          };
        }
      });
      if (utils.isObject(opts.state)) {
        Object.keys(opts.state).forEach(function (k) {
          Object.defineProperty(opts, k, {
            get: function get$$1() {
              return vuet.store[name][k];
            },
            set: function set$$1(val) {
              vuet.store[name][k] = val;
            }
          });
        });
      }
      vuet.modules[name] = opts;
    }
  }, {
    key: 'signin',
    value: function signin(name) {
      return this.modules[name];
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
