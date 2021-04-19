<template>
    <div>
        <div id="main" style="height:100%;width:100%;display:flex;">
            <div id="map" ref="rootmap" class="map"></div>
            <div id="column" class="column">
                <el-collapse>
                    <el-collapse-item>
                        <template slot="title">
                            <div style="width:100%;background:gray;">
                                <span class="text-h4 text-thick" style="margin-left:10px;">当前项目</span>

                            </div>
                        </template>
                        <el-collapse>
                            <el-collapse-item>
                                <template slot="title">
                                    <span class="text-h5 text-thick" style="margin-left:10px;">项目基本情况</span>
                                </template>
                                <el-collapse>
                                    <el-collapse-item>
                                        <template slot="title">
                                            <span class="text-h5 text-thick" style="margin-left:10px;">项目基本信息</span>
                                        </template>
                                        <div v-for="lake in unfinishedLake" v-bind:key="lake.lakeInfo.id">
                                            <div style="background:white;border-radius:5px;padding-left:5px;margin-top:5px;">
                                                <div @click="jumpToLake(lake.lakeInfo.id)" class="flex-row-inline" style="cursor:pointer;">
                                                    <span class="text-h6 text-thick">项目名称</span>
                                                    <span class="text-h6 text-thick" style="margin-left:10px;">{{lake.lakeInfo.name}}</span>
                                                </div>
                                                <div>
                                                    <span class="text-h6 text-thick">建设时间</span>
                                                    <span>{{formatTimeByStamp(lake.lakeInfo.createTime)}}</span>
                                                </div>
                                                <div>
                                                    <span class="text-h6 text-thick">设计单位</span>
                                                    <span>{{getUserWorkPlace()}}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </el-collapse-item>
                                    <el-collapse-item>
                                        <template slot="title">
                                            <span class="text-h5 text-thick" style="margin-left:10px;">导入项目地图，河网图层等</span>
                                        </template>
                                    </el-collapse-item>
                                </el-collapse>
                            </el-collapse-item>
                            <el-collapse-item>
                                <template slot="title">
                                    <span class="text-h5 text-thick" style="margin-left:10px;">数据输入/修改</span>
                                </template>
                                <div v-for="lake in unfinishedLake" v-bind:key="lake.lakeInfo.id">
                                    <div style="background:white;border-radius:5px;padding-left:5px;margin-top:5px;">
                                        <div @click="jumpToLake(lake.lakeInfo.id)" class="flex-row-inline" style="cursor:pointer;">
                                            <img style="height:20px;" src="/static/img/lake.png">
                                            <span class="text-h6 text-thick" style="margin-left:10px;">{{lake.lakeInfo.name}}</span>
                                        </div>
                                        <div>
                                            <span class="text-h6 text-thick">面积(平方米)</span>
                                            <span>{{lake.lakeInfo.area}}</span>
                                        </div>
                                        <div>
                                            <span class="text-h6 text-thick">平均深度(米)</span>
                                            <span>{{lake.lakeInfo.height}}</span>
                                        </div>
                                        <div>
                                            <span class="text-h6 text-thick">蓄水量(立方米)</span>
                                            <span>{{parseFloat(lake.lakeInfo.area*lake.lakeInfo.height).toFixed(2)}}</span>
                                        </div>
                                        <div>
                                            <el-button style="margin-top:5px;" @click="resetLakeInfo(lake.lakeInfo,lake.lakeInfo.id)" size="mini" type="primary">修改湖泊信息</el-button>
                                            <el-button style="margin-top:5px;" @click="jumpToLake(lake.lakeInfo.id);$message.info('请在地图中选中湖泊右键添加检测点')" size="mini" type="primary">添加检测点</el-button>
                                            <el-button style="margin-top:5px;" @click="updateWaterQuality(lake.lakeInfo.id)" size="mini" type="primary">更新水质数据</el-button>
                                            <el-button style="margin-top:5px;" @click="lakeDataClone(lake.lakeInfo.id)" size="mini" type="primary">项目数据下载</el-button>
                                            <el-tooltip effect="dark" content="项目将被放入历史项目中，可以查看数据但无法修改" placement="bottom">
                                                <el-button style="margin-top:5px;" @click="finishLake(lake.lakeInfo.id)" size="mini" type="warning">项目结算</el-button>
                                            </el-tooltip>
                                        </div>
                                    </div>
                                    
                                </div>
                            </el-collapse-item>
                            <el-collapse-item >
                                <template slot="title">
                                    <span class="text-h5 text-thick" style="margin-left:10px;">结果文件查看</span>
                                </template>
                                <el-collapse v-model="unfinishedCurrentLake" accordion v-on:change="lakeChange">
                                    <el-collapse-item :name="lake.lakeInfo.id" v-for="lake in unfinishedLake" v-bind:key="lake.lakeInfo.id">
                                    <template slot="title">
                                        <span class="text-h5 text-thick" style="margin-left:10px;">{{lake.lakeInfo.name}}</span>
                                    </template>
                                    <el-collapse accordion v-on:change="unfinishedQualityChange">
                                        <el-collapse-item :name="quality.monitorTime" v-for="quality in lake.qualities" v-bind:key="quality.monitorTime">
                                            <template slot="title">
                                                <i style="font-size:16px;" class="el-icon-timer"></i>
                                                <span class="text-h6 text-secondary">{{formatTimeByStamp(quality.monitorTime)}}</span>
                                            </template>
                                            <div v-if="waterAnalyse[lake.lakeInfo.id+''+quality.monitorTime]">
                                                <div class="flex-row-inline">
                                                    <span class="text-h5 text-thick">水质分析图</span>
                                                    <img src="~static/img/table.png" style="height:20px;cursor:pointer;height:20px;margin-left:5px;" @click="showAnalyseDetail(lake.lakeInfo.id,quality.monitorTime)" title="详细评价数据"/>
                                                </div>
                                                <div style="height:200px;margin-top:10px;margin-bottom:10px;" :id="lake.lakeInfo.id+''+quality.monitorTime">
                                                    
                                                </div>
                                                <div v-if="!qualityJudge(lake.lakeInfo.id,quality.monitorTime)">
                                                    <div slot="lake.lakeInfo.id+''+quality.monitorTime" slot-scope="id">
                                                        <span>{{id}}</span>
                                                    </div>
                                                    <div v-if="!waterPurify[lake.lakeInfo.id+''+quality.monitorTime]">
                                                            <span class="text-secondary">获取配方中</span><i class="el-icon-loading text-secondary"></i>
                                                    </div>
                                                    <div v-else >
                                                        <div class="text-h5 text-thick">水质治理配方(m2)</div>
                                                        <div v-if="countPurifyArea(waterPurify[lake.lakeInfo.id+''+quality.monitorTime].purify)>lake.lakeInfo.area">
                                                            <div class="flex-row-inline" style="color:#ff0000">
                                                                <span>请减少入水量</span>
                                                                <el-tooltip class="item" effect="dark" content="植物配方总面积大于湖泊面积，无法满足要求，需要减少入水量" placement="bottom">
                                                                    <i style="font-size:16px;" class="el-icon-warning"></i>
                                                                </el-tooltip>
                                                            </div>
                                                        </div>
                                                        <div v-else>
                                                            <div  style="display:flex; flex-wrap:wrap;">
                                                                <div class="purify-item">
                                                                    <div class="purify-title">WF_TN</div>
                                                                    <div class="purify-value">{{parseFloat(waterPurify[lake.lakeInfo.id+''+quality.monitorTime].purify.wfTn).toFixed(2)}}</div>
                                                                </div>
                                                                <div class="purify-item">
                                                                    <div class="purify-title">WF_TP</div>
                                                                    <div class="purify-value">{{parseFloat(waterPurify[lake.lakeInfo.id+''+quality.monitorTime].purify.wfTp).toFixed(2)}}</div>
                                                                </div>
                                                                <div class="purify-item">
                                                                    <div class="purify-title">WF_DO</div>
                                                                    <div class="purify-value">{{parseFloat(waterPurify[lake.lakeInfo.id+''+quality.monitorTime].purify.wfDo).toFixed(2)}}</div>
                                                                </div>
                                                                <div class="purify-item">
                                                                    <div class="purify-title">WF_COD</div>
                                                                    <div class="purify-value">{{parseFloat(waterPurify[lake.lakeInfo.id+''+quality.monitorTime].purify.wfCod).toFixed(2)}}</div>
                                                                </div>
                                                                <div class="purify-item">
                                                                    <div class="purify-title">WF_BOD</div>
                                                                    <div class="purify-value">{{parseFloat(waterPurify[lake.lakeInfo.id+''+quality.monitorTime].purify.wfBod).toFixed(2)}}</div>
                                                                </div>
                                                                <div class="purify-item">
                                                                    <div class="purify-title">WF_CH</div>
                                                                    <div class="purify-value">{{parseFloat(waterPurify[lake.lakeInfo.id+''+quality.monitorTime].purify.wfCh).toFixed(2)}}</div>
                                                                </div>
                                                                <div class="purify-item">
                                                                    <div class="purify-title">WD_TN</div>
                                                                    <div class="purify-value">{{parseFloat(waterPurify[lake.lakeInfo.id+''+quality.monitorTime].purify.wdTn).toFixed(2)}}</div>
                                                                </div>
                                                                <div class="purify-item">
                                                                    <div class="purify-title">WD_TP</div>
                                                                    <div class="purify-value">{{parseFloat(waterPurify[lake.lakeInfo.id+''+quality.monitorTime].purify.wdTp).toFixed(2)}}</div>
                                                                </div>
                                                                <div class="purify-item">
                                                                    <div class="purify-title">WD_DO</div>
                                                                    <div class="purify-value">{{parseFloat(waterPurify[lake.lakeInfo.id+''+quality.monitorTime].purify.wdDo).toFixed(2)}}</div>
                                                                </div>
                                                                <div class="purify-item">
                                                                    <div class="purify-title">WD_COD</div>
                                                                    <div class="purify-value">{{parseFloat(waterPurify[lake.lakeInfo.id+''+quality.monitorTime].purify.wdCod).toFixed(2)}}</div>
                                                                </div>
                                                                <div class="purify-item">
                                                                    <div class="purify-title">WD_BOD</div>
                                                                    <div class="purify-value">{{parseFloat(waterPurify[lake.lakeInfo.id+''+quality.monitorTime].purify.wdBod).toFixed(2)}}</div>
                                                                </div>
                                                                <div class="purify-item">
                                                                    <div class="purify-title">WD_CH</div>
                                                                    <div class="purify-value">{{parseFloat(waterPurify[lake.lakeInfo.id+''+quality.monitorTime].purify.wdCh).toFixed(2)}}</div>
                                                                </div>
                                                            </div>
                                                            <div style="height:200px;margin-top:10px;margin-bottom:10px;" :id="'pie'+lake.lakeInfo.id+''+quality.monitorTime"></div>
                                                        </div>
                                                        
                                                        
                                                    </div>
                                                </div>
                                            </div>
                                        </el-collapse-item>
                                    </el-collapse>
                                </el-collapse-item>
                                </el-collapse>
                                
                            </el-collapse-item>
                        </el-collapse>
                        
                    </el-collapse-item>
                    <el-collapse-item>
                        <template slot="title">
                            <div style="width:100%;background:gray;">
                            <span class="text-h4 text-thick" style="margin-left:10px;">历史项目</span>
                            </div>
                        </template>
                        <el-collapse v-model="finishedCurrentLake" accordion v-on:change="lakeChange">
                                    <el-collapse-item :name="lake.lakeInfo.id" v-for="lake in finishedLake" v-bind:key="lake.lakeInfo.id">
                                    <template slot="title">
                                        <span class="text-h5 text-thick" style="margin-left:10px;">{{lake.lakeInfo.name}}</span>
                                    </template>
                                    <el-collapse accordion v-on:change="finishedQualityChange">
                                        <el-collapse-item :name="quality.monitorTime" v-for="quality in lake.qualities" v-bind:key="quality.monitorTime">
                                            <template slot="title">
                                                <i style="font-size:16px;" class="el-icon-timer"></i>
                                                <span class="text-h6 text-secondary">{{formatTimeByStamp(quality.monitorTime)}}</span>
                                            </template>
                                            <div v-if="waterAnalyse[lake.lakeInfo.id+''+quality.monitorTime]">
                                                <div class="flex-row-inline">
                                                    <span class="text-h5 text-thick">水质分析图</span>
                                                    <img src="~static/img/table.png" style="height:20px;cursor:pointer;height:20px;margin-left:5px;" @click="showAnalyseDetail(lake.lakeInfo.id,quality.monitorTime)" title="详细评价数据"/>
                                                </div>
                                                <div style="height:200px;margin-top:10px;margin-bottom:10px;" :id="lake.lakeInfo.id+''+quality.monitorTime">
                                                    
                                                </div>
                                                <div v-if="!qualityJudge(lake.lakeInfo.id,quality.monitorTime)">
                                                    <div slot="lake.lakeInfo.id+''+quality.monitorTime" slot-scope="id">
                                                        <span>{{id}}</span>
                                                    </div>
                                                    <div v-if="!waterPurify[lake.lakeInfo.id+''+quality.monitorTime]">
                                                            <span class="text-secondary">获取配方中</span><i class="el-icon-loading text-secondary"></i>
                                                    </div>
                                                    <div v-else >
                                                        <div class="text-h5 text-thick">水质治理配方(m2)</div>
                                                        <div v-if="countPurifyArea(waterPurify[lake.lakeInfo.id+''+quality.monitorTime].purify)>lake.lakeInfo.area">
                                                            <div class="flex-row-inline" style="color:#ff0000">
                                                                <span>请减少入水量</span>
                                                                <el-tooltip class="item" effect="dark" content="植物配方总面积大于湖泊面积，无法满足要求，需要减少入水量" placement="bottom">
                                                                    <i style="font-size:16px;" class="el-icon-warning"></i>
                                                                </el-tooltip>
                                                            </div>
                                                        </div>
                                                        <div v-else>
                                                            <div style="display:flex; flex-wrap:wrap;">
                                                                <div class="purify-item">
                                                                    <div class="purify-title">WF_TN</div>
                                                                    <div class="purify-value">{{parseFloat(waterPurify[lake.lakeInfo.id+''+quality.monitorTime].purify.wfTn).toFixed(2)}}</div>
                                                                </div>
                                                                <div class="purify-item">
                                                                    <div class="purify-title">WF_TP</div>
                                                                    <div class="purify-value">{{parseFloat(waterPurify[lake.lakeInfo.id+''+quality.monitorTime].purify.wfTp).toFixed(2)}}</div>
                                                                </div>
                                                                <div class="purify-item">
                                                                    <div class="purify-title">WF_DO</div>
                                                                    <div class="purify-value">{{parseFloat(waterPurify[lake.lakeInfo.id+''+quality.monitorTime].purify.wfDo).toFixed(2)}}</div>
                                                                </div>
                                                                <div class="purify-item">
                                                                    <div class="purify-title">WF_COD</div>
                                                                    <div class="purify-value">{{parseFloat(waterPurify[lake.lakeInfo.id+''+quality.monitorTime].purify.wfCod).toFixed(2)}}</div>
                                                                </div>
                                                                <div class="purify-item">
                                                                    <div class="purify-title">WF_BOD</div>
                                                                    <div class="purify-value">{{parseFloat(waterPurify[lake.lakeInfo.id+''+quality.monitorTime].purify.wfBod).toFixed(2)}}</div>
                                                                </div>
                                                                <div class="purify-item">
                                                                    <div class="purify-title">WF_CH</div>
                                                                    <div class="purify-value">{{parseFloat(waterPurify[lake.lakeInfo.id+''+quality.monitorTime].purify.wfCh).toFixed(2)}}</div>
                                                                </div>
                                                                <div class="purify-item">
                                                                    <div class="purify-title">WD_TN</div>
                                                                    <div class="purify-value">{{parseFloat(waterPurify[lake.lakeInfo.id+''+quality.monitorTime].purify.wdTn).toFixed(2)}}</div>
                                                                </div>
                                                                <div class="purify-item">
                                                                    <div class="purify-title">WD_TP</div>
                                                                    <div class="purify-value">{{parseFloat(waterPurify[lake.lakeInfo.id+''+quality.monitorTime].purify.wdTp).toFixed(2)}}</div>
                                                                </div>
                                                                <div class="purify-item">
                                                                    <div class="purify-title">WD_DO</div>
                                                                    <div class="purify-value">{{parseFloat(waterPurify[lake.lakeInfo.id+''+quality.monitorTime].purify.wdDo).toFixed(2)}}</div>
                                                                </div>
                                                                <div class="purify-item">
                                                                    <div class="purify-title">WD_COD</div>
                                                                    <div class="purify-value">{{parseFloat(waterPurify[lake.lakeInfo.id+''+quality.monitorTime].purify.wdCod).toFixed(2)}}</div>
                                                                </div>
                                                                <div class="purify-item">
                                                                    <div class="purify-title">WD_BOD</div>
                                                                    <div class="purify-value">{{parseFloat(waterPurify[lake.lakeInfo.id+''+quality.monitorTime].purify.wdBod).toFixed(2)}}</div>
                                                                </div>
                                                                <div class="purify-item">
                                                                    <div class="purify-title">WD_CH</div>
                                                                    <div class="purify-value">{{parseFloat(waterPurify[lake.lakeInfo.id+''+quality.monitorTime].purify.wdCh).toFixed(2)}}</div>
                                                                </div>
                                                            </div>
                                                            <div style="height:200px;margin-top:10px;margin-bottom:10px;" :id="'pie'+lake.lakeInfo.id+''+quality.monitorTime"></div>                                                            
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </el-collapse-item>
                                    </el-collapse>
                                </el-collapse-item>
                                </el-collapse>
                    </el-collapse-item>
                    <el-collapse-item>
                        <template slot="title">
                            <div style="width:100%;background:gray;">
                            <span class="text-h4 text-thick" style="margin-left:10px;">标准化表格</span>
                            </div>
                        </template>
                        <el-card >
                            <span style="cursor:pointer;" @click="waterQualityStandardVisible = true;getWaterQualityStandard()" class="text-h5 text-thick text-primary">水质标准</span>
                        </el-card>
                        <el-card >
                            <span style="cursor:pointer;" @click="waterPurifyStandardVisible = true;getWaterPurifyStandard()" class="text-h5 text-thick text-primary">配方治理标准</span>
                        </el-card>
                    </el-collapse-item>
                    <el-collapse-item>
                        <template slot="title">
                            <div style="width:100%;background:gray;">
                            <span class="text-h4 text-thick" style="margin-left:10px;">其他功能</span>
                            </div>
                        </template>
                        <el-collapse>
                            <el-collapse-item>
                                <template slot="title">
                                    <span class="text-h5 text-thick" style="margin-left:10px;">水质应急处理设施</span>
                                </template>
                            </el-collapse-item>
                            <el-collapse-item>
                                <template slot="title">
                                    <span class="text-h5 text-thick" style="margin-left:10px;">全生态理念</span>
                                </template>
                            </el-collapse-item>
                            <el-collapse-item>
                                <template slot="title">
                                    <span class="text-h5 text-thick" style="margin-left:10px;">省联网，水质预测</span>
                                </template>
                            </el-collapse-item>
                            <el-collapse-item>
                                <template slot="title">
                                    <span class="text-h5 text-thick" style="margin-left:10px;">全流域覆盖</span>
                                </template>
                            </el-collapse-item>
                        </el-collapse>
                    </el-collapse-item>
                </el-collapse>
            </div>
        </div>
        <el-dialog title="添加标记" :visible.sync="addMarkerDialogVisible">
            <el-form :model="addMarkerInfo">
                <span class="text-normal text-h6" style="text-align:left;margin-left:10px;">{{'X:'+addMarkerInfo.location[0]}}</span>
                <span class="text-normal text-h6" style="text-align:left;margin-left:10px;">{{'Y:'+addMarkerInfo.location[1]}}</span>
                <el-form-item label="标记名称">
                    <el-input v-model="addMarkerInfo.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="标记注释">
                    <el-input v-model="addMarkerInfo.note" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addMarkerDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addMarkerDialog()">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="添加检测点" :visible.sync="addMonitorDialogVisible">
            <el-form :model="addMonitorInfo">
                <span class="text-normal text-h6" style="text-align:left;margin-left:10px;">{{'X:'+addMonitorInfo.location[0]}}</span>
                <span class="text-normal text-h6" style="text-align:left;margin-left:10px;">{{'Y:'+addMonitorInfo.location[1]}}</span>
                <el-form-item label="检测点名称">
                    <el-input v-model="addMonitorInfo.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="检测点注释">
                    <el-input v-model="addMonitorInfo.note" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addMonitorDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addMonitorDialog()">确 定</el-button>
            </div>
        </el-dialog>
        
        <el-dialog title="添加水质检测数据" :visible.sync="addWaterQualityDialogVisible">
            <div v-for="qualityInfo in addWaterQualityInfo.monitors" v-bind:key="qualityInfo.monitorId">
                <span>{{qualityInfo.name}}</span>
                <el-form :inline="true"  size="mini" label-width="100px" :model="addWaterQualityInfo">
                    
                    <el-form-item label="TN(mg/L)">
                        <el-input type="number" v-model="qualityInfo.tn" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="TP(mg/L)">
                        <el-input type="number" v-model="qualityInfo.tp" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="叶绿素(mg/L)">
                        <el-input  type="number" v-model="qualityInfo.chlorophyll" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="DO(mg/L)">
                        <el-input type="number" v-model="qualityInfo.o2" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="COD(mg/L)">
                        <el-input type="number" v-model="qualityInfo.cod" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="BOD(mg/L)">
                        <el-input type="number" v-model="qualityInfo.bod" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="水量(m3)">
                        <el-input type="number" v-model="qualityInfo.volumn" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="百分比水量">
                        <span>{{parseFloat(qualityInfo.volumn/addWaterQualityInfo.lakeVolumn*100).toFixed(2)+'%'}}</span>
                    </el-form-item>
                    
                </el-form>
            </div>
            <div>
                <span style="margin-right:10px;">检测时间</span>
                <el-date-picker size="mini" v-model="addWaterQualityInfo.monitorTime" type="datetime"></el-date-picker>
            </div>
            
            <div slot="footer" class="dialog-footer">
                <el-button @click="addWaterQualityDialogVisible = false">取消</el-button>
                <el-button :disabled="!addWaterQualityInfo.monitors || addWaterQualityInfo.monitors.length==0" type="primary" @click="addWaterQualityDialog()">更新</el-button>
            </div>
        </el-dialog>
        <el-dialog title="水质数据" :visible.sync="waterQualityVisible">
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

        <el-dialog :width="analyseDetailType?'90%':'50%'" :visible.sync="analyseDetailVisible">
            <div slot="title" class="dialog-title">
                <span>详细评价数据</span>
                <el-switch v-model="analyseDetailType" active-text="单表" inactive-text="多表"></el-switch>
            </div>
            <div v-if="!analyseDetailType">
                <div v-for="table in analyseDetail.tables" v-bind:key="table.monitorId">
                    <div class="flex-row-inline">
                        <img style="height:20px;margin-right:10px;" src="/static/img/monitor.png">
                        <span>{{table.monitorName}}</span>
                    </div>
                    <el-table size="mini" :data="table.data" >
                        <el-table-column property="name" label="指标"></el-table-column>
                        <el-table-column property="value" label="实测进水浓度(mg/L)"></el-table-column>
                        <el-table-column label="地表水环境质量标准">
                            <el-table-column label="Ⅰ类">
                                <template slot-scope="scope">
                                    <div :style="{'background':scope.row.level<1?getColorByLevel(scope.row.level):'none'}">{{scope.row.standard.level1}}</div>
                                </template>
                            </el-table-column>
                            <el-table-column label="Ⅱ类">
                                <template slot-scope="scope">
                                    <div :style="{'background':(scope.row.level<=2&&scope.row.level>1)?getColorByLevel(scope.row.level):'none'}">{{scope.row.standard.level2}}</div>
                                </template>
                            </el-table-column>
                            <el-table-column label="Ⅲ类">
                                <template slot-scope="scope">
                                    <div :style="{'background':(scope.row.level<=3&&scope.row.level>2)?getColorByLevel(scope.row.level):'none'}">{{scope.row.standard.level3}}</div>
                                </template>
                            </el-table-column>
                            <el-table-column label="Ⅳ类">
                                <template slot-scope="scope">
                                    <div :style="{'background':(scope.row.level<=4&&scope.row.level>3)?getColorByLevel(scope.row.level):'none'}">{{scope.row.standard.level4}}</div>
                                </template>
                            </el-table-column>
                            <el-table-column label="Ⅴ类">
                                <template slot-scope="scope">
                                    <div :style="{'background':(scope.row.level<5&&scope.row.level>4)?getColorByLevel(scope.row.level):'none'}">{{scope.row.standard.level5}}</div>
                                </template>
                            </el-table-column>
                            <el-table-column label="劣Ⅴ类">
                                <template slot-scope="scope">
                                    <div :style="{'background':(scope.row.level==5)?getColorByLevel(scope.row.level):'none'}">{{scope.row.level6}}</div>
                                </template>
                            </el-table-column>
                        </el-table-column>
                    </el-table>
                </div>
                
            </div>
            <div v-if="analyseDetailType">
                <el-table :data="analyseDetail.list">
                    <el-table-column property="monitorName" label="检测点名" ></el-table-column>
                    <el-table-column label="TN">
                        <el-table-column property="tn" label="浓度(mg/L)"  width="100px;" :formatter="floatFix"></el-table-column>
                        <el-table-column label="等级" width="60px;">
                            <template slot-scope="scope">
                                <div :style="{'color':getColorByLevel(scope.row.tnLevel)}">{{formatLevelByNum(scope.row.tnLevel)}}</div>
                            </template>
                        </el-table-column>
                    </el-table-column>
                    <el-table-column label="TP">
                        <el-table-column property="tp" label="浓度(mg/L)" width="100px;" :formatter="floatFix"></el-table-column>
                        <el-table-column label="等级" width="60px;">
                            <template slot-scope="scope">
                                <div :style="{'color':getColorByLevel(scope.row.tpLevel)}">{{formatLevelByNum(scope.row.tpLevel)}}</div>
                            </template>
                        </el-table-column>
                    </el-table-column>
                    <el-table-column label="叶绿素">
                        <el-table-column property="chlorophyll" label="浓度(mg/L)"  width="100px;" :formatter="floatFix"></el-table-column>
                        <!-- <el-table-column label="等级">
                            <template slot-scope="scope">
                                <div :style="{'color':getColorByLevel(scope.row.chlorophyllLevel)}">{{formatLevelByNum(scope.row.chlorophyllLevel)}}</div>
                            </template>
                        </el-table-column> -->
                    </el-table-column>
                    <el-table-column label="DO">
                        <el-table-column property="o2" label="浓度(mg/L)"  width="100px;" :formatter="floatFix"></el-table-column>
                        <el-table-column label="等级" width="60px;">
                            <template slot-scope="scope">
                                <div :style="{'color':getColorByLevel(scope.row.o2Level)}">{{formatLevelByNum(scope.row.o2Level)}}</div>
                            </template>
                        </el-table-column>
                    </el-table-column>
                    <el-table-column label="COD">
                        <el-table-column property="cod" label="浓度(mg/L)"  width="100px;" :formatter="floatFix"></el-table-column>
                        <el-table-column label="等级" width="60px;">
                            <template slot-scope="scope">
                                <div :style="{'color':getColorByLevel(scope.row.codLevel)}">{{formatLevelByNum(scope.row.codLevel)}}</div>
                            </template>
                        </el-table-column>
                    </el-table-column>
                    <el-table-column label="BOD">
                        <el-table-column property="bod" label="浓度(mg/L)"  width="100px;" :formatter="floatFix"></el-table-column>
                        <el-table-column label="等级"  width="60px;">
                            <template slot-scope="scope">
                                <div :style="{'color':getColorByLevel(scope.row.bodLevel)}">{{formatLevelByNum(scope.row.bodLevel)}}</div>
                            </template>
                        </el-table-column>
                    </el-table-column>
                    <el-table-column label="水量(m3)" property="volumn" :formatter="volumnFix">

                    </el-table-column>
                </el-table>
            </div>
        </el-dialog>
        <el-dialog width="60%" title="水质标准" :visible.sync="waterQualityStandardVisible">
            <el-table max-height="350" :data="waterQualityStandard">
                <el-table-column width="250" property="name" label="名称" ></el-table-column>
                <el-table-column property="level1" label="Ⅰ类"></el-table-column>
                <el-table-column property="level2" label="Ⅱ类"></el-table-column>
                <el-table-column property="level3" label="Ⅲ类"></el-table-column>
                <el-table-column property="level4" label="Ⅳ类"></el-table-column>
                <el-table-column property="level5" label="Ⅴ类"></el-table-column>         
            </el-table>
        </el-dialog>
        <el-dialog width="80%" title="配方治理标准" :visible.sync="waterPurifyStandardVisible">
            <el-table max-height="350" :data="waterPurifyStandard">
                <el-table-column property="name" label="名称" ></el-table-column>
                <el-table-column property="tn" label="TN(mg/m2)"></el-table-column>
                <el-table-column property="tp" label="TP(mg/m2)"></el-table-column>
                <el-table-column property="chlorophyll" label="叶绿素(mg/m2)"></el-table-column>
                <el-table-column property="bod" label="BOD(mg/m2)"></el-table-column>
                <el-table-column property="cod" label="COD(mg/m2)"></el-table-column>     
                <el-table-column property="o2" label="DO(mg/m2)"></el-table-column>
                <el-table-column width="200" label="操作">
                    <template slot-scope="scope">
                        <el-button type="primary" size="mini" @click="resetPurifyStandard(scope.$index, scope.row)">修改参数</el-button>
                    </template>
                </el-table-column>     
            </el-table>
            <el-dialog
                width="60%"
                title="修改参数"
                :visible.sync="innerWaterPurifyStandardVisible"
                append-to-body>
                <el-form size="mini" label-width="150px" :model="innerWaterPurifyStandard">
                    <el-form-item label="参数名称">
                        <el-input :disabled="true" v-model="innerWaterPurifyStandard.name" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="TN(mg/m2)">
                        <el-input type="number" v-model="innerWaterPurifyStandard.tn" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="TP(mg/m2)">
                        <el-input type="number" v-model="innerWaterPurifyStandard.tp" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="叶绿素(mg/m2)">
                        <el-input type="number" v-model="innerWaterPurifyStandard.chlorophyll" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="BOD(mg/m2)">
                        <el-input type="number" v-model="innerWaterPurifyStandard.bod" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="COD(mg/m2)">
                        <el-input type="number" v-model="innerWaterPurifyStandard.cod" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="DO(mg/m2)">
                        <el-input type="number" v-model="innerWaterPurifyStandard.o2" autocomplete="off"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="innerWaterPurifyStandardVisible = false">取消</el-button>
                    <el-button type="primary" @click="updateWaterPurifyStandard()">更新</el-button>
                </div>
            </el-dialog>
        </el-dialog>
        <el-dialog
            title="修改湖泊信息"
            :visible.sync="lakeInfoVisible"
            append-to-body>
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
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="lakeInfoVisible = false">取 消</el-button>
                <el-button type="primary" @click="updateLake()">确 定</el-button>
            </div>
        </el-dialog>
  </div>
