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
      v-if="isFirststep">
      <el-form-item label="初始问题:">
        <el-input class="input1" v-model="form.question"></el-input>
      </el-form-item>
      <el-form-item label="提示信息:">
        <el-input class="input2"  v-model="form.tip"></el-input>
      </el-form-item>
      <el-form-item label="答案:">
        <el-input class="input2" type="textarea" v-model="answer"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button class="button" plain  @click="next">下一步 <i class="el-icon-thumb"></i></el-button>
        <el-button class="button" plain  @click="back()">重置 <i class="el-icon-delete"></i></el-button>
      </el-form-item>
    </el-form>
    <el-form :model="ruleForm"
             status-icon
             :rules="rules"
             ref="ruleForm"
             label-width="100px"
             class="form"
             v-if="!isFirststep">
      <el-form-item label="密码" prop="pass">
        <el-input type="password" v-model="ruleForm.pass" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="checkPass">
        <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "UcChangepwd",
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else {
        if (this.ruleForm.checkPass !== '') {
          this.$refs.ruleForm.validateField('checkPass');
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
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

  },
  methods: {
    next() {
      this.active++;
      this.isFirststep = !this.isFirststep;
    },
    back(){
      this.answer = '';
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$message.success('成功');
          this.active = 3;
        } else {
          console.log('error submit!!');
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
