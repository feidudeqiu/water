import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)
const Login = () => import('@/components/Login')
const Index = () => import('@/components/Index')
const Map = () => import('@/components/map/Map')
const AddMap = () => import('@/components/map/AddMap')
const MapTest = () => import('@/components/map/MapTest')
const UserCenter = () => import('@/components/UserCenter')
const UcManage = () => import('@/components/UcManage')
const UcChangepwd = () => import('@/components/UcChangepwd')
const UcProfile = () => import('@/components/UcProfile')
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
			path: '/map/add-map',
			name: 'AddMap',
			component: AddMap,
			meta: {
				title: '添加地图',
				requireAuth: true
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
          path:'/user-center/uc-changepwd',
          component: UcChangepwd
        },
        {
          path:'/user-center/uc-manage',
          component: UcManage
        },
        {
          path: '/user-center/uc-profile',
          component: UcProfile
        }
      ],
			meta: {
				title: '用户中心',
				requireAuth: true
			}
		},
	]
})
