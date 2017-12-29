var Manageboxes = pc.createScript('manageboxes');

// initialize code called once per entity
Manageboxes.prototype.initialize = function() {
    this.entity.delcount = 0;
    this.delflag = false;
    for(var i = 0; i < pool.children.length;i++){
        if(this.entity.getLocalPosition().equals(pool.children[i].getLocalPosition())){
            old = pool.children[i];
            this.entity.delcount++;
        }
    }
    
    if(this.entity.isredo){
        // if(this.entity.delcount > 1){
        //     // for(var hhh = 0;hhh<meshs.length;hhh++){
        //     //     if(this.entity.getLocalPosition().equals(meshs[hhh])){
        //     //         texs.splice(hhh,1);
        //     //         meshs.splice(hhh,1);
        //     //         break;
        //     //     }
        //     // }
        //     this.entity.destroy();
        // }
        if(this.entity.delcount > 1){
            his.delflag = true;                
        }else{
            meshs.push(this.entity.getLocalPosition());
            texs.push(parseInt(this.entity.mycol.r * 255,10)+","+parseInt(this.entity.mycol.g * 255,10)+","+parseInt(this.entity.mycol.b * 255,10)+","+this.entity.mycol.a);
        }
    }
    
    if(this.entity.copyobj){
        if(this.entity.delcount > 0){
            this.delflag = true;
        }else{
            meshs.push(this.entity.getLocalPosition());
            texs.push(parseInt(this.entity.mycol.r * 255,10)+","+parseInt(this.entity.mycol.g * 255,10)+","+parseInt(this.entity.mycol.b * 255,10)+","+this.entity.mycol.a);
        }
    }
    //meshs.push(this.entity.getLocalPosition());
    //console.log(getcolor().toString());
    if(!this.entity.noadd){
        //texs.push(getcolor().toString());
    }
    //console.log(this.entity._children[0].model.material._diffuse.toString());
//     if(pool._children){
// //         for(var p = 0;p<pool._children.length;p++){
// //             pool._children[p].script.manageboxes.isaround();
// //         }
//     }
    if(cam.script.orbitCamera.distanceMin < this.entity.getLocalPosition().length() * 1.5){
        cam.script.orbitCamera.distanceMin = this.entity.getLocalPosition().length() * 1.5;
    }
    
    if(pool._children.length < 2){
        this.entity.mycol = new pc.Color(1,1,1,1);
    }
};

Manageboxes.prototype.update = function(dt){
    if(this.delflag){
        this.entity.destroy();
    }
};

Manageboxes.prototype.isaround = function(){
    //囲まれているかどうか 囲まれていたらdestroy
    var ans = false;
    this.count = 0;
    var selfpos = this.entity.getLocalPosition();
    this.aroundboxes = [
        new pc.Vec3(selfpos.x+1,selfpos.y,selfpos.z),
        new pc.Vec3(selfpos.x-1,selfpos.y,selfpos.z),
        new pc.Vec3(selfpos.x,selfpos.y+1,selfpos.z),
        new pc.Vec3(selfpos.x,selfpos.y-1,selfpos.z),
        new pc.Vec3(selfpos.x,selfpos.y,selfpos.z+1),
        new pc.Vec3(selfpos.x,selfpos.y,selfpos.z-1)
    ];
    
    for(var i = 0;i<meshs.length;i++){
        for(var l = 0;l<this.aroundboxes.length;l++){
            if(meshs[i].equals(this.aroundboxes[l])){
                this.count++;
            }
        }
    }
    
    if(this.count == this.aroundboxes.length){
        ans = true;
        this.entity.destroy();
    }
    return ans;
};
// swap method called for script hot-reloading
// inherit your script state here
// Manageboxes.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// http://developer.playcanvas.com/en/user-manual/scripting/