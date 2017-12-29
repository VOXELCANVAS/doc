ve3.MeshBuilder = function(){
    this.vertices = [];
    this.uvs = [];
    this.normals = [];
    this.colors = [];
    this.indices = [];
};

ve3.MeshBuilder.prototype.createMesh = function(graphicsDev) {
    return pc.createMesh(graphicsDev, this.vertices, {
        normals: this.normals,
        colors: this.colors,
        indices: this.indices
    });
};

ve3.MeshBuilder.prototype.createMeshWithUV = function(graphicsDev) {
    return pc.createMesh(graphicsDev, this.vertices, {
        uvs: this.uvs,
        normals: this.normals,
        colors: this.colors,
        indices: this.indices
    });
};

ve3.MeshBuilder.prototype.clear = function() {
    this.vertices.length = 0;
    this.uvs.length = 0;
    this.normals.length = 0;
    this.colors.length = 0;
    this.indices.length = 0;
};

ve3.MeshBuilder.prototype.numOfVertex = function() {
    return this.vertices.length;
};

// ---------------------------------------------
// methods to create mesh
// ---------------------------------------------
ve3.MeshBuilder.prototype.addVertex = function(v) {
    this.vertices.push(v.x, v.y, v.z);
};

ve3.MeshBuilder.prototype.addUv = function(uv) {
    this.uvs.push(uv.x, uv.y);
};

ve3.MeshBuilder.prototype.addNormal = function(n) {
    this.normals.push(n.x, n.y, n.z);
};

ve3.MeshBuilder.prototype.addColor = function(c) {
    this.colors.push(
        parseInt(c.r * 255),
        parseInt(c.g * 255),
        parseInt(c.b * 255),
        parseInt(c.a * 255)
    );
};

ve3.MeshBuilder.prototype.addQuad = function(v1, v2, v3, v4, isReveresd) {
    var vertexIdx = parseInt(this.vertices.length / 3);
    this.addVertex(v1);
    this.addVertex(v2);
    this.addVertex(v3);
    this.addVertex(v4);
    
    if(isReveresd) {
        this.indices.push(vertexIdx);
        this.indices.push(vertexIdx + 1);
        this.indices.push(vertexIdx + 2);
        this.indices.push(vertexIdx + 1);
        this.indices.push(vertexIdx + 3);
        this.indices.push(vertexIdx + 2);
    } else {
        this.indices.push(vertexIdx);
        this.indices.push(vertexIdx + 2);
        this.indices.push(vertexIdx + 1);
        this.indices.push(vertexIdx + 1);
        this.indices.push(vertexIdx + 2);
        this.indices.push(vertexIdx + 3);
    }
};

ve3.MeshBuilder.prototype.addQuadNormal = function(n) {
    this.addNormal(n);
    this.addNormal(n);
    this.addNormal(n);
    this.addNormal(n);
};

ve3.MeshBuilder.prototype.addQuadColor = function(c) {
    this.addColor(c);
    this.addColor(c);
    this.addColor(c);
    this.addColor(c);
};

ve3.MeshBuilder.prototype.addQuadUV = function(uv1, uv2, uv3, uv4) {
    this.addUv(uv1);
    this.addUv(uv2);
    this.addUv(uv3);
    this.addUv(uv4);
};

ve3.MeshBuilder.prototype.exportData = function() {
    var positions = this.vertices;
    var normals = this.normals;
    var colors = this.colors;
    var indices = this.indices;
    return {p:positions, n:normals, c:colors, i:indices};
};