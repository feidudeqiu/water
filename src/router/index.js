import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)
const Login = () => import('@/components/Login')
const Index = () => import('@/components/Index')
const Map = () => import('@/components/map/Map')
const AddMap = () => import('@/components/map/AddMap')
const TestMap = () => import('@/components/map/TestMap')
const UserCenter = () => import('@/components/UserCenter')
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
		},
		{
			path: '/map/test-map',
			name: 'TestMap',
			component: TestMap,
			meta: {
				title: '测试地图',
				requireAuth: false
			}
		},
		{
			path: '/user-center',
			name: 'UserCenter',
			component: UserCenter,
			meta: {
				title: '用户中心',
				requireAuth: true
			}
		},
	]
})
