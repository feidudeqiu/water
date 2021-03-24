<template>
    <div>
        <div id="main" style="height:100%;width:100%;display:flex;">
            <div id="map" ref="rootmap" class="map"></div>
            <div id="column" class="column">
                <el-tabs style="display:flex;flex-direction:column;" v-model="tab" type="card" >
                    <el-tab-pane label="湖泊" name="lake">
                        <el-collapse v-model="currentLake" accordion v-on:change="lakeChange">
                            <el-collapse-item  :name="lake.lakeInfo.id" v-for="lake in lakes" v-bind:key="lake.lakeInfo.id">
                                <template slot="title">
                                    <span class="text-h4 text-thick" style="margin-left:10px;">{{lake.lakeInfo.name}}</span>
                                </template>
                                <div style="display:flex;flex-wrap:wrap;">
                                    <div class="marker-item" style="margin-top:0px;"  v-for="monitor in lake.monitors" v-bind:key="monitor.props.id">
                                        <div class="marker-item-info" style="margin-top:0px;cursor:pointer;" @click="jump(monitor.props.location[0],monitor.props.location[1])">
                                            <img src="~static/img/monitor.png" style="height:20px;margin-left:5px;margin-right:5px;" >
                                            <span class="text-normal text-h6">{{monitor.props.name}}</span>
                                        </div>
                                    </div>
                                </div>
                                <div style="display:flex;justify-content:center;">
                                    <el-collapse style="width:90%;" accordion v-on:change="qualityChange">
                                        <el-collapse-item :name="quality.monitorTime" v-for="quality in lake.qualities" v-bind:key="quality.monitorTime">
                                            <template slot="title">
                                                 <i style="font-size:16px;" class="el-icon-timer"></i>
                                                <span class="text-h6 text-secondary">{{formatTimeByStamp(quality.monitorTime)}}</span>
                                            </template>
                                            <div v-if="waterAnalyse[lake.lakeInfo.id+''+quality.monitorTime]">
                                                <div class="flex-row-inline">
                                                    <span class="text-h5 text-thick">水质分析图</span>
                                                    <img src="~static/img/table.png" style="height:20px;cursor:pointer;height:20px;margin-left:5px;" @click="showAnalyseDetail(lake.lakeInfo.id+''+quality.monitorTime)" title="详细评价数据"/>
                                                </div>
                                                <div style="height:200px;margin-top:10px;margin-bottom:10px;" :id="lake.lakeInfo.id+''+quality.monitorTime">
                                                    
                                                </div>
                                                <div v-if="!qualityJudge(lake.lakeInfo.id+''+quality.monitorTime)">
                                                    <div slot="lake.lakeInfo.id+''+quality.monitorTime" slot-scope="id">
                                                        <span>{{id}}</span>
                                                    </div>
                                                    <div v-if="!waterPurify[lake.lakeInfo.id+''+quality.monitorTime]">
                                                            <span class="text-secondary">获取配方中</span><i class="el-icon-loading text-secondary"></i>
                                                    </div>
                                                    <div v-else >
                                                        <div class="text-h5 text-thick">水质治理配方</div>
                                                        <div style="display:flex; flex-wrap:wrap;">
                                                            <div class="purify-item">
                                                                <div class="purify-title">WF_TN</div>
                                                                <div class="purify-value">{{waterPurify[lake.lakeInfo.id+''+quality.monitorTime].wfTn}}</div>
                                                            </div>
                                                            <div class="purify-item">
                                                                <div class="purify-title">WF_TP</div>
                                                                <div class="purify-value">{{waterPurify[lake.lakeInfo.id+''+quality.monitorTime].wfTp}}</div>
                                                            </div>
                                                            <div class="purify-item">
                                                                <div class="purify-title">WF_DO</div>
                                                                <div class="purify-value">{{waterPurify[lake.lakeInfo.id+''+quality.monitorTime].wfDo}}</div>
                                                            </div>
                                                            <div class="purify-item">
                                                                <div class="purify-title">WF_COD</div>
                                                                <div class="purify-value">{{waterPurify[lake.lakeInfo.id+''+quality.monitorTime].wfCod}}</div>
                                                            </div>
                                                            <div class="purify-item">
                                                                <div class="purify-title">WF_BOD</div>
                                                                <div class="purify-value">{{waterPurify[lake.lakeInfo.id+''+quality.monitorTime].wfBod}}</div>
                                                            </div>
                                                            <div class="purify-item">
                                                                <div class="purify-title">WF_CH</div>
                                                                <div class="purify-value">{{waterPurify[lake.lakeInfo.id+''+quality.monitorTime].wfCh}}</div>
                                                            </div>
                                                            <div class="purify-item">
                                                                <div class="purify-title">WD_TN</div>
                                                                <div class="purify-value">{{waterPurify[lake.lakeInfo.id+''+quality.monitorTime].wdTn}}</div>
                                                            </div>
                                                            <div class="purify-item">
                                                                <div class="purify-title">WD_TP</div>
                                                                <div class="purify-value">{{waterPurify[lake.lakeInfo.id+''+quality.monitorTime].wdTp}}</div>
                                                            </div>
                                                            <div class="purify-item">
                                                                <div class="purify-title">WD_DO</div>
                                                                <div class="purify-value">{{waterPurify[lake.lakeInfo.id+''+quality.monitorTime].wdDo}}</div>
                                                            </div>
                                                            <div class="purify-item">
                                                                <div class="purify-title">WD_COD</div>
                                                                <div class="purify-value">{{waterPurify[lake.lakeInfo.id+''+quality.monitorTime].wdCod}}</div>
                                                            </div>
                                                            <div class="purify-item">
                                                                <div class="purify-title">WD_BOD</div>
                                                                <div class="purify-value">{{waterPurify[lake.lakeInfo.id+''+quality.monitorTime].wdBod}}</div>
                                                            </div>
                                                            <div class="purify-item">
                                                                <div class="purify-title">WD_CH</div>
                                                                <div class="purify-value">{{waterPurify[lake.lakeInfo.id+''+quality.monitorTime].wdCh}}</div>
                                                            </div>
                                                        </div>
                                                        
                                                    </div>
                                                </div>
                                            </div>
                                        </el-collapse-item>
                                    </el-collapse>
                                </div>
                            </el-collapse-item>
                        </el-collapse>
                    </el-tab-pane>
                    <el-tab-pane label="标记" name="marker">
                        <el-input placeholder="请输入搜索内容" size="mini" prefix-icon="el-icon-search" v-model="markerInput"></el-input>
                        <div class="marker-item" v-for="marker in markers" v-bind:key="marker.props.id">
                            <div class="marker-item-info" style="cursor:pointer;" @click="jump(marker.props.location[0],marker.props.location[1])">
                                <img src="~static/img/marker.png" style="height:20px;margin-left:5px;margin-right:10px;" >
                                <span class="text-normal text-h6">{{marker.props.name}}</span>
                            </div>
                            <div class="marker-item-info">
                                <i class="el-icon-user" style="font-size: 20px;margin-left:5px;margin-right:10px;"></i>
                                <span class="text-normal text-h6">{{marker.featureData.username}}</span>
                            </div>
                            <div  class="marker-item-info">
                                <i class="el-icon-location-outline" style="font-size: 20px;margin-left:5px;margin-right:10px;"></i>
                                <span class="text-normal text-h6">{{'('+parseFloat(marker.props.location[0]).toFixed(5)+','+parseFloat(marker.props.location[1]).toFixed(5)+')'}}</span>
                            </div>
                            <div  class="marker-item-info">
                                <i class="el-icon-collection-tag" style="font-size: 20px;margin-left:5px;margin-right:10px;"></i>
                                <span class="text-normal text-h6">{{marker.featureData.note}}</span>
                            </div>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="检测点" name="monitor">
                        <div style="display:flex;height:100%;flex-direction:column;">
                            <el-input size="mini" placeholder="请输入搜索内容" prefix-icon="el-icon-search" v-model="monitorInput"></el-input>
                            <div style="overflow:auto;">
                                <div class="marker-item" v-for="monitor in monitors" v-bind:key="monitor.props.id">
                                    <div class="marker-item-info" style="cursor:pointer;" @click="jump(monitor.props.location[0],monitor.props.location[1])">
                                        <img src="~static/img/monitor.png" style="height:20px;margin-left:5px;margin-right:10px;" >
                                        <span class="text-normal text-h6">{{monitor.props.name}}</span>
                                    </div>
                                    <div class="marker-item-info">
                                        <i class="el-icon-user" style="font-size: 20px;margin-left:5px;margin-right:10px;"></i>
                                        <span class="text-normal text-h6">{{monitor.featureData.username}}</span>
                                    </div>
                                    <div  class="marker-item-info">
                                        <i class="el-icon-location-outline" style="font-size: 20px;margin-left:5px;margin-right:10px;"></i>
                                        <span class="text-normal text-h6">{{'('+parseFloat(monitor.props.location[0]).toFixed(5)+','+parseFloat(monitor.props.location[1]).toFixed(5)+')'}}</span>
                                    </div>
                                    <div  class="marker-item-info">
                                        <i class="el-icon-collection-tag" style="font-size: 20px;margin-left:5px;margin-right:10px;"></i>
                                        <span class="text-normal text-h6">{{monitor.featureData.note}}</span>
                                    </div>
                                    <div class="marker-item-info" >
                                        <i class="el-icon-setting" style="font-size: 20px;margin-left:5px;margin-right:10px;"></i>
                                        <img src="~static/img/table.png" title="水质数据" @click="showWaterQualities(monitor.props.id)" style="height:20px;cursor:pointer;height:20px;margin-left:5px;margin-right:10px;" >
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                    </el-tab-pane>
                    <el-tab-pane label="标准" name="standard">
                        <el-card >
                            <span style="cursor:pointer;" @click="waterQualityStandardVisible = true;getWaterQualityStandard()" class="text-h5 text-thick text-primary">水质标准</span>
                        </el-card>
                    </el-tab-pane>
                </el-tabs>
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
                    
                    <el-form-item label="TN">
                        <el-input type="number" v-model="qualityInfo.tn" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="TP">
                        <el-input type="number" v-model="qualityInfo.tp" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="叶绿素">
                        <el-input  type="number" v-model="qualityInfo.chlorophyll" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="DO">
                        <el-input type="number" v-model="qualityInfo.o2" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="COD">
                        <el-input type="number" v-model="qualityInfo.cod" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="BOD">
                        <el-input type="number" v-model="qualityInfo.bod" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="水量">
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
                <el-button type="primary" @click="addWaterQualityDialog()">更新</el-button>
            </div>
        </el-dialog>
        <el-dialog title="水质数据" :visible.sync="waterQualityVisible">
            <el-table :data="waterQualityById">
                <el-table-column :sortable="true" width="200px" :formatter="formatTime" property="monitorTime" label="检测时间"></el-table-column>
                <el-table-column property="tn" label="TN" ></el-table-column>
                <el-table-column property="tp" label="TP"></el-table-column>
                <el-table-column property="chlorophyll" label="叶绿素"></el-table-column>
                <el-table-column property="o2" label="DO"></el-table-column>
                <el-table-column property="cod" label="COD"></el-table-column>
                <el-table-column property="bod" label="BOD"></el-table-column> 
                <el-table-column property="volumn" label="水量"></el-table-column>                 
            </el-table>
        </el-dialog>
        <el-dialog width="90%" title="详细评价数据" :visible.sync="analyseDetailVisible">
            <el-table :data="analyseDetail">
                <el-table-column property="monitorName" label="检测点名" ></el-table-column>
                <el-table-column label="TN">
                    <el-table-column property="tn" label="浓度" :formatter="floatFix"></el-table-column>
                    <el-table-column label="等级">
                        <template slot-scope="scope">
                            <div :style="{'color':getColorByLevel(scope.row.tnLevel)}">{{formatLevelByNum(scope.row.tnLevel)}}</div>
                        </template>
                    </el-table-column>
                </el-table-column>
                <el-table-column label="TP">
                    <el-table-column property="tp" label="浓度" :formatter="floatFix"></el-table-column>
                    <el-table-column label="等级">
                        <template slot-scope="scope">
                            <div :style="{'color':getColorByLevel(scope.row.tpLevel)}">{{formatLevelByNum(scope.row.tpLevel)}}</div>
                        </template>
                    </el-table-column>
                </el-table-column>
                <el-table-column label="叶绿素">
                    <el-table-column property="chlorophyll" label="浓度" :formatter="floatFix"></el-table-column>
                    <el-table-column label="等级">
                        <template slot-scope="scope">
                            <div :style="{'color':getColorByLevel(scope.row.chlorophyllLevel)}">{{formatLevelByNum(scope.row.chlorophyllLevel)}}</div>
                        </template>
                    </el-table-column>
                </el-table-column>
                <el-table-column label="DO">
                    <el-table-column property="o2" label="浓度" :formatter="floatFix"></el-table-column>
                    <el-table-column label="等级">
                        <template slot-scope="scope">
                            <div :style="{'color':getColorByLevel(scope.row.o2Level)}">{{formatLevelByNum(scope.row.o2Level)}}</div>
                        </template>
                    </el-table-column>
                </el-table-column>
                <el-table-column label="COD">
                    <el-table-column property="cod" label="浓度" :formatter="floatFix"></el-table-column>
                    <el-table-column label="等级">
                        <template slot-scope="scope">
                            <div :style="{'color':getColorByLevel(scope.row.codLevel)}">{{formatLevelByNum(scope.row.codLevel)}}</div>
                        </template>
                    </el-table-column>
                </el-table-column>
                <el-table-column label="BOD">
                    <el-table-column property="bod" label="浓度" :formatter="floatFix"></el-table-column>
                    <el-table-column label="等级">
                        <template slot-scope="scope">
                            <div :style="{'color':getColorByLevel(scope.row.bodLevel)}">{{formatLevelByNum(scope.row.bodLevel)}}</div>
                        </template>
                    </el-table-column>
                </el-table-column>
            </el-table>
        </el-dialog>
        <el-dialog title="水质标准" :visible.sync="waterQualityStandardVisible">
            <el-table max-height="350" :data="waterQualityStandard">
                <el-table-column property="name" label="名称" ></el-table-column>
                <el-table-column property="level1" label="Ⅰ类"></el-table-column>
                <el-table-column property="level2" label="Ⅱ类"></el-table-column>
                <el-table-column property="level3" label="Ⅲ类"></el-table-column>
                <el-table-column property="level4" label="Ⅳ类"></el-table-column>
                <el-table-column property="level5" label="Ⅴ类"></el-table-column>         
            </el-table>
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
            currentLake: '',
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
            analyseDetailVisible: false,
            analyseDetail: [],
            waterPurify: {

            },
            waterAnalyse: {

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
        }
    },
    methods: {
        initContextMenu() {
            var contextmenuItems = [
				{
					text: '添加标记',
					classname: 'bold',
					icon: '/static/img/marker.png',
					callback: this.addMarkerCallback
                },
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
                        removeMonitorItem.data = { feature: feature,type: "monitor" };
                        showWaterQualities.data = {feature: feature};
                        this.contextMenu.push(removeMonitorItem);
                        this.contextMenu.push(showWaterQualities);
                    } else if (feature && (feature.get('type') === 'lake')) {
                        this.contextMenu.clear();
                        this.contextMenu.extend(contextmenuItems);
                        showLakeInfo.data = { feature: feature};
                        addMonitorItem.data = {feature: feature};
                        updateWaterQuality.data = { feature: feature};
                        this.contextMenu.push(showLakeInfo);
                        this.contextMenu.push(addMonitorItem);
                        this.contextMenu.push(updateWaterQuality);
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
            this.axios.get("/api/monitor/remove-monitor?id="+id)
				.then(res=>{
                    this.markerLayers.marker.removeMarker(id);
                    this.rawMonitors = this.rawMonitors.filter(item => item.props.id !== id);
				})
				.catch(err=>{
					this.$message.error(err.response.data.message);
				})
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
            }).catch(err=>{
                this.$message.error(err.response.data.message);
            })
        },
        getWaterQualityStandard() {
            this.axios.get("/api/water/water-quality-standard")
            .then(res=>{
                this.waterQualityStandard = res.data.standards;
            })
            .catch(err=>{
                this.$message.error(err.response.data.message);
            })
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
            if(num<=0) {
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
            if(level<=0) {
                return "#ff0000";
            } else if(level < 2) {
                return "#00B050";
            } else if(level < 3) {
                return "#92D050";
            } else if(level < 4) {
                return "#F68326";
            } else {
                return "#ff0000"; 
            }
        },
        formatLevel(row, column, data, index) {
            return this.formatLevelByNum(data);
        },
        getQualityByLakeId(lakeId) {
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
        qualityJudge(id) {
            let q = this.waterAnalyse[id];
            let count = 0;
            if(q.tnLevel == -1) count++;
            if(q.tpLevel == -1) count++;
            if(q.codLevel == -1) count++;
            if(q.o2Level == -1) count++;
            if(q.bodLevel == -1) count++;
            if(q.chlorophyllLevel == -1) count++;
            if(count>=1) {
                this.waterQualityPurify(id);
                return false;
                
            } else {
                return true;
            }
        },
        getOption(q) {
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
                    data: ["TN","TP","DO","叶绿素","BOD","COD"]
                },
                series: [{
                    name: '水质级别',
                    type: 'bar',
                    barWidth: '60%',
                    data: [
                        parseFloat(q.tnLevel).toFixed(2),
                        parseFloat(q.tpLevel).toFixed(2),
                        parseFloat(q.o2Level).toFixed(2),
                        parseFloat(q.chlorophyllLevel).toFixed(2),
                        parseFloat(q.bodLevel).toFixed(2),
                        parseFloat(q.codLevel).toFixed(2)
                    ],
                    itemStyle: {
                        color:"#5C7BD9"
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
        qualityChange(e) {
            let data = new URLSearchParams();
            let ids = [];
            let lake = this.lakes.find(lake=>lake.lakeInfo.id == this.currentLake);
            let id = this.currentLake+""+e;
            this.$set(this.currentAnalyse,this.currentLake,e);
            if(this.waterAnalyse[id]) {
                // 
                let echart = echarts.getInstanceByDom(document.getElementById(id));
                // let option = this.getOption(q);
                // echart.setOption(option);
                // console.info(echart);
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
                            console.info(q);
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
        waterQualityPurify(id) {
            if(!this.waterPurify[id]) {
                this.axios.post("/api/water/water-purify")
                .then(res=> {
                    this.$set(this.waterPurify,id,res.data.purify);
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
        showAnalyseDetail(id) {
            this.analyseDetail = JSON.parse(JSON.stringify(this.waterAnalyse[id]));
            const len = this.analyseDetail.length-1;
            for(let i = 0 ; i < len ; i++) {
                const item = this.analyseDetail[i];
                const monitor = this.rawMonitors.find(monitor=>{return monitor.props.id === item.monitorId;})
                if(monitor) {
                    item.monitorName = monitor.featureData.name;
                }
                
            }
            if(len >=0 && this.analyseDetail[len].monitorId === null) {
                this.analyseDetail[len].monitorName = "整体入水";
            }
            this.analyseDetailVisible = true;
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
            column.style.height = document.body.clientHeight-120+"px";
        });
        resizeObserver.observe(document.body);
        window.addEventListener("resize", () => { 
                if(this.currentLake && this.currentAnalyse[this.currentLake]) {
                    const id = this.currentLake+""+this.currentAnalyse[this.currentLake];
                    const q = this.waterAnalyse[id];
                    if(q) {
                        console.info(q);
                        const echart = echarts.getInstanceByDom(document.getElementById(id));
                        echart.setOption(this.getOption(q));
                        echart.resize();
                    }
                }
                
        });
        this.initMarkers();
        this.initMonitors();
        this.initLake();
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
}
>>>.el-collapse-item__header {
    background: #282c35;   
}
>>>.el-collapse-item__content {
    background: #282c35;   
} */
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