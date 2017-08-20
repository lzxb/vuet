(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.VuetStore = global.VuetStore || {})));
}(this, (function (exports) { 'use strict';

var _Vue = void 0;

var NAME = 'vuet-store';

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

var getName = function getName(path) {
  return '__vuet_store_' + path + '__';
};

var setItem = function setItem(path, data) {
  setTimeout(function () {
    localStorage.setItem(getName(path), JSON.stringify(data));
  }, 0);
};

var index = {
  addModule: function addModule(vuet, path) {
    var store = JSON.parse(localStorage.getItem(getName(path)));
    if (store) {
      vuet.getModule(path).state = store;
    }
  },
  rule: function rule(_ref) {
    var path = _ref.path;

    return {
      created: function created() {
        debug.assertModule(this.$vuet, path);
        setItem(path, this.$vuet.getModule(path).state);
        this[getName(path)] = this.$vuet.app.$watch(function () {
          return this.$vuet.getModule(path).state;
        }, function (newVal) {
          setItem(path, newVal);
        }, {
          deep: true
        });
      },
      destroyed: function destroyed() {
        this[getName(path)].unwatch();
        delete this[getName(path)];
      }
    };
  }
};

exports['default'] = index;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=vuet-store.js.map
