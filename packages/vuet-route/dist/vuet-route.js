(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.VuetRoute = global.VuetRoute || {})));
}(this, (function (exports) { 'use strict';

var _Vue = void 0;

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
  },
  assertVue: function assertVue() {
    if (!_Vue) {
      this.error('must call Vue.use(Vuet) before creating a store instance');
    }
  },
  assertPromise: function assertPromise() {
    if (typeof Promise === 'undefined') {
      this.error('Vuet requires a Promise polyfill in this browser');
    }
  }
};

// import util from '../../../src/util'

var NAME = '__route__';

var index = {
  init: function init(vuet) {
    vuet[NAME] = {};
  },
  register: function register(vuet, path) {
    vuet[NAME][path] = '';
  },
  rule: function rule(_ref) {
    var path = _ref.path;

    return {
      beforeCreate: function beforeCreate() {
        debug.assertModule(this.$vuet, path);
        var vuet = this.$vuet;
        var vtm = vuet.getModule(path);
        // let watch = vtm.route.watch
        // watch = Array.isArray(watch) ? watch : [watch]
        // watch.forEach(k => {
        //   vuet[NAME][path] += JSON.stringify(this.$route[k])
        // })
        // console.log(vuet[NAME])
        vtm.route.fetch.call(vtm);
      },

      watch: {
        $route: {
          deep: true,
          handler: function handler(to, from) {
            var vtm = this.$vuet.getModule(path);
            vtm.reset();
            vtm.route.fetch.call(vtm);
          }
        }
      }
    };
  }
};

exports['default'] = index;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=vuet-route.js.map
