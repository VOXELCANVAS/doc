var Voxengine = pc.createScript('voxengine');

Voxengine.attributes.add('chunkEntity', {
    type: 'entity', 
    title: 'Vox Chunk',
});

Voxengine.attributes.add("chunkSize", {
    type: "number",
    title: "Chunk Size",
});

Voxengine.prototype.initialize = function() {
    voxengine = this;
    
    this.chunkGrid = {};
    this.voxCount = 0;
};

// ---------------------------------------------
// utility methods
// ---------------------------------------------
Voxengine.prototype.convertToChunkIdx = function(v) {
    var x = Math.floor(v.x / this.chunkSize);
    var y = Math.floor(v.y / this.chunkSize);
    var z = Math.floor(v.z / this.chunkSize);
    return new pc.Vec3(x, y, z);
};

Voxengine.prototype.convertToChunkPosition = function(cIdx) {
    var p = new pc.Vec3();
    p.copy(cIdx);
    p.x = Math.round(p.x);
    p.y = Math.round(p.y);
    p.z = Math.round(p.z);
    p.scale(this.chunkSize);
    return p;
};

Voxengine.prototype.convertToGlobalVoxIdx = function(v) {
    var x = Math.floor(v.x) + 0.5;
    var y = Math.floor(v.y) + 0.5;
    var z = Math.floor(v.z) + 0.5;
    return new pc.Vec3(x, y, z);
};

Voxengine.prototype.getVoxIdxsInSpace = function(start, end) {
    var voxIdxs = [];
    var startIdx = this.convertToGlobalVoxIdx(start);
    var endIdx = this.convertToGlobalVoxIdx(end);
    var t = voxutil.minMaxVec3(startIdx, endIdx);
    var min = t.min;
    var max = t.max;
    
    for(var x = min.x; x <= max.x; ++x) {
        for(var y = min.y; y <= max.y; ++y) {
            for(var z = min.z; z <= max.z; ++z) {
                voxIdxs.push(new pc.Vec3(x, y, z));
            }
        }
    }
    return voxIdxs;
};

// ---------------------------------------------
// methods to edit vox
// ---------------------------------------------
Voxengine.prototype.putVoxWithVec3 = function(v, c) {
    var cIdx = this.convertToChunkIdx(v);
    if(!this.checkChunk(cIdx)) {
        this.createChunk(cIdx);
    }
    
    var chunk = this.getChunk(cIdx);
    var cPosition = this.convertToChunkPosition(cIdx);
    var p = new pc.Vec3(v.x, v.y, v.z);
    p.sub(cPosition);
    if(chunk.putVoxWithVec3(p, c)) {
        this.voxCount++;
        return true;
    } else {
        return false;
    }
};

Voxengine.prototype.removeVoxWithVec3 = function(v) {
    var cIdx = this.convertToChunkIdx(v);
    if(!this.checkChunk(cIdx)) {
        return false;
    }
    
    var chunk = this.getChunk(cIdx);
    var cPosition = this.convertToChunkPosition(cIdx);
    var p = new pc.Vec3(v.x, v.y, v.z);
    p.sub(cPosition);
    if(chunk.removeVoxWithVec3(p)) {
        this.voxCount--;
        return true;
    } else {
        return false;
    }
};

Voxengine.prototype.getVoxWithVec3 = function(v) {
    var cIdx = this.convertToChunkIdx(v);
    if(!this.checkChunk(cIdx)) {
        return null;
    }
    
    var chunk = this.getChunk(cIdx);
    var cPosition = this.convertToChunkPosition(cIdx);
    var p = new pc.Vec3(v.x, v.y, v.z);
    p.sub(cPosition);
    return chunk.getVoxWithVec3(p);
};

Voxengine.prototype.setVoxColorWithVec3 = function(v, color) {
    var cIdx = this.convertToChunkIdx(v);
    if(!this.checkChunk(cIdx)) {
        return false;
    }
    
    var chunk = this.getChunk(cIdx);
    var cPosition = this.convertToChunkPosition(cIdx);
    var p = new pc.Vec3(v.x, v.y, v.z);
    p.sub(cPosition);
    return chunk.setVoxColorWithVec3(p, color);
}; 

