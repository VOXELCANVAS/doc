var PickerFramebuffer = pc.createScript('pickerFramebuffer');
var pickedentity;
// initialize code called once per entity
PickerFramebuffer.prototype.initialize = function() {
    copyarray =[];
    newarray = [];
    isCopy = false;
    isPaste = false;
    numofcopy = 0;
    // Create a frame buffer picker with a resolution of 1024x1024
    this.picker = new pc.Picker(this.app.graphicsDevice, 1024, 1024);
    this.app.mouse.on(pc.EVENT_MOUSEMOVE, this.onSelect, this);
    
    if(this.app.touch){
         this.app.touch.on("touchstart", this.onChoisemobile, this);   
    }else{
        this.app.mouse.on(pc.EVENT_MOUSEDOWN, this.onChoise, this);
    }
};


PickerFramebuffer.prototype.onSelect = function (event) {
    var canvas = this.app.graphicsDevice.canvas;
    var canvasWidth = parseInt(canvas.clientWidth, 10);
    var canvasHeight = parseInt(canvas.clientHeight, 10);

    var camera = this.entity.camera.camera;
    var scene = this.app.scene;
    var picker = this.picker;

    picker.prepare(camera, scene);

    // Map the mouse coordinates into picker coordinates and 
    // query the selection
    var selected = picker.getSelection({
        x: Math.floor(event.x * (picker.width / canvasWidth)), 
        y: picker.height - Math.floor(event.y * (picker.height / canvasHeight))
    });

    if (selected.length > 0) {
        // Get the graph node used by the selected mesh instance
        var entity = selected[0].node;

        // Bubble up the hierarchy until we find an actual Entity
        while (!(entity instanceof pc.Entity) && entity !== null) {
            entity = entity.getParent();
        }
        if (entity) {
            // if(document.getElementById("delete").checked){
            //     for(var hhh = 0;hhh<meshs.length;hhh++){
            //         if(entity.parent.getLocalPosition().equals(meshs[hhh])){
            //             if(hhh !== 0){
            //                 console.log(hhh);
            //                 texs.splice(hhh,1);
            //                 meshs.splice(hhh,1);
            //                 entity.parent.destroy();
            //             }
            //         }
            //     }
            // }else{
            //     entity.script.hoveradd.addobj();
            // }
            // pool.script.boxmanager.manage();
            
            if(!pickedentity){
                pickedentity = entity;
                
            }else if(pickedentity != entity){
                pickedentity.ishover = false;
                pickedentity = entity;
            }
            if(entity.name == "Plane"){
                entity.script.hoveradd.hoverobj(entity);
            }
            if(document.getElementById("copypaste").checked){
                if(this.app.keyboard.isPressed(pc.KEY_CONTROL)){
                    if(isCopy){
                        if(!entity.parent.copychecked){
                            newarray[numofcopy] = new Object();
                            var entitypos = entity.parent.getLocalPosition().clone();
                            newarray[numofcopy].absolutely = entity.parent.getLocalPosition();
                            if(numofcopy === 0){
                                newarray[numofcopy].pos = new pc.Vec3(0,0,0);
                            }else{
                                newarray[numofcopy].pos = entitypos.sub(newarray[0].absolutely);
                            }
                            newarray[numofcopy].col = entity.parent.mycol.clone();
                            newarray[numofcopy].mat = entity.model.meshInstances[0].material;
                            entity.parent.copychecked = true;
                            numofcopy++;
                        }                    
                    }                    
                }
            }
        }
    }else{
        if(pickedentity){
            pickedentity.ishover = false;
        }
    }
};

