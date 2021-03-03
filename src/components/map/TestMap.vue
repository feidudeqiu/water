<template>
    <div>
        <div style="height:100%;width:100%;display:flex;">
            <div id="map" ref="rootmap" class="map"></div>
            <div class="column">
                <el-tabs v-model="tab" type="card" >
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
                        <el-input size="mini" placeholder="请输入搜索内容" prefix-icon="el-icon-search" v-model="markerInput"></el-input>
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
                                <img src="~static/img/update.png" title="更新水质数据" @click="updateWaterQuality(monitor.props.id)" style="height:20px;cursor:pointer;height:20px;margin-left:5px;margin-right:10px;" >
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
            <el-form size="mini" label-width="100px" :model="addWaterQualityInfo">
                <el-form-item label="TN">
                    <el-input type="number" v-model="addWaterQualityInfo.tn" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="TP">
                    <el-input type="number" v-model="addWaterQualityInfo.tp" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="叶绿素">
                    <el-input  type="number" v-model="addWaterQualityInfo.chlorophyll" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="DO">
                    <el-input type="number" v-model="addWaterQualityInfo.o2" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="COD">
                    <el-input type="number" v-model="addWaterQualityInfo.cod" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="BOD">
                    <el-input type="number" v-model="addWaterQualityInfo.bod" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="检测时间">
                    <el-date-picker v-model="addWaterQualityInfo.monitorTime" type="datetime"></el-date-picker>
                </el-form-item>
            </el-form>
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
                <el-table-column  width="120">
                    <template slot="header" slot-scope="scope">
                        <el-button size="mini" @click="qualityAnalyse()">水质评价</el-button>
                    </template>
                    <template slot-scope="scope">
                        <el-dropdown v-if="scope.row.res !== undefined">
                            <span class="el-dropdown-link">
                                评价结果<i class="el-icon-arrow-down el-icon--right"></i>
                            </span>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item>{{"TN("+getLevel(scope.row.res.tnLevel)+")"}}</el-dropdown-item>
                                <el-dropdown-item>{{"TP("+getLevel(scope.row.res.tpLevel)+")"}}</el-dropdown-item>
                                <el-dropdown-item>{{"叶绿素("+getLevel(scope.row.res.chlorophyllLevel)+")"}}</el-dropdown-item>
                                <el-dropdown-item>{{"DO("+getLevel(scope.row.res.o2Level)+")"}}</el-dropdown-item>
                                <el-dropdown-item>{{"COD("+getLevel(scope.row.res.codLevel)+")"}}</el-dropdown-item>
                                <el-dropdown-item>{{"BOD("+getLevel(scope.row.res.bodLevel)+")"}}</el-dropdown-item>
                                <el-dropdown-item>{{"整体("+(judgeStandard(scope.row.res)?"合格":"不合格")+")"}}</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </template>
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
export default {
    name: 'TestMap',
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
				note: ''
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
            tab: 'marker',
            markerInput: "",
            monitorInput: "",
            waterQualityVisible: false,
            waterQualityById: [],
            addWaterQualityDialogVisible: false,
            addWaterQualityInfo: {
                tn: 0,
                tp: 0,
                chlorophyll: 0,
                o2: 0,
                cod: 0,
                bod: 0,
                monitorTime: null,
                monitorId: 0
            },
            waterQualityStandardVisible: false,
            waterQualityStandard: [

            ]
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
                    text: '添加检测点',
					classname: 'bold',
					icon: '/static/img/monitor.png',
					callback: this.addMonitorCallback
                },
				{
					text: '保存图片',
					classname: 'bold',
					icon: '/static/img/download_color.png',
					callback: this.saveAsPngCallback
				}
            ];
            this.contextMenu.clear();
            this.contextMenu.extend(contextmenuItems);
            this.contextMenu.on('open', evt=> {
                var feature =	this.map.forEachFeatureAtPixel(evt.pixel, ft => ft);
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
				if (feature && (feature.get('type') === 'marker')) {
					this.contextMenu.clear();
					removeMarkerItem.data = { feature: feature,type: "marker" };
					this.contextMenu.push(removeMarkerItem);
				} else if (feature && (feature.get('type') === 'monitor')) {
                    this.contextMenu.clear();
                    removeMonitorItem.data = { feature: feature,type: "monitor" };
                    updateWaterQuality.data = { feature: feature};
                    this.contextMenu.push(updateWaterQuality);
                    this.contextMenu.push(removeMonitorItem);
				} else if (feature && (feature.get('type') === 'lake')) {
                    this.contextMenu.clear();
                    this.contextMenu.extend(contextmenuItems);
                    showLakeInfo.data = { feature: feature};
                    this.contextMenu.push(showLakeInfo);
                } else {
                    this.contextMenu.clear();
					this.contextMenu.extend(contextmenuItems);
                }
			});
        },
        initEvent() {
            var that = this;
			this.map.on('pointermove',function(evt) {
				var feature =	that.map.forEachFeatureAtPixel(evt.pixel, ft => ft);
				if (feature && (feature.get('type') === 'marker' || feature.get('type') === 'monitor')) {
					that.map.getTargetElement().style.cursor = 'pointer';
				} else {
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
				note: ''
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
			var that = this;
			this.axios.post("/api/monitor/add-monitor",data)
				.then(res=> {
                    var featureData = {
                        name: this.addMarkerInfo.name,
                        location: this.addMonitorInfo.location,
                        note: this.addMonitorInfo.note,
                        username: this.$store.getters.get_username,
                        markerId: res.data.id,
                        type: "monitor"
                    }
                    var props = {
                        id: res.data.id,
                        name: this.addMarkerInfo.name,
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
            this.addWaterQualityInfo = {
                tn: 0,
                tp: 0,
                chlorophyll: 0,
                o2: 0,
                cod: 0,
                bod: 0,
                monitorTime: new Date(),
                monitorId: id
            }
            this.addWaterQualityDialogVisible = true;
        },
        showWaterQualities(id) {
            this.waterQualityVisible = true;
            this.axios.get("/api/quality/get-qualities-by-id?monitorId="+id)
            .then(res=>{
                this.waterQualityById = res.data.qualities;
            })
            .catch(err=>{
                console.info(err);
            })
        },
        addWaterQualityDialog() {
            let data = new URLSearchParams();
            data.append("monitorId",this.addWaterQualityInfo.monitorId);
            data.append("tn",this.addWaterQualityInfo.tn);
            data.append("tp",this.addWaterQualityInfo.tp);
            data.append("chlorophyll",this.addWaterQualityInfo.chlorophyll);
            data.append("o2",this.addWaterQualityInfo.o2);
            data.append("cod",this.addWaterQualityInfo.cod);
            data.append("bod",this.addWaterQualityInfo.bod);
            data.append("monitorTime",Date.parse(this.addWaterQualityInfo.monitorTime));
			var that = this;
            this.axios.post("/api/quality/add-quality",data)
            .then(res=>{
                this.$message.success("更新成功");
                this.addWaterQualityDialogVisible = false;
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
                    lake.geo = JSON.parse(lake.geo);
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
        formatTime(row, column,date, index) {
            if(date) {
                var date = new Date(date);
                var YY = date.getFullYear() + '-';
                var MM = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
                var DD = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate());
                var hh = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
                var mm = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
                var ss = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
                return YY + MM + DD +" "+hh + mm + ss;
            } else {
                return "";
            }
            
        },
        qualityAnalyse() {
            let data = new URLSearchParams();
            let ids = [];
            this.waterQualityById.forEach(item=>{
                ids.push(item.id);
            })
            data.append("ids",JSON.stringify(ids));
            this.axios.post("/api/water/quality-analyse",data)
            .then(res=>{
                var results = res.data.results;
                results.forEach(result=>{
                    let quality = this.waterQualityById.find(quality=>{return quality.id === result.id});
                    this.$set(quality,"res",result);
                })
            })
            .catch(err=>{
                this.$message.error(err.response.data.message);
            })
        },
        getLevel(level) {
            switch(level) {
                case 1: {
                    return "Ⅰ类";
                }
                case 2: {
                    return "Ⅱ类";                    
                }
                case 3: {
                    return "Ⅲ类";
                }
                case 4: {
                    return "Ⅳ类";
                }
                case 5: {
                    return "Ⅴ类";
                }
                default: {
                    return "不合格";
                }
            }
        },
        judgeStandard(res) {
            let count = 0;
            if(res.tnLevel == -1) {
                count++;
            }
            if(res.tpLevel == -1) {
                count++;
            }
            if(res.chlorophyllLevel == -1) {
                count++;
            }
            if(res.bodLevel == -1) {
                count++;
            }
            if(res.codLevel == -1) {
                count++;
            }
            if(res.o2Level == -1) {
                count++;
            }
            if(count>=2) {
                return false;
            } else {
                return true;
            }
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
        this.initMarkers();
        this.initMonitors();
        this.initLake();
    }
}
</script>

<style>
.map {
    height:100%;
    flex: 10;
}
.column {
	flex:4;
	display: flex;
	flex-direction: column;
	padding:10px;
	background:#f7f8f9;
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