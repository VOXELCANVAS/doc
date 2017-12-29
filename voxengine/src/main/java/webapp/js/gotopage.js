var Gotopage = pc.createScript('gotopage');

// initialize code called once per entity
Gotopage.prototype.initialize = function() {
    this.entity.element.on("mousedown",this.goto,this);
    if(this.app.touch){
        this.entity.element.on("touchstart",this.goto,this);
    }
};

// update code called every frame
Gotopage.prototype.update = function(dt) {
    
};

Gotopage.prototype.goto = function(ev){
    window.open("https://voxelcanvas.me","_blank");
};

// swap method called for script hot-reloading
// inherit your script state here
// Gotopage.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// http://developer.playcanvas.com/en/user-manual/scripting/