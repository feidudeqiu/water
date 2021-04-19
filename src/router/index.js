import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)
const Login = () => import('@/components/Login')
const Register = () => import('@/components/Register')
const Index = () => import('@/components/Index')
const Map = () => import('@/components/map/Map')
const AddMap = () => import('@/components/map/AddMap')
const MapTest = () => import('@/components/map/MapTest')
const UserCenter = () => import('@/components/userCenter/UserCenter')
const UcManage = () => import('@/components/userCenter/UcManage')
const ChangePwd = () => import('@/components/Changepwd')
const UcProfile = () => import('@/components/userCenter/UcProfile')
const AddLake = () =>import('@/components/map/AddLake')
const UcRegister = () =>import('@/components/userCenter/UcRegister')
const UcDataManage = () =>import('@/components/userCenter/UcDataManage')
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
			path: '/changePwd',
			name: 'ChangePwd',
			component: ChangePwd,
			meta: {
					title: '修改密码'
				}
		},
		// {
		// 	path: '/',
		// 	alias: '/index',
		// 	name: 'Index',
		// 	component: Index,
		// 	meta: {
		// 			title: '首页',
		// 			requireAuth: true
		// 		}
		// },
		{
			path: '/',
			alias: '/index',
			name: 'Map',
			component: Map,
			meta: {
					title: '地图',
					requireAuth: true
				}
		},
		{
			path: '/register',
			name: 'Register',
			component: Register,
			meta: {
					title: '注册',
					requireAuth: false
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
			path: '/map/add-lake',
			name: 'AddLake',
			component: AddLake,
			meta: {
				title: '添加湖泊',
				requireAuth: true,
			}
		},
		{
			path: '/map/map-test',
			name: 'MapTest',
			component: MapTest,
			meta: {
				title: '测试地图',
				requireAuth: false
			}
		},
		{
			path: '/user-center',
			name: 'UserCenter',
      		redirect: '/user-center/uc-profile',
			component: UserCenter,
      		children: [
				{
					path:'/user-center/uc-manage',
					component: UcManage,
					meta: {
						title: '用户管理',
						requireAuth: true,
						requireRole: 2
					}
				},
				{
					path: '/user-center/uc-profile',
					component: UcProfile,
					meta: {
						title: '个人信息',
						requireAuth: true
					}
				},
				{
					path: '/user-center/uc-register',
					component: UcRegister,
					meta: {
						title: '注册管理',
						requireAuth: true,
						requireRole: 2
					}
				},
				{
					path: '/user-center/uc-data-manage',
					component: UcDataManage,
					meta: {
						title: '数据管理',
						requireAuth: true,
						requireRole: 2
					}
				}
      		],
			meta: {
				title: '用户中心',
				requireAuth: true
			}
		},
	]
})
