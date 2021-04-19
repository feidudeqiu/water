<template>
	<div class="ucprofile">
		<el-card class="box-card">
			<div class="item">用户名：{{username}}</div>
			<div class="item">角色权限：{{role}}</div>
			<div class="item">创建时间：{{formatTimeByStamp(createtime)}}</div>
			<div class="item">邮箱：{{email}}</div>
			<div class="item">工作单位：{{workPlace}}</div>
			<el-button style="margin-top:10px;" size="mini" type="primary" @click="$router.push('/changePwd')">修改密码</el-button>
		</el-card>
	</div>

</template>

<script>
export default {
	name: "UcProfile",
	data() {
		return{
			username: '未初始化',
			role: '未初始化',
			createtime: '未初始化',
			workPlace: '未初始化',
			email: '未初始化'
		}
	},
	created() {
		this.axios.get("/api/user/get-user")
		.then(res =>{
			this.username = res.data.user.username;
			this.email = res.data.user.email;
			this.workPlace = res.data.user.workPlace;
			this.createtime = res.data.user.createTime;
			switch (res.data.user.role){
				case 1: this.role = "普通用户"; break;
				case 2: this.role = "管理员"; break;
				case 3: this.role = "超级管理员"; break;
			};
			
		})
	},
	methods: {
		formatTimeByStamp(stamp) {
            var date = new Date(parseInt(stamp));
            var YY = date.getFullYear() + '-';
            var MM = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
            var DD = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate());
            var hh = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
            var mm = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
            var ss = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
            return YY + MM + DD +" "+hh + mm + ss;
        },
	}
}
</script>

<style scoped>

.item {
  padding: 10px 0;
}

.box-card {
  width: 100%;
  height: 100%;
}
.ucprofile{
  font-size: 16px;
  position: relative;
  width: 600px;
  height: 400px;
  top: 50%;
  left: 50%;
  margin:-250px 0 0 -350px;
}

</style>
