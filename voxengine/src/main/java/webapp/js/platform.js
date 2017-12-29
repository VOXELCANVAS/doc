var Platform = pc.createScript('platform');

// initialize code called once per entity
Platform.prototype.initialize = function() {
    voxUI.on("UI:platform",this._changeplatform,this);
};

// update code called every frame
Platform.prototype.update = function(dt) {
    
};

Platform.prototype.childrenEnable = function(bool){
    for(let i = 0;i<this.entity.children.length;i++){
        this.entity.children[i].enabled = bool;
    }
    voxUI.platform.checked = bool;
};

Platform.prototype._changeplatform = function(){
    if(voxUI.platform.checked){
        this.childrenEnable(true);
    }else{
        this.childrenEnable(false);
    }
};

// swap method called for script hot-reloading
// inherit your script state here
// Platform.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// http://developer.playcanvas.com/en/user-manual/scripting/