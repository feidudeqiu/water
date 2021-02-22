<template>
  <div id="app" style="margin-top:0px;height:100%;width:100%;display:flex;flex-direction:column;">
	<g-head></g-head>
    <router-view class="content" :key="$route.fullPath" />
	<g-foot></g-foot>
  </div>
</template>
<style scoped>
.content {
	display: flex;
	flex:1;
}
</style>
<script>
import Head from '@/components/global/Head.vue';
import Foot from '@/components/global/Foot.vue';
export default {
	name: "App",
	components: {
    	"g-head": Head,
    	"g-foot": Foot
	}
};
</script>

<style>
@import url("../static/css/display.css");
@import url("../static/css/common.css");
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
