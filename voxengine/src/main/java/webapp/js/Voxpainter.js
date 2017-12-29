var Voxpainter = pc.createScript('voxpainter');

Voxpainter.attributes.add("voxengineEntity", {
    type : "entity",
    title: "Voxengine Entity",
});

// initialize code called once per entity
Voxpainter.prototype.initialize = function() {
    this.voxengine = this.voxengineEntity.script.voxengine;
    this.chunkSize = this.voxengine.chunkSize;
    this.cubicChunkSize = Math.pow(this.chunkSize, 3);
    this.start = 0;
    this.size = 5;
    this.chunkArray = [];
    this.loadCnt = 0;
    for(var y = 0; y < this.size + this.start; ++y) {
        for(var x = this.start; x < this.size + this.start; ++x) {
            for(var z = this.start; z < this.size + this.start; ++z) {
                this.chunkArray.push(new pc.Vec3(x, y, z));
            }
        }
    }
    
    this.visibles = [];
    this.colors = [];
    for(var i = 0; i < this.cubicChunkSize; ++i) {
        this.visibles.push(false);
        this.colors.push(new pc.Color(1, 1, 1, 1));
    }
    
    /*
    var size = 100;
    var n;
    for(var x = -size/2; x < size/2; ++x) {
        for(var y = 0; y < size; ++y) {
            for(var z = -size/2; z < size/2; ++z) {
                n = noise.perlin3(x * 0.05, y * 0.05, z * 0.05);
                if(n > 0.3) {
                    this.voxengine.putVoxWithVec3(new pc.Vec3(x, y, z), new pc.Color(1,1,1,1));
                }
            }
        }
    }
    */
};

Voxpainter.prototype.update = function() {
    if(this.chunkArray.length > this.loadCnt) {
        this.putVoxChunk(this.chunkArray[this.loadCnt]);
        this.loadCnt++;
    }
};

Voxpainter.prototype.putVoxChunk = function(cIdx) {
    var p = this.voxengine.convertToChunkPosition(cIdx);
    var i = 0;
    for(var z = 0; z < this.chunkSize; ++z) {
        for(var y = 0; y < this.chunkSize; ++y) {
            for(var x = 0; x < this.chunkSize; ++x) {
                n = noise.perlin3((x + p.x) * 0.05, (y + p.y) * 0.05, (z + p.z) * 0.05);
                this.visibles[i] = (0.2 < n && n < 0.3);
                ++i;
            }
        }
    }
    this.voxengine.setVoxesAtChunk(cIdx, this.visibles, this.colors);
};