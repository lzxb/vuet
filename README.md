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