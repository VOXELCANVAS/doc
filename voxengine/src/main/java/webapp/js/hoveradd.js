var Hoveradd = pc.createScript('hoveradd');
var gameui;


// initialize code called once per entity
Hoveradd.prototype.initialize = function() {
    this.entity.ishover = false;
    this.direct = this.app.root.children[0].script.check.checkdirection(this.entity.getLocalEulerAngles());
    this.targetpos = new pc.Vec3(this.entity.parent.getPosition().x - this.direct.x,this.entity.parent.getPosition().y - this.direct.y,this.entity.parent.getPosition().z - this.direct.z);
};


Hoveradd.prototype.update = function(dt){
    if(!this.app.touch){
        if(this.entity.ishover){
            if(document.getElementById("delete").checked){
                deletebox(this.entity.parent.getLocalPosition());
            }else if(document.getElementById("colpic").checked){
                colpicbox(this.entity.parent.getLocalPosition());
            }else if(isCopy){
                colpicbox(this.entity.parent.getLocalPosition());
            }else if(isPaste){
                //貼り付け開始
                for(var i = 0;i < copyarray.length;i++){
                    drawcolorbox(new pc.Vec3(this.targetpos.x + copyarray[i].pos.x,this.targetpos.y + copyarray[i].pos.y,this.targetpos.z + copyarray[i].pos.z),copyarray[i].col);
                }
            }else{
                drawbox(this.targetpos);
            }
        }
    }
};
    
    
Hoveradd.prototype.hoverobj = function(entity){
//     var defmat = new pc.StandardMaterial();
//     defmat.diffuse.set(1,1,1);
//     defmat.update();
//     for(var i = 0;i<this.entity.parent.parent.children.length;i++){
//         for(var l = 0;l<this.entity.parent.parent.children[i].children.length;l++){
//             this.entity.parent.parent.children[i].children[l].model.meshInstances[0].material = defmat;
//         }
//     }
    
//     var objmat = new pc.StandardMaterial();
//     objmat.diffuse.set(1,0,0);
//     //objmat = this.app.assets.find("tex").resource;
//     objmat.update();
//     this.entity.model.meshInstances[0].material = objmat;
//     nowpos = this.targetpos;
//     voidb.setPosition(nowpos);
//     console.log("hover");
    if(this.entity == entity && !entity.parent.copychecked){
        this.entity.ishover = true;
    }
};

Hoveradd.prototype.addobj = function(){
    //console.log("count");
    
    var obj;
    if(document.getElementById("shadow")){
        if(document.getElementById("shadow").checked){
            obj = shadowtemp.clone();
        }else{
            obj = temp.clone();
        }
    }else{
        obj = temp.clone();
    }
    pool.addChild(obj);
    obj.setLocalPosition(this.targetpos);
    meshs.push(this.targetpos);
    texs.push(getcolor().toString());
    obj.enabled = true;

    
    if(this.app.touch){
        if(!isPicked){
            if(document.getElementById("glay").checked){
                colR = 1 - document.getElementById("sv").value / 199;
                colG = 1 - document.getElementById("sv").value / 199;
                colB = 1 - document.getElementById("sv").value / 199;
            }else{
                hsv = document.getElementById("colorrange").value;
                sv = document.getElementById("sv").value;

                var sss;
                var vvv;

                if(sv > 99){
                    sss = 99;
                    vvv = 199 - sv;
                }else{
                    sss = sv;
                    vvv = 99;
                }

                var rgb = colorsys.hsv_to_rgb({ h: hsv, s: sss, v: vvv });
                colR = rgb.r / 255; //0-1
                colG = rgb.g / 255;
                colB = rgb.b / 255;
            }            
        }else{
            colR = pickedColR / 255;
            colG = pickedColG / 255;
            colB = pickedColB / 255;
        }
    }else{
        col = document.getElementById("color").value.toString();
        col = col.split("");    
        colR = col[1] + col[2];
        colG = col[3] + col[4];
        colB = col[5] + col[6];
        colR = parseInt(colR,16)/255;
        colG = parseInt(colG,16)/255;
        colB = parseInt(colB,16)/255;
    }
    opa = document.getElementById("opacity").value;
    
    for(var j = 0;j<obj.children.length;j++){
        obj._children[j].model.meshInstances[0].material = defmat;
    }
    
    obj.mycol = new pc.Color(colR,colG,colB,opa/100);
};

