import Vue from 'vue'          //引入Vue对象
import Router from 'vue-router'//引入路由
//引入自定义组件
import Login from "./components/web/xz/Login.vue"
import Product from "./components/web/xz/Product.vue"
import Cart from "./components/web/xz/Cart.vue"
import Register from "./components/web/xz/Register.vue"
Vue.use(Router)               
export default new Router({
  //配置组件-:访问路径
  routes: [
    {path:'/Cart',component:Cart},
    {path:'/Register',component:Register},
    {path:'/',component:Product},
    {path:'/Login',component:Login},
  ]
})
//打浏览器地址 http://127.0.0.1:8080/#/MessageList