import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)
const Login = () => import('@/components/Login')
const Index = () => import('@/components/Index')
const Map = () => import('@/components/map/Map')
const AddMap = () => import('@/components/map/AddMap')
export default new Router({
  mode: 'history',
	base: '/',
	routes: [
		{
			path: '/login',
			name: 'Login',
			component: Login,
			meta: {
					title: '登录'
				}
		},
		{
			path: '/',
			alias: '/index',
			name: 'Index',
			component: Index,
			meta: {
					title: '首页',
					requireAuth: true
				}
		},
		{
			path: '/map',
			name: 'Map',
			component: Map,
			meta: {
					title: '地图',
					requireAuth: true
				}
		},
		{
			path: '/map/add-map',
			name: 'AddMap',
			component: AddMap,
			meta: {
				title: '添加地图',
				requireAuth: true
			}
		}
	]
})
