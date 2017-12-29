var Drawline = pc.createScript('drawline');
Drawline.attributes.add("color",{type:"rgba"});
Drawline.attributes.add("minmax",{type:"vec2"});

// initialize code called once per entity
Drawline.prototype.initialize = function() {

};

// update code called every frame
Drawline.prototype.update = function(dt) {
    for(var l=this.minmax.x;l<=this.minmax.y;l+=1){
        for(var i=this.minmax.x;i<=this.minmax.y;i+=1){
            this.app.renderLine(new pc.Vec3(this.minmax.x,l,i),new pc.Vec3(this.minmax.y,l,i), this.color);
            this.app.renderLine(new pc.Vec3(i,l,this.minmax.x),new pc.Vec3(i,l,this.minmax.y), this.color);
       }
    }
    
    for(var l=this.minmax.x;l<=this.minmax.y;l+=1){
        for(var i=this.minmax.x;i<=this.minmax.y;i+=1){
            this.app.renderLine(new pc.Vec3(i,this.minmax.x,l),new pc.Vec3(i,this.minmax.y,l), this.color);
            this.app.renderLine(new pc.Vec3(this.minmax.x,i,l),new pc.Vec3(this.minmax.y,i,l), this.color);
        }
    }
};

// swap method called for script hot-reloading
// inherit your script state here
// Drawline.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// http://developer.playcanvas.com/en/user-manual/scripting/