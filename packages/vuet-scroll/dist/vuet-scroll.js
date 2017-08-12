(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.VuetScroll = global.VuetScroll || {})));
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
          // _Vue.set(opt.store, '$scroll', {})
        }
        if (!opt.store.$scroll[opt.name]) {
          // _Vue.set(opt.store.$scroll, opt.name, { x: 0, y: 0 })
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

var VuetScroll$1 = {
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

var index = {
  install: function install(Vuet, Vue) {
    Vue.directive('vuet-scroll', VuetScroll$1);
  }
};

exports['default'] = index;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=vuet-scroll.js.map
