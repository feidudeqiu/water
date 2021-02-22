<template>
    <div>
        <div class="content-block">
            <div class="flex-row-inline" style="margin-top:20px;margin-left: 20px">
                <i class="el-icon-place" style="font-size: 30px;"></i>
                <span class="text-h4 text-thick text-gray">地图</span>
                <i class="el-icon-circle-plus" @click="$router.push('/map/add-map')"  style="font-size: 30px;margin-left:10px;cursor:pointer;"></i>
            </div>
            <div class="flex-row-wrap" style="justify-content:space-around">
                <div
                class="flex-row-center"
                style="margin-left: 25px;margin-right:25px;margin-top: 20px;margin-bottom:20px;"
                v-for="map in mapList"
                v-bind:key="map.id"
                >
                <a :href="'/map?id='+map.id">
                    <div
                    class="map-item flex-row-center icon-brow"
                    style="background-repeat:no-repeat;background-size:cover;background-position:center"
                    :style="{'background-image': 'url('+map.img+')'}"
                    >
                    <span style="color: white;font-size: 20px;">{{map.name}}</span>
                    </div>
                </a>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Index',
    data() {
        return {
            mapList: []
        }
    },
    methods: {

    },
    created() {
        var that = this;
        this.axios
            .get("/api/map/get-maps")
            .then(function(res) {
                that.mapList = res.data.maps;
            })
            .catch(function(err) {
                that.$message.error(err.response.data.message);
            })
    }
}
</script>

<style>
.map-item {
  display: flex;
  flex-direction: column;
  width: 285px;
  height: 150px;
  border-radius: 10px;
}
.content-block {
    width:100%;
}
</style>