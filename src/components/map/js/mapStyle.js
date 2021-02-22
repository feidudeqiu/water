import {Stroke, Style, Circle, Fill} from "ol/style";
var hightStyle = new Style({
    //填充色
//    fill: new Fill({
//        color: 'rgba(255, 255, 255, 0.2)'
//    }),
   //边线颜色
   stroke: new Stroke({
       color: '#FF0000',
       width: 5
   })
})
var delightStyle =  new Style({
    stroke: new Stroke({
      color: '#409EFF',
      width: 1,
    })
    // fill: new Fill({
    //   color: 'rgba(255,0,0,0.1)',
    // }),
})
function highlightFeature(feature) {
    feature.setStyle(hightStyle);
}
function delightFeature(feature) {
    feature.setStyle(delightStyle);
}
export default{
    hightStyle,
    delightStyle,
    highlightFeature,
    delightFeature
}