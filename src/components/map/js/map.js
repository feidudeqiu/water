import 'ol/ol.css';
import 'ol-contextmenu'
import 'ol-contextmenu/dist/ol-contextmenu.css'
import {Map, View} from 'ol';
import Feature from 'ol/Feature';
import {Tile as TileLayer, Image as ImageLayer, Vector as VectorLayer} from 'ol/layer';
import ImageWMS from 'ol/source/ImageWMS';
import GeoJSON from 'ol/format/GeoJSON';
import {boundingExtent,getCenter} from 'ol/extent';
import WKT from 'ol/format/WKT';
import VectorImageLayer from 'ol/layer/VectorImage';
import Point from 'ol/geom/Point';
import Polygon from 'ol/geom/Polygon';
import LineString from 'ol/geom/LineString';
import {Icon, Style, Text, Fill, Circle, Stroke} from 'ol/style';
import VectorSource from 'ol/source/Vector';
import ContextMenu from 'ol-contextmenu'
import Overlay from 'ol/Overlay';
import domtoimage from 'dom-to-image';
import * as olProj from 'ol/proj';
import TileImage from 'ol/source/TileImage';
import TileGrid from 'ol/tilegrid/TileGrid';
import { v4 as uuidv4 } from 'uuid';
import {fromLonLat} from 'ol/proj'
import TianDiTu from './tianditu'
import { register } from 'ol/proj/proj4';
import proj4 from 'proj4';
proj4.defs("EPSG:4490", "GEOGCS[\"China Geodetic Coordinate System 2000\",DATUM[\"China_2000\",SPHEROID[\"CGCS2000\",6378137,298.257222101,AUTHORITY[\"EPSG\",\"1024\"]],AUTHORITY[\"EPSG\",\"1043\"]],PRIMEM[\"Greenwich\",0,AUTHORITY[\"EPSG\",\"8901\"]],UNIT[\"degree\",0.0174532925199433,AUTHORITY[\"EPSG\",\"9122\"]],AUTHORITY[\"EPSG\",\"4490\"]]");
register(proj4);
var data = {
    map: null,
    contextmenu: null
}
function initContextMenu() {
    data.contextmenu = new ContextMenu({
        width: 180,
        items: []
    });
    if(data.map === null) {
        throw "map is null!";
    }
    data.map.addControl(data.contextmenu);
    return data.contextmenu;
}
function getVECLayer() {
    var tdt = TianDiTu.getTianditu({
        type: '矢量底图',
        proj: '经纬度投影',
        key: '0541fab40010e8246749be81a4a8daf2'
    });
    return tdt;
}
function getCVALayer() {
    var tdt = TianDiTu.getTianditu({
        type: '矢量注记',
        proj: '经纬度投影',
        key: '0541fab40010e8246749be81a4a8daf2'
    });
    return tdt;
}
function getViewByDemo() {
    return new View({
        center: [11580353.774161404,3588672.3694916293],
        zoom: 18
    })
}
class MarkerLayer {
    constructor(types) {
        this.types = types;
        this.vectorSource = new VectorSource({
            features: []
        });
        this.vectorLayer = new VectorLayer({
            source: this.vectorSource
        });
    }
    getLayer() {
        return this.vectorLayer;
    }
    removeMarker(id) {
        const feature = this.vectorSource.getFeatureById(id);
        if(feature) {
            this.vectorSource.removeFeature(feature);
        }
    }
    addMarker(coordinate,data,props,type,img) {
        var featureData = {
            geometry: new Point(coordinate),
            id: props.id,
            custom: {

            },
            type: type
        }
        for(let key in data) {
            featureData.custom[key] = data[key];
        }
        var marker = new Feature(featureData);
        marker.setId(props.id);
        var styleData = {
            image: new Icon({
                anchor: [0.5, 1],
                crossOrigin: 'anonymous',
                src: img
            }),
        }
        if(props.name) {
            styleData.text = new Text({
                text:  props.name
            })
        }
        var iconStyle = new Style(styleData);
        marker.setStyle(iconStyle);
        this.vectorSource.addFeature(marker);
    }
}
class PopupLayer {
    constructor() {
        var that = this;
        /**
         * Elements that make up the popup.
         */
        /**
         * <div id="popup" class="ol-popup">
                <a href="#" id="popup-closer" class="ol-popup-closer"></a>
                <div id="popup-content"></div>
		    </div>
         */
        this.container = document.createElement("div");
        this.container.setAttribute("class","ol-popup");

        this.closer = document.createElement("a");
        this.closer.setAttribute("class","ol-popup-closer");
        this.closer.setAttribute("href","#");

        this.content = document.createElement("div");
        
        this.container.appendChild(this.closer);
        this.container.appendChild(this.content);
        
        this.overlay = new Overlay({
            element: this.container,
            autoPan: true,
            autoPanAnimation: {
               duration: 250,
            },
        });

        this.closer.onclick = function () {
            that.overlay.setPosition(undefined);
            closer.blur();
            return false;
        };
    }
    getOverLay() {
        return this.overlay
    }
    setPosition(coordinate) {
        this.overlay.setPosition(coordinate);
    }
    showInfo(ht,coordinate) {
        this.content.innerHTML = ht;
        this.setPosition(coordinate);
    }
    getContainer() {
        return this.container;
    }
}
class LineLayer {
    constructor(resolution) {
        this.vectorSource = new VectorSource({
            features: []
        });
        this.vectorLayer = new VectorLayer({
            source: this.vectorSource,
        });
        this.resolution = resolution;
    }
    getLayer() {
        return this.vectorLayer;
    }
    addLine(coordinates,props,type) {
        const geometry = new LineString(coordinates);
        var featureData = {
            geometry: geometry,
            id: props.id,
            type: type
        }
        var line = new Feature(featureData);
        line.setId(props.id);
        line.setStyle(this.getStyle(this.resolution,geometry));
        this.vectorSource.addFeature(line);
    }
    removeLine(id) {
        const feature = this.vectorSource.getFeatureById(id);
        if(feature) {
            this.vectorSource.removeFeature(feature);
        }
    }
    getStyle(resolution,geometry) {
        // var length = geometry.getLength();//获取线段长度
        // var radio = (50 * resolution) / length;
        // var dradio = 1;//投影坐标系，如3857等，在EPSG:4326下可以设置dradio=10000
        var styles = [
            new Style({
                stroke: new Stroke({
                    color: "red",
                    width: 3,
                })
            })
        ];
        // for (var i = 0; i <= 1; i += radio) {
        //     var arrowLocation = geometry.getCoordinateAt(i);
        //     geometry.forEachSegment(function (start, end) {
        //         if (start[0] == end[0] || start[1] == end[1]) return;
        //         var dx1 = end[0] - arrowLocation[0];
        //         var dy1 = end[1] - arrowLocation[1];
        //         var dx2 = arrowLocation[0] - start[0];
        //         var dy2 = arrowLocation[1] - start[1];
        //         if (dx1 != dx2 && dy1 != dy2) {
        //             if (Math.abs(dradio * dx1 * dy2 - dradio * dx2 * dy1) < 0.001) {
        //                 var dx = end[0] - start[0];
        //                 var dy = end[1] - start[1];
        //                 var rotation = Math.atan2(dy, dx);
        //                 styles.push(new Style({
        //                     geometry: new Point(arrowLocation),
        //                     image: new Icon({
        //                         src: '/static/img/arrow.png',
        //                         anchor: [0.75, 0.5],
        //                         rotateWithView: false,
        //                         rotation: -rotation
        //                     })
        //                 }));
        //             }
        //         } 
        //     });
        // }
        return styles;
    }
}
class PolygonLayer {
    constructor() {
        this.vectorSource = new VectorSource({
            features: []
        });
        this.vectorLayer = new VectorLayer({
            source: this.vectorSource,
        });
    }
    addPloygon(coordinates,data,props,type) {
        var featureData = {
            geometry: new Polygon(coordinates),
            id: props.id,
            type: type,
            custom: {

            }
        }
        var styleData = {
            fill: new Fill({
                color: 'rgba(255, 255, 255, 0.1)'
            }),
            stroke: new Stroke({
                color: 'red',
                width: 2
            }),
            image: new Circle({
                radius: 10,
                fill: new Fill({
                    color: '#ffcc33'
                })
            })
        }
        if(props.name) {
            styleData.text = new Text({
                text:  props.name,
                font: "20px Arial"
            })
        }
        for(let key in data) {
            featureData.custom[key] = data[key];
        }
        var ploygon = new Feature(featureData);
        ploygon.setId(props.id);
        var iconStyle = new Style(styleData);
        ploygon.setStyle(iconStyle);
        this.vectorSource.addFeature(ploygon);
    }
    removePloygon(id) {
        const feature = this.vectorSource.getFeatureById(id);
        if(feature) {
            this.vectorSource.removeFeature(feature);
        }
    }
    getPloygon(id) {
        return this.vectorSource.getFeatureById(id);
    }
    getLayer() {
        return this.vectorLayer;
    }
    getCenterById(id) {
        return this.getCenter(this.getPloygon(id));
    }
    getCenter(feature) {
        var extent = boundingExtent(feature.getGeometry().getCoordinates()[0]); //获取一个坐标数组的边界，格式为[minx,miny,maxx,maxy]
        var center = getCenter(extent);   //获取边界区域的中心位置
        return center;
    }
}
function initMap(layers, view) {
    data.map = new Map({
        target: 'map',
        layers: layers,
        view: view
    })
    return data.map;
}
function getWKTString(feature) {
    return  (new WKT()).writeFeature(feature);
}
export default{
    initMap,
    initContextMenu,
    getViewByDemo,
    MarkerLayer,
    PolygonLayer,
    LineLayer,
    getVECLayer,
    getCVALayer,
    PopupLayer,
    getWKTString
}