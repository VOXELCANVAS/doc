var ElevationPlotter = pc.createScript('elevationPlotter');
var ___self;

ElevationPlotter.prototype.header = "https://api.utautattaro.com/elevation.php?locations=";

// initialize code called once per entity
ElevationPlotter.prototype.initialize = function() {
    this.plotOffset = new pc.Vec3(0, 0, 0);
    
    var center;
    var plotHere = false;
    if(get_url_vars().location && get_url_vars().zoom){
        var location = get_url_vars().location;
        if(location.indexOf(",") != -1){
            //座標データ
            var lat = parseFloat(location.split(",")[0]);
            var lang = parseFloat(location.split(",")[1]);
            center = new geoUtil.LatLng(lat,lang);
        }else if(location == "here"){
            //hereに移動
            plotHere = true;
        }else{
            switch(location){
                case "MtFuji":
                    center = new geoUtil.LatLng(35.365025, 138.729823);
                    break;
                case "皇居":
                    center = new geoUtil.LatLng(35.684579, 139.754389);
                    break;
                case "daisen":
                    center = new geoUtil.LatLng(34.563933, 135.487311);
                    break;
                case "mariana":
                    center = new geoUtil.LatLng(16.723286, 147.848063);
                    break;
            }
        }
        if(location != "here"){
            this.plotCenter(center,100, 200, parseInt(get_url_vars().zoom,10));
        }
    }
    
    if(plotHere){
        var ___self = this;
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
            //ここは非同期
            var center = new geoUtil.LatLng(position.coords.latitude, position.coords.longitude);
            ___self.plotCenter(center, 100, 200, parseInt(get_url_vars().zoom,10));
        });
        }
    }
    

//    var koko = false;
//     if(koko) {
//         var ___self = this;
//         if (navigator.geolocation) {
//             navigator.geolocation.getCurrentPosition(function (position) {
//                 //ここは非同期
//                 var center = new geoUtil.LatLng(position.coords.latitude, position.coords.longitude);
//                 ___self.plotCenter(center, 100, 200, 14);
//             });
//         }
//     } else {
//         // ふじやーま
//         //var center = new geoUtil.LatLng(35.365025, 138.729823);
//         // kohu-n
//         // var center = new geoUtil.LatLng(34.563933, 135.487311);
//         // こうきょ
//         // var center = new geoUtil.LatLng(35.684579, 139.754389);
//         // まりあな海溝
//         // var center = new geoUtil.LatLng(16.723286, 147.848063);
        
//     }
};

ElevationPlotter.prototype.plotCenter = function(center, size, imgSize, zoom, callback) {
    this.getColorMap(center, imgSize, imgSize, zoom, function(colorMap, cInfo) {
        var range = geoUtil.calcKilometersPerPixel(center.lat, cInfo.zoom) * cInfo.width;
        cInfo.plotter.getElevationMap(center, range, 20, function(elevationMap, eInfo) {
            var meterPerVoxel = size / (eInfo.range * 1000);
            /*
            // サンプリング地点の色を変える
            var samplePerPixel = colorMap.width / (eInfo.resolution);
            for(var z = 0; z <= eInfo.resolution - 1; ++z) {
                for(var x = 0; x <= eInfo.resolution - 1; ++x) {
                    colorMap.set(
                        Math.floor(x * samplePerPixel),
                        Math.floor(z * samplePerPixel),
                        [0.0, 0.0, 1.0, 1.0]
                    );
                }
            }
            */
            cInfo.plotter.plotTerrain(size, size, meterPerVoxel, elevationMap, colorMap);
            callback();
        });
    });
};

// テスト機能
ElevationPlotter.prototype.sequentiallyPlotCenter = function(centers, size, imgSize, zoom) {
    let count = 0;
    let self = this;
    (function() {
        if(count < centers.length) {
            if(self.plotOffset === void 0) {
                self.plotOffset = new pc.Vec3(0, 0, 0);
            }
            self.plotOffset.x = count * size;
            self.plotCenter(centers[count], size, imgSize, zoom, arguments.callee);
            count++;
        }
    })();
};

ElevationPlotter.prototype.plotTerrain = function(width, depth, elevationScale, elevationMap, colorMap) {
    var nx, nz, elevation, color;
    for(var z = 0; z <= depth; ++z) {
        nz = z / depth;
        for(var x = 0; x <= width; ++x) {
            nx = x / width;
            elevation = elevationMap.get(nx, nz);
            color = new pc.Color(colorMap.get(nx, nz));
            this.plotColumn(x + this.plotOffset.x, z + this.plotOffset.z, elevation * elevationScale, color ,width);
        }
    }
};

