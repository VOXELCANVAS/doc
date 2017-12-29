var Voxchunk = pc.createScript("voxchunk");

Voxchunk.attributes.add("material", {
    type: "asset",
    assetType: "material"
});

Voxchunk.attributes.add("transparentMaterial", {
    type: "asset",
    assetType: "material"
});

// ---------------------------------------------
// prototype value
// --------------------------------------------
Voxchunk.prototype.neighborIndices = [
    new pc.Vec3(1, 0, 0),
    new pc.Vec3(-1, 0, 0),
    new pc.Vec3(0, 1, 0),
    new pc.Vec3(0, -1, 0),
    new pc.Vec3(0, 0, 1),
    new pc.Vec3(0, 0, -1),
];

Voxchunk.prototype.neighborDirections = [
    new pc.Vec3(0.5, 0, 0),
    new pc.Vec3(-0.5, 0, 0),
    new pc.Vec3(0, 0.5, 0),
    new pc.Vec3(0, -0.5, 0),
    new pc.Vec3(0, 0, 0.5),
    new pc.Vec3(0, 0, -0.5)
];


// ---------------------------------------------
// playcanvas events
// ---------------------------------------------
Voxchunk.prototype.update = function(dt) {
    if(this.dirty) {
        this.updateChunk();
    }
};

Voxchunk.prototype.onMouseDown = function(event) {
    if(event.button === pc.MOUSEBUTTON_LEFT) {
        this.showVox(
            pc.math.random(0, this.size),
            pc.math.random(0, this.size),
            pc.math.random(0, this.size)
        );
    }
};


// ---------------------------------------------
// initialize methods
// ---------------------------------------------
Voxchunk.prototype.initializeChunk = function(cIdx, voxengine, size, offset) {
    this.entity.addComponent("model");
    this.entity.addComponent("collision", {
        type: "mesh"
    });
    this.dirty = false;
    
    this.voxModelNode = new pc.GraphNode();
    this.voxMaterial = this.material.resource;
    this.transMaterial = this.transparentMaterial.resource;
    
    this.cIdx = cIdx.clone();
    this.voxengine = voxengine;
    this.size = size;
    this.offset = offset.clone();
    
    this.neighborChunkIndices = [];
    var temp;
    for(var i = 0; i < this.neighborIndices.length; ++i) {
        temp = this.cIdx.clone();
        this.neighborChunkIndices.push(temp.add(this.neighborIndices[i]));
    }
    
    this.numberOfSquare = Math.pow(size, 2);
    this.numberOfCubic = Math.pow(size, 3);
    
    this.voxDatas = [];
    this.initializeVoxDatas();
    
    this.voxMesh = new Voxmesh();
    this.transparentMesh = new Voxmesh();
    
    this.voxCount = 0;
    
    this.numberOfDirection = 6;
};

Voxchunk.prototype.initializeVoxDatas = function() {
    var i;
    var p;
    for(i = 0; i < this.numberOfCubic; ++i) {
        p = this.convertToVec3(i);
        this.voxDatas.push(
            new Vox(false,
                    new pc.Vec3(p.x, p.y, p.z),
                    new pc.Color(0, 0, 0, 0)
                   )
        );
    }
};


// ---------------------------------------------
// utility methods
// ---------------------------------------------
Voxchunk.prototype.convertToVec3 = function(idx) {
    if(0 <= idx && idx < this.numberOfCubic) {
        return new pc.Vec3(
            Math.floor(idx % this.size) + 0.5,
            Math.floor(idx % this.numberOfSquare / this.size) + 0.5,
            Math.floor(idx / this.numberOfSquare) + 0.5
        );
    } else {
        return new pc.Vec3(-1, -1, -1);
    }
};

Voxchunk.prototype.convertToIdx = function(v) {
    if(!this.checkBound(v)) {
        return - 1;
    }
    return Math.floor(v.z) * this.numberOfSquare + Math.floor(v.y) * this.size + Math.floor(v.x);
};

Voxchunk.prototype.twiceNextDirection = function(direction) {
    return (direction + 2) % this.numberOfDirection;
};

Voxchunk.prototype.twicePrevDirection = function(direction) {
    return (direction + this.numberOfDirection - 2) % this.numberOfDirection;
};

Voxchunk.prototype.getNeighbor = function(vox, direction) {
    var p = new pc.Vec3();
    p.copy(vox.position);
    p.add(this.neighborIndices[direction]);
    if(!this.checkBound(p)) {
        // チャンクをまたぐ場合
        var t = this.voxengine.getVoxWithVec3(p.add(this.offset));
        return t;
    } else {
        // チャンクをまだがない
        return this.getVoxWithVec3(p);
    }
};

