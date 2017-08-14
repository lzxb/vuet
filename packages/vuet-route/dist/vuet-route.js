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

function isWatch(vuet, path, route) {
  var vtm = vuet.getModule(path);
  var watch = vtm.route.watch || ['fullPath'];
  watch = Array.isArray(watch) ? watch : [watch];
  var oldWatch = vuet[NAME][path];
  vuet[NAME][path] = [];
  watch.forEach(function (k) {
    var data = route;
    k.split('.').forEach(function (chlidKey) {
      data = data[chlidKey];
    });
    vuet[NAME][path].push(JSON.stringify(data));
  });
  return oldWatch.join() !== vuet[NAME][path].join();
}

function resetVuetScroll(vtm) {
  var $scroll = vtm.state.$scroll;

  if ($scroll) {
    Object.keys($scroll).forEach(function (k) {
      $scroll[k].x = 0;
      $scroll[k].y = 0;
    });
  }
}

var index = {
  init: function init(vuet) {
    vuet[NAME] = {};
  },
  addModules: function addModules(vuet, path) {
    vuet[NAME][path] = [];
    var vtm = vuet.getModule(path);
    Object.keys(vtm.route).forEach(function (k) {
      if (typeof vtm.route[k] === 'function') {
        vtm.route[k] = vtm.route[k].bind(vtm);
      }
    });
  },
  rule: function rule(_ref) {
    var path = _ref.path;

    return {
      beforeCreate: function beforeCreate() {
        debug.assertModule(this.$vuet, path);
        var vtm = this.$vuet.getModule(path);
        if (isWatch(this.$vuet, path, this.$route)) {
          vtm.reset();
          resetVuetScroll(vtm);
        }
        vtm.route.fetch(vtm);
      },

      watch: {
        $route: {
          deep: true,
          handler: function handler(to, from) {
            var vtm = this.$vuet.getModule(path);
            if (isWatch(this.$vuet, path, to)) {
              vtm.reset();
              resetVuetScroll(vtm);
            }
            vtm.route.fetch(vtm);
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
