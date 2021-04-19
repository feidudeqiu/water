<template>
	<div class="ucmanage" style="margin-top:10px;display:flex;flex-direction:column;align-items:center;">
			<el-button size="mini" type="primary" @click="dialogFormVisible = true">点击创建新用户</el-button>
			<div>
				<el-table style="margin-top:10px;" size="mini" :data="tableData" border>
					<el-table-column prop="username" label="用户名" width="100"></el-table-column>
					<el-table-column prop="createTime" label="创建时间" width="150"></el-table-column>
					<el-table-column label="角色" width="150">
						<template slot-scope="scope">
							<span>{{getRoleName(scope.row.role)}}</span>
						</template>
					</el-table-column>
					<el-table-column prop="email" label="邮箱" width="150"></el-table-column>
					<el-table-column prop="workPlace" label="工作单位" width="150"></el-table-column>
					<el-table-column label="操作" width="150">
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
				<el-pagination
					@current-change="currentPageChange"
					:current-page="currentPage"
					background hide-on-single-page
					layout="prev, pager, next"
					:page-size="pageSize"
					:total="rawData.length">
				</el-pagination>
			</div>
		<el-dialog title="新用户信息" :visible.sync="dialogFormVisible">
		<el-form :model="form">
			<el-form-item label="用户名:" :label-width="formLabelWidth">
			<el-input maxlength="16" v-model="form.username" autocomplete="off"></el-input>
			</el-form-item>
			<el-form-item label="密码:" :label-width="formLabelWidth">
			<el-input type="password" show-password maxlength="16" v-model="form.password" autocomplete="off"></el-input>
			</el-form-item>
			<el-form-item label="角色权限:" :label-width="formLabelWidth">
			<el-input value="普通用户" disabled></el-input>
			</el-form-item>
			<el-form-item label="邮件:" :label-width="formLabelWidth">
			<el-input v-model="form.email" autocomplete="off"></el-input>
			</el-form-item>
			<el-form-item label="工作单位:" :label-width="formLabelWidth">
			<el-input v-model="form.workPlace" autocomplete="off"></el-input>
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
				email:'',
				workPlace: ""
			},
			currentPage: 1,
			pageSize: 10,
			formLabelWidth: '120px',
			dialogFormVisible: false,
			dialogFormVisible2: false,
			reRole: '',
			reroleUSer: '',
			rawData: [],
			options: [
				{
					value: '1',
					label: '普通用户'
				}, 
				{
				value: '2',
				label: '管理员'
				}
			],
		}
	},
	computed: {
		tableData() {
            return this.rawData.slice((this.currentPage-1)*this.pageSize,this.currentPage*this.pageSize)
        }
	},
	created() {
		this.axios.get("/api/user/get-users")
		.then(res => {
		for(let i in res.data.users){
			res.data.users[i].createTime = this.formatTimeByStamp(res.data.users[i].createTime);
		}
		this.rawData = res.data.users
		})
	},
	methods: {
		getRoleName(role) {
			if(role == 1) {
				return "普通用户";
			} else if(role == 2) {
				return "管理员";
			} else if(role == 3) {
				return "超级管理员";
			}
		},
		currentPageChange(e) {
			this.currentPage = e;
		},
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
		submit(form) {
			let data = new URLSearchParams()
			data.append('username', form.username);
			data.append('password', form.password);
			data.append('email', form.email);
			data.append('workPlace',form.workPlace);
			this.axios.post('/api/user/add-user',data)
			.then(res =>{
				this.dialogFormVisible = false
				this.$message.success("添加用户成功")
				setTimeout(() =>{
				location.reload()
				},500)
				}
			).catch(err=>{
				this.$message.error(err.response.data.message);
				this.dialogFormVisible = false
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
  width:100%;
 height:100%;
}
</style>
