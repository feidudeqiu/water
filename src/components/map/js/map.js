import 'ol/ol.css';
import 'ol-contextmenu'
import 'ol-contextmenu/dist/ol-contextmenu.css'
import {Map, View} from 'ol';
import Feature from 'ol/Feature';
import {Tile as TileLayer, Image as ImageLayer, Vector as VectorLayer} from 'ol/layer';
import ImageWMS from 'ol/source/ImageWMS';
import GeoJSON from 'ol/format/GeoJSON';
import WKT from 'ol/format/WKT';
import VectorImageLayer from 'ol/layer/VectorImage';
import Point from 'ol/geom/Point';
import Polygon from 'ol/geom/Polygon';
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
        center: [11597489.008261489,3586607.7438052753],
        zoom: 16
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
        this.vectorSource.removeFeature(this.vectorSource.getFeatureById(id));
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
class PolygonLayer {
    constructor() {
        this.vectorSource = new VectorSource({
            features: []
        });
        this.vectorLayer = new VectorLayer({
            source: this.vectorSource,
            style: new Style({
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
            })
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
        for(let key in data) {
            featureData.custom[key] = data[key];
        }
        var ploygon = new Feature(featureData);
        ploygon.setId(props.id);
        this.vectorSource.addFeature(ploygon);
    }
    removePloygon(id) {
        this.vectorSource.removeFeature(this.vectorSource.getFeatureById(id));
    }
    getLayer() {
        return this.vectorLayer;
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
    getVECLayer,
    getCVALayer,
    PopupLayer,
    getWKTString
}