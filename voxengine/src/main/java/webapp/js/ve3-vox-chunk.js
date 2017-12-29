ve3.VoxChunk = pc.createScript('ve3VoxChunk');

ve3.VoxChunk.attributes.add("opaque", {
    type: "asset",
    assetType: "material"
});

ve3.VoxChunk.attributes.add("transparent", {
    type: "asset",
    assetType: "material"
});


// ---------------------------------------------
// initialize methods
// ---------------------------------------------

// チャンクを初期化する
ve3.VoxChunk.prototype.initializeChunk = function(cidx, engine, size, offset) {
    if(!this.entity.model) {
        this.entity.addComponent("model");
    }
    if(!this.entity.collision) {
        this.entity.addComponent("collision", {type: "mesh"});
    }
    
    this.dirty = false;
    
    this.modelNode = new pc.GraphNode();
    this.opaque = this.opaque.resource;
    this.transparent = this.transparent.resource;
    
    this.cidx = cidx.clone();
    this.engine = engine;
    this.size = size;
    this.offset = offset.clone();
    
    this.voxes = {};
    this.initializeVoxes();
    
    this.opaqueMesh = new ve3.MeshBuilder();
    this.transparentMesh = new ve3.MeshBuilder();
    
    this.voxCount = 0;
};

// チャンクの管理するボクセルデータを初期化する
ve3.VoxChunk.prototype.initializeVoxes = function() {
    /*
    for(let y = 0; this.size; ++y) {
        for(let z = 0; this.size; ++z) {
            for(let x = 0; this.size; ++x) {
                this.voxDatas[[x, y, z]] = new ve3.Vox(
                    false, new pc.Vec3(x, y, z), new pc.Color(1, 1, 1, 1)
                );
            }
        }
    }
    */
    // こっちのほうが良いか
    this.voxes = new Array(this.size);
    for(let x = 0; x < this.size; ++x) {
        this.voxes[x] = new Array(this.size);
        for(let y = 0; y < this.size; ++y) {
            this.voxes[x][y] = new Array(this.size);
            for(let z = 0; z < this.size; ++z) {
                this.voxes[x][y][z] = new ve3.Vox(
                    false, [x, y, z], [1, 1, 1, 1]
                );
            }
        }
    }
};


// ---------------------------------------------
// methods to edit vox
// ---------------------------------------------

// 指定したローカル座標に指定した色のボクセルを配置する
ve3.VoxChunk.prototype.putVox = function(lpos, color) {
    let vox = this.voxes[lpos];
    vox.visible = true;
    vox.color = color;
    
    ++this.vox;
};

// 指定したローカル座標のボクセルを削除する
ve3.VoxChunk.prototype.removeVox = function(lpos) {
    let vox = this.voxes[lpos];
    vox.visible = false;
    
    --this.vox;
};

// 指定したローカル座標のボクセルの色を指定した色に設定する
ve3.VoxChunk.prototype.setVoxColor = function(lpos, color) {
    let vox = this.voxes[lpos];
    vox.color = color;
};

// 指定したローカル座標のボクセルを取得する
ve3.VoxChunk.prototype.getVox = function(lpos) {
    return this.voxes[lpos];
};


// ---------------------------------------------
// methods to triangulate
// ---------------------------------------------

// メッシュを更新する
ve3.VoxChunk.prototype.updateMesh = function() {
    this.clearMesh();
    this.triangulate();
    this.applyMesh();
    this.dirty = false;
};

// メッシュデータを初期化する
ve3.VoxChunk.prototype.clearMesh = function() {
    this.opaqueMesh.clear();
    this.transparentMesh.clear();
};

// メッシュデータをentityに適用する
ve3.VoxChunk.prototype.applyMesh = function() {
    if(
        this.voxCount <= 0 ||
        (this.opaqueMesh.numOfVertex() === 0 && !this.transparentMesh.numOfVertex() === 0)
    ) {
        this.entity.model.model = null;
        this.entity.collision.model = null;
    } else {
        let model = new pc.Model();
        model.graph = this.modelNode;
        let mesh;
        let meshInstance;
        
        // opaque mesh
        if(this.opaqueMesh.numOfVertex() !== 0) {
            mesh = this.opaqueMesh.createMesh(this.app.graphicsDevice);
            meshInstance = new pc.MeshInstance(this.modelNode, mesh, this.opaqueMaterial);
            model.meshInstances.push(meshInstance);
        }
        
        // transparent mesh
        if(this.transparentMesh.numOfVertex() !== 0) {
            mesh = this.transparentMesh.createMesh(this.app.graphicsDevice);
            meshInstance = new pc.MeshInstance(this.modelNode, mesh, this.transparentMaterial);
            model.meshInstances.push(meshInstance);
        }
        this.entity.model.model = model;
        this.entity.collision.model = model;
    }
};

// 三角形化してメッシュを作成する
ve3.VoxChunk.prototype.triangulate = function() {
    if(this.voxCount <= 0) {
        return;
    }
    
    // ネガティブ側から処理
    for(let x = 0; x < this.size; ++x) {
        for(let y = 0; y < this.size; ++y) {
            this.triangulateVox(this.voxes[x][y][0], x, y, 0);
        }
    }
};

// ボクセルを三角形化する
ve3.VoxChunk.prototype.triangulateVox = function(vox, x, y, z, dir) {
    
};