</template>

<script>
import Map from './js/map'
import domtoimage from 'dom-to-image';
import echarts from 'echarts'
import WKT from "terraformer-wkt-parser"

export default {
    name: 'Map',
	data(){
		return{
            map: null,
            view: null,
            contextMenu:null,
            addMarkerInfo: {
				name: '',
				location: [],
				note: ''
            },
            addMarkerDialogVisible: false,
            addMonitorInfo: {
                name: '',
				location: [],
                note: '',
                lakeId: ''
            },
            addMonitorDialogVisible: false,
            markerLayers: {

            },
            ploygonLayers: {

            },
            popupLayer: null,
            rawMarkers: [

            ],
            rawMonitors: [

            ],
            rawLakes: [

            ],
            tab: 'lake',
            finishedCurrentLake: '',
            unfinishedCurrentLake: '',
            currentAnalyse: {

            },
            markerInput: "",
            monitorInput: "",
            waterQualityVisible: false,
            waterQualityById: [],
            waterQualityByLakeId:{},
            addWaterQualityDialogVisible: false,
            addWaterQualityInfo: [],
            waterQualityStandardVisible: false,
            waterQualityStandard: [],
            waterQualityNeededStandard: [],
            waterPurifyStandardVisible: false,
            waterPurifyStandard: [],
            innerWaterPurifyStandardVisible:false,
            innerWaterPurifyStandard: {},
            analyseDetailVisible: false,
            analyseDetail: {},
            analyseDetailType: true,
            waterPurify: {

            },
            waterAnalyse: {

            },
            lakeInfoVisible: false,
            lakeInfo: {

            }
        }
    },
    computed: {
        markers() {
            return this.rawMarkers.filter(marker=>
                !this.markerInput || marker.featureData.username.includes(this.markerInput) ||  marker.props.name.includes(this.markerInput) || marker.featureData.note.includes(this.markerInput) 
            )
        },
        monitors() {
            return this.rawMonitors.filter(monitor=>
                !this.monitorInput || monitor.featureData.username.includes(this.monitorInput) || monitor.props.name.includes(this.monitorInput) || monitor.featureData.note.includes(this.monitorInput) 
            )
        },
        lakes ({ rawLakes, rawMonitors,waterQualityByLakeId }) {
            return rawLakes.map((rawLake) => {
                let qualities = waterQualityByLakeId[rawLake.id];
                if(qualities===undefined) {
                    qualities = [];
                } else {
                    const groups = {};        
                    qualities.forEach(item=> { 
                        const group = item.monitorTime;
                        groups[group] = groups[group] || [];
                        groups[group].push(item);
                    });
                    var temp = [];
                    for(let key in groups) {
                        temp.push({monitorTime:key,qualities:groups[key]});
                    }
                    qualities = temp;
                }
                return {
                lakeInfo: rawLake,
                monitors: rawMonitors.filter((monitor) => monitor.featureData.lakeId === rawLake.id),
                qualities: qualities
                }
            })
        },
        finishedLake() {
            return this.lakes.filter(item=>{
                return item.lakeInfo.finished === true;
            })
        },
        unfinishedLake() {
            return this.lakes.filter(item=>{
                return item.lakeInfo.finished === false;
            })
        }
    },
    methods: {
        initContextMenu() {
            var contextmenuItems = [
				// {
				// 	text: '添加标记',
				// 	classname: 'bold',
				// 	icon: '/static/img/marker.png',
				// 	callback: this.addMarkerCallback
                // },
				{
					text: '保存图片',
					classname: 'bold',
					icon: '/static/img/download_color.png',
					callback: this.saveAsPngCallback
                },
                {
                    text: '添加湖泊',
                    classname: 'blod',
                    icon: '/static/img/lake.png',
                    callback: this.addLakeCallback
                }
            ];
            this.contextMenu.clear();
            this.contextMenu.extend(contextmenuItems);
            this.contextMenu.on('open', evt=> {
                var removeMarkerItem = {
                    text: '删除标记',
                    icon: '/static/img/marker.png',
                    callback: this.removeMarkerCallback
                };
                var removeMonitorItem = {
                    text: '删除检测点',
                    icon: '/static/img/marker.png',
                    callback: this.removeMonitorCallback
                };
                var updateWaterQuality = {
                    text: '更新水质数据',
                    icon: '/static/img/update.png',
                    callback: this.updateWaterQualityCallback
                }
                var showLakeInfo = {
                    text: '获取湖泊信息',
                    icon: '/static/img/info.png',
                    callback: this.showLakeInfoCallback
                }
                var addMonitorItem = {
                    text: '添加检测点',
					classname: 'bold',
					icon: '/static/img/monitor.png',
					callback: this.addMonitorCallback
                }
                var showWaterQualities = {
                    text: "获取水质信息",
                    icon: '/static/img/table.png',
                    callback: this.showWaterQualitiesCallback
                }
                let f = null;
                this.map.forEachFeatureAtPixel(evt.pixel, feature=>{
                    if (feature && (feature.get('type') === 'marker')) {
                        this.contextMenu.clear();
                        removeMarkerItem.data = { feature: feature,type: "marker" };
                        this.contextMenu.push(removeMarkerItem);
                    } else if (feature && (feature.get('type') === 'monitor')) {
                        this.contextMenu.clear();
                        const index = this.rawLakes.findIndex(item=>item.id === feature.values_.custom.lakeId);
                        if(index != -1) {
                            if(!this.rawLakes[index].finished) {
                                removeMonitorItem.data = { feature: feature,type: "monitor" };
                                this.contextMenu.push(removeMonitorItem);
                            }
                        }
                        showWaterQualities.data = {feature: feature};
                        
                        this.contextMenu.push(showWaterQualities);
                    } else if (feature && (feature.get('type') === 'lake')) {
                        this.contextMenu.clear();
                        this.contextMenu.extend(contextmenuItems);
                        showLakeInfo.data = { feature: feature};
                        addMonitorItem.data = {feature: feature};
                        updateWaterQuality.data = { feature: feature};
                        if(!feature.values_.custom.finished) {
                            this.contextMenu.push(addMonitorItem);
                            this.contextMenu.push(updateWaterQuality);
                        }
                        this.contextMenu.push(showLakeInfo);
                        
                    } 
                    f = feature;
                });
                if(!f) {
                    this.contextMenu.clear();
                    this.contextMenu.extend(contextmenuItems);
                }
			});
        },
        initEvent() {
            var that = this;
			this.map.on('pointermove',function(evt) {
                var temp = null;
				that.map.forEachFeatureAtPixel(evt.pixel, feature => {
                   if (feature && (feature.get('type') === 'marker' || feature.get('type') === 'monitor')) {
                        that.map.getTargetElement().style.cursor = 'pointer';
                    } else {
                        that.map.getTargetElement().style.cursor = '';
                    }
                    temp = feature;
                });
                if(!temp) {
                    that.map.getTargetElement().style.cursor = '';
                }
			});
        },
        saveAsPngCallback() {
			var that = this;
			this.contextMenu.close();
			setTimeout(()=>{
				domtoimage.toBlob(document.getElementById('map'))
				.then(function (blob) {
					const a = document.createElement("a");
					const url = window.URL.createObjectURL(blob);
					const filename = "map.png";
					a.href = url;
					a.download = filename;
					a.click();
					window.URL.revokeObjectURL(url)
				});
			},300);
        },
        addLakeCallback(e) {
            window.open("/map/add-lake",'_blank');
        },
        showLakeInfoCallback(obj) {
            var ht = "";
            var custom = obj.data.feature.values_.custom;
            ht+="<span style='font-size:14px;'>湖泊名称:"+custom.name+"</span></br>";
            ht+="<span style='font-size:14px;'>面积:"+parseFloat(custom.area).toFixed(2)+"(平方米)</span></br>";
            ht+="<span style='font-size:14px;'>平均深度:"+parseFloat(custom.height).toFixed(2)+"(米)</span></br>";
            this.popupLayer.showInfo(ht,obj.coordinate);
        },
        addMarkerCallback(e) {
            this.addMarkerInfo = {
				name: '',
				location: e.coordinate,
				note: ''
			},
			this.addMarkerDialogVisible = true;
        },
        removeMarkerCallback(obj) {
            var id = obj.data.feature.getId();
            this.axios.get("/api/marker/remove-marker?id="+id)
				.then(res=>{
                    this.markerLayers.marker.removeMarker(id);
                    this.rawMarkers = this.rawMarkers.filter(item=>item.props.id !== id);
				})
				.catch(err=>{
					this.$message.error(err.response.data.message);
				})

        },
        addMarkerDialog() {
            this.addMarkerDialogVisible = false;
			let data = new URLSearchParams();
            data.append("name",this.addMarkerInfo.name);
            data.append("location",JSON.stringify(this.addMarkerInfo.location));
            data.append("note",this.addMarkerInfo.note);
			var that = this;
			this.axios.post("/api/marker/add-marker",data)
				.then(res=> {
                    var featureData = {
                        name: this.addMarkerInfo.name,
                        location: this.addMarkerInfo.location,
                        note: this.addMarkerInfo.note,
                        username: that.$store.getters.get_username,
                        markerId: res.data.id,
                        type: "marker"
                    }
                    var props = {
                        name: this.addMarkerInfo.name,
                        id: res.data.id,
                        location: this.addMarkerInfo.location
                    }
                    this.rawMarkers.push({featureData: featureData,props: props});
					this.markerLayers.marker.addMarker(this.addMarkerInfo.location,featureData,props,"marker","/static/img/marker.png");
				})
				.catch(function(err) {
					that.$message.error(err.response.data.message);
				})
        },
        addMonitorCallback(e) {
            this.addMonitorInfo = {
				name: '',
				location: e.coordinate,
                note: '',
                lakeId: e.data.feature.values_.id
			},
			this.addMonitorDialogVisible = true;
        },
        removeMonitorCallback(obj) {
            var id = obj.data.feature.getId();
            this.$confirm('此操作将永久删除检测点, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.axios.get("/api/monitor/remove-monitor?id="+id)
				.then(res=>{
                    this.markerLayers.marker.removeMarker(id);
                    this.rawMonitors = this.rawMonitors.filter(item => item.props.id !== id);
				})
				.catch(err=>{
					this.$message.error(err.response.data.message);
				})
            }).catch(() => {
                        
            });
        },
        addMonitorDialog() {
            this.addMonitorDialogVisible = false;
			let data = new URLSearchParams();
            data.append("name",this.addMonitorInfo.name);
            data.append("locationX",this.addMonitorInfo.location[0]);
            data.append("locationY",this.addMonitorInfo.location[1]);
            data.append("note",this.addMonitorInfo.note);
            data.append("lakeId",this.addMonitorInfo.lakeId);
			var that = this;
			this.axios.post("/api/monitor/add-monitor",data)
				.then(res=> {
                    var featureData = {
                        name: this.addMarkerInfo.name,
                        location: this.addMonitorInfo.location,
                        note: this.addMonitorInfo.note,
                        username: this.$store.getters.get_username,
                        markerId: res.data.id,
                        type: "monitor",
                        lakeId: this.addMonitorInfo.lakeId
                    }
                    var props = {
                        id: res.data.id,
                        name: this.addMonitorInfo.name,
                        location: this.addMonitorInfo.location
                    }
                    this.rawMonitors.push({featureData: featureData,props: props});
					this.markerLayers.marker.addMarker(this.addMonitorInfo.location,featureData,props,"monitor","/static/img/monitor.png");
				})
				.catch(function(err) {
					that.$message.error(err.response.data.message);
				})
        },
        updateWaterQualityCallback(obj) {
            this.updateWaterQuality(obj.data.feature.getId())
        },
        updateWaterQuality(id) {
            var monitors = this.rawMonitors.filter(monitor=>{
                    return monitor.featureData.lakeId === id;
            })
            let lake = this.rawLakes.find(item=>item.id === id);
            const volumn = lake.area * lake.height;
            this.addWaterQualityInfo = {monitors:[],monitorTime:new Date(),lakeVolumn: volumn};
            monitors.forEach(monitor=>{
                let item = {
                    tn: 0,
                    tp: 0,
                    chlorophyll: 0,
                    o2: 0,
                    cod: 0,
                    bod: 0,
                    monitorId: monitor.props.id,
                    name: monitor.props.name,
                    volumn: 0
                }
                this.addWaterQualityInfo.monitors.push(item);
            })
            this.addWaterQualityDialogVisible = true;
        },
        showWaterQualitiesCallback(obj) {
            this.showWaterQualities(obj.data.feature.getId());
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
        addWaterQualityDialog() {
            let data = new URLSearchParams();
            data.append("qualities",JSON.stringify(this.addWaterQualityInfo.monitors));
            data.append("monitorTime",Date.parse(this.addWaterQualityInfo.monitorTime));
			var that = this;
            this.axios.post("/api/quality/add-quality",data)
            .then(res=>{
                this.$message.success("更新成功");
                this.addWaterQualityDialogVisible = false;
                setTimeout(function(){ location.reload(); }, 1500);
            })
            .catch(err=>{
                this.$message.error(err.response.data.message);
            })
        },
        initMarkers() {
			var that = this;
			this.axios
            .get("/api/marker/get-markers")
            .then(res=> {
				var markers = res.data.markers;
				for(let marker of markers) {
                    marker.location = JSON.parse(marker.location);
                    marker.type = "marker";
                    var props = {
                        name: marker.name,
                        id: marker.id,
                        location: marker.location
                    }
                    this.rawMarkers.push({featureData: marker,props: props});
                    this.markerLayers.marker.addMarker(marker.location,marker,props,"marker","/static/img/marker.png");
				}
                
            })
            .catch(function(err) {
                that.$message.error(err.response.data.message);
            })
        },
        initMonitors() {
            var that = this;
			this.axios
            .get("/api/monitor/get-monitors")
            .then(res=> {
				var monitors = res.data.monitors;
				for(let monitor of monitors) {
                    monitor.location = [monitor.locationX,monitor.locationY];
                    monitor.type = "monitor";
                    var props = {
                        name: monitor.name,
                        id: monitor.id,
                        location: monitor.location
                    }
                    this.rawMonitors.push({featureData: monitor,props: props});
                    this.markerLayers.marker.addMarker(monitor.location,monitor,props,"monitor","/static/img/monitor.png");
				}
            })
            .catch(function(err) {
                that.$message.error(err.response.data.message);
            })
        },
        initLake() {
            this.axios.get("/api/lake/get-lakes")
            .then(res=>{
                var lakes = res.data.lakes;
                lakes.forEach(lake=>{
                    lake.geo = WKT.parse(lake.geo);
                    this.ploygonLayers.lake.addPloygon(lake.geo.coordinates,lake,{id:lake.id},"lake")
                })
                this.rawLakes = lakes;
                if(this.rawLakes.length!=0) {
                    const index = this.rawLakes.findIndex(item=>!item.finished);
                    if(index!=-1) {
                        this.jumpToLake(this.rawLakes[index].id);
                    } else {
                        this.jumpToLake(this.rawLakes[0].id);
                    }
                }
            }).catch(err=>{
                this.$message.error(err.response.data.message);
            })
        },
        getWaterQualityStandard() {
            if(this.waterQualityStandard.length == 0) {
                this.axios.get("/api/water/water-quality-standard")
                .then(res=>{
                    this.waterQualityStandard = res.data.standards;
                    this.waterQualityNeededStandard = JSON.parse(res.data.neededStandards);
                    this.waterQualityNeededStandard.chlorophyll = {
                        level1:'',
                        level2:'',
                        level3:'',
                        level4:'',
                        level5:'',
                        increment:false
                    }
                })
                .catch(err=>{
                    this.$message.error(err.response.data.message);
                })
            }
        },
        getWaterPurifyStandard() {
            if(this.waterPurifyStandard.length == 0) {
                this.axios.get("/api/water/water-purify-standard")
                .then(res=>{
                    this.waterPurifyStandard = res.data.standards;
                })
                .catch(err=>{
                    this.$message.error(err.response.data.message);
                })
            }
        },
        jump(x, y) {
			var that = this;
			this.view.animate({
				duration: 700,
				easing: that.elastic,
				center: [x,y]
			});
        },
        elastic (t) {
			return Math.pow(2, -10 * t) * Math.sin((t - 0.075) * (2 * Math.PI) / 0.3) + 1;
        },
        floatFix(row, column,data, index) {
            return parseFloat(data).toFixed(5);
        },
        volumnFix(row,column,data, index) {
            var lake = this.rawLakes.find(item=>item.id == this.analyseDetail.lakeId);
            return parseFloat(data / (lake.area*lake.height)*100).toFixed(4)+"%";
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
        formatLevelByNum(num) {
            if(num<0) {
                return "劣Ⅴ类";
            } else if(num < 1) {
                return "Ⅰ类";
            } else if(num < 2) {
                return "Ⅱ类";
            } else if(num < 3) {
                return "Ⅲ类";
            } else if(num < 4) {
                return "Ⅳ类";
            } else if (num < 5) {
                return "Ⅴ类";
            } else {
                return "劣Ⅴ类";
            }
        },
        getColorByLevel(level) {
            if(level<0) {
                return "#ff0000";
            } else if(level < 2) {
                return "#00B050";
            } else if(level < 3) {
                return "#92D050";
            } else if(level < 4) {
                return "#F68326";
            } else if(level == 5) {
                return "#ff0000"; 
            } else {
                return "#ff0000"; 
            }
        },
        formatLevel(row, column, data, index) {
            return this.formatLevelByNum(data);
        },
        getQualityByLakeId(lakeId) {
            if(lakeId==''){
                return ;
            }
            this.axios.get("/api/quality/get-qualities-by-lake-id?lakeId="+lakeId)
            .then(res=>{
                this.$set(this.waterQualityByLakeId,lakeId,res.data.qualities);
            })
            .catch(err=>{
                this.$message.error(err.response.data.message);
            })
        },
        lakeChange(e) {
            if(e) {
                this.jumpToLake(e);
            }
            if(this.waterQualityByLakeId[e]===undefined) {
                this.getQualityByLakeId(e);
            }
        },
        //false 表示水质不合格 true 表示水质合格
        qualityJudge(lakeId, monitorTime) {
            const id = lakeId+""+monitorTime;
            let q = this.waterAnalyse[id][this.waterAnalyse[id].length-1];
            let count = 0;
            if(q.tnLevel > 3) count++;
            if(q.tpLevel > 3) count++;
            if(q.codLevel > 3) count++;
            if(q.o2Level > 3) count++;
            if(q.bodLevel > 3) count++;
            // if(q.chlorophyllLevel  > 3) count++;
            if(count>=1) {
                this.waterQualityPurify(lakeId,monitorTime);
                return false;
                
            } else {
                return true;
            }
        },
        countPurifyArea(q) {
            let count = 0;
            for(let key in q) {
                count+=q[key];
            }
            return count;
        },
        getPieOption(q) {
            var data = {};
            data["WF_TN"] = q.purify.wfTn;
            data["WF_TP"] = q.purify.wfTp;
            data["WF_CH"] = q.purify.wfTh;
            data["WF_COD"] = q.purify.wfCod;
            data["WF_BOD"] = q.purify.wfBod;
            data["WF_DO"] = q.purify.wfDo;
            data["WD_TN"] = q.purify.wdTn;
            data["WD_TP"] = q.purify.wdTp;
            data["WD_CH"] = q.purify.wdTh;
            data["WD_COD"] = q.purify.wdCod;
            data["WD_BOD"] = q.purify.wdBod;
            data["WD_DO"] = q.purify.wdDo;
            var temp = [];
            var re = q.lakeInfo.area;
            for(let item in data) {
                if(data[item]>0) {
                    re -= data[item];
                    temp.push({"value":parseFloat(data[item]).toFixed(2),"name":item})
                }
            }
            temp.push({"value":parseFloat(re).toFixed(2),"name":'剩余面积'})
            var option = {
                title: {
                    text: '配方面积占比示意图',
                    left: 'center'
                },
                tooltip: {
                    trigger: 'item'
                },
                legend: {
                    orient: 'vertical',
                    left: 'left',
                },
                series: [
                    {
                        name: '配方',
                        type: 'pie',
                        radius: '50%',
                        data:temp,
                        emphasis: {
                            itemStyle: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                ]
            };
            return option;
        },
        getOption(q) {
            var that = this;
            const option = {
                grid: [{
                    left: '15%',
                    bottom: '10%',
                    top: '3%',
                    right: '5%'
                }],
                tooltip: {},
                xAxis: {
                    type : 'value',
                    max:5,
                    min:0,
                    minInterval: 1,
                    interval:1
                },
                yAxis: {
                    type : 'category',
                    // data: ["TN","TP","DO","叶绿素","BOD","COD"]
                    data: ["TN","TP","DO","BOD","COD"]
                },
                series: [{
                    name: '水质级别',
                    type: 'bar',
                    barWidth: '60%',
                    data: [
                        parseFloat(q.tnLevel).toFixed(2),
                        parseFloat(q.tpLevel).toFixed(2),
                        parseFloat(q.o2Level).toFixed(2),
                        // parseFloat(q.chlorophyllLevel).toFixed(2),
                        parseFloat(q.bodLevel).toFixed(2),
                        parseFloat(q.codLevel).toFixed(2)
                    ],
                    itemStyle: {
                        color: function(params) { 
                            return that.getColorByLevel(params.data);
                        }
                    },  
                    label: {
                        normal: {
                            show: true,
                            position: 'insideRight',
                            formatter:function(params) {
                                if(params.data<=0) {
                                    return "";
                                } else if(params.data < 1) {
                                    return "Ⅰ类";
                                } else if(params.data < 2) {
                                    return "Ⅱ类";
                                } else if(params.data < 3) {
                                    return "Ⅲ类";
                                } else if(params.data < 4) {
                                    return "Ⅳ类";
                                } else if (params.data < 5) {
                                    return "Ⅴ类";
                                } else {
                                    return "劣Ⅴ类";
                                }
                            }
                        }
                    }
                }]
            };
            return option;
        },
        finishedQualityChange(e) {
            this.qualityChange(e,this.finishedCurrentLake);
        },
        unfinishedQualityChange(e) {
            this.qualityChange(e,this.unfinishedCurrentLake);
        },
        qualityChange(e,lakeId) {
            let data = new URLSearchParams();
            let ids = [];
            let lake = this.lakes.find(lake=>lake.lakeInfo.id == lakeId);
            let id = lakeId+""+e;
            this.$set(this.currentAnalyse,lakeId,e);
            if(this.waterAnalyse[id]) {
                // 
                let echart = echarts.getInstanceByDom(document.getElementById(id));
                // let option = this.getOption(q);
                // echart.setOption(option);
                // window.addEventListener("resize", () => {echart.setOption(option);echart.resize();});
                return ;
            }
            if(lake) {
                let qualities = lake.qualities.find(quality=>
                    quality.monitorTime == e)
                if(qualities) {
                    qualities.qualities.forEach(item=>{
                        ids.push(item.id);
                    })
                    data.append("ids",JSON.stringify(ids));
                    this.axios.post("/api/water/quality-analyse",data)
                    .then(res=>{
                        const q = res.data.result;
                        this.$set(this.waterAnalyse,id,res.data.result);
                        this.$nextTick(()=>{
                            let echart = echarts.init(document.getElementById(id));
                            const a = q.find(item=>{
                                return item.id === null;
                            })
                            let option = this.getOption(a);
                            echart.setOption(option);
                        })
                    })
                    .catch(err=>{
                        this.$message.error(err.response.data.message);
                    })
                }
            }
            
        },
        getPurifyParam(lakeId, monitorTime) {
            const id = lakeId+""+monitorTime;
            let q = this.waterAnalyse[id][this.waterAnalyse[id].length-1];
            var main = null;
            var second = null;
            var mainV = 0;
            var secondV = 0;
            var list = [];
            list.push({name:"TN",value:q.tnLevel});
            list.push({name:"TP",value:q.tpLevel});
            // list.push({name:"CH",value:q.chlorophyllLevel});
            list.push({name:"BOD5",value:q.bodLevel});
            list.push({name:"COD",value:q.codLevel});
            list.push({name:"DO",value:q.o2Level});
            list.sort((a,b)=>{return b.value - a.value;})
            if(list[0].value>3) {
                main = list[0].name;
            }
            if(list[1].value>3) {
                second = list[1].name;
            }
            let lake = this.lakes.find(lake=>lake.lakeInfo.id == lakeId);
            let qualityContainer = lake.qualities.find(quality=>quality.monitorTime == monitorTime);
            let qualities = qualityContainer.qualities;
            var volumn = 0;
            qualities.forEach(item=>{
                volumn += item.volumn;
            })
            if(main!=null) {
                switch(main) {
                    case "TN": {
                        qualities.forEach(item=> {
                            mainV+=item.tn*item.volumn;
                        })
                        break;
                    }
                    case "TP": {
                        qualities.forEach(item=> {
                            mainV+=item.tp*item.volumn;
                        })
                        break;
                    }
                    case "COD": {
                        qualities.forEach(item=> {
                            mainV+=item.cod*item.volumn;
                        })
                        break;
                    }
                    case "CH": {
                        qualities.forEach(item=> {
                            mainV+=item.chlorophyll*item.volumn;
                        })
                        break;
                    }
                    case "BOD5": {
                        qualities.forEach(item=> {
                            mainV+=item.bod*item.volumn;
                        })
                        break;
                    }
                    case "DO": {
                        qualities.forEach(item=> {
                            mainV+=item.o2*item.volumn;
                        })
                        break;
                    }
                }
                mainV /= volumn;
            }
            if(second!=null) {
                switch(second) {
                    case "TN": {
                        qualities.forEach(item=> {
                            secondV+=item.tn*item.volumn;
                        })
                        break;
                    }
                    case "TP": {
                        qualities.forEach(item=> {
                            secondV+=item.tp*item.volumn;
                        })
                        break;
                    }
                    case "COD": {
                        qualities.forEach(item=> {
                            secondV+=item.cod*item.volumn;
                        })
                        break;
                    }
                    case "CH": {
                        qualities.forEach(item=> {
                            secondV+=item.chlorophyll*item.volumn;
                        })
                        break;
                    }
                    case "BOD5": {
                        qualities.forEach(item=> {
                            secondV+=item.bod*item.volumn;
                        })
                        break;
                    }
                    case "DO": {
                        qualities.forEach(item=> {
                            secondV+=item.o2*item.volumn;
                        })
                        break;
                    }
                }
                secondV /= volumn;
            }
            return {
                main: main,
                second: second,
                mainV: mainV,
                secondV: secondV,
                volumn: volumn
            }
        },
        waterQualityPurify(lakeId,monitorTime) {
            const id = lakeId+""+monitorTime;
            if(!this.waterPurify[id]) {
                let param = this.getPurifyParam(lakeId,monitorTime);
                var data = new URLSearchParams();
                if(param.main!=null) {
                    data.append("main",param.main);
                    data.append("mainV",param.mainV);
                }
                if(param.second!=null) {
                    data.append("second",param.second);
                    data.append("secondV",param.secondV);
                }
                data.append("volumn",param.volumn);
                this.axios.post("/api/water/water-purify",data)
                .then(res=> {
                    const lake = this.rawLakes[this.rawLakes.findIndex(item=>item.id === lakeId)];
                    let area = 0;
                    if(lake) {
                        area = lake.area;
                    }
                    var opt = {
                        purify: res.data.purify,
                        lakeInfo: {
                            lakeId: lakeId,
                            area: area
                        }
                    }
                    this.$set(this.waterPurify,id,opt);
                    this.$nextTick(()=>{
                            let echart = echarts.init(document.getElementById("pie"+lakeId+''+monitorTime));
                            let option = this.getPieOption(opt);
                            echart.setOption(option);
                        })
                })
                .catch(err=> {
                    this.$message.error(err.response.data.message);
                }) 
            }
        },
        jumpToLake(id) {
            const center = this.ploygonLayers.lake.getCenterById(id);
            if(center) {
                this.jump(center[0],center[1]);
            }
        },
        showAnalyseDetail(lakeId,monitorTime) {
            const id = lakeId+""+monitorTime;
            this.analyseDetail.list = JSON.parse(JSON.stringify(this.waterAnalyse[id]));
            this.analyseDetail.lakeId = lakeId;
            this.analyseDetail.monitorTime = monitorTime;
            const len = this.analyseDetail.list.length-1;
            for(let i = 0 ; i < len ; i++) {
                const item = this.analyseDetail.list[i];
                const monitor = this.rawMonitors.find(monitor=>{return monitor.props.id === item.monitorId;})
                if(monitor) {
                    item.monitorName = monitor.featureData.name;
                }
            }
            if(len >=0 && this.analyseDetail.list[len].monitorId === null) {
                this.analyseDetail.list[len].monitorName = "整体入水";
            }
            var tables = this.analyseDetail.tables = [];
            this.analyseDetail.list.forEach((item)=>{
                tables.push(
                    {
                        data:[
                            {name: "COD",level6: (this.waterQualityNeededStandard.cod.increment?"<":">")+this.waterQualityNeededStandard.cod.level5,value: item.cod,level: item.codLevel,standard:this.waterQualityNeededStandard.cod},
                            {name: "BOD",level6: (this.waterQualityNeededStandard.bod.increment?"<":">")+this.waterQualityNeededStandard.bod.level5,value: item.bod,level: item.bodLevel,standard:this.waterQualityNeededStandard.bod},
                            {name: "DO",level6: (this.waterQualityNeededStandard.o2.increment?"<":">")+this.waterQualityNeededStandard.o2.level5,value: item.o2,level: item.o2Level,standard:this.waterQualityNeededStandard.o2},
                            {name: "TN",level6: (this.waterQualityNeededStandard.tn.increment?"<":">")+this.waterQualityNeededStandard.tn.level5,value: item.tn,level: item.tnLevel,standard:this.waterQualityNeededStandard.tn},
                            {name: "TP",level6: (this.waterQualityNeededStandard.tp.increment?"<":">")+this.waterQualityNeededStandard.tp.level5,value: item.tp,level: item.tpLevel,standard:this.waterQualityNeededStandard.tp},
                            {name: "叶绿素",level6: "",value: item.chlorophyll,level: 0,standard:this.waterQualityNeededStandard.chlorophyll}
                        ],
                        monitorId: item.monitorId,
                        monitorName: item.monitorName,
                        volumn: item.volumn
                    }
                )
            })
            this.analyseDetailVisible = true;
        },
        getUserWorkPlace() {
            return this.$store.getters.get_workPlace;
        },
        resetPurifyStandard(index,row) {
            this.innerWaterPurifyStandard = {
                tn: row.tn,
                tp: row.tp,
                cod: row.cod,
                chlorophyll: row.chlorophyll,
                bod: row.bod,
                o2: row.o2,
                name: row.name
            }
            this.innerWaterPurifyStandardVisible = true;
        },
        resetLakeInfo(lakeInfo,lakeId) {
            this.lakeInfo = {
                name: lakeInfo.name,
                area: lakeInfo.area,
                height: lakeInfo.height,
                id: lakeId
            },
            this.lakeInfoVisible = true;
        },
        updateLake() {
            var data = new URLSearchParams();
            data.append("lakeId",this.lakeInfo.id);
            data.append("name",this.lakeInfo.name);
            data.append("area",this.lakeInfo.area);
            data.append("height",this.lakeInfo.height);
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
        finishLake(lakeId) {
            this.$confirm('项目将被放入历史项目中，可以查看数据但无法修改，请确认是否继续?', '提示', {
                confirmButtonText: '确认',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.axios.get("/api/lake/finish-lake?lakeId="+lakeId)
                .then(res=>{
                    if(res.data.res == true) {
                        this.$message.success("项目已结算");
                        setTimeout(function(){ location.reload(); }, 1500);
                    } else {
                        this.$message.error("项目结算失败");
                    }
                })
                .catch(err=>{
                    this.$message.error(err.response.data.message);
                })
            }).catch(() => {
                         
            });
        },
        updateWaterPurifyStandard(){
            var data = new URLSearchParams();
            data.append("tn",this.innerWaterPurifyStandard.tn);
            data.append("tp",this.innerWaterPurifyStandard.tp);
            data.append("cod",this.innerWaterPurifyStandard.cod);
            data.append("chlorophyll",this.innerWaterPurifyStandard.chlorophyll);
            data.append("bod",this.innerWaterPurifyStandard.bod);
            data.append("o2",this.innerWaterPurifyStandard.o2);
            data.append("name",this.innerWaterPurifyStandard.name);
            this.axios.post("/api/water/update-water-purify-standard",data)
            .then(res=>{
                if(res.data.res == true) {
                    this.$message.success("更新成功");
                    setTimeout(function(){ location.reload(); }, 1500);
                } else {
                    this.$message.error("更新失败");
                }
            })
            .catch(err=>{
                    this.$message.error(err.response.data.message);
            })
        },
        lakeDataClone(lakeId) {
            var lake = this.rawLakes.find(item=>item.id==lakeId);
            this.axios.get("/api/lake/data-clone?lakeId="+lakeId)
            .then(res=>{
                this.saveFile(lake.name+".txt",res.data.data);
            })
            .catch(err=>{
                this.$message.error(err.response.data.message);
            })
        },
        saveFile(name, data) {
            const blob = new Blob([data], {type: "text/plain"})
            const a= document.createElement("a")
            a.href = URL.createObjectURL(blob)
            a.download = name
            a.click()
            URL.revokeObjectURL(a.href)
    　　　  a.remove();
        }
    },
    mounted() {
        this.view = Map.getViewByDemo();
        this.map = Map.initMap([Map.getVECLayer(),Map.getCVALayer()],this.view);
        this.contextMenu = Map.initContextMenu();
        this.initEvent();
        this.initContextMenu();
        this.markerLayers.marker = new Map.MarkerLayer();
        this.ploygonLayers.lake = new Map.PolygonLayer();
        this.popupLayer = new Map.PopupLayer();
        var marker = this.markerLayers.marker;
        var lake = this.ploygonLayers.lake;
        this.map.addLayer(marker.getLayer());
        this.map.addLayer(lake.getLayer());
        this.map.addOverlay(this.popupLayer.getOverLay());

        var column = document.getElementById("column");
        const resizeObserver = new ResizeObserver(entries => {
            column.style.height = document.body.clientHeight-100+"px";
        });
        resizeObserver.observe(document.body);
        window.addEventListener("resize", () => { 
                if(this.unfinishedCurrentLake && this.currentAnalyse[this.unfinishedCurrentLake]) {
                    const id = this.unfinishedCurrentLake+""+this.currentAnalyse[this.unfinishedCurrentLake];
                    const q = this.waterAnalyse[id];
                    const a = q.find(item=>{
                        return item.id === null;
                    })
                    if(a) {
                        const echart = echarts.getInstanceByDom(document.getElementById(id));
                        echart.setOption(this.getOption(a));
                        echart.resize();
                    }
                    if(this.waterPurify[id]) {
                        const pie = echarts.getInstanceByDom(document.getElementById("pie"+id));
                        pie.setOption(this.getPieOption(this.waterPurify[id]));
                        pie.resize();
                    }
                }
                if(this.finishedCurrentLake && this.currentAnalyse[this.finishedCurrentLake]) {
                    const id = this.finishedCurrentLake+""+this.currentAnalyse[this.finishedCurrentLake];
                    const q = this.waterAnalyse[id];
                    const a = q.find(item=>{
                                return item.id === null;
                            })
                    if(a) {
                        const echart = echarts.getInstanceByDom(document.getElementById(id));
                        echart.setOption(this.getOption(a));
                        echart.resize();
                    }
                    if(this.waterPurify[id]) {
                        const pie = echarts.getInstanceByDom(document.getElementById("pie"+id));
                        pie.setOption(this.getPieOption(this.waterPurify[id]));
                        pie.resize();
                    }
                }
                
        });
        this.initMarkers();
        this.initMonitors();
        this.initLake();
        this.getWaterQualityStandard();
    }
}
</script>
<style scoped>
>>>.el-collapse-item__content {
    padding-bottom:0px;
}
/* .dark-background {
    background: #212121;
}
.dark-item {
    background: #282c35;   
}*/
/* >>>.el-collapse-item__header {
    background: #282c35;   
} */
/*
>>>.el-collapse-item__content {
    background: #282c35;   
} */
>>>.el-dialog__body {
    padding:10px;
}
>>>.el-collapse-item__content {
    padding-left:6px;
    padding-top:3px;
    padding-bottom:3px;
    background:#F7F8FA;
}
>>>.el-collapse-item__wrap:last-child {
    border-bottom: 0px;
}
.map {
    height:100%;
    flex: 10;
}
.column {
	flex:6;
	display: flex;
	flex-direction: column;
	padding:10px;
    overflow-y: auto;
}
.marker-item {
	background:white;
	border-radius: 5px;
	display:flex;
	flex-direction: column;
	justify-content: flex-start;
	margin-top:5px;
}
.marker-item-info {
	margin-top:5px;
	margin-bottom:5px;
	display:flex;
	flex-direction: row;
	align-items:center;
}
.purify-item {
    width: 40%;
    margin-right:10%;
    display:flex;
    margin-top:5px;
    margin-bottom: 5px;
}
.purify-title {
    font-size: 14px;
    font-weight: 700;
    color: #303133;
    width:70px;
    background: #5C7BD9;
    border-radius: 5px;
    text-align: center;
}
.purify-value {
    flex:1;
    font-size: 14px;
    font-weight: 700;
    color: #606266;
    text-align:center;
}
</style>
<style>
  /*隐藏ol的一些自带元素*/
.ol-attribution,.ol-zoom { display: none;}
.ol-popup {
	position: absolute;
	background-color: white;
	box-shadow: 0 1px 4px rgba(0,0,0,0.2);
	padding: 15px;
	border-radius: 10px;
	border: 1px solid #cccccc;
	bottom: 12px;
	left: -50px;
	min-width: 280px;
}
.ol-popup:after, .ol-popup:before {
	top: 100%;
	border: solid transparent;
	content: " ";
	height: 0;
	width: 0;
	position: absolute;
	pointer-events: none;
}
.ol-popup:after {
	border-top-color: white;
	border-width: 10px;
	left: 48px;
	margin-left: -10px;
}
.ol-popup:before {
	border-top-color: #cccccc;
	border-width: 11px;
	left: 48px;
	margin-left: -11px;
}
.ol-popup-closer {
	text-decoration: none;
	position: absolute;
	top: 2px;
	right: 8px;
}
.ol-popup-closer:after {
	content: "✖";
}

</style>