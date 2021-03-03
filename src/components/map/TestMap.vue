<template>
  <div>
        <div id="map" ref="rootmap" class="map"></div>
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

            }
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
				if (feature && (feature.get('type') === 'marker')) {
					this.contextMenu.clear();
					removeMarkerItem.data = { marker: feature };
					this.contextMenu.push(removeMarkerItem);
				} else if (feature && (feature.get('type') === 'monitor')) {
                    this.contextMenu.clear();
                    removeMarkerItem.data = { marker: feature };
                    this.contextMenu.push(updateWaterQuality);
                    this.contextMenu.push(removeMonitorItem);
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
        addMarkerCallback(e) {
            this.addMarkerInfo = {
				name: '',
				location: e.coordinate,
				note: ''
			},
			this.addMarkerDialogVisible = true;
        },
        removeMarkerCallback(obj) {
            var id = obj.data.marker.getId();
            this.axios.get("/api/marker/remove-marker?id="+id)
				.then(res=>{
					this.markerLayers.marker.removeMarker(id);
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
                        id: res.data.id
                    }
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
            var id = obj.data.marker.getId();
            this.axios.get("/api/monitor/remove-monitor?id="+id)
				.then(res=>{
					this.markerLayers.marker.removeMarker(id);
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
                        name: this.addMarkerInfo.name
                    }
					this.markerLayers.marker.addMarker(this.addMonitorInfo.location,featureData,props,"monitor","/static/img/monitor.png");
				})
				.catch(function(err) {
					that.$message.error(err.response.data.message);
				})
        },
        updateWaterQualityCallback() {
            
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
                        id: marker.id
                    }
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
                        id: monitor.id
                    }
                    this.markerLayers.marker.addMarker(monitor.location,monitor,props,"monitor","/static/img/monitor.png");
				}
            })
            .catch(function(err) {
                that.$message.error(err.response.data.message);
            })
        }
    },
    mounted() {
        this.map = Map.initMap([Map.getVECLayer(),Map.getCVALayer()],Map.getViewByDemo());
        this.contextMenu = Map.initContextMenu();
        this.initEvent();
        this.initContextMenu();
        this.markerLayers.marker = new Map.MarkerLayer();
        var marker = this.markerLayers.marker;
        this.map.addLayer(marker.getLayer());
        this.initMarkers();
        this.initMonitors();
    }
}
</script>

<style>
.map {
    height:100%;
    width:100%;
}
</style>