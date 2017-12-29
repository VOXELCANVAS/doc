var RecordGif = pc.createScript('recordGif');

// initialize code called once per entity
RecordGif.prototype.initialize = function() {
    voxUI.on("UI:rec",this._startRecord,this);
};

// update code called every frame
RecordGif.prototype.update = function(dt) {
    
};

RecordGif.prototype._startRecord = function(){
    var canvas = document.getElementById("application-canvas").getContext('webgl');
    console.log(canvas);
};

// swap method called for script hot-reloading
// inherit your script state here
// RecordGif.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// http://developer.playcanvas.com/en/user-manual/scripting/