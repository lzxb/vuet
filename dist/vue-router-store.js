(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.VueRouterStore = global.VueRouterStore || {})));
}(this, (function (exports) { 'use strict';

var _Vue = null;

var isDef = function isDef(v) {
  return v !== undefined;
};

function install(Vue) {
  if (install.installed) return;
  install.installed = true;
  _Vue = Vue;
  Object.defineProperty(Vue.prototype, '$vrs', {
    get: function get() {
      return this.$root._vrs;
    }
  });
  Object.defineProperty(Vue.prototype, '$rs', {
    get: function get() {
      return this.$root._vrs.store;
    }
  });
  Vue.mixin({
    beforeCreate: function beforeCreate() {
      if (isDef(this.$options.vrs)) {
        this._vrs = this.$options.vrs;
      }
    }
  });
}

function options() {
  var opt = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var options = {
    pagekey: 'page', // this.$route.query[pagekey]
    queryKey: 'query', // this.$data[queryKey]
    detailParamsKey: 'id', // this.$route.params[detailParamsKey]
    fetchBefore: function fetchBefore(name, type) {
      // Callback method before requesting to send
      // This points to the component instance
    },
    fetchAfter: function fetchAfter(name, type) {
      // After the request ends, the callback method, regardless of success or failure
      // This points to the component instance
    },
    fetchSuccess: function fetchSuccess(res, name, type) {
      // Request successful callback
    },
    fetchError: function fetchError(e, name, type) {
      // Request failed callback
    },
    baseData: function baseData(name, type) {
      // All use
      return {};
    },
    baseListData: function baseListData(name) {
      // List all use
      return {};
    },
    baseDetailData: function baseDetailData(name) {
      // Detail all use
      return {};
    },

    modules: {}
  };
  return Object.assign(options, opt);
}

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

var utils = {
  isObject: function isObject(obj) {
    return Object.prototype.toString.call(obj) === '[object Object]';
  },
  isArray: function isArray(arr) {
    return Object.prototype.toString.call(arr) === '[object Array]';
  },
  isFunction: function isFunction(arr) {
    return Object.prototype.toString.call(arr) === '[object Function]';
  },
  next: function next(fn, resolve) {
    var reject = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function (e) {};

    var btn = false;
    var back = fn(resolve, reject);
    if ((typeof back === 'undefined' ? 'undefined' : _typeof(back)) === 'object' && utils.isFunction(back.then)) {
      back.then(function (res) {
        if (btn) return;
        btn = true;
        resolve(res);
      }).catch(reject);
    }
  }
};

var debug = {
  error: function error(msg) {
    throw new Error('[vue-router-store] ' + msg);
  },
  warn: function warn(msg) {
    if (process.env.NODE_ENV !== 'production') {
      typeof console !== 'undefined' && console.warn('[vue-router-store] ' + msg);
    }
  }
};

var VueRouterStore$1 = function () {
  function VueRouterStore(opt) {
    classCallCheck(this, VueRouterStore);

    this.options = options(opt = opt || {});
    this._init();
  }

  createClass(VueRouterStore, [{
    key: '_init',
    value: function _init() {
      var _this = this;

      var store = {};
      var _fetchKey = {};
      Object.keys(this.options.modules).forEach(function (name) {
        store[name] = {
          list: _this._getData(name, 'list'),
          detail: _this._getData(name, 'detail')
        };
        _fetchKey[name] = {
          list: '',
          detail: ''
        };
      });
      this.store = new _Vue({
        data: {
          store: store
        }
      }).$data.store;
      this._fetchKey = _fetchKey;
    }
  }, {
    key: '_getModuleOptions',
    value: function _getModuleOptions(name, type) {
      var options$$1 = this.options.modules[name];
      var defaults$$1 = {
        pagekey: this.options.pagekey,
        queryKey: this.options.queryKey,
        paramsKey: this.options.detailParamsKey,
        fetch: function fetch(next) {
          return {};
        },
        data: function data() {
          return {};
        }
      };
      Object.keys(options$$1).forEach(function (k) {
        var name = k.split(type)[1] || '';
        name = name.replace(/^(\w)/, function (v) {
          return v.toLowerCase();
        }); // 首字母大写
        if (name) {
          defaults$$1[name] = options$$1[k];
        } else {
          defaults$$1[name] = options$$1[k];
        }
      });
      return defaults$$1;
    }
  }, {
    key: '_returnComput',
    value: function _returnComput(comput, diy) {
      var obj = {};
      if (!diy.length) return comput;
      diy.forEach(function (k) {
        obj[k] = comput[k];
      });
      return obj;
    }
  }, {
    key: '_getData',
    value: function _getData(name, type) {
      var data = this.options.baseData.call(this, name, type);
      switch (type) {
        case 'list':
          Object.assign(data, this.options.baseListData.call(this, name));
          break;
        case 'detail':
          Object.assign(data, this.options.baseDetailData.call(this, name));
          break;
      }
      var options$$1 = this._getModuleOptions(name, type);
      return Object.assign(data, options$$1.data.call(this));
    }
  }, {
    key: '_clearStore',
    value: function _clearStore(name, type) {
      var data = this._getData(name, type);
      this._setStore(name, type, data);
    }
  }, {
    key: '_getStore',
    value: function _getStore(name, type) {
      return this.store[name][type];
    }
  }, {
    key: '_setStore',
    value: function _setStore(name, type, data) {
      var store = this.store[name][type];
      Object.assign(store, data);
    }
  }, {
    key: '_getComputed',
    value: function _getComputed(name, type) {
      var store = this.store[name][type];
      var computed = {};
      Object.keys(store).forEach(function (k) {
        computed[k] = {
          get: function get$$1() {
            return store[k];
          },
          set: function set$$1(val) {
            store[k] = val;
          }
        };
      });
      return computed;
    }
  }, {
    key: '_setFetchKey',
    value: function _setFetchKey(name, type, val) {
      this._fetchKey[name][type] = String(val);
    }
  }, {
    key: '_getFetchKey',
    value: function _getFetchKey(name, type) {
      return this._fetchKey[name][type];
    }
  }, {
    key: 'listStore',
    value: function listStore(name) {
      var self = this;
      var type = 'list';
      var options$$1 = self._getModuleOptions(name, type);
      var computed = _extends({}, self._getComputed(name, type), {
        $rsList: function $rsList() {
          var vm = this;

          function rsList() {
            var fetch = self._getModuleOptions(name, type).fetch;
            if (!utils.isFunction(fetch)) {
              return debug.error(type + ' fetch method is undefined');
            }
            var fullPath = vm.$route.fullPath;
            self.options.fetchBefore.call(vm, name, type);
            utils.next(fetch.bind(vm), function (res) {
              var back = self.options.fetchSuccess.call(vm, res, name, type);
              if (utils.isObject(back)) {
                res = back;
              }
              if (fullPath !== vm.$route.fullPath) return;
              self._setStore(name, type, res);
              self._setFetchKey(name, type, fullPath);
              self.options.fetchAfter.call(vm, name, type);
            }, function (e) {
              self.options.fetchError.call(vm, e, name, type);
              self.options.fetchAfter.call(vm, name, type);
            });
          }
          rsList.init = function init() {
            self._clearStore(name, type);
          };

          rsList.search = function search() {
            var query = {};
            /* eslint-disable no-undef */

            for (var _len2 = arguments.length, arg = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
              arg[_key2] = arguments[_key2];
            }

            if ((typeof event === 'undefined' ? 'undefined' : _typeof(event)) === 'object' && event === arg[0]) {
              arg[0] = {};
            }
            if (utils.isObject(arg[0])) {
              // search({})
              query = arg[0];
            } else if (typeof arg[0] === 'string') {
              // search('key', val)
              query[arg[0]] = arg[1];
            }
            query = Object.assign({}, vm.$route.query, defineProperty({}, options$$1.pagekey, '1'), vm[options$$1.queryKey], query);
            vm.$router.push(_extends({}, vm.$route, {
              query: query
            }));
          };
          rsList.syncQuery = function syncQuery() {
            var query = vm[options$$1.queryKey];
            if (utils.isObject(query)) {
              Object.keys(query).forEach(function (k) {
                if (Object.prototype.hasOwnProperty.call(vm.$route.query, k)) {
                  query[k] = vm.$route.query[k];
                }
              });
            }
          };
          return rsList;
        }
      });

      for (var _len = arguments.length, diy = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        diy[_key - 1] = arguments[_key];
      }

      return this._returnComput(computed, diy);
    }
  }, {
    key: 'listMixin',
    value: function listMixin(name) {
      var self = this;
      var type = 'list';
      return {
        beforeRouteEnter: function beforeRouteEnter(to, from, next) {
          var key = self._getFetchKey(name, type);
          var toKey = to.fullPath;
          if (!key) {
            self._setFetchKey(name, type, toKey);
          } else if (key !== toKey) {
            self._clearStore(name, type);
            self._setFetchKey(name, type, toKey);
          }
          if (utils.isFunction(next)) {
            next();
          }
        },

        computed: self.listStore(name),
        created: function created() {
          this.$rsList.syncQuery();
          this.$rsList();
        },

        watch: {
          '$route.fullPath': function $routeFullPath() {
            this.$rsList.syncQuery();
            this.$rsList();
          }
        }
      };
    }
  }, {
    key: 'detailStore',
    value: function detailStore(name) {
      var self = this;
      var type = 'detail';
      var options$$1 = self._getModuleOptions(name, type);
      var computed = _extends({}, self._getComputed(name, type), {
        $rsDetail: function $rsDetail() {
          var vm = this;
          function rsDetail() {
            var key = vm.$route.path;
            if (!vm.$route.params[options$$1.paramsKey]) return;
            var fetch = options$$1.fetch;
            if (!utils.isFunction(fetch)) {
              return debug.error(type + ' fetch method is undefined');
            }
            self.options.fetchBefore.call(vm, name, type);
            utils.next(fetch.bind(vm), function (res) {
              var back = self.options.fetchSuccess.call(vm, res, name, type);
              if (utils.isObject(back)) {
                res = back;
              }
              if (key !== vm.$route.path) return;
              self._setStore(name, type, res);
              self._setFetchKey(name, type, key);
              self.options.fetchAfter.call(vm, name, type);
            }, function (e) {
              self.options.fetchError.call(vm, e, name, type);
              self.options.fetchAfter.call(vm, name, type);
            });
          }
          rsDetail.init = function init() {
            self._clearStore(name, type);
          };
          return rsDetail;
        }
      });

      for (var _len3 = arguments.length, diy = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
        diy[_key3 - 1] = arguments[_key3];
      }

      return this._returnComput(computed, diy);
    }
  }, {
    key: 'detailMixin',
    value: function detailMixin(name) {
      var self = this;
      var type = 'detail';
      return {
        beforeRouteEnter: function beforeRouteEnter(to, from, next) {
          var key = self._getFetchKey(name, type);
          if (!key) {
            self._setFetchKey(name, type, to.path);
          } else if (key && key !== to.path) {
            self._clearStore(name, type);
            self._setFetchKey(name, type, to.path);
          }
          if (utils.isFunction(next)) {
            next();
          }
        },

        computed: self.detailStore(name),
        created: function created() {
          this.$rsDetail();
        },

        watch: {
          '$route.path': function $routePath() {
            this.$rsDetail();
          }
        }
      };
    }
  }]);
  return VueRouterStore;
}();

VueRouterStore$1.install = install;

exports['default'] = VueRouterStore$1;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=vue-router-store.js.map
