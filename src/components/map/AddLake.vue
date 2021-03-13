<template>
    <div>
        <div id="main" style="height:100%;width:100%;display:flex;">
            <div id="map" ref="rootmap" class="map"></div>
            <div id="column" class="column">
            </div>
        </div>
    </div>
</template>

<script>
import Map from './js/map'
import WKT from "terraformer-wkt-parser"
export default {
    name: 'AddLake',
	data(){
		return{
            map: null,
            view: null,
            ploygonLayers: {

            },
            popupLayer: null,
            rawLakes: [

            ]
        }
    },
    mounted() {
        this.view = Map.getViewByDemo();
        this.map = Map.initMap([Map.getVECLayer(),Map.getCVALayer()],this.view);

        this.ploygonLayers.lake = new Map.PolygonLayer();
        this.popupLayer = new Map.PopupLayer();
        var lake = this.ploygonLayers.lake;
        this.map.addLayer(lake.getLayer());
        this.map.addOverlay(this.popupLayer.getOverLay());

        var column = document.getElementById("column");
        const resizeObserver = new ResizeObserver(entries => {
            column.style.height = document.body.clientHeight-120+"px";
        });
        resizeObserver.observe(document.body);

        this.initLake();
    },
    methods: {
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
                console.info(err);
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
    }
}
</script>

<style scoped>
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
</style>