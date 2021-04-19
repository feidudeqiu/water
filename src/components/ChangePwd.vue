<template>
    <div>
        <div class="content flex-column-inline" style="margin-top:30px;width:100%;">
            <div style="text-align:center;width:100%;height:30px;border-bottom:1px solid #ddd;margin-bottom:45px;">
                <span style="color:black;background:white;font-size:38px;line-height:58px;padding:0 20px;">修改密码</span>
            </div>
			<div class="flex-row-center">
				<el-form status-icon class="demo-ruleForm" :model="formData" ref="ruleForm" :rules="rules" style="width:400px;" label-width="80px" size="mini">
					<el-form-item prop="username" label="用户名">
						<el-input  maxlength="16" v-model="formData.username"></el-input>
					</el-form-item>
					<el-form-item prop="password" label="密码">
						<el-input type="password" show-password maxlength="16" v-model="formData.password"></el-input>
					</el-form-item>
					<el-form-item prop="passwordConfirm" label="确认密码">
						<el-input type="password" show-password maxlength="16" v-model="formData.passwordConfirm"></el-input>
					</el-form-item>
					<el-form-item prop="email" label="邮箱">
						<el-input type="email" maxlength="50" v-model="formData.email">
							<el-button @click="changePwdMail()" :disabled="sendable" slot="append">{{formData.emailTimeOut===0?'获取验证码':'请'+formData.emailTimeOut+'秒后再试'}}</el-button>
						</el-input>
					</el-form-item>
					<el-form-item prop="pin" label="验证码">
						<el-input maxlength="6" v-model="formData.pin"></el-input>
					</el-form-item>
					<el-form-item >
							<el-button :disabled="changeFlag" type="primary" @click="changePwd('ruleForm')">修改密码</el-button>
					</el-form-item>
				</el-form>
			</div>
        </div>
    </div>
</template>

<script>
export default {
	name: "ChangePwd",
	data() {
		var checkPassword = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入密码'));
            } else {
                if (this.formData.passwordConfirm !== '') {
                    this.$refs.ruleForm.validateField('passwordConfirm');
                }
                callback();
            }
		};
		var checkPasswordConfirm = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请再次输入密码'));
            } else if (value !== this.formData.password) {
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
                this.formData.emailStatus = false;
                callback();
            }    
        };
		return {
			changeFlag: false,
			formData: {
				username: "",
				password: "",
				passwordConfirm: "",
				email: "",
				pin: "",
				emailTimeOut: 0,
				emailStatus: false,
			},
			rules: {
                username: [{required: true,message: '用户名不为空' }],
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
            return (this.formData.username=='')||(this.formData.email.search(/^\w+([-_.]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,6})+$/) == -1) || this.formData.emailStatus;
        }
	},
	methods: {
		changePwdMail() {
			this.formData.emailStatus = true;
			this.axios.get("/api/user/change-pwd-mail?username="+this.formData.username+"&email="+this.formData.email)
			.then(res=>{
				this.formData.emailTimeOut = 60;
                var interval = setInterval(() => {
                    this.formData.emailTimeOut --;
                    if(this.formData.emailTimeOut == 0) {
                        this.formData.emailStatus = false;
                        clearInterval(interval);
                    }
                }, 1000);
			})
			.catch(err=>{
				this.formData.emailStatus = false;
                this.$message.error(err.response.data.message);
			})
			
		},
		changePwd(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.changePwdPost()
                } else {
                    return false;
                }
            });
		},
		changePwdPost() {
			this.changeFlag = true;
            let data = new URLSearchParams();
            data.append("username",this.formData.username);
            data.append("password",this.formData.password);
            data.append("email",this.formData.email);
            data.append("pin",this.formData.pin);
            this.axios.post("/api/user/change-pwd",data)
            .then(res=>{
				this.$message.success("修改成功");
				setTimeout(()=>{
                	this.$router.replace("/login");
				},1500);
            })
            .catch(err=>{
                this.changeFlag = false;
                this.$message.error(err.response.data.message);
            })
		}
	}
}
</script>

<style scoped>

</style>