// ---------------------------------------------
// methods to edit vox
// ---------------------------------------------
Voxengine.prototype.setVoxesAtChunk = function(cIdx, visibles, colors) {
    var chunk = this.getChunk(cIdx);
    if(chunk === null) {
        chunk = this.createChunk(cIdx);
    }
    chunk.setVoxes(visibles, colors);
};


// ---------------------------------------------
// methods to manage chunks
// ---------------------------------------------
Voxengine.prototype.checkChunk = function(cIdx) {
    return this.chunkGrid[cIdx] !== void 0;
};

Voxengine.prototype.createChunk = function(cIdx) {
    if(!this.checkChunk(cIdx)) {
        // チャンクが未作成
        var newChunk = this.chunkEntity.clone();
        newChunk.enabled = true;
        this.entity.addChild(newChunk);
        var p = this.convertToChunkPosition(cIdx);
        var voxChunk = newChunk.script.voxchunk;
        voxChunk.initializeChunk(cIdx, this, this.chunkSize, p);
        
        this.chunkGrid[cIdx] = voxChunk;
        return voxChunk;
    }
    return null;
};

Voxengine.prototype.getChunk = function(cIdx) {
    return this.checkChunk(cIdx) ? this.chunkGrid[cIdx] : null;
};

Voxengine.prototype.haveChunkRefresh = function(cIdx) {
    // チャンクのタイミングで更新
    var chunk = this.getChunk(cIdx);
    if(chunk !== null) {
        chunk.dirty = true;
    }
};

Voxengine.prototype.makeChunkRefresh = function(cIdx) {
    // 強制的に更新
    var chunk = this.getChunk(cIdx);
    if(chunk !== null) {
        chunk.updateChunk();
    }
};

// ---------------------------------------------
// methods to inport/export a vox data
// ---------------------------------------------

// 津田フォーマットテキストを出力
Voxengine.prototype.exportOriginalFormat = function() {
    // format = (x,y,z,(r,g,b,a,)"a")*
    var exp = "";
    var cIdx;
    var ret;
    var color = null;
    for(cIdx in this.chunkGrid) {
        ret = this.chunkGrid[cIdx].exportOriginalFormat(color);
        exp += ret[0];
        color = ret[1];
        exp += "a";
    }
    return exp.slice(0, -1);
};

// 津田フォーマットテキストを入力
Voxengine.prototype.importOriginalFormat = function(imp) {
    // format = (x,y,z,(r,g,b,a,)"a")*
    var impVoxes = imp.split("a");
    var i;
    var position = new pc.Vec3(0, 0, 0);
    var color = new pc.Color(1, 1, 1, 1);
    for(i = 0; i < impVoxes.length; ++i){
        var elems = impVoxes[i].split(",");
        position.x = parseInt(elems[0]);
        position.y = parseInt(elems[1]);
        position.z = parseInt(elems[2]);
        if(elems.length > 3) {
            color.r = (parseFloat(elems[3]) / 255);
            color.g = (parseFloat(elems[4]) / 255);
            color.b = (parseFloat(elems[5]) / 255);
            color.a = parseFloat(elems[6]) > 0.99 ? 1 : 0.5;
        }
        this.putVoxWithVec3(position, color);
    }
};

// 擬似的なobjフォーマットテキストを出力
Voxengine.prototype.exportPesudeObjFormat = function() {
    var meshs = [];
    var colors = [];
    
    for(var cIdx in this.chunkGrid) {
        ret = this.chunkGrid[cIdx].exportPesudeObjFormat();
        Array.prototype.push.apply(meshs, ret.meshs);
        Array.prototype.push.apply(colors, ret.colors);
    }
    return {meshs:meshs, colors:colors};
};

