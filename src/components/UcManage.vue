<template>
  <div class="ucmanage">
    <div class="button">
      <el-button type="text" @click="dialogFormVisible = true">点击创建新用户</el-button>
    </div>
    <el-table
      class="table_box"
      :data="tableData"
      style="width:80%;font-size:13px;color:rgb(0, 0, 0);max-height:100%"
      stripe
      border
      height="480"
    >
      <el-table-column fixed prop="username" label="姓名" width="150"></el-table-column>
      <el-table-column prop="createTime" label="创建时间" width="150"></el-table-column>
      <el-table-column prop="tip" label="提示" width="150"></el-table-column>
      <el-table-column prop="role" label="角色" width="150"></el-table-column>
      <el-table-column fixed="right"  label="操作" width="250">
        <template slot-scope="scope">
          <el-button  @click="reroleUser(scope.row)" plain type="warning" size="small">
            重设角色身份
          </el-button>
          <!--<el-button  @click.native.prevent="deleteRow(scope.$index, tableData)" plain type="danger" size="small">
            删除用户
          </el-button>-->
        </template>
      </el-table-column>
    </el-table>

    <!--<el-pagination
      background
      :page-size="20"
      layout="prev, pager, next"
      :total="totalPagenum * 20"
      @current-change="handleCurrentChange"
    >
    </el-pagination>-->
    <el-dialog title="新用户信息" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="用户姓名:" :label-width="formLabelWidth">
          <el-input v-model="form.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码:" :label-width="formLabelWidth">
          <el-input v-model="form.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色权限:" :label-width="formLabelWidth">
          <el-input value="普通用户" disabled></el-input>
        </el-form-item>
        <el-form-item label="问题:" :label-width="formLabelWidth">
          <el-input v-model="form.question" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="答案:" :label-width="formLabelWidth">
          <el-input v-model="form.answer" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="提示:" :label-width="formLabelWidth">
          <el-input v-model="form.tip" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit(form)">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="设置角色权限" :visible.sync="dialogFormVisible2" class="reroledialog" >
      <el-form>
      <el-form-item label="角色权限:" label-width="225px">
        <el-select v-model="reRole" placeholder="请选择角色">
          <el-option v-for="item in options"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible2 = false">取 消</el-button>
        <el-button type="primary" @click="submitRerole">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "UcManage",
  data() {
    return {
      form:{
        username:'',
        password:'',
        role:'1',
        question:'',
        answer:'',
        tip:'',
      },
      formLabelWidth: '120px',
      dialogFormVisible: false,
      dialogFormVisible2: false,
      reRole: '',
      reroleUSer: '',
      tableData:[],
      options: [{
        value: '1',
        label: '普通用户'
      }, {
        value: '2',
        label: '管理员'
      }, {
        value: '3',
        label: 'root'
      }],
    }
  },
  created() {
    this.axios.get("/api/user/get-users")
    .then(res => {
      for(let i in res.data.users){
        res.data.users[i].createTime = new Date(parseInt(res.data.users[i].createTime)).toLocaleString().replace(/:\d{1,2}$/,' ')
      }
      this.tableData = res.data.users
    })
  },
  methods: {
    submit(form) {
      let data = new URLSearchParams()
      data.append('username', form.username)
      data.append('password', form.password)
      data.append('role', form.role)
      data.append('question', form.question)
      data.append('answer', form.answer)
      data.append('tip', form.tip)
      this.axios.post('/api/user/add-user',data)
      .then(res =>{
          this.dialogFormVisible = false
          this.$message.success("添加用户成功")
        setTimeout(() =>{
          location.reload()
        },500)
        }
      ).catch(err=>{
        console.log(err.response.data)
        this.dialogFormVisible = false
        if(err.response.data.code === 604)
          this.$message.error("该用户已存在")
        else if(err.response.data.code === 603)
          this.$message.error("权限不足")
        else if(err.response.data.code === 602)
          this.$message.error("表单格式异常")
        else this.$message.error("异常")
      })
    },
    reroleUser(row) {
      this.dialogFormVisible2 = true
      this.reroleUSer = row.username
    },
    submitRerole(){
      this.axios.get("/api/user/rerole-user?username=" + this.reroleUSer + "&role=" + this.reRole)
      .then(res => {
        this.dialogFormVisible2 = false
        this.$message.success("操作成功")
        setTimeout(() =>{
          location.reload()
        },500)

      })
      .catch( err =>{
        this.dialogFormVisible2 = false
        this.$message.error("操作失败")
      })
    }
  }
}
</script>

<style scoped>
.ucmanage {
  position: relative;
  width: 100%;
  height: 100%;
}
.button {
  position: absolute;
  left: 8%;
  top: 5%;
}
.table_box {
  position: absolute;
  left: 8%;
  top: 12%;
}

</style>