Voxchunk.prototype.checkBound = function(v) {
    return (0 <= v.x && v.x < this.size) && (0 <= v.y && v.y < this.size) && (0 <= v.z && v.z < this.size);
};

Voxchunk.prototype.refreshNeighbor = function(idx) {
    var x = Math.floor(idx % this.size);
    var y = Math.floor(idx % this.numberOfSquare / this.size);
    var z = Math.floor(idx / this.numberOfSquare);
    var t = this.size - 1;
    
    if(x === 0) {
        this.voxengine.haveChunkRefresh(this.neighborChunkIndices[1]);
    } else if(x === t) {
        this.voxengine.haveChunkRefresh(this.neighborChunkIndices[0]);
    }
    if(y === 0) {
        this.voxengine.haveChunkRefresh(this.neighborChunkIndices[3]);
    } else if(y === t) {
        this.voxengine.haveChunkRefresh(this.neighborChunkIndices[2]);
    }
    if(z === 0) {
        this.voxengine.haveChunkRefresh(this.neighborChunkIndices[5]);
    } else if(z === t) {
        this.voxengine.haveChunkRefresh(this.neighborChunkIndices[4]);
    }
};


// ---------------------------------------------
// methods to edit vox
// ---------------------------------------------
Voxchunk.prototype.putVoxWithIdx = function(idx, c) {
    var vox = this.getVoxWithIdx(idx);
    if(vox === null || vox.visible) {
        return false;
    }
    vox.visible = true;
    vox.color.copy(c);
    
    this.refreshNeighbor(idx);
    
    this.voxCount++;
    this.dirty = true;
    
    return true;
};

Voxchunk.prototype.putVoxWithVec3 = function(v, c) {
    var idx = this.convertToIdx(v);
    return this.putVoxWithIdx(idx, c);
};

Voxchunk.prototype.removeVoxWithIdx = function(idx) {
    var vox = this.getVoxWithIdx(idx);
    if(vox === null || !vox.visible) {
        return false;
    }
    vox.visible = false;

    this.refreshNeighbor(idx);
    
    this.voxCount--;
    this.dirty = true;
    
    return true;
};

Voxchunk.prototype.removeVoxWithVec3 = function(v) {
    var idx = this.convertToIdx(v);
    return this.removeVoxWithIdx(idx);
};

Voxchunk.prototype.getVoxWithIdx = function(idx) {
    if(idx < 0 || this.numberOfCubic <= idx) {
        return null;
    }
    return this.voxDatas[idx];
};

Voxchunk.prototype.getVoxWithVec3 = function(v) {
    if(this.checkBound(v)) {
        return this.getVoxWithIdx(this.convertToIdx(v));
    } else {
        return null;
    }
};

Voxchunk.prototype.setVoxColorWithVec3 = function(v, color) {
    var vox = this.getVoxWithVec3(v);
    if(vox === null) {
        return false;
    }
    vox.color.copy(color);
    this.dirty = true;
    
    return true;
};


// ---------------------------------------------
// methods to edit voxes
// ---------------------------------------------
Voxchunk.prototype.setVoxes = function(visibles, colors) {
    if(this.voxDatas.length === visibles.length && visibles.length === colors.length) {
        for(var i = 0; i < this.numberOfCubic; ++i) {
            if(visibles[i]) {
                this.putVoxWithIdx(i, colors[i]);
            } else {
                this.removeVoxWithIdx(i);
            }
        }
        this.dirty = true;
    }
};


// ---------------------------------------------
// methods to triangulate
// ---------------------------------------------
Voxchunk.prototype.clear = function() {
    this.voxMesh.clear();
    this.transparentMesh.clear();
};

Voxchunk.prototype.apply = function() {
    if(this.voxCount <= 0 || (this.voxMesh.numberOfVertex() === 0 && this.transparentMesh.numberOfVertex() === 0)) {
        this.entity.model.model = null;
        this.entity.collision.model = null;
    } else {
        // make a model
        var model = new pc.Model();
        model.graph = this.voxModelNode;
        var mesh;
        var meshInstance;
        
        // normal mesh
        if(this.voxMesh.numberOfVertex() !== 0) {
            mesh = this.voxMesh.createMesh(this.app.graphicsDevice);
            meshInstance = new pc.MeshInstance(this.voxModelNode, mesh, this.voxMaterial);
            model.meshInstances.push(meshInstance);
        }
        
        // transparent mesh
        if(this.transparentMesh.numberOfVertex() !== 0) {
            mesh = this.transparentMesh.createMesh(this.app.graphicsDevice);
            meshInstance = new pc.MeshInstance(this.voxModelNode, mesh, this.transMaterial);
            model.meshInstances.push(meshInstance);
        }
        
        this.entity.model.model = model;
        this.entity.collision.model = model;
    }
};