// objフォーマットテキストを出力
Voxengine.prototype.exportObjFormat = function(name) {
    const meshData = this.exportMargedMeshData();
    const tMeshData = this.exportMargedTransparentMeshData();
    
    // ２つをマージ
    // オーバーフロー対策
    const push = Array.prototype.push;
    let p = [];   // push.apply(p, meshData.p); push.apply(p, tMeshData.p);
    for(let i = 0; i < meshData.p.length; ++i) p.push(meshData.p[i]);
    for(let i = 0; i < tMeshData.p.length; ++i) p.push(tMeshData.p[i]);
    let n = [];   // push.apply(n, meshData.n);  push.apply(n, tMeshData.n);
    for(let i = 0; i < meshData.n.length; ++i) n.push(meshData.n[i]);
    for(let i = 0; i < tMeshData.n.length; ++i) n.push(tMeshData.n[i]);
    let c = [];   // push.apply(c, meshData.c);  push.apply(c, tMeshData.c);
    for(let i = 0; i < meshData.c.length; ++i) c.push(meshData.c[i]);
    for(let i = 0; i < tMeshData.c.length; ++i) c.push(tMeshData.c[i]);
    
    // インデックスは透過側にオフセットを付ける
    const vOffset = meshData.p.length / 3;
    const idxs = meshData.i;        // 非透過メッシュインデックス
    const oIdxs = [];        // 透過メッシュインデックス。オフセット有り。
    for(let j = 0; j < tMeshData.i.length; ++j) {
        oIdxs.push(tMeshData.i[j] + vOffset);
    }
    
    // 頂点カラーをuv座標に変換
    const t = [];
    const tex = new Voxtexture(c);
    
    const color = [0, 0, 0, 0];
    for(let i = 0; i < c.length; i += 4) {
        color[0] = c[i];
        color[1] = c[i + 1];
        color[2] = c[i + 2];
        color[3] = c[i + 3];
        let uv = tex.color2UV(color);
        t.push(uv.x, uv.y);
    }
    
    // 透過/非透過の面情報を作成
    const faces = [];
    const tFaces = [];
    
    for(let i = 0; i < idxs.length; ++i) {
        faces.push([
            idxs[i] + 1,        // position
            idxs[i] + 1,        // texcoord
            idxs[i] + 1         // normal
        ]);
    }
    
    for(let i = 0; i < oIdxs.length; ++i) {
        tFaces.push([
            oIdxs[i] + 1,       // position
            oIdxs[i] + 1,       // texcoord
            oIdxs[i] + 1        // normal
        ]);
    }
    
    // objフォーマットテキストに変換
    const objText = this.makeObjFormatText(name, p, t, n, faces, tFaces);
    // mtlフォーマットテキスト出力
    const mtlText = this.makeMTLFormatText(name + ".png");
    // pngフォーマットテキスト出力
    const pngData = tex.exportPngFormat();
    
    // テスト
    // this.testDownload(name, objText, mtlText, pngData);
    
    return {obj:objText, mtl:mtlText, png:pngData};
};

Voxengine.prototype.testDownload = function(name, obj, mtl, png) {
    let dl = document.createElement("a");
    let blob;
    
    // obj
    blob = new Blob([obj], {type: "text/obj"});
    dl.download = name + ".obj";
    dl.href = window.URL.createObjectURL(blob);
    dl.click();
    
    // mtl
    blob = new Blob([mtl], {type: "text/mtl"});
    dl.download = name + ".mtl";
    dl.href = window.URL.createObjectURL(blob);
    dl.click();
    
    // png
    let buffer = new Uint8Array(png.length);
    // Uint8Array ビューに 1 バイトずつ値を埋める
    for (let i = 0; i < png.length; i++) {
      buffer[i] = png.charCodeAt(i);
    }
    // Uint8Array ビューのバッファーを抜き出し、それを元に Blob を作る
    blob = new Blob([buffer.buffer], {type: "image/png"});
    
    // 試しにpngをダウンロード
    dl.download = name + ".png";
    dl.href = window.URL.createObjectURL(blob);
    dl.click();
};

