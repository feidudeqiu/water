<template>
    <div class="register" style="display:flex;justify-content:center;">
        <div>
            <el-table style="margin-top:20px;" size="mini" border :data="tableData">
                <el-table-column width="120" property="username" label="用户名"></el-table-column>
                <el-table-column width="200" property="email" label="邮件地址"></el-table-column>
                <el-table-column width="150" :formatter="formatTime" property="createTime" label="注册时间"></el-table-column>
                <el-table-column show-overflow-tooltip width="250" property="workPlace" label="工作单位"></el-table-column>
                <el-table-column width="150" label="操作">
                    <template slot-scope="scope">
                        <el-button size="mini" @click="permit(scope.row.username)" type="success">通过</el-button>
                        <el-button size="mini" @click="deny(scope.row.username)" type="danger">拒绝</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                @current-change="currentPageChange"
                :current-page="currentPage"
                background hide-on-single-page
                layout="prev, pager, next"
                :page-size="pageSize"
                :total="rawRegister.length">
            </el-pagination>
        </div>
        
    </div>
</template>

<script>
export default {
    name: "UcRegister",
    data () {
        return {
            rawRegister: [],
            currentPage: 1,
            pageSize: 10
        }
    },
    computed: {
        tableData() {
            return this.rawRegister.slice((this.currentPage-1)*this.pageSize,this.currentPage*this.pageSize)
        }
    },
    created() {
        this.axios.get("/api/user/get-registers")
        .then(res=>{
            this.rawRegister = res.data.registers;
        })
        .catch(err=>{
            this.$message.error(err.response.data.message);
        })
    },
    methods: {
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
        formatTime(row, column,date, index) {
            if(date) {
                return this.formatTimeByStamp(date);
            } else {
                return "";
            }
            
        },
        permit(username) {
            this.axios.get("/api/user/permit-register?username="+username)
            .then(res=>{
                this.rawRegister = this.rawRegister.filter(item=>item.username!=username);
                this.$message.success("操作成功");
            })
            .catch(err=>{
                this.$message.error(err.response.data.message);
            })
        },
        deny(username) {
            this.axios.get("/api/user/deny-register?username="+username)
            .then(res=>{
                this.rawRegister = this.rawRegister.filter(item=>item.username!=username);
                this.$message.success("操作成功");
            })
            .catch(err=>{
                this.rawRegister = this.rawRegister.filter(item=>item.username!=username);
                this.$message.error(err.response.data.message);
            })
        }
    }
}
</script>

<style scoped>
.register {
    width:100%;
    height:100%;
}
</style>