<template>
  <div style="width:100%;">
    <div class="head" style="display:flex;align-items:center;">
        <a class="flex-row-center" href="/index" style="margin-left:50px;height:45px;">
          <img src="~static/img/logo.svg" style="height:45px;" />
        </a>
        <div style="height:40px;display:flex;justify-content:space-between;flex:2;min-width:150px;">
			<div class="text-h3 text-thick" style="flex:1;text-align:center;color:#E65800;">流域静态水体水环境治理智慧系统（1.0）</div>
			<div class="mine" style="position:relative;margin-left:50px;margin-right:75px;">
				<img id="profilePhoto" class="profile" src="~static/img/background.jpg" />
				<div v-if="logged" class="flex-column-inline menu">
					<div class="text-black text-h4 text-thick" style="text-align:center;">{{username}}</div>
					
					<div class="flex-row-inline menu-item" @click="jumpToGs()">
						<img class="menu-icon" src="~static/img/earth.png" />
						<div class="choice">GS</div>
					</div>

					<div v-if="isAdministrator" class="flex-row-inline menu-item" @click="$router.push('/user-center');">
						<img class="menu-icon" src="~static/img/username.png" />
						<div class="choice">用户管理</div>
					</div>
					<div class="flex-row-inline menu-item" @click="logout()">
						<img class="menu-icon" src="~static/img/logout.png" />
						<div class="choice">退出</div>
					</div>
				</div>
				<div v-else class="flex-column-inline menu">
					<div class="flex-row-inline menu-item" @click="$router.push('/login');">
						<img class="menu-icon" src="~static/img/login.png" />
						<div class="choice">登录</div>
					</div>
				</div>
			</div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.head {
	height: 50px;
	width: 100%;
	background-color: rgb(0, 25, 56);
}
.mine {
	height: 35px;
}
.profile {
	width: 40px;
	height: 40px;
	border-radius: 50%;
	position: relative;
  	z-index: 99;
  	cursor: pointer;
}
.menu {
	display: none;
 	background: white;
  	color: #606266;
  	width: 150px;
  	box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  	top: 25px;
  	left: -50px;
  	position: absolute;
  	z-index: 98;
  	padding-top: 40px;
  	border-radius: 3px;
}
.menu-icon {
  	width: 20px;
  	height: 20px;
}
.mine:hover .profile {
  	transform: scale(1.2);
  	transition: all 0.3s;
}
.mine:hover .menu {
  	display: flex;
}
.menu-item {
  	width: 100%;
  	padding-top: 10px;
  	padding-bottom: 10px;
  	padding-left: 10px;
  	box-sizing: border-box;
  	cursor: pointer;
}
.menu-item:last-child {
  	margin-bottom: 10px;
}
.menu-item:hover {
  	background: #f4f4f4;
}
.menu-item .choice {
  	flex: 1;
  	margin-left: 10px;
  	text-align: left;
  	font-size: 14px;
  	color: black;
}
</style>
<script>
export default {
  	name: "Head",
  	data() {
    	return {
			
		}
  	},
  	computed: {
		logged() {
			return this.username;
		},
		isAdministrator() {
			return this.$store.getters.get_role >= 2;
		},
		username() {
			return this.$store.getters.get_username;
		}
	},
  	created() {

	},
  	methods: {
			logout() {
				var that = this;
				this.$confirm('确认退出吗?', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
				}).then(() => {
					that.axios
					.get("/api/sign/sign-in/sign-out")
					.then(function (res) {
						that.$store.commit("remove_username");
						that.$router.push("/login");
					})
					.catch(function (err) {
						that.$message.error(err.response.data.message);
					})
				}).catch(() => {
						
				});
			},
			jumpToGs() {
				window.open('http://127.0.0.1:8080/geoserver', '_blank');
			}
	}
};
</script>