Voxengine.prototype.makeObjFormatText = function(name, p, t, n, f, tf) {
    let text = "";
    text = "# powerd by VOXELCANVAS\n";
    text += "# https://voxelcanvas.me\n\n";
    text += "# Author ryotaro,seiro\n";
    text += "# https://utautattaro.com/\n";
    text += "# https://seir.online/\n";
    text += "\n\n\n";
    text += "mtllib " + name + ".mtl\n";
    
    for(let i = 0; i < p.length; i += 3) {
        text += "v " + p[i] + " " + p[i + 1] + " " + p[i + 2] + "\n";
        
    }
    for(let i = 0; i < t.length; i += 2) {
        text += "vt " + t[i] + " " + t[i + 1] + "\n";
    }
    for(let i = 0; i < n.length; i += 3) {
        text += "vn " + n[i] + " " + n[i + 1] + " " + n[i + 2] + "\n";
    }

    // 非透過
    text += "\n\ng mesh\nusemtl mat0\n";
    for(let i = 0; i < f.length; i += 3) {
        let temp = f[i];
        text += "f " + temp[0] + "/" + temp[1] + "/" + temp[2];
        text += " ";
        
        temp = f[i + 1];
        text += temp[0] + "/" + temp[1] + "/" + temp[2];
        text += " ";
        
        temp = f[i + 2];
        text += temp[0] + "/" + temp[1] + "/" + temp[2] + "\n";
    }
    
    // 透過
    text += "\n\ng transparent \nusemtl mat1\n";
    for(let i = 0; i < tf.length; i += 3) {
        let temp = tf[i];
        text += "f " + temp[0] + "/" + temp[1] + "/" + temp[2];
        text += " ";
        
        temp = tf[i + 1];
        text += temp[0] + "/" + temp[1] + "/" + temp[2];
        text += " ";
        
        temp = tf[i + 2];
        text += temp[0] + "/" + temp[1] + "/" + temp[2] + "\n";
    }
    return text;
};

Voxengine.prototype.makeMTLFormatText = function(png) {
    let text = "";
    text += "# VOXELCANVAS @ voxelover\n\n";
    // 非透過
    text += "newmtl mat0\n";
    text += "illum 1\n";
    text += "Ka 0.000 0.000 0.000\n";
    text += "Kd 1.000 1.000 1.000\n";
    text += "Ks 0.000 0.000 0.000\n";
    text += "d 1.0\n";
    text += "map_Kd " + png + "\n\n";
    // 透過
    text += "newmtl mat1\n";
    text += "illum 1\n";
    text += "Ka 0.000 0.000 0.000\n";
    text += "Kd 1.000 1.000 1.000\n";
    text += "Ks 0.000 0.000 0.000\n";
    text += "d 0.5\n";
    text += "map_Kd " + png + "\n";
    
    return text;
};

// チャンク毎の非透過メッシュデータを統合したメッシュデータを出力
Voxengine.prototype.exportMargedMeshData = function() {
    let vOffset = 0;
    
    const positions = [];
    const normals = [];
    const colors = [];
    const indices = [];
    
    const push = Array.prototype.push;
    
    for(let cIdx in this.chunkGrid) {
        const meshData = this.chunkGrid[cIdx].exportMeshData();
        
        push.apply(positions, meshData.p);
        push.apply(normals, meshData.n);
        push.apply(colors, meshData.c);
        
        for(let j = 0; j < meshData.i.length; ++j) {
            indices.push(meshData.i[j] + vOffset);
        }
        
        vOffset += meshData.p.length / 3;
    }
    return {p:positions, n:normals, c:colors, i:indices};
};

// チャンク毎の透過メッシュデータを統合したメッシュデータを出力
Voxengine.prototype.exportMargedTransparentMeshData = function() {
    let vOffset = 0;
    
    const positions = [];
    const normals = [];
    const colors = [];
    const indices = [];
    
    const push = Array.prototype.push;
    
    for(let cIdx in this.chunkGrid) {
        const tMeshData = this.chunkGrid[cIdx].exportTransparentMeshData();
        
        push.apply(positions, tMeshData.p);
        push.apply(normals, tMeshData.n);
        push.apply(colors, tMeshData.c);
        
        for(let j = 0; j < tMeshData.i.length; ++j) {
            indices.push(tMeshData.i[j] + vOffset);
        }
        
        vOffset += tMeshData.p.length / 3;
    }
    return {p:positions, n:normals, c:colors, i:indices};
};