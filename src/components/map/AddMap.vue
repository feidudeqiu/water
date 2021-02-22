<template>
    <div class="flex-column-center">
        <el-card style="margin:20px;">
            <div style="display:flex;flex-direction:row;flex-wrap:wrap;padding-left:20px;padding-right:20px;">
                <div
                    class="map-item flex-row-center icon-brow"
                    style="background-repeat:no-repeat;background-size:cover;background-position:center;margin-right:20px;"
                    :style="{'background-image': 'url('+map.img+')'}"
                >
                    <span style="color: white;font-size: 20px;">{{map.name}}</span>
                </div>

                <el-form size="mini" ref="map" :model="map" label-width="100px" style="margin-top:10px;">
                    <el-form-item label="名称">
                        <el-input placeholder="请输入地图名称" v-model="map.name"></el-input>
                    </el-form-item>
                    <el-form-item label="地图源地址">
                        <el-input placeholder="http://{ip}/geoserver/{store}" v-model="map.url"></el-input>
                    </el-form-item>
                    <el-form-item label="地图图层名">
                        <el-input v-model="map.layer"></el-input>
                    </el-form-item>
                    <el-form-item label="坐标系">
                        <el-select v-model="map.projection" >
                            <el-option label="EPSG:4326" value="EPSG:4326"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="地图中心坐标">
                        <el-col :span="2" style="text-align:center">X:</el-col>
                        <el-col :span="10">
                            <el-input type="number" v-model="map.center[0]"></el-input>
                        </el-col>
                        <el-col :span="2" style="text-align:center">Y:</el-col>
                        <el-col :span="10">
                            <el-input type="number" v-model="map.center[1]"></el-input>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="地图缩放尺度">
                        <el-input-number v-model="map.zoom" :min="1" :max="10"></el-input-number>
                    </el-form-item>
                    <el-form-item label="地图封面地址">
                        <el-input v-model="map.img"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="addMap()">添加</el-button>
                        <el-button>取消</el-button>
                        <el-button @click="getMapInfo()">配置地图描述信息</el-button>
                    </el-form-item>
                </el-form>

                <div v-if="mapElements.length!=0"  style="display:flex;flex-direction:column;width:300px;margin-left:20px;">
                    <div>
                        <span class="text-info text-h6">地图描述信息名称</span>
                        <el-tooltip placement="top">
                            <div slot="content" v-html="'为地图描述信息重置名称，以后显示以重置名称为主。</br>同时勾选的描述项将为今后地图查询提供索引，未勾选的描述项将不做查询。'" ></div>
                            <i class="el-icon-info"></i>
                        </el-tooltip>
                    </div>
                    
                    <div v-for="element in mapElements" v-bind:key="element.name">
                        <el-checkbox v-model="element.choose"><span class="text-primary text-h6">{{element.name}}</span></el-checkbox>
                        <el-input placeholder="信息名重命名" maxlength="16" size="mini" v-if="element.choose" v-model="element.rename"></el-input>
                    </div>
                </div>
            </div>
        </el-card>
    </div>
</template>

<script>
import xmlToJSON from 'xmltojson';
export default {
    name: 'AddMap',
    data() {
        return {
            map: {
                img: "/static/img/background.jpg",
                name: "",
                url: "",
                projection: "EPSG:4326",
                zoom: "",
                layer: "",
                center:[0,0]
            },
            mapElements: [
                
            ]
            
        }
    },
    methods: {
        addMap() {
            let data = new URLSearchParams();
            data.append("img",this.map.img);
            data.append("name",this.map.name);
            data.append("url",this.map.url);
            data.append("projection",this.map.projection);
            data.append("zoom",this.map.zoom);
            data.append("center",JSON.stringify(this.map.center));
            data.append("layer",this.map.layer);
            var properties = [];
            this.mapElements.forEach(element => {
                if(element.choose) {
                    properties.push(element);
                }
            });
            data.append("properties",JSON.stringify(properties));
            var that = this;
            this.axios
                .post("/api/map/add-map/", data)
                .then(function (res) {
                    that.$router.push("/index");
                })
                .catch(function (err) {
                    that.$message.error(err.response.data.message);
                }) 
        },
        getMapInfo() {
			this.axios.get(this.map.url+"/wms"+"?service=wfs&version=2.0.0&request=DescribeFeatureType&typeNames="+
			this.map.layer)
			.then(res=>{
                var json = xmlToJSON.parseString(res.data);
                this.mapElements = [];
                for(let element of json.schema[0].complexType[0].complexContent[0].extension[0].sequence[0].element) {
                    this.mapElements.push({'name':element._attr.name._value,'choose':false,'rename':""});
                }
            })
            .catch(err=>{
                this.$message.error("无法获取描述信息，请输入正确的地址和图层");
            })
		}
    },
    created() {
        
    }
}
</script>

<style scoped>

.map-item {
  display: flex;
  flex-direction: column;
  width: 285px;
  height: 150px;
  border-radius: 10px;
}
</style>