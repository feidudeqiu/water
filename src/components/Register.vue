<template>
    <div>
        <div class="content flex-column-inline" style="margin-top:30px;width:100%;">
            <div style="text-align:center;width:100%;height:30px;border-bottom:1px solid #ddd;margin-bottom:45px;">
                <span style="color:black;background:white;font-size:38px;line-height:58px;padding:0 20px;">注册</span>
            </div>
            <div>
                <el-form status-icon class="demo-ruleForm" ref="ruleForm" :rules="rules" style="width:400px;" :model="registerForm" label-width="80px" size="mini">
                    <el-form-item prop="username" label="用户名">
                        <el-input maxlength="16" v-model="registerForm.username"></el-input>
                    </el-form-item>
                    <el-form-item prop="password" label="密码">
                        <el-input type="password" show-password maxlength="16" v-model="registerForm.password"></el-input>
                    </el-form-item>
                    <el-form-item prop="passwordConfirm" label="确认密码">
                        <el-input type="password" show-password maxlength="16" v-model="registerForm.passwordConfirm"></el-input>
                    </el-form-item>
                    <el-form-item prop="email" label="邮箱">
                        <el-input type="email" maxlength="50" v-model="registerForm.email">
                            <el-button @click="registerMail()" :disabled="sendable" slot="append">{{registerForm.emailTimeOut===0?'获取验证码':'请'+registerForm.emailTimeOut+'秒后再试'}}</el-button>
                        </el-input>
                    </el-form-item>
                    <el-form-item prop="pin" label="验证码">
                        <el-input maxlength="6" v-model="registerForm.pin"></el-input>
                    </el-form-item>
                    <el-form-item prop="workPlace" label="工作单位">
                        <el-input maxlength="50" v-model="registerForm.workPlace"></el-input>
                    </el-form-item>
                    <el-form-item >
                        <div class="flex-row-inline">
                            <el-button :disabled="registerFlag" type="primary" @click="register('ruleForm')">立即注册</el-button>
                            <el-tooltip placement="bottom" content="用户注册提交后需要管理员审核才能通过">
                                <i style="font-size:20px;margin-left:10px;" class="el-icon-info text-gray"></i>
                            </el-tooltip>
                        </div>
                        
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>
<style scoped>

</style>
<script>
export default {
    name: "Register",
    data() {
        var checkUsername = (rule, value, callback) => {
            if(value === '') {
                callback(new Error('请输入用户名'));
            } else {
                this.axios.get("/api/sign/sign-in/check-username?username="+value)
                .then(res=>{
                    if(res.data.res) {
                        callback()
                    } else {
                        callback(new Error('用户名已存在'));
                    }
                })
                .catch(error=>{
                    callback(new Error('服务异常,请稍后再试'));
                })
            }
        };
        var checkPassword = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入密码'));
            } else {
                if (this.registerForm.passwordConfirm !== '') {
                    this.$refs.ruleForm.validateField('passwordConfirm');
                }
                callback();
            }
        };
        var checkPasswordConfirm = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请再次输入密码'));
            } else if (value !== this.registerForm.password) {
                callback(new Error('两次输入密码不一致!'));
            } else {
                callback();
            }
        };
        var checkEmail = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入邮箱'));
            } else if (value.search(/^\w+([-_.]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,6})+$/) == -1) {
                callback(new Error('邮箱格式错误'));
            } else {
                this.registerForm.emailStatus = false;
                callback();
            }    
        };
        return {
            registerFlag: false,
            registerForm: {
                username: "",
                password: "",
                passwordConfirm: "",
                email: "",
                emailStatus: false,
                emailTimeOut: 0,
                pin: "",
                workPlace: "",
            },
            rules: {
                username: [{required: true,  validator: checkUsername, trigger: 'blur' }],
                password: [{required: true,  validator: checkPassword, trigger: 'blur' }],
                passwordConfirm: [{required: true,  validator: checkPasswordConfirm, trigger: 'blur' }],
                email: [{required: true,  validator: checkEmail, trigger: 'blur' }],
                pin: [
                    { required: true, message: '请输入验证码', trigger: 'blur' },
                    { min: 6, max: 6, message: '长度为6个字符', trigger: 'blur' }
                ],
            }
        }
    },
    created() {
        
    },
    computed: {
        sendable() {
            return (this.registerForm.email.search(/^\w+([-_.]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,6})+$/) == -1) || this.registerForm.emailStatus;
        }
    },
    methods: {
        register(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.registerPost();
                } else {
                    return false;
                }
            });
        },
        registerPost() {
            this.registerFlag = true;
            let data = new URLSearchParams();
            data.append("username",this.registerForm.username);
            data.append("password",this.registerForm.password);
            data.append("email",this.registerForm.email);
            data.append("pin",this.registerForm.pin);
            data.append("workPlace",this.registerForm.workPlace);
            this.axios.post("/api/sign/sign-in/register",data)
            .then(res=>{
                this.$message.success("注册提交成功，请等待管理员审核，注册结果由邮件通知");
                this.registerFlag = false;
                setTimeout(()=>{
                    this.$router.replace("/login");
                },1500)
            })
            .catch(err=>{
                this.registerFlag = false;
                this.$message.error(err.response.data.message);
            })

        },
        registerMail() {
            this.registerForm.emailStatus = true;
            this.axios.get("/api/sign/sign-in/register-mail?to="+this.registerForm.email)
            .then(res=>{
                this.registerForm.emailTimeOut = 60;
                var interval = setInterval(() => {
                    this.registerForm.emailTimeOut --;
                    if(this.registerForm.emailTimeOut == 0) {
                        this.registerForm.emailStatus = false;
                        clearInterval(interval);
                    }
                }, 1000);
            })
            .catch(err=>{
                this.registerForm.emailStatus = false;
                this.$message.error(err.response.data.message);
            })
        }
    }
}
</script>