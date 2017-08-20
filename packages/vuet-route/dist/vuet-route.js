(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.VuetRoute = global.VuetRoute || {})));
}(this, (function (exports) { 'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
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

var NAME$1 = 'vuet-route';

var debug = {
  error: function error(msg) {
    throw new Error('[' + NAME$1 + '] ' + msg);
  },
  warn: function warn(msg) {
    {
      typeof console !== 'undefined' && console.warn('[' + NAME$1 + '] ' + msg);
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

var NAME = '__route__';

function isWatch(vuet, path, route) {
  var vtm = vuet.getModule(path);
  var watch = ['fullPath'];
  if (vtm.route.watch) {
    watch = vtm.route.watch;
  }
  watch = Array.isArray(watch) ? watch : [watch];
  var oldWatch = vuet[NAME][path]; // old
  vuet[NAME][path] = []; // new
  watch.forEach(function (k) {
    var data = route;
    k.split('.').forEach(function (chlidKey) {
      data = data[chlidKey];
    });
    vuet[NAME][path].push(JSON.stringify(data));
  });
  return oldWatch.join() !== vuet[NAME][path].join();
}

var index = {
  init: function init(vuet) {
    vuet[NAME] = {};
  },
  addModule: function addModule(vuet, path) {
    vuet[NAME][path] = [];
    if (!util.isObject(vuet.getModule(path).route)) {
      vuet.getModule(path).route = {};
    }
  },
  rule: function rule(_ref) {
    var path = _ref.path;

    return {
      beforeCreate: function beforeCreate() {
        debug.assertFetch(this.$vuet, path);
        if (!this.$route) {
          debug.error('The \'vue-router\' module is not installed');
        }
        var vtm = this.$vuet.getModule(path);
        if (!util.isObject(vtm.state)) {
          debug.error('\'' + path + '\' module state must be the object type');
        }
        if (isWatch(this.$vuet, path, this.$route)) {
          vtm.reset();
          vtm.state.__routeLoaded__ = true;
          return vtm.fetch(vtm);
        }
        if (vtm.route.once !== true || !vtm.state.__routeLoaded__) {
          // default
          vtm.state.__routeLoaded__ = true;
          return vtm.fetch(vtm);
        }
      },

      watch: {
        $route: {
          deep: true,
          handler: function handler(to, from) {
            var vtm = this.$vuet.getModule(path);
            if (isWatch(this.$vuet, path, to)) {
              vtm.reset();
              vtm.state.__routeLoaded__ = true;
              vtm.fetch(vtm);
            }
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
