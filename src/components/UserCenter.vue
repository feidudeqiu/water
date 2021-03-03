<template>
  <el-row class="tac">
    <el-col :span="4" class="col4">
      <el-menu
        default-active="1"
        class="el-menu-vertical-demo"
        background-color="#011a37"
        text-color="#fff"
        active-text-color="#e4581c"
        router>
        <el-menu-item index="/userCenter/ucChangepwd">
          <i class="el-icon-edit-outline"></i>
          <span slot="title">修改密码</span>
        </el-menu-item>
        <el-menu-item index="/userCenter/ucManage">
          <i class="el-icon-setting"></i>
          <span slot="title">用户管理</span>
        </el-menu-item>
        <div class="col4"></div>
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
  methods:{

  }
}
</script>

<style scoped>
.col4{
  background-color: #011a37;
}
</style>
