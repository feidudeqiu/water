<template>
	<div>
		<div style="height:100%;width:100%;display:flex;">
			<div id="map" ref="rootmap" class="map"></div>
			<div class="column">
				<div class="marker-item">
					<span class="text-normal text-h6" style="text-align:left;margin-left:10px;">{{'X:'+current.location[0]}}</span>
					<span class="text-normal text-h6" style="text-align:left;margin-left:10px;">{{'Y:'+current.location[1]}}</span>
				</div>
				<div class="list">
					<div class="marker-item" v-for="marker in markers" v-bind:key="marker.id">
						<div class="marker-item-info" style="cursor:pointer;" @click="jump(marker.location[0],marker.location[1])">
							<img src="~static/img/marker.png" style="height:20px;margin-left:5px;margin-right:10px;" >
							<span class="text-normal text-h6">{{marker.name}}</span>
						</div>
						<div class="marker-item-info">
							<i class="el-icon-user" style="font-size: 20px;margin-left:5px;margin-right:10px;"></i>
							<span class="text-normal text-h6">{{marker.username}}</span>
						</div>
						<div  class="marker-item-info">
							<i class="el-icon-location-outline" style="font-size: 20px;margin-left:5px;margin-right:10px;"></i>
							<span class="text-normal text-h6">{{'('+parseFloat(marker.location[0]).toFixed(5)+','+parseFloat(marker.location[1]).toFixed(5)+')'}}</span>
						</div>
						<div  class="marker-item-info">
							<i class="el-icon-collection-tag" style="font-size: 20px;margin-left:5px;margin-right:10px;"></i>
							<span class="text-normal text-h6">{{marker.note}}</span>
						</div>
					</div>
				</div>
			</div>
			
		</div>

		<div id="popup" class="ol-popup">
			<a href="#" id="popup-closer" class="ol-popup-closer"></a>
			<div id="popup-content"></div>
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
	</div>
