<template>
    <div>
        <div class="content flex-column-inline" style="margin-top:30px;width:100%;">
            <div style="text-align:center;width:100%;height:30px;border-bottom:1px solid #ddd;margin-bottom:45px;">
                <span style="color:black;background:white;font-size:38px;line-height:58px;padding:0 20px;">登录</span>
            </div>
            <div class="login-item flex-row-center">
                <div class="password-item flex-column-center">
                    <div style="width: fit-content;">
                        <input maxlength="20" class="input-login input-background-username" v-model="username" placeholder="用户名">
                        <input @keyup.enter="login()" type="password" maxlength="16" class="input-login input-background-pwd" style="margin-bottom:10px;" v-model="password" placeholder="密码">
                        <div class="flex-row-center">
                            <div class="flex-row-inline" style="width:100%;justify-content: space-between;margin-top:10px;">
                                <div class="option-button flex-row-center" style="background: #19be6b;cursor:pointer;color:white" @click="login()">登录</div>
                                <div class="option-button flex-row-center" style="background: #19be6b;cursor:pointer;color:white" @click="$router.push('/register')">注册</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped>
.login-item {
    width:80%;
    min-width:230px;
    max-width: 350px;
}
.input-background-username{
    background-image: url("~static/img/username.png");
    background-position-x:5px;
    background-position-y: 7px;
    background-size: 25px 25px;
}
.input-background-pwd{
    background-image: url("~static/img/password.png");
    background-position-x:5px;
    background-position-y: 7px;
    background-size: 25px 25px;
}
.input-login{
    border:1px solid #ccc;
    width:100%;
    font-size:14px;
    height:38px;
    padding-left:42px;
    padding-right: 5px;
    margin-bottom: 20px;
    background-repeat: no-repeat;
    box-sizing: border-box;
}
.password-item {
    width: 100%;
    height: fit-content;
}
.option-button {
    width:45%;
    height:30px;
    border-radius: 5px;
    font-weight: 800;
}
</style>
<script>
export default {
    name: 'Login',
    data () {
        return {
            username: '',
            password: ''
        }
    },
    created () {
        
    },
    methods: {
        login () {
            var that = this;
            let data = new URLSearchParams()
            data.append('username', this.username)
            data.append('password', this.password)
            const loading = this.$loading({
                lock: true,
                text: '登陆中',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            });
            var that = this;
            this.axios
                .post("/api/sign/sign-in/", data)
                .then(function (res) {
                    that.$store.commit("set_username",res.data.username);
                    that.$store.commit("set_role",res.data.role);
                    that.$store.commit("set_workPlace",res.data.workPlace);
                    that.$store.commit("set_createTime",res.data.createTime);
                    loading.close();
                    that.$router.push("/index");
                })
                .catch(function (err) {
                    that.$message.error(err.response.data.message);
                    loading.close();
                })
        }
    }
}
</script>
