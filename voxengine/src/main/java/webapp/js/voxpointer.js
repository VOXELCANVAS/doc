var Voxpointer = pc.createScript('voxpointer');

Voxpointer.attributes.add("material", {
    type: "asset",
    assetType: "material"
});

Voxpointer.prototype.offset = new pc.Vec3(0.6, 0.6, 0.6);

Voxpointer.prototype.tempSurfaces = [
    [1, 5, 3, 7],
    [4, 0, 6, 2],
    [2, 3, 6, 7],
    [1, 0, 5, 4],
    [0, 1, 2, 3],
    [5, 4, 7, 6]
];

Voxpointer.prototype.tempNormals = [
    new pc.Vec3(1, 0, 0),
    new pc.Vec3(-1, 0, 0),
    new pc.Vec3(0, 1, 0),
    new pc.Vec3(0, -1, 0),
    new pc.Vec3(0, 0, 1),
    new pc.Vec3(0, 0, -1)
];

Voxpointer.prototype.tempUVs = [
    new pc.Vec2(0, 0),
    new pc.Vec2(1, 0),
    new pc.Vec2(0, 1),
    new pc.Vec2(1, 1),
];

Voxpointer.prototype.initialize = function() {
    this.model = this.entity.model;
    this.meshBuilder = new Voxmesh();
    this.modelNode = new pc.GraphNode();
    this.modelMaterial = this.material.resource;
};

Voxpointer.prototype.changeSizeToOne = function() {
    this.triangulate(pc.Vec3.ZERO, pc.Vec3.ZERO);
};

Voxpointer.prototype.changeSize = function(start, end) {
    this.triangulate(start, end);
};

Voxpointer.prototype.apply = function() {
    var model = new pc.Model();
    model.graph = this.modelNode;
    var mesh;
    var meshInstance;

    mesh = this.meshBuilder.createMeshWithUV(this.app.graphicsDevice);
    meshInstance = new pc.MeshInstance(this.modelNode, mesh, this.modelMaterial);
    model.meshInstances.push(meshInstance);

    this.model.model = model;
};

Voxpointer.prototype.triangulate = function(start, end) {
    this.meshBuilder.clear();
    this.entity.setLocalPosition(pc.Vec3.ZERO);
    var t = voxutil.minMaxVec3(start, end);
    var min = t.min.sub(this.offset);
    var max = t.max.add(this.offset);
    var vertices = [
        new pc.Vec3(min.x, min.y, max.z),
        new pc.Vec3(max.x, min.y, max.z),
        new pc.Vec3(min.x, max.y, max.z),
        new pc.Vec3(max.x, max.y, max.z),
        new pc.Vec3(min.x, min.y, min.z),
        new pc.Vec3(max.x, min.y, min.z),
        new pc.Vec3(min.x, max.y, min.z),
        new pc.Vec3(max.x, max.y, min.z),
    ];
    
    for(var i = 0; i < this.tempSurfaces.length; ++i) {
        this.meshBuilder.addQuad(
            vertices[this.tempSurfaces[i][0]],
            vertices[this.tempSurfaces[i][1]],
            vertices[this.tempSurfaces[i][2]],
            vertices[this.tempSurfaces[i][3]],
            true
        );
        this.meshBuilder.addQuadNormal(this.tempNormals[i]);
        this.meshBuilder.addQuadUV(
            this.tempUVs[0],
            this.tempUVs[1],
            this.tempUVs[2],
            this.tempUVs[3]
        );
    }
    
    this.apply();
};