ElevationPlotter.prototype.plotColumn = function(x, z, elevation, surfaceColor  , size) {
    var color;
    var localHeight = 0;
    var numOfPlot = elevation > 10 ? elevation : 10;
    for(var i = 0; i < numOfPlot; ++i) {
        var t = elevation - i;
        if(i === 0) {
            color = surfaceColor;
        } else if(i < 2) {
            color = new pc.Color(0.3412 ,0.6235 ,0.2196, 1.0);
        } else if(i < 5){
            color = new pc.Color(0.6235 ,0.4510 ,0.2196, 1.0);
        } else {
            color = new pc.Color(0.8000 ,0.7765 ,0.6784, 1.0);
        }
        voxengine.putVoxWithVec3(new pc.Vec3(x - size/2, t, z - size / 2), color);
    }
};

ElevationPlotter.prototype.createMessage = function(from, to, resolution) {
    var latlngs = [];
    var t = to.sub(from).scale(1 / resolution);
    
    for(var lat = 0; lat <= resolution; ++lat) {
        for(var lng = 0; lng <= resolution; ++lng) {
            latlngs.push({lng:(from.x + t.x * lng), lat:(from.y + t.y * lat)});
        }
    }
    var encoded = polylineUtil.encode(latlngs, 5);
    return this.header + encoded;
};

ElevationPlotter.prototype.getElevationMap = function(center, range, resolution, callback) {
    var half = range * 0.5;
    var northWest = geoUtil.calcLatLng(center, new pc.Vec2(-half, half));
    var southEast = geoUtil.calcLatLng(center, new pc.Vec2(half, -half));
    
    var from = new pc.Vec2(northWest.lng, northWest.lat);
    var to = new pc.Vec2(southEast.lng, southEast.lat);
    
    var message = this.createMessage(from, to, resolution);
    
    $.ajax({
        url: message,
        dataType: 'JSON',
        type: 'GET',
        info: {
            plotter:this,
            center:center,
            range:range,
            resolution:resolution
        },
        success: function(j_data) {
            var elevationData = [];
            for(var i = 0; i < j_data.results.length; ++i) {
                elevationData.push(j_data.results[i].elevation);
            }
            var elevationMap = new Map2D(resolution + 1, resolution + 1, elevationData, 1);
            callback(elevationMap, this.info);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log(XMLHttpRequest);
        }
    });
};

ElevationPlotter.prototype.getColorMap = function(center, width, height, zoom, callback) {
    var canvas_hidden = document.createElement("canvas");
    var colors = [];
    var margin = 20;
    canvas_hidden.id = 'canvas_hidden';
    canvas_hidden.width = width;
    canvas_hidden.height = height + margin;
    canvas_hidden.style.cssText="z-index:999";
    ctx_hidden = canvas_hidden.getContext('2d');

    var adjustW = width + margin * 2;
    var adjustH = height + margin * 2;
    
    var img = new Image();
    var issatellite = "";
    if(get_url_vars().image == "photo"){
        issatellite = "&maptype=satellite";
    }
    img.src = "https://maps.googleapis.com/maps/api/staticmap?size="+adjustH+"x"+adjustH+"&zoom=" + zoom + "&center="+ center.lat +","+ center.lng + issatellite + "&format=png&style=element:labels|visibility:off&style=feature:administrative.land_parcel|visibility:off&style=feature:administrative.neighborhood|visibility:off&style=feature:water|color:0x92B8F4&style=feature:administrative.locality|visibility:off&style=feature:administrative.province|visibility:off&style=feature:poi.business|visibility:off&style=feature:poi.park|element:labels.text|visibility:off&style=feature:road.arterial|visibility:off&style=feature:road.local|visibility:off&style=feature:transit.line|color:0xA1A1A1&key=AIzaSyDMSV1OYr27VJT6wSEAEr_NqJYmhPbMpt0";
    img.setAttribute('crossOrigin', '');
    var ___self = this;

    img.onload = function() {
        // 画像の画素値を取ってくるためには一旦canvasを経由するしかないらしい
        var canvas = document.createElement("canvas");
        canvas.setAttribute("width", adjustW);
        canvas.setAttribute("height", adjustH);
        var context = canvas.getContext("2d");
        context.drawImage(this, 0, 0);
        var imgData = context.getImageData(margin, margin, width, height);
        /*
        ctx_hidden.width = adjustW;
        ctx_hidden.height = adjustH;
        ctx_hidden.drawImage(img, 0, 0, adjustW, adjustH);
        var imgData = ctx_hidden.getImageData(margin, margin, width, height);
        */
        var data = imgData.data;
        for(var i = 0; i < data.length; ++i) {
            colors.push(data[i] / 255.0);
        }
        var colorMap = new Map2D(width, height, colors, 4);
        callback(colorMap, {
            plotter:___self,
            center:center,
            width:width,
            height:height,
            zoom:zoom
        });
    };
};