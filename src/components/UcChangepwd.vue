<template>
  <div class="changepwd">
    <el-steps   :active="active"  finish-status="success" class="steps">
      <el-step title="验证身份"></el-step>
      <el-step title="修改密码"></el-step>
      <el-step title="完成修改"></el-step>
    </el-steps>
    <el-form
      ref="form"
      :model="form"
      label-width="80px"
      v-loading.fullscreen.lock="fullscreenLoading"
      element-loading-text="验证中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(255, 255, 255, 0.7)"
      class="form"
      v-show="isFirststep">
      <el-form-item label="初始问题:">
        <el-input class="input1" v-model="form.question" readonly></el-input>
      </el-form-item>
      <el-form-item label="提示信息:">
        <el-input class="input2"  v-model="form.tip" readonly></el-input>
      </el-form-item>
      <el-form-item label="答案:">
        <el-input class="input2" type="textarea" v-model="answer"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button class="button" type="primary"  @click="next">下一步 <i class="el-icon-thumb"></i></el-button>
        <el-button class="button" plain  @click="back()">重置答案 <i class="el-icon-delete"></i></el-button>
      </el-form-item>
    </el-form>
    <el-form :model="ruleForm"
             status-icon
             :rules="rules"
             ref="ruleForm"
             label-width="100px"
             class="form"
             v-loading.fullscreen.lock="fullscreenLoadingsec"
             element-loading-text="验证中"
             element-loading-spinner="el-icon-loading"
             element-loading-background="rgba(255, 255, 255, 0.7)"
             v-show="!isFirststep">
      <el-form-item label="密码" prop="pass">
        <el-input show-password v-model="ruleForm.pass" ></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="checkPass">
        <el-input show-password v-model="ruleForm.checkPass" ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">提交<i class="el-icon-thumb"></i></el-button>
        <el-button @click="resetForm('ruleForm')">重置<i class="el-icon-delete"></i></el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "UcChangepwd",
  data() {
    let validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else {
        if (this.ruleForm.checkPass !== '') {
          this.$refs.ruleForm.validateField('checkPass');
        }
        callback();
      }
    };
    let validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.ruleForm.pass) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      active: 0,
      isFirststep: true,
      answer: '',
      fullscreenLoading: false,
      fullscreenLoadingsec: false,
      form: {
        question:'',
        tip: '',
        key: '',
      },
      ruleForm: {
        pass: '',
        checkPass: '',
      },
      rules: {
        pass: [
          { validator: validatePass, trigger: 'blur' }
        ],
        checkPass: [
          { validator: validatePass2, trigger: 'blur' }
        ],
      }
    }
  },
  created() {
    this.axios.get("/api/user/get-user")
    .then(res =>{
      this.form.question = res.data.user.question
      this.form.tip = res.data.user.tip
      this.form.key = res.data.user.answer
    })
  },
  methods: {
    next() {
      this.fullscreenLoading = true
      setTimeout(()=>{
        if (this.answer === this.form.key){
          this.$message.success("验证成功")
          this.active++
          this.isFirststep = !this.isFirststep
        }else {
          this.$message.error("答案错误，验证失败")
        }
        this.fullscreenLoading = false
      },1000)
    },
    back(){
      this.answer = '';
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.fullscreenLoadingsec = true
          setTimeout(() =>{
            let data = new URLSearchParams()
            data.append('username', this.$store.getters.get_username)
            data.append('password', this.ruleForm.pass)
            this.axios.post("/api/user/repwd-user",data)
            .then(res =>{
              this.fullscreenLoadingsec = false
              this.$message.success("修改成功")
              this.active = 3
            })
            .catch(err =>{
              this.fullscreenLoadingsec = false
              this.$message.error("失败")
            })
          },1000)


        } else {
          this.$message.error("error")
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
}
</script>

<style scoped>
.form{
  position: absolute;
  left: 22%;
  top: 25%;
}
.steps{
  position: absolute;
  width: 100%;

}
.changepwd{
  font-size: 20px;
  position: relative;
  width: 700px;
  height: 500px;
  top: 50%;
  left: 50%;
  margin:-250px 0 0 -350px;
}
</style>
