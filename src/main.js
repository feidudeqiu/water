// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import axios from 'axios'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);
Vue.prototype.axios = axios
Vue.config.productionTip = false
Vue.prototype.$message = ElementUI.Message;

// 路由切换操作
router.beforeEach((to, from, next) => {
	/* 路由发生变化修改页面title */
	if (to.meta.title) {
		document.title = to.meta.title;
	}
	if (to.meta.requireAuth) {  // 判断该路由是否需要登录权限
        if (store.getters.get_username) {  // 通过vuex state获取当前的token是否存在
            next();
        }
        else {
            next({
                path: '/login',  // 去登录页面
                query: {redirect: to.path}  // 将跳转的路由path作为参数，登录成功后跳转到该路由
            })
        }
    }
    else {
        next();
	}
})
// 为数据请求添上时间戳，防止缓存
axios.interceptors.request.use(config => {
	if (/get/i.test(config.method)) {
		config.params = config.params || {};
		config.params.t = Date.parse(new Date()) / 1000;
	}
	return config;
}, error => {
	return Promise.reject(error);
})

axios.interceptors.response.use(response => Promise.resolve(response),
  error => { // 这里对 error 预期结果是包含具体错误信息和状态码
    if (error && error.response && error.response.status) {
      switch (error.response.status) {
        case 601: {
			store.commit("remove_username");
			store.commit("remove_role");
			router.replace({
				path: '/login',
				query: {redirect: router.currentRoute.fullPath}
			})
			break;
		}
        default:
		  throw error;
      }
    }
  });
new Vue({
	el: '#app',
	router,
	store,
	components: { App },
	template: '<App/>'
})
