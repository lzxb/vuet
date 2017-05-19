[![Build Status](https://travis-ci.org/lzxb/vue-router-store.svg?branch=master)](https://travis-ci.org/lzxb/vue-router-store)
[![dependencies Status](https://david-dm.org/lzxb/vue-router-store/status.svg)](https://david-dm.org/lzxb/vue-router-store)
[![devDependencies Status](https://david-dm.org/lzxb/vue-router-store/dev-status.svg)](https://david-dm.org/lzxb/vue-router-store?type=dev)
[![npm](https://img.shields.io/npm/v/vue-router-store.svg?style=flat-square)](https://www.npmjs.com/package/vue-router-store) 
[![npm](https://img.shields.io/npm/dt/vue-router-store.svg?style=flat-square)](https://www.npmjs.com/package/vue-router-store)

## vue-router-store
一个和vue-router配合使用的数据管理插件

### 功能
- [ ] 基本的数据管理
- [x] 分页列表数据管理
- [x] 详情页面的数据管理
- [ ] 记录局部滚动条位置

### 安装
```text
npm install --save vue-router-store
```

### 入门的例子
以cnode社区的列表和详情为例子，当你前进或后台时，如果当前的地址和数据关联的地址匹配，会先渲染上次存储的数据，然后再请求服务器更新这一份数据，如果匹配不上，则会重置页面数据  
[例子代码地址请点击我](https://github.com/medevicex/vue-router-store/tree/master/example)

### 可选参数

#### pagekey
类型：String  
默认值：page  
描述：调用this.$rsList.search()方法时，会重置this.$route.query[pagekey]参数值为1

#### queryKey
类型：String
默认值:query  
描述：将this.$route.query里面的参数设置到this.$data[queryKey]中
```javascript
export default {
  //....
  data () {
    // ?keyname=xxxx 会设置到this.$data[queryKey].keyname中
    return {
      query: {
        keyname: ''
      }
    }
  }
}
```

#### fetchBefore
类型：Function  
传入参数：name, type  
描述：请求发送之前调用的钩子函数，this 指向到组件的实例中，无论成功失败

#### fetchAfter
类型：Function  
传入参数：name, type  
描述：请求结束之后调用的钩子函数，this 指向到组件的实例中，无论成功失败

#### fetchSuccess
类型：Function  
传入参数：res, name, type  
描述：请求成功之后调用的钩子函数，this 指向到组件的实例中，无论成功失败

#### fetchError
类型：Function  
传入参数：e, name, type  
描述：请求失败之后调用的钩子函数，this 指向到组件的实例中，无论成功失败

#### baseData
类型：Function  
传入参数：name, type  
返回类型：Object  
描述：基本的数据

#### baseListData
类型：Function  
传入参数：name  
返回类型：Object  
描述：列表的基本字段

#### baseDetailData
类型：Function  
传入参数：name  
返回类型：Object  
描述：详情的基本字段

#### modules
类型：Object  
默认值：{}  
描述：设置各个模块之前的请求配置、数据配置等

**传入的参数说明：**   
res： modules的fetch钩子执行完成后返回的数据  
name：模块的名称  
type：模块的类型  
e：错误的信息  

### modules 模块的可选参数
```javascript
  new VueRouterStore({
    // ...其他的可选参数
    modules: {
      ['模块名称']: {
        pagekey: 'page', // 分页的参数，不设置默认为全局的pagekey
        queryKey: 'query', // this.$route.query同步到this.$data[queryKey]，不设置默认为全局的queryKey
        ListData () {
          return {
            // 单独定制当前模块的字段，模块的数据 = Object.assign(baseData, baseListData, 当前模块的基本数据)
          }
        },
        listFetch (next) {
          // 支持直接返回Promise
          next({
            // 更新的data
          })
        },
        detailData () {
          return {
            // 单独定制当前模块的字段，模块的数据 = Object.assign(baseData, baseDetailData, 当前模块的基本数据)
          }
        },
        detailFetch (next) {
          // 支持直接返回Promise
          next({
            // 更新的data
          })
        }
      }
    }
  })
```