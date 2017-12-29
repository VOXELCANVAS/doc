var GridBox = pc.createScript('gridBox');

GridBox.attributes.add("gridSize", {
    type: "vec3",
    title: "Grid Size",
});

GridBox.prototype.vertices = [
    new pc.Vec3(0.5, 0, 0),
    new pc.Vec3(-0.5, 0, 0),
    new pc.Vec3(0, 0.5, 0),
    new pc.Vec3(0, -0.5, 0),
    new pc.Vec3(0, 0, 0.5),
    new pc.Vec3(0, 0, -0.5)
];

GridBox.prototype.normals = [
    new pc.Vec3(1, 0, 0),
    new pc.Vec3(-1, 0, 0),
    new pc.Vec3(0, 1, 0),
    new pc.Vec3(0, -1, 0),
    new pc.Vec3(0, 0, 1),
    new pc.Vec3(0, 0, -1),
];

GridBox.prototype.initialize = function() {
    this.boxModelNode = new pc.GraphNode();
    this.boxMesh = new Voxmesh();
    this.boxMaterial = null;
    
    this.createGridMesh(this.gridSize);
};

GridBox.prototype.createGridMesh = function(size) {
    this.boxMesh.clear();
    
    var center = new pc.Vec3(),
        v1 = new pc.Vec3(),
        v2 = new pc.Vec3(),
        v3 = new pc.Vec3(),
        v4 = new pc.Vec3(),
        normal = new pc.Vec3();
    
    for(var i = 0; i < 6; ++i) {
        center = this.vertices[i].clone();
        var left = this.vertices[this.twicePrevDirection(i)];
        var up = this.vertices[this.twiceNextDirection(i)];

        v1 = center.clone();
        v1.sub(left).sub(up).mul(size);
        v2 = center.clone();
        v2.add(left).sub(up).mul(size);
        v3 = center.clone();
        v3.sub(left).add(up).mul(size);
        v4 = center.clone();
        v4.add(left).add(up).mul(size);

        this.boxMesh.addQuad(v1, v2, v3, v4, i % 2 == 1);
        this.boxMesh.addQuadNormal(this.normals[i].clone());
    }
    
    var model = new pc.Model();
    model.graph = this.boxModelNode;
    var mesh;
    var meshInstance;
    
    mesh = this.boxMesh.createMesh(this.app.graphicsDevice);
    meshInstance = new pc.MeshInstance(this.boxModelNode, mesh, this.boxMaterial);
    model.meshInstances.push(meshInstance);
    model.meshInstances[0].material = this.boxMaterial;
    
    this.entity.model.model = model;
    this.entity.collision.model = model;
};

GridBox.prototype.twiceNextDirection = function(direction) {
    return (direction + 2) % this.vertices.length;
};

GridBox.prototype.twicePrevDirection = function(direction) {
    return (direction + this.vertices.length - 2) % this.vertices.length;
};