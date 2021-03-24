<template>
    <div>
        <div id="main" style="height:100%;width:100%;display:flex;">
            <div id="map" ref="rootmap" class="map"></div>
            <div id="column" class="column">
                <el-tabs style="display:flex;flex-direction:column;" v-model="tab" type="card" >
                    <el-tab-pane label="湖泊" name="lake">
                        <el-collapse v-model="currentLake" accordion v-on:change="lakeChange">
                            <el-collapse-item  :name="lake.id" v-for="lake in lakes" v-bind:key="lake.id">
                                <template slot="title">
                                    <span class="text-h4 text-thick" style="margin-left:10px;">{{lake.name}}</span>
                                </template>
                                <div>
                                    
                                </div>
                            </el-collapse-item>
                        </el-collapse>
                        
                    </el-tab-pane>
                    <el-tab-pane label="操作" name="action">
                        <el-button size="mini" type="primary" style="width:100%;margin-top:5px;" v-if="currentPoint.length>=3" @click="addLake()">添加湖泊</el-button>
                        <el-button size="mini" type="danger" style="margin-left:0px;width:100%;margin-top:5px;" v-if="currentPoint.length>=1" @click="deleteAll()">全部删除</el-button>
                        <draggable @update="draged" v-model="currentPoint">
                            <div class="point-item" v-for="(point, index) in currentPoint" v-bind:key="point.id">
                                <div class="point-item-info" style="cursor:pointer;justify-content:space-between;" @click="jump(point.coordinate[0],point.coordinate[1])">
                                    <div class="flex-row-inline">
                                        <span class="text-normal text-thick text-h6" style="margin-left:5px;margin-right:5px;">{{index+1}}</span>
                                        <img src="~static/img/anchor.png" style="height:20px;margin-left:5px;margin-right:10px;" >
                                        <span class="text-normal text-h6">{{point.id}}</span>
                                    </div>
                                    <div>
                                        <i @click.stop="removePoint(point.id)" class="text-h4 el-icon-delete-solid" style="color:red;margin-right:10px;"></i>
                                    </div>
                                </div>
                            </div>
                        </draggable>
                        
                    </el-tab-pane>
                </el-tabs>
            </div>
        </div>
        <el-dialog title="添加湖泊" :visible.sync="addLakeDialogVisible">
            <el-form :model="addLakeInfo">
                <el-form-item label="湖泊名称">
                    <el-input maxlength="32" v-model="addLakeInfo.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="湖泊面积">
                    <el-input type="number" v-model="addLakeInfo.area" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="湖泊平均深度">
                    <el-input type="number" v-model="addLakeInfo.height" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addLakeDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addLakeDialog()">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import Map from './js/map'