Voxchunk.prototype.triangulate = function() {
    if(this.voxCount <= 0) return;
    var i;
    for(i = 0; i < this.numberOfCubic; ++i) {
        this.triangulateVox(i);
    }
};

Voxchunk.prototype.updateChunk = function() {
    this.clear();
    this.triangulate();
    this.apply();
    this.dirty = false;
};

Voxchunk.prototype.triangulateVox = function(idx) {
    var vox = this.getVoxWithIdx(idx);
    if(!vox.visible) {
        return;
    }
    
    var neighbor;
    var i;
    for(i = 0; i < this.neighborIndices.length; ++i) {
        neighbor = this.getNeighbor(vox, i);
        this.triangulateQuad(vox, i, neighbor);
    }
};

Voxchunk.prototype.triangulateQuad = function(vox, direction, neighbor) {
    if(neighbor !== null && neighbor.visible === true) {
        if(neighbor.color.a >= 1) {
            return;
        }
        if(vox.color.a < 1 && neighbor.color.a < 1) {
            return;
        }
    }
    var center = new pc.Vec3(),
        v1 = new pc.Vec3(),
        v2 = new pc.Vec3(),
        v3 = new pc.Vec3(),
        v4 = new pc.Vec3(),
        normal = new pc.Vec3();
    
    //全体をオフセットだけずらす(ボクセルはワールド座標に設置する)
    center.add2(vox.position, this.neighborDirections[direction]);
    center.add(this.offset);
    var left = this.neighborDirections[this.twicePrevDirection(direction)];
    var up = this.neighborDirections[this.twiceNextDirection(direction)];
    
    v1.copy(center);
    v1.sub(left).sub(up);
    v2.copy(center);
    v2.add(left).sub(up);
    v3.copy(center);
    v3.sub(left).add(up);
    v4.copy(center);
    v4.add(left).add(up);
    
    normal.copy(this.neighborDirections[direction]).normalize();
    if(vox.color.a > 0.99) {
        this.voxMesh.addQuad(v1, v2, v3, v4, direction % 2 == 1);
        this.voxMesh.addQuadNormal(normal);
        this.voxMesh.addQuadColor(vox.color);
    } else {
        this.transparentMesh.addQuad(v1, v2, v3, v4, direction % 2 == 1);
        this.transparentMesh.addQuadNormal(normal);
        this.transparentMesh.addQuadColor(vox.color);
    }
};


// ---------------------------------------------
// methods to export a vox data
// ---------------------------------------------
Voxchunk.prototype.exportOriginalFormat = function(color) {
    var exp = "";
    var vox;
    var prevColor = color;
    for(var i = 0; i < this.numberOfCubic; ++i) {
        vox = this.getVoxWithIdx(i);
        if(!vox.visible) {
            continue;
        }
        exp += 
            Math.floor(vox.position.x + this.offset.x) + "," + 
            Math.floor(vox.position.y + this.offset.y) + "," +
            Math.floor(vox.position.z + this.offset.z);
        if(prevColor === null || !voxutil.equalsColor(prevColor, vox.color)) {
            exp += "," + 
                parseInt(vox.color.r * 255) + "," +
                parseInt(vox.color.g * 255) + "," +
                parseInt(vox.color.b * 255) + "," +
                vox.color.a;
            prevColor = vox.color;
        }
        exp += "a";
    }
    return [exp.slice(0, -1), prevColor];
};

Voxchunk.prototype.exportPesudeObjFormat = function() {
    var meshs = [];
    var colors = [];
    
    for(var i = 0; i < this.numberOfCubic; ++i) {
        vox = this.getVoxWithIdx(i);
        if(!vox.visible) {
            continue;
        }
        meshs.push(vox.position.clone().add(this.offset));
        colors.push(
            parseInt(vox.color.r * 255) + "," + 
            parseInt(vox.color.g * 255) + "," +
            parseInt(vox.color.b * 255) + "," +
            vox.color.a);
    }
    return {meshs:meshs, colors:colors};
};

Voxchunk.prototype.exportMeshData = function() {
    return this.voxMesh.exportData();
};

Voxchunk.prototype.exportTransparentMeshData = function() {
    return this.transparentMesh.exportData();
};