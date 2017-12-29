(function(global){
    var module = global.geoUtil = {};
    var polarRadius = 6356.752;         // 極半径(km)
    var equatorialRadius = 6378.137;    // 赤道半径(km)
    
    module.LatLng = function(lat, lng) {
        this.lat = lat;
        this.lng = lng;
        
    };
    
    module.calcLatUnit = function() {
        return polarRadius * 2 * Math.PI / 360;
    };
    
    var latUnitDis = module.calcLatUnit();     // 緯度1度あたりの距離
    
    module.calcEquatorialRadius = function(lat) {
        return Math.cos(lat / 180 * Math.PI) * equatorialRadius;
    };
    
    module.calcLngUnit = function(lat) {
        return this.calcEquatorialRadius(lat) * 2 * Math.PI / 360;
    };
    
    //latlngからdis(km単位)分移動したlatlngを求める
    module.calcLatLng = function(latlng, dis) {
        var difflat = dis.y / latUnitDis;
        // 緯度あたりの経度1度あたりの距離を求める
        var lngUnitDis = this.calcLngUnit(latlng.lat);
        var difflng = dis.x / lngUnitDis;
        return new this.LatLng(difflat + latlng.lat, difflng + latlng.lng);
    };
    
    module.calcMetersPerPixel = function(lat, zoom) {
        return 156543.03392 * Math.cos(lat * Math.PI / 180) / Math.pow(2, zoom);
    };
    
    module.calcKilometersPerPixel = function(lat, zoom) {
        return 156.54303392 * Math.cos(lat * Math.PI / 180) / Math.pow(2, zoom);
    };
})(this);