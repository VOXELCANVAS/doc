var GridShader = pc.createScript('gridShader');

GridShader.attributes.add('vs', {
    type: 'asset',
    assetType: 'shader',
    title: 'Vertex Shader'
});

GridShader.attributes.add('fs', {
    type: 'asset',
    assetType: 'shader',
    title: 'Fragment Shader'
});

GridShader.prototype.initialize = function() {
    this.entity.model.model.meshInstances[0].material = this.createMaterial();
};

GridShader.prototype.createMaterial = function() {
    var gd = this.app.graphicsDevice;
    var vs = this.vs.resource;
    var fs = "precision " + gd.precision + " float;\n";
    fs = fs + this.fs.resource;

    var shaderDefinition = {
        attributes: {
            aPosition: pc.SEMANTIC_POSITION,
            aNormal: pc.SEMANTIC_NORMAL
        },
        vshader: vs,
        fshader: fs
    };

    this.shader = new pc.Shader(gd, shaderDefinition);

    var material = new pc.Material();
    material.setShader(this.shader);
    
    return material;
};