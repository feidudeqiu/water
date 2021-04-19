<template>
    <div style="margin-top:10px;display:flex;flex-direction:column;align-items:center;">
        <div style="margin-top:5px;">
            <el-input size="mini"  placeholder="按创建用户搜索" v-model="usernameInput">
                <template slot="append">
                    <el-button @click="searchByUsername()" type="primary" size="mini">搜索</el-button>
                </template>
            </el-input>
            <el-table style="margin-top:5px;" size="mini" :data="tableData" border>
                <el-table-column width="120" property="name" label="湖泊名称"></el-table-column>
                <el-table-column width="120" property="area" label="面积"></el-table-column>
                <el-table-column width="120" property="height" label="平均深度"></el-table-column>
                <el-table-column width="120" property="username" label="创建用户"></el-table-column>
                <el-table-column width="120" property="finished"  :formatter="formatFinished" label="是否结算"></el-table-column>
                <el-table-column width="180" :formatter="formatTime" property="create_time" label="创建时间"></el-table-column>
                <el-table-column  width="250" label="操作">
                    <template slot-scope="scope">
							<el-button size="mini" @click="edit(scope.row)" type="primary">修改数据</el-button>
                            <el-button size="mini" @click="showInfo(scope.row.id)" type="primary">查看湖泊信息</el-button>
					</template>
                </el-table-column>
            </el-table>
            <el-pagination
                @current-change="currentPageChange"
                :current-page="currentPage"
                background hide-on-single-page
                layout="prev, pager, next"
                :page-size="pageSize"
                :total="model==='nomal'?total:rawData.length">
            </el-pagination>
        </div>
        <el-dialog
            title="修改湖泊信息"
            :visible.sync="lakeInfoVisible">
            <el-form size="mini" label-width="150px" :model="lakeInfo">
                <el-form-item label="湖泊名称">
                    <el-input maxlength="32" v-model="lakeInfo.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="平均深度(米)">
                    <el-input type="number" v-model="lakeInfo.height" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="面积(平方米)">
                    <el-input type="number" v-model="lakeInfo.area" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="是否结算">
                    <el-switch v-model="lakeInfo.finished" active-text="是" inactive-text="否"></el-switch>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="lakeInfoVisible = false">取消</el-button>
                <el-button type="primary" @click="updateLake()">修改</el-button>
            </div>
        </el-dialog>
        <el-dialog 
            title="湖泊信息"
            :visible.sync="lakeDataVisible">
            <div>
                <span class="text-h5 text-thick">检测点</span>
                <div style="border-radius:5px;margin:5px;background:#F7F8FA;padding:5px;" v-for="monitor in lakeData.monitors" v-bind:key="monitor.monitorId">
                    <div class="flex-row-inline">
                        <img style="height:20px;" src="/static/img/monitor.png">
                        <span style="margin-left:10px;">{{monitor.monitorName}}</span>
                        <el-button type="primary" size="mini" @click="showWaterQualities(monitor.monitorId)" style="margin-left:10px;">查看水质数据</el-button>
                        <el-button type="danger" size="mini" @click="deleteMonitor(monitor.monitorId)" >删除</el-button>
                    </div>
                    <div>
                        <span class="text-h6 text-thick">备注</span>
                        <span>{{monitor.note}}</span>
                    </div>
                </div>
            </div>
            <!-- <el-collapse>
                <el-collapse-item>
                    <template slot="title">
                        <span class="text-h5 text-thick">检测点</span>
                    </template>
                    <div>
                        <div style="border-radius:5px;margin:5px;background:#F7F8FA;padding:5px;" v-for="monitor in lakeData.monitors" v-bind:key="monitor.monitorId">
                            <div class="flex-row-inline">
                                <img style="height:20px;" src="/static/img/monitor.png">
                                <span style="margin-left:10px;">{{monitor.monitorName}}</span>
                                <img style="cursor:pointer;height:20px;margin-left:10px;" src="/static/img/table.png">
                                <i @click="deleteMonitor(monitor.monitorId)" style="cursor:pointer;font-size:20px;" class="el-icon-delete"/>
                            </div>
                            <div>
                                <span class="text-h6 text-thick">备注</span>
                                <span>{{monitor.note}}</span>
                            </div>
                        </div>
                    </div>
                    
                </el-collapse-item>
            </el-collapse> -->
            <el-dialog width="80%" append-to-body title="水质数据" :visible.sync="waterQualityVisible">
                <el-table :data="waterQualityById">
                    <el-table-column :sortable="true" width="200px" :formatter="formatTime" property="monitorTime" label="检测时间"></el-table-column>
                    <el-table-column property="tn" label="TN(mg/L)" ></el-table-column>
                    <el-table-column property="tp" label="TP(mg/L)"></el-table-column>
                    <el-table-column property="chlorophyll" label="叶绿素(mg/L)"></el-table-column>
                    <el-table-column property="o2" label="DO(mg/L)"></el-table-column>
                    <el-table-column property="cod" label="COD(mg/L)"></el-table-column>
                    <el-table-column property="bod" label="BOD(mg/L)"></el-table-column> 
                    <el-table-column property="volumn" label="水量(m3)"></el-table-column>                 
                </el-table>
            </el-dialog>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: 'UcDataManage',
    data() {
        return {
            currentPage: 1,
            pageSize: 10,
            rawData:[],
            total: 0,
            usernameInput:'',
            model:"nomal",
            lakeInfoVisible: false,
            lakeInfo: {
                name: "",
                height: "",
                area:"",
                finished: false
            },
            
            lakeDataVisible: false,
            lakeData: {
                monitors:[],
                qualitys:[]
            },
            waterQualityVisible:false,
            waterQualityById: []
        }
    },
    computed: {
        tableData() {
            if(this.model === 'nomal') {
                return this.rawData
            } else if(this.model === 'username') {
                return this.rawData.slice((this.currentPage-1)*this.pageSize,this.currentPage*this.pageSize)
            }
        }
    },
    created() {
        this.getData(this.pageSize,(this.currentPage-1)*this.pageSize);
        this.getLakeCount();
    },
    methods: {
        updateLake() {
            var data = new URLSearchParams();
            data.append("lakeId",this.lakeInfo.id);
            data.append("name",this.lakeInfo.name);
            data.append("area",this.lakeInfo.area);
            data.append("height",this.lakeInfo.height);
            data.append("finished",this.lakeInfo.finished);
            this.axios.post("/api/lake/update-lake",data)
            .then(res=>{
                if(res.data.res) {
                    this.$message.success("更新成功");
                    this.lakeInfoVisible = false;
                    setTimeout(function(){ location.reload(); }, 1500);
                } else {
                    this.$message.error("更新失败");
                }
            })
            .catch(err=>{
                this.$message.error(err.response.data.message);
            })
        },
        currentPageChange(e) {
            this.currentPage = e;
            this.getData(this.pageSize,(this.currentPage-1)*this.pageSize);
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
        formatFinished(row, column,data, index) {
            if(data) {
                return "是";
            } else {
                return "否";
            }
        },
        getLakeCount() {
            this.axios.get("/api/lake/get-lake-count")
            .then(res=>{
                this.total = res.data.data;
            })
            .catch(err=>{
                this.$message.error(err.response.data.message);
            })
        },
        getData(limit,offset) {
            this.axios.get("/api/lake/get-lakeinfos-by-page?limit="+limit+"&offset="+offset)
            .then(res=>{
                this.rawData = res.data.data;
            })
            .catch(err=>{
                this.$message.error(err.response.data.message);
            })
        },
        searchByUsername() {
            this.rawData = [];
            if(this.usernameInput!= '') {
                this.model = "username";
                this.currentPage=1,
                this.getDataByUsername(this.usernameInput);
            } else {
                this.model = "nomal";
                this.currentPage=1,
                this.getLakeCount();
                this.getData(this.pageSize,(this.currentPage-1)*this.pageSize);
            }
        },
        getDataByUsername(username) {
            this.axios.get("/api/lake/get-lakeinfos-by-username?username="+username)
            .then(res=>{
                this.rawData = res.data.data;
            })
            .catch(err=>{
                this.$message.error(err.response.data.message);
            })
        },
        showInfo(id) {
            this.lakeData.monitors = [];
            this.lakeDataVisible = true;
            this.getMonitorByLakeId(id);

        },
        getMonitorByLakeId(lakeId) {
            this.axios.get("/api/monitor/get-monitors-by-lake-id?lakeId="+lakeId)
            .then(res=>{
                this.lakeData.monitors = res.data.data;
            })
            .catch(err=>{
                this.$message.error(err.response.data.message);
            })
        },
        edit(row) {
            this.lakeInfo = {
                name: row.name,
                area: row.area,
                height: row.height,
                id: row.id,
                finished: row.finished
            },
            this.lakeInfoVisible = true;
        },
        showWaterQualities(id) {
            this.waterQualityVisible = true;
            this.axios.get("/api/quality/get-qualities-by-id?monitorId="+id)
            .then(res=>{
                this.waterQualityById = res.data.qualities;
            })
            .catch(err=>{
                this.$message.error(err.response.data.message);
            })
        },
        deleteMonitor(id) {
            this.$confirm('此操作将永久删除检测点, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.axios.get("/api/monitor/remove-monitor?id="+id)
                .then(res=>{
                    if(res.data.res) {
                        this.$message.success("删除成功！");
                        this.lakeData.monitors.splice(this.lakeData.monitors.findIndex(item=>item.monitorId==id), 1);
                    } else {
                        this.$message.error("删除失败！");
                    }
                    
                })
                .catch(err=>{
                    this.$message.error(err.response.data.message);
                })
            }).catch(() => {
                        
            });
        }
    }
}
</script>

<style scoped>
>>>.el-collapse-item__content {
    padding-left:6px;
    padding-top:3px;
    padding-bottom:3px;
    /* background:#F7F8FA; */
}
>>>.el-collapse-item__wrap:last-child {
    border-bottom: 0px;
}
</style>