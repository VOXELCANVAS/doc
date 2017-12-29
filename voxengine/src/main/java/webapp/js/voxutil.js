var voxutil = {};

voxutil.rgbToHex = function(rgb) {
    return "#" + 
        (rgb.r * 255).toString(16) + 
        (rgb.g * 255).toString(16) + 
        (rgb.b * 255).toString(16);
};

voxutil.hexToRGB = function(hex) {
    return new pc.Color(
        parseInt(hex.substring(1,2), 16) / 255,
        parseInt(hex.substring(3,4), 16) / 255,
        parseInt(hex.substring(5,6), 16) / 255
    );
};

voxutil.equalsColor = function(a, b) {
    return (a.r === b.r && a.g === b.g && a.b === b.b && a.a === b.a);
};

voxutil.minMaxFloat = function(a, b) {
    if(a < b) {
        return {min: a, max: b};
    } else {
        return {max: a, min: b};
    }
};

voxutil.minMaxVec2 = function(a, b) {
    var min = new pc.Vec3();
    var max = new pc.Vec3();
    t = voxutil.minMaxFloat(a.x, b.x);
    min.x = t.min;
    max.x = t.max;
    t = voxutil.minMaxFloat(a.y, b.y);
    min.y = t.min;
    max.y = t.max;
    return {min:min, max:max};
};

voxutil.minMaxVec3 = function(a, b) {
    var min = new pc.Vec3();
    var max = new pc.Vec3();
    t = voxutil.minMaxFloat(a.x, b.x);
    min.x = t.min;
    max.x = t.max;
    t = voxutil.minMaxFloat(a.y, b.y);
    min.y = t.min;
    max.y = t.max;
    t = voxutil.minMaxFloat(a.z, b.z);
    min.z = t.min;
    max.z = t.max;
    return {min:min, max:max};
};

voxutil.floorVec2 = function(v) {
    v.x = Math.floor(v.x);
    v.y = Math.floor(v.y);
    return v;
};

voxutil.absVec3 = function(v) {
    var t = new pc.Vec3();
    t.x = Math.abs(v.x);
    t.y = Math.abs(v.y);
    t.z = Math.abs(v.z);
    return t;
};