import WKT from "terraformer-wkt-parser"
import draggable from 'vuedraggable'
import Feature from 'ol/Feature';
import Polygon from 'ol/geom/Polygon';
export default {
    name: 'AddLake',
    components: {
        draggable
    },
	data(){
		return{
            map: null,
            view: null,
            contextMenu: null,
            ploygonLayers: {

            },
            markerLayers: {
            },
            lineLayers: {

            },
            popupLayer: null,
            rawLakes: [

            ],
            currentPoint: [

            ],
            tab: 'lake',
            currentLake: '',
            counter: 0,
            lineCounter: 0,
            addLakeDialogVisible: false,
            addLakeInfo: {
                name: "",
                area: 0,
                height: 0
            }
        }
    },
    computed: {
        lakes() {
            return this.rawLakes.map((lake)=>{
                return {
                    id: lake.id,
                    name: lake.name
                }
            })
        },
        lineCoordinates() {
            let points = this.currentPoint.map((item)=>{
                return item.coordinate;
            })
            if(points.length > 2) {
                points.push(points[0]);
            }
            return points;
        }
    },
    mounted() {
        this.view = Map.getViewByDemo();
        this.map = Map.initMap([Map.getVECLayer(),Map.getCVALayer()],this.view);
        this.contextMenu = Map.initContextMenu();
        this.initContextMenu();
        this.ploygonLayers.lake = new Map.PolygonLayer();
        this.markerLayers.point = new Map.MarkerLayer();
        this.lineLayers.line = new Map.LineLayer(this.view.getResolution());
        this.popupLayer = new Map.PopupLayer();
        var lake = this.ploygonLayers.lake;
        var point = this.markerLayers.point;
        var line = this.lineLayers.line;
        this.map.addLayer(point.getLayer());
        this.map.addLayer(lake.getLayer());
        this.map.addLayer(line.getLayer());
        this.map.addOverlay(this.popupLayer.getOverLay());

        var column = document.getElementById("column");
        const resizeObserver = new ResizeObserver(entries => {
            column.style.height = document.body.clientHeight-120+"px";
        });
        resizeObserver.observe(document.body);

        this.initLake();
        this.initEvent();
    },
    methods: {
        initLake() {
            this.axios.get("/api/lake/get-lakes")
            .then(res=>{
                var lakes = res.data.lakes;
                lakes.forEach(lake=>{
                    lake.geo = WKT.parse(lake.geo);
                    this.ploygonLayers.lake.addPloygon(lake.geo.coordinates,lake,{id:lake.id,name: lake.name},"lake")
                })
                this.rawLakes = lakes;
            }).catch(err=>{
                console.info(err);
                this.$message.error(err.response.data.message);
            })
        },
        initEvent() {
            var that = this;
			this.map.on('pointermove',function(evt) {
				var temp = null;
				that.map.forEachFeatureAtPixel(evt.pixel, feature => {
                   if (feature && (feature.get('type') === 'lake' || feature.get('type') === 'point')) {
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
        initContextMenu(){
            var contextmenuItems = [
				{
					text: '添加点位',
					classname: 'bold',
					icon: '/static/img/anchor.png',
					callback: this.addPointCallback
                },
            ];
            this.contextMenu.clear();
            this.contextMenu.extend(contextmenuItems);
            this.contextMenu.on('open', evt=> {
                let f = null;
                let removePointItem = {
                    text: '删除点位',
                    icon: '/static/img/anchor.png',
                    callback: this.removePointCallback
                };
                this.map.forEachFeatureAtPixel(evt.pixel, feature=>{
                    if (feature && (feature.get('type') === 'lake')) {
                        this.contextMenu.clear();
                        f = feature;
                    }
                    else if (feature && (feature.get('type') === 'point')) {
                        this.contextMenu.clear();
                        removePointItem.data = { feature: feature,type: "point" };
                        this.contextMenu.push(removePointItem);
                        f = feature;
                    }
                })
                if(!f) {
                    this.contextMenu.clear();
                    this.contextMenu.extend(contextmenuItems);
                }
            });
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
        lakeChange(e) {
            if(e) {
                this.jumpToLake(e);
            }
        },
        jumpToLake(id) {
            const center = this.ploygonLayers.lake.getCenterById(id);
            if(center) {
                this.jump(center[0],center[1]);
            }
        },
        addLake() {
            this.addLakeInfo = {
                name: "",
                area: 0,
                height: 0
            }
            this.addLakeDialogVisible = true;
        },
        addLakeDialog() {
            let data = new URLSearchParams(); 
            data.append("name",this.addLakeInfo.name);
            data.append("area",this.addLakeInfo.area);
            data.append("height",this.addLakeInfo.height);
            var feature = new Feature({
                geometry: new Polygon([this.lineCoordinates]),
            });
            data.append("geo",Map.getWKTString(feature));
            this.axios.post("/api/lake/add-lake",data)
            .then(res=>{
                this.$message.success("添加成功");
                setTimeout(function(){ location.reload(); }, 1500);
                this.addLakeDialogVisible = false;
                
            })
            .catch(err=>{
                this.$message.error(err.response.data.message);
            })
        },
        addPointCallback(e) {
            this.counter+=1;
            const id = String(this.counter);
            let props = {
                id: id,
                name: id
            }
            let featureData = {

            }
            this.currentPoint.push({id:id,coordinate:e.coordinate});
            this.reDraw();
            this.markerLayers.point.addMarker(e.coordinate,featureData,props,"point","/static/img/anchor.png");
        },
        reDraw() {
            let id = ""+this.lineCounter;
            this.lineLayers.line.removeLine(id);
            if(this.currentPoint.length >= 2) {
                this.lineCounter++;
                this.lineLayers.line.addLine(this.lineCoordinates,{id:new String(this.lineCounter)},"line");
            }
        },
        removePointCallback(e) {
            this.removePoint(e.data.feature.getId());
        },
        removePoint(id) {
            this.markerLayers.point.removeMarker(id);
            this.currentPoint = this.currentPoint.filter(item=>item.id !== id);
            this.reDraw();
        },
        deleteAll() {
            this.currentPoint.forEach(item=>{
                this.markerLayers.point.removeMarker(item.id);
            })
            this.currentPoint = [];
            this.reDraw();
        },
        draged(e) {
            this.reDraw();
        }
    }
}
</script>

<style scoped>
>>>.el-collapse-item__content {
    padding-bottom:0px;
}
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
    overflow-y: auto;
}
.point-item {
	background:white;
	border-radius: 5px;
	display:flex;
	flex-direction: column;
	justify-content: flex-start;
	margin-top:5px;
}
.point-item-info {
	margin-top:5px;
	margin-bottom:5px;
	display:flex;
	flex-direction: row;
	align-items:center;
}
</style>