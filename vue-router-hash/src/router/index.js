import Vue from "vue";
import VueRouter from "../vue-router";

// Vue.use注册组件，如果传入的是一个方法，则调用该方法注册组件，如果传入的是一个对象，则调用对象的install方法来注册组件
Vue.use(VueRouter);

// 嵌套路由
const routes = [
  {
    name: "index",
    path: "/index",
    component: () =>
      import(/* webpackChunkName: "index" */ "../views/Index.vue")
  },
  {
    name: "b",
    path: "/blog",
    component: () => import(/* webpackChunkName: "blog" */ "../views/Blog.vue")
  },
  {
    name: "ph",
    path: "/photo",
    component: () =>
      import(/* webpackChunkName: "photo" */ "../views/Photo.vue")
  },
  {
    name: "none",
    path: "*",
    component: () => import(/* webpackChunkName: "none" */ "../views/404.vue")
  }
];

// 创建 router 对象
const router = new VueRouter({
  mode: "history",
  routes
});

export default router;
