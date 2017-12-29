var Lightfield = pc.createScript('lightfield');
var camera;
// initialize code called once per entity
Lightfield.prototype.initialize = function() {
    camera = this.app.root.findByName("Camera");
    voxUI.on("UI:light:x",this._lightchange,this);
    voxUI.on("UI:light:y",this._lightchange,this);
    voxUI.on("UI:light:z",this._lightchange,this);
    voxUI.on("UI:light:color",this._lightcolorchange,this);
    
    voxUI.setLighttorange(this.entity.getEulerAngles());
};

// update code called every frame
Lightfield.prototype.update = function(dt) {
    this.entity.light.shadowDistance = camera.getLocalPosition().length();
};

Lightfield.prototype._lightchange = function(){
    this.entity.setEulerAngles(voxUI.light_x,voxUI.light_y,voxUI.light_z);
};

Lightfield.prototype._lightcolorchange = function(){
    var color = new pc.Color(1,1,1);
    color.fromString(voxUI.lgiht_color.value);
    
    this.entity.light.color = color;
};
// swap method called for script hot-reloading
// inherit your script state here
// Lightfield.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// http://developer.playcanvas.com/en/user-manual/scripting/