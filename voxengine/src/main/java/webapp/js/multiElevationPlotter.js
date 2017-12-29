var MultiElevationPlotter = pc.createScript('multiElevationPlotter');

MultiElevationPlotter.prototype.initialize = function() {
    var plotter = this.entity.root.findByName("LocationPlotter").script.elevationPlotter;
    
    let latlngs = [];
    // latlngs.push(new geoUtil.LatLng(27.987638, 86.923930));        // everest
    // latlngs.push(new geoUtil.LatLng(16.723286, 147.848063));       // mararia
    latlngs.push(new geoUtil.LatLng(35.622362, 139.553730));            // my house(登戸)
    latlngs.push(new geoUtil.LatLng(-29.438815, 153.370969));           // おーすとらぁりあ 
    // latlngs.push(new geoUtil.LatLng(35.705756, 139.581479));       //住みたいまち吉祥寺
    // latlngs.push(new geoUtil.LatLng(36.039142, 138.114182));       //なんとなく諏訪
    // latlngs.push(new geoUtil.LatLng(41.793747, 140.751896));       //からの函館
    latlngs.push(new geoUtil.LatLng(-25.3482961366005,131.0379157419216));      //からのオーストラリア　エアーズロック
    latlngs.push(new geoUtil.LatLng(-36.456974, 148.263500));           // コジオスコ
    latlngs.push(new geoUtil.LatLng(35.365025, 138.729823));       // mt.fuji
    latlngs.push(new geoUtil.LatLng(-3.067425, 37.355627));      //キリマンジャロ

    plotter.sequentiallyPlotCenter(latlngs, 50, 200, 13);
};