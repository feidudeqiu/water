<template>
  <div class="ucprofile">
    <el-card class="box-card">
      <div class="item">用户名：{{username}}</div>
      <div class="item">角色权限：{{role}}</div>
      <div class="item">创建时间：{{createtime}}</div>
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
      createtime: '未初始化'
    }
  },
  created() {
    this.axios.get("/api/user/get-user")
    .then(res =>{
      this.username = res.data.user.username
      switch (res.data.user.role){
        case 1: this.role = "普通用户"; break;
        case 2: this.role = "管理员"; break;
        case 3: this.role = "root"; break;
      };
      this.createtime = new Date(parseInt(res.data.user.createTime)).toLocaleString().replace(/:\d{1,2}$/,' ')
    })
  }
}
</script>

<style scoped>

.item {
  padding: 20px 0;
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
