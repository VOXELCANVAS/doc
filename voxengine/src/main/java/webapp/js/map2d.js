var Map2D = function Map2D(width, height, data, stride) {
    this.width = width;
    this.height = height;
    this.stride = stride;
    this.wUnit = 1 / width;
    this.hUnit = 1 / height;
    this.oneMinusWUnit = 1 - this.wUnit;
    this.oneMinusHUnit = 1 - this.hUnit;
    
    this.data = [];
    var pack = [];
    for(var i = 0; i < data.length; i += stride) {
        for(var j = 0; j < stride; ++j) {
            pack.push(data[i + j]);
        }
        this.data.push(pack);
        pack = [];
    }
};

// xとyは0-1で正規化しておく
Map2D.prototype.get = function(x, y) {
    var tx, ty, rx, ry, dx, dy;
    if(x >= this.oneMinusWUnit) {
        tx = this.width - 2;
        rx = Math.floor(tx);
        dx = x * this.width - rx;
    } else {
        if(x < 0) {
            x = 0;
        }
        tx = x * this.width;
        rx = Math.floor(tx);
        dx = tx - rx;
    }
    if(y >= this.oneMinusHUnit) {
        ty = this.height - 2;
        ry = Math.floor(ty);
        dy = y * this.height - ry;
    } else {
        if(y < 0) {
            y = 0;
        }
        ty = y * this.height;
        ry = Math.floor(ty);
        dy = ty - ry;
    }
    
    var idx = ry * this.width + rx;
    return this.squareInterporate(dx, dy, this.data[idx], this.data[idx + 1], this.data[idx + this.width], this.data[idx + this.width + 1], this.stride);
};

Map2D.prototype.set = function(x, y, value) {
    this.data[x * this.width + y] = value;
};

Map2D.prototype.squareInterporate = function(x, y, d1, d2, d3, d4, stride) {
    var pack = [];
    for(var i = 0; i < stride; ++i) {
        var d21 = d2[i] - d1[i];
        var d43 = d4[i] - d3[i];
        var v21 = (d21 * x) + d1[i];
        var v43 = (d43 * x) + d3[i];
        var d4321 = v43 - v21;
        pack[i] = d4321 * y + v21;
    }
    return pack;
};