voxutil.drawWireFrameBox = function(app, pos, color) {
    app.renderLine(new pc.Vec3(pos.x+0.5,pos.y+0.5,pos.z+0.5),new pc.Vec3(pos.x-0.5,pos.y+0.5,pos.z+0.5), color);
    app.renderLine(new pc.Vec3(pos.x+0.5,pos.y+0.5,pos.z+0.5),new pc.Vec3(pos.x+0.5,pos.y+0.5,pos.z-0.5), color);
    app.renderLine(new pc.Vec3(pos.x+0.5,pos.y+0.5,pos.z+0.5),new pc.Vec3(pos.x+0.5,pos.y-0.5,pos.z+0.5), color);
    app.renderLine(new pc.Vec3(pos.x+0.5,pos.y-0.5,pos.z-0.5),new pc.Vec3(pos.x+0.5,pos.y-0.5,pos.z+0.5), color);
    app.renderLine(new pc.Vec3(pos.x+0.5,pos.y-0.5,pos.z-0.5),new pc.Vec3(pos.x+0.5,pos.y+0.5,pos.z-0.5), color);
    app.renderLine(new pc.Vec3(pos.x+0.5,pos.y-0.5,pos.z-0.5),new pc.Vec3(pos.x-0.5,pos.y-0.5,pos.z-0.5), color);
    app.renderLine(new pc.Vec3(pos.x-0.5,pos.y-0.5,pos.z+0.5),new pc.Vec3(pos.x+0.5,pos.y-0.5,pos.z+0.5), color);
    app.renderLine(new pc.Vec3(pos.x-0.5,pos.y-0.5,pos.z+0.5),new pc.Vec3(pos.x-0.5,pos.y-0.5,pos.z-0.5), color);
    app.renderLine(new pc.Vec3(pos.x-0.5,pos.y-0.5,pos.z+0.5),new pc.Vec3(pos.x-0.5,pos.y+0.5,pos.z+0.5), color);
    app.renderLine(new pc.Vec3(pos.x-0.5,pos.y+0.5,pos.z-0.5),new pc.Vec3(pos.x+0.5,pos.y+0.5,pos.z-0.5), color);
    app.renderLine(new pc.Vec3(pos.x-0.5,pos.y+0.5,pos.z-0.5),new pc.Vec3(pos.x-0.5,pos.y+0.5,pos.z+0.5), color);
    app.renderLine(new pc.Vec3(pos.x-0.5,pos.y+0.5,pos.z-0.5),new pc.Vec3(pos.x-0.5,pos.y-0.5,pos.z-0.5), color);
    app.renderLine(new pc.Vec3(pos.x+0.5,pos.y+0.5,pos.z+0.5),new pc.Vec3(pos.x+0.5,pos.y-0.5,pos.z-0.5), color);
    app.renderLine(new pc.Vec3(pos.x+0.5,pos.y+0.5,pos.z-0.5),new pc.Vec3(pos.x-0.5,pos.y-0.5,pos.z-0.5), color);
    app.renderLine(new pc.Vec3(pos.x-0.5,pos.y+0.5,pos.z-0.5),new pc.Vec3(pos.x-0.5,pos.y-0.5,pos.z+0.5), color);
    app.renderLine(new pc.Vec3(pos.x-0.5,pos.y+0.5,pos.z+0.5),new pc.Vec3(pos.x+0.5,pos.y-0.5,pos.z+0.5), color);
    app.renderLine(new pc.Vec3(pos.x+0.5,pos.y-0.5,pos.z-0.5),new pc.Vec3(pos.x-0.5,pos.y-0.5,pos.z+0.5), color);
    app.renderLine(new pc.Vec3(pos.x-0.5,pos.y+0.5,pos.z+0.5),new pc.Vec3(pos.x+0.5,pos.y+0.5,pos.z-0.5), color);
    app.renderLine(new pc.Vec3(pos.x+0.5,pos.y+0.5,pos.z-0.5),new pc.Vec3(pos.x+0.5,pos.y-0.5,pos.z+0.5), color);
    app.renderLine(new pc.Vec3(pos.x-0.5,pos.y+0.5,pos.z-0.5),new pc.Vec3(pos.x+0.5,pos.y-0.5,pos.z-0.5), color);
    app.renderLine(new pc.Vec3(pos.x-0.5,pos.y+0.5,pos.z+0.5),new pc.Vec3(pos.x-0.5,pos.y-0.5,pos.z-0.5), color);
    app.renderLine(new pc.Vec3(pos.x+0.5,pos.y+0.5,pos.z+0.5),new pc.Vec3(pos.x-0.5,pos.y-0.5,pos.z+0.5), color);
    app.renderLine(new pc.Vec3(pos.x+0.5,pos.y-0.5,pos.z+0.5),new pc.Vec3(pos.x-0.5,pos.y-0.5,pos.z-0.5), color);
    app.renderLine(new pc.Vec3(pos.x+0.5,pos.y+0.5,pos.z+0.5),new pc.Vec3(pos.x-0.5,pos.y+0.5,pos.z-0.5), color);
};

// cloneメソッドが実装されてるオブジェクトのみ
voxutil.cloneArray = function(array) {
    var dst = [];
    for(var i = 0; i < array.length; ++i) {
        dst.push(array[i].clone());
    }
    return dst;
};

// 平面補間する。正式名称は知らない -> 要素内補間って言うらしい
voxutil.planeLerp = function(p1, xlen, ylen, v1, v2, v3, v4, x, y) {
    var tx = x / xlen;
    var d12 = v2 - v1;
    var v12 = (d12 * tx) + v1;
    var d34 = v4 - v3;
    var v34 = (d34 * tx) + v3;
    
    var ty = y / ylen;
    var d1234 = v34 - v12;
    var v1234 = (d1234 * ty) + v12;
    return v1234;
};

voxutil.makePng = function(imgData) {
    let data = new Uint8Array(128); //長さは適当
    data[0] = 0x89;
    data[1] = 0x50;
    data[2] = 0x4e;
    data[3] = 0x47;
    data[4] = 0x0d;
    data[5] = 0x0a;
    data[6] = 0x1a;
    data[7] = 0x0a;
    
    // 最終的にこれでテキストに変換
    String.fromCharCode.apply(null, ARRAY);
};