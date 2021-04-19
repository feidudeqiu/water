<template>
    <el-row class="tac">
		<el-col :span="4" class="col4">
				<el-menu
				class="el-menu-vertical-demo"
				background-color="#011a37"
				text-color="#fff"
				active-text-color="#ff0000"
				router>
				<el-menu-item index="/user-center/uc-profile">
					<i class="el-icon-user"></i>
					<span :style="{'color':(currentIndex==='/user-center/uc-profile'?'green':'white')}" slot="title">个人信息</span>
				</el-menu-item>
				<el-menu-item v-if="isAdministrator()" index="/user-center/uc-manage">
					<i class="el-icon-setting"></i>
					<span :style="{'color':(currentIndex==='/user-center/uc-manage'?'green':'white')}" slot="title">用户管理</span>
				</el-menu-item>
				<el-menu-item v-if="isAdministrator()" index="/user-center/uc-register">
					<img style="height:20px;margin-right:5px;" src="/static/img/register.png">
					<span :style="{'color':(currentIndex==='/user-center/uc-register'?'green':'white')}" slot="title">注册管理</span>
				</el-menu-item>
				<el-menu-item v-if="isAdministrator()" index="/user-center/uc-data-manage">
					<img style="height:20px;margin-right:5px;" src="/static/img/data.png">
					<span :style="{'color':(currentIndex==='/user-center/uc-data-manage'?'green':'white')}" slot="title">数据管理</span>
				</el-menu-item>
				<!-- <div class="col4"></div> -->
				</el-menu>
			</el-col>
		<el-col :span="20">
        <div class="col20"></div>
        <router-view></router-view>
      </el-col>
    </el-row>
</template>

<script>
export default {
	name: "UserCenter",
	data() {
		return {
			currentIndex: window.location.pathname,
		}
	},
	methods:{
		isAdministrator() {
			return this.$store.getters.get_role >= 2;
		},
		// select(index, indexPath) {
		// 	this.currentIndex = index;
		// }
	}
}
</script>

<style scoped>
.col4 {
  background-color: #011a37;
}
>>>.el-menu {
  border-right: none;
}
</style>