Hoveradd.prototype.addarrayobj = function(copyarray){
    var temparray = [];
    var work = new Object();
    for(var i = 0;i < copyarray.length;i++){
        //console.log("count");
        var obj;
        if(document.getElementById("shadow")){
            if(document.getElementById("shadow").checked){
                obj = shadowtemp.clone();
            }else{
                obj = temp.clone();
            }
        }else{
            obj = temp.clone();
        }
        obj.copyobj = true;
        obj.mycol = copyarray[i].col;
        var coppos = new pc.Vec3(this.targetpos.x + copyarray[i].pos.x,this.targetpos.y + copyarray[i].pos.y,this.targetpos.z + copyarray[i].pos.z);
        
        obj.setLocalPosition(coppos);
        obj.enabled = true;
        // var copmat = new pc.StandardMaterial();
        // copmat.diffuse.set(copyarray[i].col.r,copyarray[i].col.g,copyarray[i].col.b);
        // copmat.blendType = pc.BLEND_NORMAL;
        // copmat.opacity = copyarray[i].col.a;
        // copmat.update();

        for(var j = 0;j<obj.children.length;j++){
            obj._children[j].model.meshInstances[0].material = copyarray[i].mat;
        }
        var delcount = 0;
        for(var ll = 0;ll<pool.children.length;ll++){
            if(pool.children[ll].getLocalPosition().equals(coppos)){
                delcount++;
            }
        }
        if(delcount === 0){
            var tag = new Object();
            tag.col = copyarray[i].col.clone();
            tag.target = coppos.clone();
            temparray.push(tag);
        }
        pool.addChild(obj);
    }
    work = {do : "addarray" ,array : temparray};
    works[progress] = work;
    works.splice(progress + 1,works.length - progress);
    progress++;
};

Hoveradd.prototype.initaddobj = function(x,y,z,r,g,b,a,mat){
    //console.log("count");
    var obj = temp.clone();
    pool.addChild(obj);
    obj.setLocalPosition(new pc.Vec3(x,y,z));
    meshs.push(new pc.Vec3(x,y,z));
    obj.enabled = true;
    
//     var defmat = new pc.StandardMaterial();
//     defmat.diffuse.set(r/255,g/255,b/255);
//     defmat.blendType = pc.BLEND_NORMAL;
//     defmat.opacity = a;
//     defmat.update();
    
    for(var j = 0;j<obj.children.length;j++){
        obj._children[j].model.meshInstances[0].material = mat;
    }
    
    obj.mycol = new pc.Color(r/255,g/255,b/255,a);
};

Hoveradd.prototype.redoobj = function(pos,col){
    //console.log("count");
    var obj = temp.clone();
    pool.addChild(obj);
    obj.setLocalPosition(pos);
    obj.isredo = true;
    obj.mycol = col;
    
    //meshs.push(pos);
    var string = parseInt(col.r * 255,10) + "," + parseInt(col.g * 255,10) + "," + parseInt(col.b * 255,10) + "," + col.a;
    //texs.push(string);
    obj.enabled = true;
    
//     var defmat = new pc.StandardMaterial();
//     defmat.diffuse.set(r/255,g/255,b/255);
//     defmat.blendType = pc.BLEND_NORMAL;
//     defmat.opacity = a;
//     defmat.update();
    
    var mat = new pc.StandardMaterial();
    mat.diffuse.set(col.r,col.g,col.b);
    mat.blendType = pc.BLEND_NORMAL;
    mat.opacity = col.a;
    mat.update();
    
    for(var j = 0;j<obj.children.length;j++){
        obj._children[j].model.meshInstances[0].material = mat;
    }
};

// Hoveradd.prototype.redoaddarrayobj = function(meshs,cols){
//     var emptyentity = new pc.Entity();
//     emptyentity.name = "copygroups";
//     for(var i = 0;i < meshs.length;i++){
//         //console.log("count");
//         var obj;
//         if(document.getElementById("shadow")){
//             if(document.getElementById("shadow").checked){
//                 obj = shadowtemp.clone();
//             }else{
//                 obj = temp.clone();
//             }
//         }else{
//             obj = temp.clone();
//         }
//         obj.copyobj = true;
//         obj.mycol = cols[i];
//         var coppos = new pc.Vec3(meshs[i].x,meshs[i].y,meshs[i].z);
//         obj.setLocalPosition(coppos);
//         obj.enabled = true;
//         // var copmat = new pc.StandardMaterial();
//         // copmat.diffuse.set(copyarray[i].col.r,copyarray[i].col.g,copyarray[i].col.b);
//         // copmat.blendType = pc.BLEND_NORMAL;
//         // copmat.opacity = copyarray[i].col.a;
//         // copmat.update();
//         // 
//         var inimat;
//         inimat = new pc.StandardMaterial();
//         inimat.diffuse.set(cols[i].r,cols[i].g,cols[i].b);
//         inimat.blendType = pc.BLEND_NORMAL;
//         inimat.opacity = parseFloat(cols[i].a,10);
//         inimat.update();

//         for(var j = 0;j<obj.children.length;j++){
//             obj._children[j].model.meshInstances[0].material = inimat;
//         }
//         emptyentity.addChild(obj);
//     }
//     pool.addChild(emptyentity);
// };

Hoveradd.prototype.paintobj = function(){
    //color要素から色情報を取得
    var col = document.getElementById("color").value.toString();
        col = col.split("");    
        var colR = col[1] + col[2];
        var colG = col[3] + col[4];
        var colB = col[5] + col[6];
    
    var defmat = new pc.PhongMaterial();
    defmat.diffuse.set(parseInt(colR,16)/255,parseInt(colG,16)/255,parseInt(colB,16)/255);
    defmat.update();
    this.entity.model.meshInstances[0].material = defmat;
};



// swap method called for script hot-reloading
// inherit your script state here
// Hoveradd.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// http://developer.playcanvas.com/en/user-manual/scripting/