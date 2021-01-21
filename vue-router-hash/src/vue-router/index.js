let _Vue = null;
/**
 * Vue Router Hash
 */
export default class VueRouter {
  // 插件注册
  static install(Vue) {
    // 判断是否已经注册
    if (VueRouter.install.installed) return;
    VueRouter.install.installed = true;
    // 保存Vue构造函数
    _Vue = Vue;
    // 将new Vue传入的router对象存储到VueRouter.prototype上
    _Vue.mixin({
      beforeCreate() {
        if (this.$options.router) {
          // 传入router时，将router保存到Vue的原型上
          _Vue.prototype.$router = this.$options.router;
        }
      }
    });
  }
  constructor(options) {
    // 保存选项变量
    this.options = options;
    // path和component的映射对象
    this.routeMap = {};
    // 创建响应式数据，存储当前路由，路由更新时更新视图
    this.data = _Vue.observable({
      current: this.getRouteFromHash(window.location.hash)
    });
    // 存储path和component的映射对象
    this.initRouteMap();
    // 创建router-link和router-view组件
    this.initComponent();
    // 注册监听事件
    this.initEvent();
  }
  getRouteFromHash(hash) {
    return hash.split("?")[0].slice(1);
  }
  initEvent() {
    // 监听hash路由改变
    window.addEventListener("hashchange", () => {
      const hash = window.location.hash;
      this.data.current = this.getRouteFromHash(hash);
    });
  }
  initRouteMap() {
    this.options.routes.forEach(item => {
      this.routeMap[item.path] = item.component;
    });
  }
  initComponent() {
    // 创建router-link组件
    const self = this;
    _Vue.component("router-link", {
      props: {
        to: String
      },
      render(h) {
        return h(
          "a",
          {
            attrs: {
              href: "#" + this.to
            }
          },
          [this.$slots.default]
        );
      }
    });
    // 创建router-view展示组件
    _Vue.component("router-view", {
      render(h) {
        return h(self.routeMap[self.data.current]);
      }
    });
  }
  replace(path) {
    window.location.replace("#" + path);
  }
  getQueryStringForQueryObject(query) {
    return Object.keys(query)
      .reduce((pre, next) => `${pre}${next}=${query[next]}&`, "?")
      .slice(0, -1);
  }
  push(path) {
    if (typeof path === "string") {
      window.location.href = `#${path}`;
    } else if (typeof path === "object") {
      let queryStr = "";
      if (path.query) {
        queryStr = this.getQueryStringForQueryObject(path.query);
      }
      window.location.href = `#${path.path}${queryStr}`;
    }
  }
  go(num) {
    window.history.go(num);
  }
}