PickerFramebuffer.prototype.onChoise = function (event) {
    var canvas = this.app.graphicsDevice.canvas;
    var canvasWidth = parseInt(canvas.clientWidth, 10);
    var canvasHeight = parseInt(canvas.clientHeight, 10);

    var camera = this.entity.camera.camera;
    var scene = this.app.scene;
    var picker = this.picker;

    picker.prepare(camera, scene);

    // Map the mouse coordinates into picker coordinates and 
    // query the selection
    var selected = picker.getSelection({
        x: Math.floor(event.x * (picker.width / canvasWidth)), 
        y: picker.height - Math.floor(event.y * (picker.height / canvasHeight))
    });

    if (selected.length > 0) {
        // Get the graph node used by the selected mesh instance
        var entity = selected[0].node;

        // Bubble up the hierarchy until we find an actual Entity
        while (!(entity instanceof pc.Entity) && entity !== null) {
            entity = entity.getParent();
        }
        if (entity && entity.name == "Plane") {
            if(document.getElementById("delete").checked){
                for(var hhh = 0;hhh<meshs.length;hhh++){
                    if(entity.parent.getLocalPosition().equals(meshs[hhh])){
                        if(pool._children.length > 1){
                            var work = new Object();
                            work = {do : "delete" ,pos : entity.parent.getLocalPosition().clone(), col : entity.parent.mycol.clone()};
                            works[progress] = work;
                            works.splice(progress + 1,works.length - progress);
                            progress++;
                            texs.splice(hhh,1);
                            meshs.splice(hhh,1);
                            entity.parent.destroy();
                            break;
                        }
                    }
                }
            }else if(document.getElementById("colpic").checked){
                pool.script.boxmanager.colpic(entity);
                copycolorflag = true;
            }else if(document.getElementById("copypaste").checked){
                if(isCopy){
                    if(!entity.parent.copychecked){
                        newarray[numofcopy] = new Object();
                        var entitypos = entity.parent.getLocalPosition().clone();
                        newarray[numofcopy].absolutely = entity.parent.getLocalPosition();
                        if(numofcopy === 0){
                            newarray[numofcopy].pos = new pc.Vec3(0,0,0);
                        }else{
                            newarray[numofcopy].pos = entitypos.sub(newarray[0].absolutely);
                        }
                        newarray[numofcopy].col = entity.parent.mycol.clone();
                        newarray[numofcopy].mat = entity.model.meshInstances[0].material;
                        entity.parent.copychecked = true;
                        numofcopy++;
                    }else{
                        var delpos = entity.parent.getLocalPosition().clone();
                        for(var ll = 0;ll<newarray.length;ll++){
                            if(newarray[ll].absolutely.equals(delpos)){
                                newarray.splice(ll,1);
                            }
                        }
                        entity.parent.copychecked = false;
                        numofcopy--;
                    }                   
                }
                if(isPaste){
                    entity.script.hoveradd.addarrayobj(copyarray);
                }
            }else{
                var work = new Object();
                var color = new pc.Color(getcolor()[0] / 255,getcolor()[1] / 255,getcolor()[2] / 255,getcolor()[3]);
                work = {do : "addbox" ,pos : entity.script.hoveradd.targetpos, col : color};
                works[progress] = work;
                works.splice(progress + 1,works.length - progress);
                progress++;
                entity.script.hoveradd.addobj();
            }
            pool.script.boxmanager.manage();
            if(pickedentity){
                pickedentity.ishover = false;
            }
        }
    }
};

PickerFramebuffer.prototype.onChoisemobile = function (event) {
    var canvas = this.app.graphicsDevice.canvas;
    var canvasWidth = parseInt(canvas.clientWidth, 10);
    var canvasHeight = parseInt(canvas.clientHeight, 10);

    var camera = this.entity.camera.camera;
    var scene = this.app.scene;
    var picker = this.picker;

    picker.prepare(camera, scene);

    // Map the mouse coordinates into picker coordinates and 
    // query the selection
    var selected = picker.getSelection({
        x: Math.floor(event.changedTouches[0].x * (picker.width / canvasWidth)), 
        y: picker.height - Math.floor(event.changedTouches[0].y * (picker.height / canvasHeight))
    });

    if (selected.length > 0) {
        // Get the graph node used by the selected mesh instance
        var entity = selected[0].node;

        // Bubble up the hierarchy until we find an actual Entity
        while (!(entity instanceof pc.Entity) && entity !== null) {
            entity = entity.getParent();
        }
        if (entity && entity.name == "Plane") {
            if(document.getElementById("delete").checked){
                for(var hhh = 0;hhh<meshs.length;hhh++){
                    if(entity.parent.getLocalPosition().equals(meshs[hhh])){
                        if(pool._children.length > 1){
                            var work = new Object();
                            work = {do : "delete" ,pos : entity.parent.getLocalPosition().clone(), col : entity.parent.mycol.clone()};
                            works[progress] = work;
                            works.splice(progress + 1,works.length - progress);
                            progress++;
                            texs.splice(hhh,1);
                            meshs.splice(hhh,1);
                            entity.parent.destroy();
                            break;
                        }
                    }
                }
            }else if(document.getElementById("colpic").checked && !isPicked){
                    pool.script.boxmanager.colpic(entity);
            }else if(document.getElementById("copypaste").checked){
                if(isCopy){
                    if(!entity.parent.copychecked){
                        newarray[numofcopy] = new Object();
                        var entitypos = entity.parent.getLocalPosition().clone();
                        newarray[numofcopy].absolutely = entity.parent.getLocalPosition();
                        if(numofcopy === 0){
                            newarray[numofcopy].pos = new pc.Vec3(0,0,0);
                        }else{
                            newarray[numofcopy].pos = entitypos.sub(newarray[0].absolutely);
                        }
                        newarray[numofcopy].col = entity.parent.mycol.clone();
                        newarray[numofcopy].mat = entity.model.meshInstances[0].material;
                        entity.parent.copychecked = true;
                        numofcopy++;
                    }else{
                        var delpos = entity.parent.getLocalPosition().clone();
                        for(var ll = 0;ll<newarray.length;ll++){
                            if(newarray[ll].absolutely.equals(delpos)){
                                newarray.splice(ll,1);
                            }
                        }
                        entity.parent.copychecked = false;
                        numofcopy--;
                    }                   
                }
                if(isPaste){
                    entity.script.hoveradd.addarrayobj(copyarray);
                }
            }else{
                var work = new Object();
                var color = new pc.Color(getcolor()[0] / 255,getcolor()[1] / 255,getcolor()[2] / 255,getcolor()[3]);
                work = {do : "addbox" ,pos : entity.script.hoveradd.targetpos, col : color};
                works[progress] = work;
                works.splice(progress + 1,works.length - progress);
                progress++;
                entity.script.hoveradd.addobj();
            }
            pool.script.boxmanager.manage();
        }
    }
    event.event.preventDefault();
};