</template>
<script>
import 'ol/ol.css';
import 'ol-contextmenu'
import 'ol-contextmenu/dist/ol-contextmenu.css'
import {Map, View} from 'ol';
import Feature from 'ol/Feature';
import {Tile as TileLayer, Image as ImageLayer, Vector as VectorLayer} from 'ol/layer';
import ImageWMS from 'ol/source/ImageWMS';
import GeoJSON from 'ol/format/GeoJSON';
import VectorImageLayer from 'ol/layer/VectorImage';
import Point from 'ol/geom/Point';
import {Icon, Style, Text, Fill} from 'ol/style';
import VectorSource from 'ol/source/Vector';
import ContextMenu from 'ol-contextmenu'
import Overlay from 'ol/Overlay';
import domtoimage from 'dom-to-image';
import mapStyle from './js/mapStyle'
export default {
	name: 'Map',
	data(){
		return{
			map: null,
			vectorLayer: null,
			view: null,
			contextmenu: null,
			layers: null,
			source: null,
				overlay: null,
				// for initPopup
			addMarkerDialogVisible:false,
			addMarkerInfo: {
				name: '',
				location: [],
				note: ''
			},
			mapInfo: {

			},
			markers: [
				
			],
			current: {
				location: [113,30]
			},
			properties: [

			],
			highlightFeatures: [

			]
		};
	},
	mounted() {
		var id = this.$route.query.id;
		var that = this;
		this.axios
            .get("/api/map/get-map-info?id="+id)
            .then(function(res) {
				that.mapInfo = res.data.map;
				// init map
				that.initMap();

				that.initProperties();
				// init menu is after initProperties
				
				// init event
				that.initEvent();

				that.initPopup();

				that.getMarkers();
				
            })
            .catch(function(err) {
                that.$message.error(err.response.data.message);
			})
	},
	methods:{
		getMarkers() {
			var id = this.$route.query.id;
			var that = this;
			this.axios
            .get("/api/marker/get-markers?mapId="+id)
            .then(function(res) {
				var markers = res.data.markers;
				for(let marker of markers) {
					marker.location = JSON.parse(marker.location);
				}
				that.markers = markers;
				that.initMarkers();
            })
            .catch(function(err) {
                that.$message.error(err.response.data.message);
            })
		},
		initMap() {
			var url = this.mapInfo.url;
			var that = this;
			this.view = new View({
				projection: that.mapInfo.projection,    //当添加投影坐标时，无法进行绘制
				center: JSON.parse(that.mapInfo.center),
				zoom: that.mapInfo.zoom
			});
			this.source = new ImageWMS({    //TileWMS、ImageWMS
				ratio: 1,
				params: {
					'FORMAT': 'image/jpeg',
					'VERSION': '1.1.0',
					'LAYERS': that.mapInfo.layer,
					'STYLES': '',
				},
				url: url+"/wms",
				crossOrigin:'anonymous'
			});
			this.layers =  [
					new ImageLayer({     //TileLayer、ImageLayer
						source: that.source,
						style: mapStyle.delightStyle 
					}),
			],
			
			// this.source = new VectorSource({    //TileWMS、ImageWMS
			// 	url: that.mapInfo.url+'/ows?service=WFS&version=1.0.0&request=GetFeature&typeName='+that.mapInfo.layer+'&outputFormat=application/json',
        	// 	format: new GeoJSON(),
			// });
			// this.layers =  [
			// 		new VectorLayer({     //TileLayer、ImageLayer
			// 			source: that.source,
			// 			style: mapStyle.delightStyle 
			// 		}),
			// ],

			this.map = new Map({
				target: "map",
				layers: that.layers,
				view: that.view
			});

			var vectorSource = new VectorSource({
					features: []
			});
			this.vectorLayer = new VectorLayer({
				source: vectorSource
			});
			this.map.addLayer(this.vectorLayer);
		},
		initMenu() {
			var that = this;
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
					callback: this.saveAsPng
				},
				{
					text: "查看详情",
					classname: 'bold',
					icon: '/static/img/info.png',
					callback: this.showInfo
				}
			];
			var search = {
					text: "查找",
					classname: 'bold',
					icon: '/static/img/map_search.png'
			};
			contextmenuItems.push(search);
			search.items = [];
			for(let i = 0; i < this.properties.length; i++) {
				var item = {
					text :this.properties[i].rename,
					icon : '/static/img/map_search.png',
					data : {
						name: this.properties[i].name,
						rename: this.properties[i].rename
					},
					callback: this.searchCallback
				}
				search.items.push(item);
			}
			this.contextmenu = new ContextMenu({
				width: 180,
				items: contextmenuItems
			});
			var contextmenu = this.contextmenu;
			this.map.addControl(contextmenu);

			var removeMarkerItem = {
				text: '删除标记',
				icon: '/static/img/marker.png',
				callback: this.removeMarkerCallback
			};
			contextmenu.on('open', function (evt) {
				var feature =	that.map.forEachFeatureAtPixel(evt.pixel, ft => ft);
				if (feature && feature.get('type') === 'marker') {
					contextmenu.clear();
					removeMarkerItem.data = { marker: feature };
					contextmenu.push(removeMarkerItem);
				} else {
					contextmenu.clear();
					contextmenu.extend(contextmenuItems);
				}
			});
		},
		initEvent() {
			var that = this;
			this.map.on('pointermove',function(evt) {
				var feature =	that.map.forEachFeatureAtPixel(evt.pixel, ft => ft);
				that.current.location = evt.coordinate;
				if (feature && feature.get('type') === 'marker') {
					that.map.getTargetElement().style.cursor = 'pointer';
				} else {
					that.map.getTargetElement().style.cursor = '';
				}
			});
			this.map.on('singleclick', function (evt) {
				var feature =	that.map.forEachFeatureAtPixel(evt.pixel, ft => ft);
				if (feature && feature.get('type') === 'marker') {
					
				}
			});
		},
		initMarkers() {
			for(let marker of this.markers) {
				this.addMarker(marker.location[0],marker.location[1],marker);
			}
		},
		initPopup() {
			var that = this;
			/**
			 * Elements that make up the popup.
			 */
			var container = document.getElementById('popup');
			var content = document.getElementById('popup-content');
			var closer = document.getElementById('popup-closer');

			/**
			 * Create an overlay to anchor the popup to the map.
			 */
			this.overlay = new Overlay({
				element: container,
				autoPan: true,
				autoPanAnimation: {
					duration: 250,
				},
			});

			closer.onclick = function () {
				that.overlay.setPosition(undefined);
				closer.blur();
				that.delightFeature();
				return false;
			};

			this.map.addOverlay(this.overlay);
		},
		initProperties() {
			this.axios.get("/api/map/get-map-properties?id="+ this.$route.query.id)
			.then(res=>{
				this.properties = res.data.properties;
				this.initMenu();
			})
			.catch(err=>{
				this.$message.error(err.response.data.message);
			})
		},
		saveAsPng() {
			var that = this;
			this.contextmenu.close();
			setTimeout(()=>{
				domtoimage.toBlob(document.getElementById('map'))
				.then(function (blob) {
					const a = document.createElement("a");
					const url = window.URL.createObjectURL(blob);
					const filename = that.mapInfo.name+".png";
					a.href = url;
					a.download = filename;
					a.click();
					window.URL.revokeObjectURL(url)
				});
			},300);
		},
		showInfo(e) {
			var features = this.layers[0].getSource().getFeaturesAtCoordinate(e.coordinate);
			// var pixel = this.map.getPixelFromCoordinate(e.coordinate);
			// this.layers[0].getFeatures(pixel).then((features)=> {
				console.info(features);
				var feature = features.length > 0 ? features[0] : undefined;
				if(feature === undefined) {
					this.$message.info("该地点无详情信息");
					return;
				}
				this.delightFeature();
				this.highlightFeature(feature);
				var info = "";
				for(let i = 0; i < this.properties.length; i++) {
					info+="<span style='font-size:14px;'>"+this.properties[i].rename+":"+feature.values_[this.properties[i].name]+"</span></br>"
				}
				this.showPopup(info,e.coordinate);
			// });
			// var that = this;
			// let infoUrl = this.source.getFeatureInfoUrl(e.coordinate, this.view.getResolution(), "EPSG:4326", {
			// 	INFO_FORMAT: 'application/json',
			// 	QUERY_LAYERS: that.mapInfo.layer
			// })
			// if (infoUrl) {
			// 	this.axios.get(infoUrl)
			// 	.then(res=>{
			// 		var info = ""

			// 	})
			// }
		},
		showPopup(ht,coordinate) {
			var content = document.getElementById('popup-content');
			content.innerHTML = ht;
			this.overlay.setPosition(coordinate);
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
			console.info(obj);
			this.axios.get("/api/marker/remove-marker?markerId="+obj.data.marker.values_.id)
				.then(res=>{
					this.vectorLayer.getSource().removeFeature(obj.data.marker);
					this.markers.splice(this.markers.findIndex(item => item.id === obj.data.marker.values_.id), 1)
				})
				.catch(err=>{
					console.info(err);
					this.$message.error(err.response.data.message);
				})
			
		},
		addMarkerDialog() {
			this.addMarkerDialogVisible = false;
			let data = new URLSearchParams();
            data.append("name",this.addMarkerInfo.name);
            data.append("location",JSON.stringify(this.addMarkerInfo.location));
            data.append("note",this.addMarkerInfo.note);
            data.append("mapId",this.$route.query.id);
			var that = this;
			this.axios.post("/api/marker/add-marker",data)
				.then(function(res) {
					that.addMarkerInfo.markerId = res.data.id;
					that.addMarker(that.addMarkerInfo.location[0],that.addMarkerInfo.location[1],that.addMarkerInfo);
					that.markers.push({
						name: that.addMarkerInfo.name,
						location: that.addMarkerInfo.location,
						username: that.$store.getters.get_username,
						note: that.addMarkerInfo.note
					});
				})
				.catch(function(err) {
					that.$message.error(err.response.data.message);
				})
		},
		addMarker(x, y, data) {
			var marker = new Feature({
				geometry: new Point([x, y]),
				name: data.name,
				username: data.username,
				note: data.note,
				type: 'marker',
				id: data.markerId
			});
			var iconStyle = new Style({
				image: new Icon({
					anchor: [0.5, 1],
					crossOrigin: 'anonymous',
					src: "/static/img/marker.png"
				}),
				text: new Text({
					text:  data.name
				})
			});
			marker.setStyle(iconStyle);
			this.vectorLayer.getSource().addFeature(marker);
		},
		searchCallback(e){
			var name = e.data.name;
			var rename = e.data.rename;
			var ht = 
				"<span>按"+rename+"查找</span></br>"+
				"<input id='search-input'/></br>"+
				"<button id='search-button-submit'>查找</button>";
			this.showPopup(ht,e.coordinate);
			var button = document.getElementById('search-button-submit');
			var input = document.getElementById('search-input');
			var that = this;
			button.onclick = function() {
				console.info(input.value);
				var features = that.searchByFeature(name,input.value);
				if(features.length == 0) {
					that.$message.info("不存在查找对象");
				} else {
					that.delightFeature();
					features.forEach((feature)=>{
						that.highlightFeature(feature);
					})
				}
			}
		},
		searchByFeature(name,re) {
			var res = [];
			this.source.forEachFeature((feature)=>{
				if(String(feature.values_[name]) === String(re)) {
					res.push(feature);
				}
			})
			return res;
		},
		searchByGml(data) {
			var url = data.url;
			var coordinates = data.coordinates;
			var re = data.re;
			var layer = data.layer;
			var name = data.name;
			var filter =
				'<Filter xmlns="http://www.opengis.net/ogc" xmlns:gml="http://www.opengis.net/gml">';
				filter += '<And>';
				filter += '<Intersects>';
				filter += '<PropertyName>geom</PropertyName>';
				filter += '<gml:Polygon>';
				filter += '<gml:outerBoundaryIs>';
				filter += '<gml:LinearRing>';
				filter += '<gml:coordinates>' + coordinates + '</gml:coordinates>';
				filter += '</gml:LinearRing>';
				filter += '</gml:outerBoundaryIs>';
				filter += '</gml:Polygon>';
				filter += '</Intersects>';
				filter += '<PropertyIsLike wildCard="*" singleChar="#" escapeChar="!">';
				filter += '<PropertyName>'+name+'</PropertyName>';
				filter += '<Literal>'+re+'</Literal>';
				filter += '</PropertyIsLike>';
				filter += '</And>';
				filter += '</Filter>';
			var urlString = url + '/ows';
			var param = {
				service: 'WFS',
				version: '1.0.0',
				request: 'GetFeature',
				typeName: layer,
				outputFormat: 'application/json',
				filter: filter
				};
			var geojsonUrl = urlString + this.getParamString(param, urlString);
			this.axios.get(geojsonUrl)
				.then(res=>{
					console.info(res);
				})
				.catch(err=>{
					console.info(err);
				})
		},
		getParamString(obj, existingUrl, uppercase){
			var params = [];
			for (var i in obj) {
			params.push(encodeURIComponent(uppercase ? i.toUpperCase() : i) + '=' + encodeURIComponent(obj[i]));
			}
			return ((!existingUrl || existingUrl.indexOf('?') === -1) ? '?' : '&') + params.join('&');   
		},
		elastic (t) {
			return Math.pow(2, -10 * t) * Math.sin((t - 0.075) * (2 * Math.PI) / 0.3) + 1;
		},
		delightFeature() {
			this.highlightFeatures.forEach((feature)=>{
				mapStyle.delightFeature(feature);
			})
			this.highlightFeatures = [];
		},
		highlightFeature(feature) {
			mapStyle.highlightFeature(feature);
			this.highlightFeatures.push(feature);
		},
		jump(x, y) {
			var that = this;
			this.view.animate({
				duration: 700,
				easing: that.elastic,
				center: [x,y]
			});
		}
	}
};
 
</script>
 
<style >
.map {
	height:100%;
	flex:10;
}
.column {
	flex:2;
	display: flex;
	flex-direction: column;
	padding:10px;
	background:#f7f8f9;
}
.list {
	display: flex;
	flex-direction: column;
	overflow-y: auto;
	flex: 1;
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