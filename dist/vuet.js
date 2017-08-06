(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.Vuet = global.Vuet || {})));
}(this, (function (exports) { 'use strict';

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

var VuetModule = function VuetModule(opts) {
  var _this = this;

  classCallCheck(this, VuetModule);

  this.methods = {};
  Object.keys(opts).forEach(function (k) {
    if (typeof opts[k] === 'function') {
      _this.methods[k] = opts[k].bind(_this);
    }
  });
  this.state = this.methods.data();
};

var Vuet$1 = function () {
  function Vuet() {
    classCallCheck(this, Vuet);

    this.modules = {};
    this.app = new Vuet.Vue({
      data: {
        modules: this.modules
      }
    });
  }

  createClass(Vuet, [{
    key: '_init',
    value: function _init() {}
  }, {
    key: 'register',
    value: function register(path, opts) {
      var vtm = new VuetModule(opts);
      Vuet.Vue.set(this.modules, path, vtm.methods);
      this.modules[path] = vtm;
    }
  }, {
    key: 'destroy',
    value: function destroy() {}
  }]);
  return Vuet;
}();

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
      var mixins = Object.keys(opts).map(function (name) {
        var _computed;

        var path = opts[name];
        return {
          computed: (_computed = {}, defineProperty(_computed, name, {
            get: function get$$1() {
              return this.$vuet.modules[path].state;
            },
            set: function set$$1(val) {
              this.$vuet.modules[path].state = val;
            }
          }), defineProperty(_computed, '$' + name, {
            get: function get$$1() {
              return this.$vuet.modules[path].methods;
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
      return {};
    }
  });
};

VuetStatic(Vuet$1);

exports['default'] = Vuet$1;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=vuet.js.map
