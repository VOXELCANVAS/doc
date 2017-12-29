var BackgroundChanger = pc.createScript('backgroundChanger');
BackgroundChanger.attributes.add("tropical",{type:"asset"});
BackgroundChanger.attributes.add("heliport",{type:"asset"});

// initialize code called once per entity
BackgroundChanger.prototype.initialize = function() {
    voxUI.on("UI:background:color",this._changeBackgroundColor,this);
    voxUI.on("UI:background:tropical",this._changeBackgroundtoTropical,this);
    voxUI.on("UI:background:heliport",this._changeBackgroundtoheliport,this);
    voxUI.on("UI:camera:range",this._changeCameraRange,this);
};

// update code called every frame
BackgroundChanger.prototype.update = function(dt) {
    
};

BackgroundChanger.prototype._changeBackgroundColor = function(){
    var color = new pc.Color(1,1,1);
    color.fromString(voxUI.background_color.value);
    color.a = 1;
    
    this.app.scene.skybox = null;
    this.entity.camera.clearColor = color;
};

BackgroundChanger.prototype._changeBackgroundtoTropical = function(){
    this.app.scene.setSkybox(this.tropical.resources);
};

BackgroundChanger.prototype._changeBackgroundtoheliport = function(){
    this.app.scene.setSkybox(this.heliport.resources);
};

BackgroundChanger.prototype._changeCameraRange = function(){
    this.entity.camera.fov = voxUI.camera_range.value;
};
// swap method called for script hot-reloading
// inherit your script state here
// BackgroundChanger.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// http://developer.playcanvas.com/en/user-manual/scripting/