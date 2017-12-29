ve3.VoxEngine = pc.createScript('ve3VoxEngine');

ve3.VoxEngine.attributes.add("chunkEntity", {
    type: "entity",
    title: "Vox Chunk"
});

ve3.VoxEngine.attributes.add("chunkSize", {
    type: "number",
    title: "Chunk Size"
});

ve3.VoxEngine.prototype.initialize = function() {
    this.chunkGrid = {};
    this.voxCount = 0;
};


// ---------------------------------------------
// utility methods
// ---------------------------------------------

// グローバル座標を対応するチャンク番号に変換する
ve3.VoxEngine.prototype.pos2cidx = function(position) {
    let x = Math.floor(position.x / this.chunkSize);
    let y = Math.floor(position.y / this.chunkSize);
    let z = Math.floor(position.z / this.chunkSize);
    return new pc.Vec3(x, y, z);
};

// チャンク番号をグローバル座標に変換する
ve3.VoxEngine.prototype.cidx2pos = function(cidx) {
    let x = cidx.x * this.chunkSize;
    let y = cidx.y * this.chunkSize;
    let z = cidx.z * this.chunkSize;
    return new pc.Vec3(x, y, z);
};

// ---------------------------------------------
// methods to edit vox
// ---------------------------------------------
ve3.VoxEngine.prototype.putVox = function(position, color) {
    let cidx = this.pos2cidx(position);
    let chunk = this.getChunk(cidx);
    if(chunk === null) {
        chunk = this.createChunk(cidx);
    }
    let 
};


// ---------------------------------------------
// methods to manage chunks
// ---------------------------------------------

// 指定したチャンク番号のチャンクの存在を確認する
ve3.VoxEngine.prototype.existChunk = function(cidx) {
    return this.chunkGrid[cidx] !== void 0;
};

// 指定したチャンク番号にチャンクを生成する
ve3.VoxEngine.prototype.createChunk = function(cidx) {
    if(!this.exitGrid(cidx)) {
        let newChunk = this.chunkEntity.clone();
        newChunk.enabled = true;
        this.entity.addChild(newChunk);
        let pos = this.cidx2Pos(cidx);
        let chunk = newChunk.script.ve3VoxChunk;
        chunk.initializeChunk(cidx, this, this.chunkSize, pos);
        
        this.chunkGrid[cidx] = chunk;
        return chunk;
    }
    return null;
};

// 指定したチャンク番号のチャンクを取得する
ve3.VoxEngine.prototype.getChunk = function(cidx) {
    return this.existChunk(cidx) ? this.chunkGrid[cidx] : null;
};

// 指定したチャンク番号のチャンクを更新する
ve3.VoxEngine.prototype.makeChunkUpdate = function(cidx) {
    let chunk = this.getChunk(cidx);
    if(chunk !== null) {
        chunk.updateChunk();
    }
};