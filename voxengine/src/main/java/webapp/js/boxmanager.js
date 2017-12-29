var Boxmanager = pc.createScript('boxmanager');
var toobjstring = "";
var vertdef;
var normdef;
var vn;
var __self;
var numofvoxel;
var urlmes;
var sharelink;
var ncmb;
var voxelID;
var isShadow;
var isLoading = false;
var col;
var colR;
var colG;
var colB;
var opa;
var nowcolor = new pc.Color(1,1,1,1);
var oldstring = "";
var oldcolor = new pc.Color(1,1,1,1);
isPicked = false;
var tarray;


// initialize code called once per entity
Boxmanager.prototype.initialize = function() {
    if(document.domain == "playcanv.as" && !get_url_vars().remove){
        window.location.href = "https://voxelcanvas.me/build";
    }
    
    username = "";
    author = this.app.root.findByName("author");
    __self = this;
    state = 0;
    //全ボクセルの座標情報を格納
    meshs = [];
    //全ボクセルの色情報を格納
    texs = [];
    
    //全ての行動を記録する配列と現在地を記録
    works = [];
    progress = 0;
    
    
    numofvoxel = 1;

    //HTMLリソースのロード及び初期化
    var htmlAsset;
    if(this.app.touch){
        htmlAsset = this.app.assets.find('iosindex');
    }else{
        htmlAsset = this.app.assets.find('index.html');
    }
    var div = document.createElement('div');
    div.innerHTML = htmlAsset.resource;
    document.body.appendChild(div);

    htmlAsset.on('load', function () {
        div.innerHTML = htmlAsset.resource;
    });

    // CSSリソースのロード及び初期化
    var cssAsset = this.app.assets.find('style.css');

    var style = document.createElement('style');
    document.head.appendChild(style);
    style.innerHTML = cssAsset.resource;

    cssAsset.on('load', function() {
        style.innerHTML = cssAsset.resource;
    });

    $(".colbox").colorbox({iframe:true, width:"95%", height:"95%"});

    //.obj保存用変数
    vertdef = [
        new pc.Vec3(0,0,0),
        new pc.Vec3(1,0,0),
        new pc.Vec3(0,1,0),
        new pc.Vec3(1,1,0),
        new pc.Vec3(0,0,1),
        new pc.Vec3(1,0,1),
        new pc.Vec3(0,1,1),
        new pc.Vec3(1,1,1),
    ];

    normdef =[
        new pc.Vec4(1,3,4,2),
        new pc.Vec4(1,5,7,3),
        new pc.Vec4(2,4,8,6),
        new pc.Vec4(1,2,6,5),
        new pc.Vec4(3,7,8,4),
        new pc.Vec4(5,6,8,7)
    ];

    vn = [
        new pc.Vec3(0,0,1),
        new pc.Vec3(-1,0,0),
        new pc.Vec3(1,0,0),
        new pc.Vec3(0,-1,0),
        new pc.Vec3(0,1,0),
        new pc.Vec3(0,0,1)
    ];
    sharelink = document.getElementById("sharelink");
    ncmb = new NCMB("b2f6f4a56fca380280fa846bcb875beaa7baf4d349a151dc37024dfc965fdd63","ca4ba6d24f03c71067591619abb0cf22a36bcdf3b10bf8ecdfb6f145a3c66629");
    this.initganeratevoxels();
    isShadow = false;
    copycolorflag = false;
};

Boxmanager.prototype.initganeratevoxels = function(){
    //init
    //URLパラメータから文字列を受け取りスプリット
    var senderobjid = get_url_vars().m;
    var initvoxels = get_url_vars().v;
    if(senderobjid){
        isLoading = true;
        this.geter(senderobjid);
    }else if(initvoxels){
        var inimat = new pc.StandardMaterial();
        inimat.diffuse.set(1,1,1);
        inimat.blendType = pc.BLEND_NORMAL;
        inimat.opacity = 1;
        inimat.update();
        var x = initvoxels.split("x")[0];
        var y = initvoxels.split("x")[1];
        var z = initvoxels.split("x")[2];
        for(var ix = 0 ;ix < x; ix++){
            for(var iy = 0; iy < y; iy++){
                for(var iz = 0; iz < z;iz++){
                    this.entity._children[0]._children[0].script.hoveradd.initaddobj(ix,iy,iz,255,255,255,1,inimat);
                    texs.push([255,255,255,1]);
                }
            }
        }
        pool.script.boxmanager.manage();
        pool._children[0].destroy();
        author.isMine = true;
    }else{
        meshs.push(pool._children[0].getPosition());
        texs.push(getcolor().toString());
        author.isMine = true;
    }
};

window.addEventListener('hashchange', function(e) {
    //__self.initganeratevoxels();
}, false);

// update code called every frame
Boxmanager.prototype.update = function(dt) {
    if(this.app.touch){
        if(isPicked){
            document.getElementById("colorrange").disabled = true;
            document.getElementById("glay").disabled = true;
            document.getElementById("sv").disabled = true;
            if(!document.getElementById("colpic").checked){
                isPicked = false;
                document.getElementById("pic").innerHTML = "picker";
            }
        }else{
            document.getElementById("colorrange").disabled = false;
            document.getElementById("glay").disabled = false;
            document.getElementById("sv").disabled = false;
        }        
    }
    if(progress > 0){
        document.getElementById("undo").disabled = false;
    }else{
        document.getElementById("undo").disabled = true;
    }
    if(works.length > progress){
        document.getElementById("redo").disabled = false;
    }else{
        document.getElementById("redo").disabled = true;
    }
    
    
    /////////Undo
    document.getElementById("undo").onclick = function(){
        undo();
    };
    
    if(this.app.keyboard.isPressed(pc.KEY_CONTROL)||this.app.keyboard.isPressed(pc.KEY_COMMA)){
        if(this.app.keyboard.wasPressed(pc.KEY_Z)){
            undo();
        }
    }
    
    
    /////Redo
    document.getElementById("redo").onclick = function(){
        redo();
    };
    if(this.app.keyboard.isPressed(pc.KEY_CONTROL)||this.app.keyboard.isPressed(pc.KEY_COMMA)){
        if(this.app.keyboard.wasPressed(pc.KEY_Y)){
            redo();
        }
    }
    
    //save
    if(document.getElementById("save")){
        document.getElementById("save").onclick = function(){
            __self.sender(voxelID,urlmes,username);
            var url = "https://voxelcanvas.me/create?m="+voxelID;
            if(document.getElementById("savewindow")){
                document.getElementById("url").value = url;
                document.getElementById("savewindow").style.cssText = "right:0%;";
                document.getElementById("save").innerHTML = "saved<img src='https://utautattaro.com/storage/ic_save_white_24dp_1x.png' width='15px' height='15px'/>";
                $(document).ready(function(){
                    $("#url").click(function(){
                        $(this).select();
                    });
                });
            }
        };
    }
    if(this.app.keyboard.isPressed(pc.KEY_CONTROL)||this.app.keyboard.isPressed(pc.KEY_COMMA)){
        if(this.app.keyboard.isPressed(pc.KEY_SHIFT)){
            if(!__self.app.touch){
                if(username || !author.isMine){
                    if(this.app.keyboard.wasPressed(pc.KEY_S)){
                        __self.sender(voxelID,urlmes,username);
                        var url = "https://voxelcanvas.me/create?m="+voxelID;
                        if(document.getElementById("savewindow")){
                            document.getElementById("url").value = url;
                            document.getElementById("savewindow").style.cssText = "right:0%;";
                            $(document).ready(function(){
                                $("#url").click(function(){
                                    $(this).select();
                                });
                            });
                        }
                    }
                }
            }
        }
    }

    
    
    if(!this.app.touch){
         if(document.getElementById("colpic").checked){
            document.body.style.cursor = "crosshair";
        }else{
            document.body.style.cursor = "default";
        }       
    }

    
    document.getElementById("sharelink").onclick = function(){
        if(!__self.app.touch){
            if(username || !author.isMine){
                var imgdata = document.getElementById('application-canvas').toDataURL();
                sampleForm(voxelID,imgdata);

                // var canvas = document.getElementById ('application-canvas');
                // // Get image data from canvas
                // var imageData = canvas.toDataURL ();
                // var twimage = document.createElement("meta");
                // twimage.name = "twitter:image";
                // twimage.content = imageData.toString();
                // document.head.appendChild(twimage);
                //__self.manage();
                __self.sender(voxelID,urlmes,username);            
            }            
        }else{
            var idata = document.getElementById('application-canvas').toDataURL();
            sampleForm(voxelID,idata);
            __self.sender(voxelID,urlmes,username);
        }

    };
    
    if(!this.app.touch){
         if(document.getElementById("shadow").checked){
            if(!isShadow){
                for(var loop=0;loop<pool._children.length;loop++){
                    for(loop2=0;loop2<pool._children[loop]._children.length;loop2++){
                        pool._children[loop]._children[loop2].model.castShadows = true;
                        pool._children[loop]._children[loop2].model.castShadowsLightmap = true;
                        pool._children[loop]._children[loop2].model.receiveShadows = true; 
                    }
                }
                isShadow = true;
              }
        }else if(isShadow){
            for(var loop=0;loop<pool._children.length;loop++){
                for(loop2=0;loop2<pool._children[loop]._children.length;loop2++){
                    pool._children[loop]._children[loop2].model.castShadows = false;
                    pool._children[loop]._children[loop2].model.castShadowsLightmap = false;
                    pool._children[loop]._children[loop2].model.receiveShadows = false; 
                }
            }
            isShadow = false;
        }        
    }

    // //         $.get("http://tinyurl.com/api-create.php?url=google.com", function(shorturl){
    // //     alert(shorturl)
    // // });

    //         window.location.href = post;

    // //         __self.loadJsonFromRemote(post, function (data) {
    // //         // display JSON data from remote server
    // //         console.log(data);
    // //             if(data){
    // //                 document.getElementById("shareurl").value = data;
    // //             }else{
    // //                 document.getElementById("shareurl").value = url;
    // //             }

    // //         });
    //     };
    //     
    
    if(this.app.touch){
        if(!isPicked){
            if(document.getElementById("glay").checked){
                colR = 1 - document.getElementById("sv").value / 199;
                colG = 1 - document.getElementById("sv").value / 199;
                colB = 1 - document.getElementById("sv").value / 199;
                
                document.getElementById("sv").style.cssText = "background-image: -webkit-linear-gradient(90deg, #fff 0%, #000 100%);background-image: linear-gradient(90deg, #fff 0%, #000 100%);";
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
                
                var middle = colorsys.hsv_to_rgb({ h: hsv, s: 99, v: 99 });
                var mostwhite = colorsys.hsv_to_rgb({ h: hsv, s: 0, v: 99 });
                var mostblack = colorsys.hsv_to_rgb({ h: hsv, s: 99, v: 0 });
                
                var rangecol = "background-image: linear-gradient(90deg,";
                rangecol += "rgb(" + mostwhite.r +","+ mostwhite.g + "," + mostwhite.b +")0%,";
                rangecol += "rgb(" + middle.r +","+ middle.g + "," + middle.b +")50%,";
                rangecol += "rgb(" + mostblack.r +","+ mostblack.g + "," + mostblack.b +")100%);";
                rangecol += "-webkit-background-image: linear-gradient(90deg,";
                rangecol += "rgb(" + mostwhite.r +","+ mostwhite.g + "," + mostwhite.b +")0%,";
                rangecol += "rgb(" + middle.r +","+ middle.g + "," + middle.b +")50%,";
                rangecol += "rgb(" + mostblack.r +","+ mostblack.g + "," + mostblack.b +")100%);";
                document.getElementById("sv").style.cssText = rangecol;
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
    
    
    var csscol = "background-color:rgba(";
    csscol += getcolor()[0] +","+ getcolor()[1] + "," + getcolor()[2] +","+ getcolor()[3] + ")";
    if(oldstring != csscol){
        document.getElementById("game_ui").style.cssText = csscol;
        defmat = new pc.StandardMaterial();
        defmat.diffuse.set(colR,colG,colB);
        defmat.blendType = pc.BLEND_NORMAL;
        defmat.opacity = opa / 100;
        defmat.update();
        if(!this.app.touch){
            copycolorflag = true;
            colchange = true;            
        }
        oldstring = csscol;
    }
    
    
    nowcolor = new pc.Color(colR,colG,colB,opa / 100);
    if(document.getElementById("copypaste")){
        if(document.getElementById("copypaste").checked){
            if(document.getElementById("guide")){
                document.getElementById("guide").style.cssText = "bottom:0%;";
            }
            if(!isCopy && !isPaste){
                //コピー実行開始
                newarray = [];
                numofcopy = 0;
                isCopy = true;
            }

            if(newarray[0]){
                //選択開始
                for(var i = 0;i < newarray.length;i++){
                    colpicbox(newarray[i].absolutely);
                }
                
                //コピペする
                if(((this.app.keyboard.isPressed(pc.KEY_CONTROL)||(this.app.keyboard.isPressed(pc.KEY_COMMA))) && this.app.keyboard.wasPressed(pc.KEY_C))||doubletap){
                    if(!copycolorflag){
                        //選択終了
                        isCopy = false;
                        doubletap = false;
                        //コピー
                        copyarray = newarray;
                        newarray = [];
                        for(var l = 0;l < pool.children.length;l++){
                            pool.children[l].copychecked = false;
                        }
                        isPaste = true;
                        document.getElementById("cop").innerHTML = "paste";
                        document.getElementById("cop").style.cssText = "background-image: url(https://utautattaro.com/storage/ic_content_paste_black_24dp_1x.png),linear-gradient(90deg, #146dfc 0%, #144ddc 100%);";
                    }
                }
                
                //一括削除する
                if(this.app.keyboard.wasPressed(pc.KEY_DELETE)){
                    if(!copycolorflag){
                        //選択したボクセルを削除
                        isCopy = false;
                        var temparray = [];
                        for(var lll = 0;lll < newarray.length;lll++){
                            for(var ll = 0;ll < pool.children.length;ll++){
                                    if(pool.children[ll].getLocalPosition().equals(newarray[lll].absolutely)){
                                        var delobj = new Object();
                                        delobj.pos = newarray[lll].absolutely.clone();
                                        delobj.col = newarray[lll].col.clone();
                                        temparray.push(delobj);
                                        if(pool.children.length > 1){
                                            pool.children[ll].destroy();
                                        }
                                }
                            }
                            for(var llll = 0;llll<meshs.length;llll++){
                                if(newarray[lll].absolutely.equals(meshs[llll])){
                                    if(pool.children.length > 1){
                                        texs.splice(llll,1);
                                        meshs.splice(llll,1);
                                    }
                                }
                            }
                        }
                        works[progress] = {do : "deletearray" ,array : temparray};
                        works.splice(progress + 1,works.length - progress);
                        progress++;
                        this.manage();
                        document.getElementById("copypaste").checked = false;      
                    }                  
                }
                
                //色を変更する
                if(!this.app.touch){
                    if(copycolorflag){
                        var work = new Object();
                        document.getElementById("cop").innerHTML = "color";
                        document.getElementById("cop").style.cssText = "background-image: url(https://utautattaro.com/storage/ic_invert_colors_black_24dp_1x.png),linear-gradient(90deg, #146dfc 0%, #144ddc 100%);";
                        for(var cl = 0;cl< newarray.length;cl++){
                            for(ccl = 0; ccl < pool.children.length;ccl++){
                                if(pool.children[ccl].getLocalPosition().equals(newarray[cl].absolutely)){
                                    var newcolor = new pc.Color(getcolor()[0]/255,getcolor()[1]/255,getcolor()[2]/255,getcolor()[3]);
                                    if(newarray[cl].col.toString() != newcolor.toString()){
                                        var tag = new Object();
                                        tag.pos = newarray[cl].absolutely.clone();
                                        if(!tarray[cl]){
                                            tag.oldcol = pool.children[ccl].mycol.clone();
                                        }else{
                                            tag.oldcol = tarray[cl].oldcol.clone();
                                        }
                                        tag.newcol = new pc.Color(getcolor()[0]/255,getcolor()[1]/255,getcolor()[2]/255,getcolor()[3]);
                                        tarray[cl] = tag;
                                        
                                        pool.children[ccl].mycol = new pc.Color(getcolor()[0]/255,getcolor()[1]/255,getcolor()[2]/255,getcolor()[3]);
                                        newarray[cl].col = new pc.Color(getcolor()[0]/255,getcolor()[1]/255,getcolor()[2]/255,getcolor()[3]);
                                        for(var j = 0;j<pool.children[ccl].children.length;j++){
                                            pool.children[ccl]._children[j].model.meshInstances[0].material = defmat;
                                        }
                                    }
                                }
                            }
                            for(var cll = 0;cll<meshs.length;cll++){
                                if(newarray[cl].absolutely.equals(meshs[cll])){
                                    texs.splice(cll,1);
                                    texs.splice(cll,0,getcolor().toString());
                                }
                            }
                        }
                        if(colchange){
                            this.manage();
                            colchange = false;
                        }
                    }
                }
            }
            
        }
        
        if(!document.getElementById("copypaste").checked){
            if(document.getElementById("guide")){
                document.getElementById("guide").style.cssText = "bottom:-100%;";
            }
            if(newarray.length > 0 && copycolorflag){
                //色変更終了
                works[progress] = {do : "colorchange" ,array : tarray};
                works.splice(progress + 1,works.length - progress);
                progress++;
                console.log(works);
            }
            //コピペ終了
            copyarray = [];
            newarray = [];
            tarray = [];
            for(var lli = 0;lli < pool.children.length;lli++){
                pool.children[lli].copychecked = false;
            }
            isPaste = false;
            isCopy = false;
            copycolorflag = false;
            document.getElementById("cop").innerHTML = "edit";
            document.getElementById("cop").style.cssText = "url(https://utautattaro.com/storage/ic_border_color_black_24dp_1x.png),linear-gradient(90deg, #146dfc 0%, #144ddc 100%);";
        }        
    }
};

getcolor = function(){
    if(!colR && colR !== 0){
        return [255,255,255,1];
    }else{
        return [parseInt(colR * 255,10),parseInt(colG * 255,10),parseInt(colB * 255,10),parseInt(opa,10)/100];
    }
};
    
redo = function(){
    var dowork = works[progress];
            //この作業をdoする
            if(dowork){
            switch(dowork.do){
                    case "delete" : 
                    
                    //ボクセルひとつ削除
                    for(var hhh = 0;hhh<meshs.length;hhh++){
                        if(dowork.pos.equals(meshs[hhh])){
                            texs.splice(hhh,1);
                            meshs.splice(hhh,1);
                            break;
                        }
                    }
                    for(var hh = 0;hh<pool.children.length;hh++){
                        if(dowork.pos.equals(pool.children[hh].getLocalPosition())){
                            pool.children[hh].destroy();
                            break;
                        }
                    }
                    
                    break;
                    
                    case "deletearray" : 
                    //ボクセル複数削除
                        for(var i = 0; i < dowork.array.length;i++){
                            for(var hhh = 0;hhh<meshs.length;hhh++){
                                if(dowork.array[i].pos.equals(meshs[hhh])){
                                    texs.splice(hhh,1);
                                    meshs.splice(hhh,1);
                                    break;
                                }
                            }
                            for(var hh = 0;hh<pool.children.length;hh++){
                                if(dowork.array[i].pos.equals(pool.children[hh].getLocalPosition())){
                                    pool.children[hh].destroy();
                                    break;
                                }
                            }
                        }
                    break;
                    case "addbox" : 
                    //ボクセル追加
                    pool._children[0]._children[0].script.hoveradd.redoobj(dowork.pos,dowork.col);

                    break;
                    case "addarray" : 
                    //ボクセル複数追加
                    for(var i = 0;i<dowork.array.length;i++){
                        pool._children[0]._children[0].script.hoveradd.redoobj(dowork.array[i].target,dowork.array[i].col);
                    }

                    break;
                    case "colorchange" :
                    //old -> newへ
                    for(var dochl = 0;dochl< dowork.array.length;dochl++){
                        for(var dochll = 0; dochll < pool.children.length;dochll++){
                            if(pool.children[dochll].getLocalPosition().equals(dowork.array[dochl].pos)){
                                pool.children[dochll].mycol = dowork.array[dochl].newcol.clone();
                                
                                var domat = new pc.StandardMaterial();
                                domat.diffuse.set(dowork.array[dochl].newcol.r,dowork.array[dochl].newcol.g,dowork.array[dochl].newcol.b);
                                domat.blendType = pc.BLEND_NORMAL;
                                domat.opacity = dowork.array[dochl].newcol.a;
                                domat.update();
                                
                                for(var j = 0;j<pool.children[dochll].children.length;j++){
                                    pool.children[dochll]._children[j].model.meshInstances[0].material = domat;
                                }
                            }
                        }
                        for(var cll = 0;cll<meshs.length;cll++){
                            if(dowork.array[dochl].pos.equals(meshs[cll])){
                                texs.splice(cll,1);
                                var dostring = [parseInt(dowork.array[dochl].newcol.r *255,10),parseInt(dowork.array[dochl].newcol.g *255,10),parseInt(dowork.array[dochl].newcol.b *255,10),dowork.array[dochl].newcol.a];
                                texs.splice(cll,0,dostring.toString());
                            }
                        }
                    }
                    break;

            }       
                document.getElementById("copypaste").checked = false;
                progress++;
                __self.manage();
        }
};


undo = function(){
    var currentwork = works[progress - 1];
            if(progress > 0){
            switch(currentwork.do){
                    case "addbox" : 
                    
                    //ボクセルひとつ追加なので削除
                    for(var hhh = 0;hhh<meshs.length;hhh++){
                        if(currentwork.pos.equals(meshs[hhh])){
                            texs.splice(hhh,1);
                            meshs.splice(hhh,1);
                            break;
                        }
                    }
                    for(var hh = 0;hh<pool.children.length;hh++){
                        if(currentwork.pos.equals(pool.children[hh].getLocalPosition())){
                            pool.children[hh].destroy();
                            break;
                        }
                    }
                    
                    break;
                    
                    case "addarray" : 
                    //ボクセル複数追加なので複数削除
                    
                    for(var i = 0; i < currentwork.array.length;i++){
                        for(var hhh = 0;hhh<meshs.length;hhh++){
                            if(currentwork.array[i].target.equals(meshs[hhh])){
                                texs.splice(hhh,1);
                                meshs.splice(hhh,1);
                                break;
                            }
                        }
                        for(var hh = 0;hh<pool.children.length;hh++){
                            if(currentwork.array[i].target.equals(pool.children[hh].getLocalPosition())){
                                pool.children[hh].destroy();
                                break;
                            }
                        }
                    }

                    break;
                    case "delete" : 
                    //ボクセル削除なので追加
                    pool._children[0]._children[0].script.hoveradd.redoobj(currentwork.pos,currentwork.col);

                    break;
                    case "deletearray" : 
                    //ボクセル複数削除なので複数追加
                    for(var ii = 0;ii<currentwork.array.length;ii++){
                        pool._children[0]._children[0].script.hoveradd.redoobj(currentwork.array[ii].pos,currentwork.array[ii].col);
                    }

                    break;
                    case "colorchange" :
                    //new -> oldへ
                    for(var chl = 0;chl< currentwork.array.length;chl++){
                        for(var chll = 0; chll < pool.children.length;chll++){
                            if(pool.children[chll].getLocalPosition().equals(currentwork.array[chl].pos)){
                                pool.children[chll].mycol = currentwork.array[chl].oldcol.clone();
                                
                                var mat = new pc.StandardMaterial();
                                mat.diffuse.set(currentwork.array[chl].oldcol.r,currentwork.array[chl].oldcol.g,currentwork.array[chl].oldcol.b);
                                mat.blendType = pc.BLEND_NORMAL;
                                mat.opacity = currentwork.array[chl].oldcol.a;
                                mat.update();
                                
                                for(var j = 0;j<pool.children[chll].children.length;j++){
                                    pool.children[chll]._children[j].model.meshInstances[0].material = mat;
                                }
                            }
                        }
                        for(var cll = 0;cll<meshs.length;cll++){
                            if(currentwork.array[chl].pos.equals(meshs[cll])){
                                texs.splice(cll,1);
                                var string = [parseInt(currentwork.array[chl].oldcol.r * 255,10),parseInt(currentwork.array[chl].oldcol.g * 255,10),parseInt(currentwork.array[chl].oldcol.b * 255,10),currentwork.array[chl].oldcol.a];
                                texs.splice(cll,0,string.toString());
                            }
                        }
                    }
                    break;

            }       
                progress--;
                document.getElementById("copypaste").checked = false;
                __self.manage();
        }
};
    
function drawbox(pos){
    __self.app.renderLine(new pc.Vec3(pos.x+0.5,pos.y+0.5,pos.z+0.5),new pc.Vec3(pos.x-0.5,pos.y+0.5,pos.z+0.5), nowcolor);
    __self.app.renderLine(new pc.Vec3(pos.x+0.5,pos.y+0.5,pos.z+0.5),new pc.Vec3(pos.x+0.5,pos.y+0.5,pos.z-0.5), nowcolor);
    __self.app.renderLine(new pc.Vec3(pos.x+0.5,pos.y+0.5,pos.z+0.5),new pc.Vec3(pos.x+0.5,pos.y-0.5,pos.z+0.5), nowcolor);
    __self.app.renderLine(new pc.Vec3(pos.x+0.5,pos.y-0.5,pos.z-0.5),new pc.Vec3(pos.x+0.5,pos.y-0.5,pos.z+0.5), nowcolor);
    __self.app.renderLine(new pc.Vec3(pos.x+0.5,pos.y-0.5,pos.z-0.5),new pc.Vec3(pos.x+0.5,pos.y+0.5,pos.z-0.5), nowcolor);
    __self.app.renderLine(new pc.Vec3(pos.x+0.5,pos.y-0.5,pos.z-0.5),new pc.Vec3(pos.x-0.5,pos.y-0.5,pos.z-0.5), nowcolor);
    __self.app.renderLine(new pc.Vec3(pos.x-0.5,pos.y-0.5,pos.z+0.5),new pc.Vec3(pos.x+0.5,pos.y-0.5,pos.z+0.5), nowcolor);
    __self.app.renderLine(new pc.Vec3(pos.x-0.5,pos.y-0.5,pos.z+0.5),new pc.Vec3(pos.x-0.5,pos.y-0.5,pos.z-0.5), nowcolor);
    __self.app.renderLine(new pc.Vec3(pos.x-0.5,pos.y-0.5,pos.z+0.5),new pc.Vec3(pos.x-0.5,pos.y+0.5,pos.z+0.5), nowcolor);
    __self.app.renderLine(new pc.Vec3(pos.x-0.5,pos.y+0.5,pos.z-0.5),new pc.Vec3(pos.x+0.5,pos.y+0.5,pos.z-0.5), nowcolor);
    __self.app.renderLine(new pc.Vec3(pos.x-0.5,pos.y+0.5,pos.z-0.5),new pc.Vec3(pos.x-0.5,pos.y+0.5,pos.z+0.5), nowcolor);
    __self.app.renderLine(new pc.Vec3(pos.x-0.5,pos.y+0.5,pos.z-0.5),new pc.Vec3(pos.x-0.5,pos.y-0.5,pos.z-0.5), nowcolor);
}

function drawcolorbox(pos,color){
    __self.app.renderLine(new pc.Vec3(pos.x+0.5,pos.y+0.5,pos.z+0.5),new pc.Vec3(pos.x-0.5,pos.y+0.5,pos.z+0.5), color);
    __self.app.renderLine(new pc.Vec3(pos.x+0.5,pos.y+0.5,pos.z+0.5),new pc.Vec3(pos.x+0.5,pos.y+0.5,pos.z-0.5), color);
    __self.app.renderLine(new pc.Vec3(pos.x+0.5,pos.y+0.5,pos.z+0.5),new pc.Vec3(pos.x+0.5,pos.y-0.5,pos.z+0.5), color);
    __self.app.renderLine(new pc.Vec3(pos.x+0.5,pos.y-0.5,pos.z-0.5),new pc.Vec3(pos.x+0.5,pos.y-0.5,pos.z+0.5), color);
    __self.app.renderLine(new pc.Vec3(pos.x+0.5,pos.y-0.5,pos.z-0.5),new pc.Vec3(pos.x+0.5,pos.y+0.5,pos.z-0.5), color);
    __self.app.renderLine(new pc.Vec3(pos.x+0.5,pos.y-0.5,pos.z-0.5),new pc.Vec3(pos.x-0.5,pos.y-0.5,pos.z-0.5), color);
    __self.app.renderLine(new pc.Vec3(pos.x-0.5,pos.y-0.5,pos.z+0.5),new pc.Vec3(pos.x+0.5,pos.y-0.5,pos.z+0.5), color);
    __self.app.renderLine(new pc.Vec3(pos.x-0.5,pos.y-0.5,pos.z+0.5),new pc.Vec3(pos.x-0.5,pos.y-0.5,pos.z-0.5), color);
    __self.app.renderLine(new pc.Vec3(pos.x-0.5,pos.y-0.5,pos.z+0.5),new pc.Vec3(pos.x-0.5,pos.y+0.5,pos.z+0.5), color);
    __self.app.renderLine(new pc.Vec3(pos.x-0.5,pos.y+0.5,pos.z-0.5),new pc.Vec3(pos.x+0.5,pos.y+0.5,pos.z-0.5), color);
    __self.app.renderLine(new pc.Vec3(pos.x-0.5,pos.y+0.5,pos.z-0.5),new pc.Vec3(pos.x-0.5,pos.y+0.5,pos.z+0.5), color);
    __self.app.renderLine(new pc.Vec3(pos.x-0.5,pos.y+0.5,pos.z-0.5),new pc.Vec3(pos.x-0.5,pos.y-0.5,pos.z-0.5), color);
}

function deletebox(pos){
    var red = new pc.Color(1,0,0,1);
    __self.app.renderLine(new pc.Vec3(pos.x+0.5,pos.y+0.5,pos.z+0.5),new pc.Vec3(pos.x-0.5,pos.y+0.5,pos.z+0.5), red);
    __self.app.renderLine(new pc.Vec3(pos.x+0.5,pos.y+0.5,pos.z+0.5),new pc.Vec3(pos.x+0.5,pos.y+0.5,pos.z-0.5), red);
    __self.app.renderLine(new pc.Vec3(pos.x+0.5,pos.y+0.5,pos.z+0.5),new pc.Vec3(pos.x+0.5,pos.y-0.5,pos.z+0.5), red);
    __self.app.renderLine(new pc.Vec3(pos.x+0.5,pos.y-0.5,pos.z-0.5),new pc.Vec3(pos.x+0.5,pos.y-0.5,pos.z+0.5), red);
    __self.app.renderLine(new pc.Vec3(pos.x+0.5,pos.y-0.5,pos.z-0.5),new pc.Vec3(pos.x+0.5,pos.y+0.5,pos.z-0.5), red);
    __self.app.renderLine(new pc.Vec3(pos.x+0.5,pos.y-0.5,pos.z-0.5),new pc.Vec3(pos.x-0.5,pos.y-0.5,pos.z-0.5), red);
    __self.app.renderLine(new pc.Vec3(pos.x-0.5,pos.y-0.5,pos.z+0.5),new pc.Vec3(pos.x+0.5,pos.y-0.5,pos.z+0.5), red);
    __self.app.renderLine(new pc.Vec3(pos.x-0.5,pos.y-0.5,pos.z+0.5),new pc.Vec3(pos.x-0.5,pos.y-0.5,pos.z-0.5), red);
    __self.app.renderLine(new pc.Vec3(pos.x-0.5,pos.y-0.5,pos.z+0.5),new pc.Vec3(pos.x-0.5,pos.y+0.5,pos.z+0.5), red);
    __self.app.renderLine(new pc.Vec3(pos.x-0.5,pos.y+0.5,pos.z-0.5),new pc.Vec3(pos.x+0.5,pos.y+0.5,pos.z-0.5), red);
    __self.app.renderLine(new pc.Vec3(pos.x-0.5,pos.y+0.5,pos.z-0.5),new pc.Vec3(pos.x-0.5,pos.y+0.5,pos.z+0.5), red);
    __self.app.renderLine(new pc.Vec3(pos.x-0.5,pos.y+0.5,pos.z-0.5),new pc.Vec3(pos.x-0.5,pos.y-0.5,pos.z-0.5), red);
    __self.app.renderLine(new pc.Vec3(pos.x+0.5,pos.y+0.5,pos.z+0.5),new pc.Vec3(pos.x+0.5,pos.y-0.5,pos.z-0.5), red);
    __self.app.renderLine(new pc.Vec3(pos.x+0.5,pos.y+0.5,pos.z-0.5),new pc.Vec3(pos.x-0.5,pos.y-0.5,pos.z-0.5), red);
    __self.app.renderLine(new pc.Vec3(pos.x-0.5,pos.y+0.5,pos.z-0.5),new pc.Vec3(pos.x-0.5,pos.y-0.5,pos.z+0.5), red);
    __self.app.renderLine(new pc.Vec3(pos.x-0.5,pos.y+0.5,pos.z+0.5),new pc.Vec3(pos.x+0.5,pos.y-0.5,pos.z+0.5), red);
    __self.app.renderLine(new pc.Vec3(pos.x+0.5,pos.y-0.5,pos.z-0.5),new pc.Vec3(pos.x-0.5,pos.y-0.5,pos.z+0.5), red);
    __self.app.renderLine(new pc.Vec3(pos.x-0.5,pos.y+0.5,pos.z+0.5),new pc.Vec3(pos.x+0.5,pos.y+0.5,pos.z-0.5), red);
    __self.app.renderLine(new pc.Vec3(pos.x+0.5,pos.y+0.5,pos.z-0.5),new pc.Vec3(pos.x+0.5,pos.y-0.5,pos.z+0.5), red);
    __self.app.renderLine(new pc.Vec3(pos.x-0.5,pos.y+0.5,pos.z-0.5),new pc.Vec3(pos.x+0.5,pos.y-0.5,pos.z-0.5), red);
    __self.app.renderLine(new pc.Vec3(pos.x-0.5,pos.y+0.5,pos.z+0.5),new pc.Vec3(pos.x-0.5,pos.y-0.5,pos.z-0.5), red);
    __self.app.renderLine(new pc.Vec3(pos.x+0.5,pos.y+0.5,pos.z+0.5),new pc.Vec3(pos.x-0.5,pos.y-0.5,pos.z+0.5), red);
    __self.app.renderLine(new pc.Vec3(pos.x+0.5,pos.y-0.5,pos.z+0.5),new pc.Vec3(pos.x-0.5,pos.y-0.5,pos.z-0.5), red);
    __self.app.renderLine(new pc.Vec3(pos.x+0.5,pos.y+0.5,pos.z+0.5),new pc.Vec3(pos.x-0.5,pos.y+0.5,pos.z-0.5), red);
}

function colpicbox(pos){
    var red = new pc.Color(1,1,1,1);
    __self.app.renderLine(new pc.Vec3(pos.x+0.5,pos.y+0.5,pos.z+0.5),new pc.Vec3(pos.x-0.5,pos.y+0.5,pos.z+0.5), red);
    __self.app.renderLine(new pc.Vec3(pos.x+0.5,pos.y+0.5,pos.z+0.5),new pc.Vec3(pos.x+0.5,pos.y+0.5,pos.z-0.5), red);
    __self.app.renderLine(new pc.Vec3(pos.x+0.5,pos.y+0.5,pos.z+0.5),new pc.Vec3(pos.x+0.5,pos.y-0.5,pos.z+0.5), red);
    __self.app.renderLine(new pc.Vec3(pos.x+0.5,pos.y-0.5,pos.z-0.5),new pc.Vec3(pos.x+0.5,pos.y-0.5,pos.z+0.5), red);
    __self.app.renderLine(new pc.Vec3(pos.x+0.5,pos.y-0.5,pos.z-0.5),new pc.Vec3(pos.x+0.5,pos.y+0.5,pos.z-0.5), red);
    __self.app.renderLine(new pc.Vec3(pos.x+0.5,pos.y-0.5,pos.z-0.5),new pc.Vec3(pos.x-0.5,pos.y-0.5,pos.z-0.5), red);
    __self.app.renderLine(new pc.Vec3(pos.x-0.5,pos.y-0.5,pos.z+0.5),new pc.Vec3(pos.x+0.5,pos.y-0.5,pos.z+0.5), red);
    __self.app.renderLine(new pc.Vec3(pos.x-0.5,pos.y-0.5,pos.z+0.5),new pc.Vec3(pos.x-0.5,pos.y-0.5,pos.z-0.5), red);
    __self.app.renderLine(new pc.Vec3(pos.x-0.5,pos.y-0.5,pos.z+0.5),new pc.Vec3(pos.x-0.5,pos.y+0.5,pos.z+0.5), red);
    __self.app.renderLine(new pc.Vec3(pos.x-0.5,pos.y+0.5,pos.z-0.5),new pc.Vec3(pos.x+0.5,pos.y+0.5,pos.z-0.5), red);
    __self.app.renderLine(new pc.Vec3(pos.x-0.5,pos.y+0.5,pos.z-0.5),new pc.Vec3(pos.x-0.5,pos.y+0.5,pos.z+0.5), red);
    __self.app.renderLine(new pc.Vec3(pos.x-0.5,pos.y+0.5,pos.z-0.5),new pc.Vec3(pos.x-0.5,pos.y-0.5,pos.z-0.5), red);
    __self.app.renderLine(new pc.Vec3(pos.x+0.5,pos.y+0.5,pos.z+0.5),new pc.Vec3(pos.x+0.5,pos.y-0.5,pos.z-0.5), red);
    __self.app.renderLine(new pc.Vec3(pos.x+0.5,pos.y+0.5,pos.z-0.5),new pc.Vec3(pos.x-0.5,pos.y-0.5,pos.z-0.5), red);
    __self.app.renderLine(new pc.Vec3(pos.x-0.5,pos.y+0.5,pos.z-0.5),new pc.Vec3(pos.x-0.5,pos.y-0.5,pos.z+0.5), red);
    __self.app.renderLine(new pc.Vec3(pos.x-0.5,pos.y+0.5,pos.z+0.5),new pc.Vec3(pos.x+0.5,pos.y-0.5,pos.z+0.5), red);
    __self.app.renderLine(new pc.Vec3(pos.x+0.5,pos.y-0.5,pos.z-0.5),new pc.Vec3(pos.x-0.5,pos.y-0.5,pos.z+0.5), red);
    __self.app.renderLine(new pc.Vec3(pos.x-0.5,pos.y+0.5,pos.z+0.5),new pc.Vec3(pos.x+0.5,pos.y+0.5,pos.z-0.5), red);
    __self.app.renderLine(new pc.Vec3(pos.x+0.5,pos.y+0.5,pos.z-0.5),new pc.Vec3(pos.x+0.5,pos.y-0.5,pos.z+0.5), red);
    __self.app.renderLine(new pc.Vec3(pos.x-0.5,pos.y+0.5,pos.z-0.5),new pc.Vec3(pos.x+0.5,pos.y-0.5,pos.z-0.5), red);
    __self.app.renderLine(new pc.Vec3(pos.x-0.5,pos.y+0.5,pos.z+0.5),new pc.Vec3(pos.x-0.5,pos.y-0.5,pos.z-0.5), red);
    __self.app.renderLine(new pc.Vec3(pos.x+0.5,pos.y+0.5,pos.z+0.5),new pc.Vec3(pos.x-0.5,pos.y-0.5,pos.z+0.5), red);
    __self.app.renderLine(new pc.Vec3(pos.x+0.5,pos.y-0.5,pos.z+0.5),new pc.Vec3(pos.x-0.5,pos.y-0.5,pos.z-0.5), red);
    __self.app.renderLine(new pc.Vec3(pos.x+0.5,pos.y+0.5,pos.z+0.5),new pc.Vec3(pos.x-0.5,pos.y+0.5,pos.z-0.5), red);
}

Boxmanager.prototype.colpic = function(entity){
    if(this.app.touch){
        // document.getElementById("r").value = entity.parent.mycol.r * 100;
        // document.getElementById("g").value = entity.parent.mycol.g * 100;
        // document.getElementById("b").value = entity.parent.mycol.b * 100;
        var colpicHSV = colorsys.rgb_to_hsv({ r: entity.parent.mycol.r * 255, g: entity.parent.mycol.g * 255, b: entity.parent.mycol.b * 255 });
        if(entity.parent.mycol.r === entity.parent.mycol.g && entity.parent.mycol.g === entity.parent.mycol.b && entity.parent.mycol.b === entity.parent.mycol.r){
            //白
            document.getElementById("glay").checked = true;
            document.getElementById("colorrange").value = 0;
            document.getElementById("sv").value = 199 - entity.parent.mycol.g * 199;
            document.getElementById("colpic").checked = false;
        }else if(colpicHSV.s > 97 || colpicHSV.v > 97){
            var colpicRGB = colorsys.rgb_to_hsv({ r: entity.parent.mycol.r * 255, g: entity.parent.mycol.g * 255, b: entity.parent.mycol.b * 255 });
            document.getElementById("colorrange").value = colpicRGB[0].h;
            document.getElementById("glay").checked = false;
            var sv;

            if(colpicRGB[0].s <= colpicRGB[0].v){
                document.getElementById("sv").value = colpicRGB[0].s;
            }else{
               document.getElementById("sv").value = 199 - colpicRGB[0].v - ( 99 - colpicRGB[0].s);
            }
            document.getElementById("colpic").checked = false;
        }else{
            //これはもう私の手には負えない
            pickedColR = entity.parent.mycol.r * 255;
            pickedColG = entity.parent.mycol.g * 255;
            pickedColB = entity.parent.mycol.b * 255;
            isPicked = true;
            document.getElementById("pic").innerHTML = "picked";
        }
    }else{
        var setstring = "#";
        setstring += (parseInt(entity.parent.mycol.r * 255,10).toString(16).length < 2)?"0"+parseInt(entity.parent.mycol.r * 255,10).toString(16):parseInt(entity.parent.mycol.r * 255,10).toString(16);
        setstring += (parseInt(entity.parent.mycol.g * 255,10).toString(16).length < 2)?"0"+parseInt(entity.parent.mycol.g * 255,10).toString(16):parseInt(entity.parent.mycol.g * 255,10).toString(16);
        setstring += (parseInt(entity.parent.mycol.b * 255,10).toString(16).length < 2)?"0"+parseInt(entity.parent.mycol.b * 255,10).toString(16):parseInt(entity.parent.mycol.b * 255,10).toString(16);

        document.getElementById("color").value = setstring;
        document.getElementById("colpic").checked = false;
    }
    document.getElementById("opacity").value = entity.parent.mycol.a * 100;
    
};


Boxmanager.prototype.loadJsonFromRemote = function (url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.addEventListener("load", function () {
        callback(this.response);
    });
    xhr.open("GET", url);
    xhr.send();
};

Boxmanager.prototype.chechui = function(){
    //     if(state === 0 ){
    //         //add box
    //        document.getElementById("button1").disabled = true;
    //        document.getElementById("button2").disabled = false;
    //     }else if(state === 1){
    //        document.getElementById("button1").disabled = false;
    //        document.getElementById("button2").disabled = true;
    //     }

    //     document.getElementById("button1").onclick = function(){
    //         state = 0;
    //     };
    //     document.getElementById("button2").onclick = function(){
    //         state = 1;
    //     };
};


Boxmanager.prototype.manage = function(){
    if(document.getElementById("savewindow")){
        document.getElementById("savewindow").style.cssText = "right:-30%;";
    }
    voxelID = get_voxel_id();
    
    //history.replaceState('','','replace');
    //URL書き出し用
    numofvoxel++;
    urlmes = "";
    var coltemp = "init";
    for(var k = 0;k<meshs.length;k++){
        urlmes += meshs[k].x;
        urlmes += ",";
        urlmes += meshs[k].y;
        urlmes += ",";
        urlmes += meshs[k].z;


        if(coltemp != texs[k]){
            urlmes += ",";
            urlmes += texs[k];
            coltemp = texs[k];
        }
        if(k != meshs.length -1){
            urlmes += "a";
        }
    }
    
    var addurl ="?m=";
    addurl += voxelID;
    history.replaceState('','',addurl);

    var url = window.location.href;
    var post;
    post = "https://api.utautattaro.com/getapi.php?url=";

    if(url.indexOf('GameFilesUpdate') != -1){
        //PLiCy対応
       var before = "GameFilesUpdate" ;

        // 変数でRegExpオブジェクトを作成
        var regExp = new RegExp( before, "g" ) ;

        // 置換を実行 ( → あいくえおあいくえお )
     url = url.replace( regExp , "GamePlay" ) ;
    }
    post += url;
    if(!this.app.touch){
        if(username || !author.isMine){
            sharelink.title = "Share via own URL";
            sharelink.href = post;
        }else{
            sharelink.title = "Please Input your name from bottom left!";
        }
    }else{
        sharelink.title = "Share via own URL";
        sharelink.href = post;
    }
    
    if(document.getElementById("save")){
        //document.getElementById("save").href = "#";
        document.getElementById("save").innerHTML = "save<img src='https://utautattaro.com/storage/ic_save_white_24dp_1x.png' width='15px' height='15px'/>";
    }
    
    //history.replaceState('','',urlmes);

    

    // this.loadJsonFromRemote(post, function (data) {
    // // display JSON data from remote server
    // console.log("data is");
    // console.log(data);
    // });

    //     var request = new XMLHttpRequest();
    //     request.open('GET', post, false);
    //     request.send(); // because of "false" above, will block until the request is done 
    //                 // and status is available. Not recommended, however it works for simple cases.

    //     if (request.status === 200) {
    //         console.log(request.responseText);
    //     }

    //console.log(meshs);
    //obj吐き出し用
    toobjstring = "# powerd by VOXELCANVAS\n";
    toobjstring += "# http://voxelcanvas.me\n\n";
    toobjstring += "# Author ryotaro,seiro\n";
    toobjstring += "# http://utautattaro.com/\n";
    toobjstring += "# http://seiroise.hatenablog.com/\n";

    for (var i = 0;i<meshs.length;i++){
        toobjstring += "g " + texs[i] + "\n";
        for(var l = 0 ;l<vertdef.length;l++){
            var temp = meshs[i].clone();
            temp.add(vertdef[l]);
            toobjstring += "v " + temp.x + " " + temp.y + " " + temp.z + "\n";
        }
        for(var q = 0 ;q<normdef.length;q++){
            var temp2 = normdef[q].clone();
            var counttemp = new pc.Vec4(i * 8,i * 8,i * 8,i * 8);
            temp2.add(counttemp);
            toobjstring += "f " + temp2.x +"//"+ (q+1) +" " + temp2.y +"//"+ (q+1) +" "+ temp2.z +"//"+ (q+1) +" "+ temp2.w +"//"+ (q+1) +"\n";
        }
    }

    for(var r=0;r<vn.length;r++){
        toobjstring += "vn " + vn[r].x + " " + vn[r].y + " " + vn[r].z + "\n";
    }

    //     //material
    //     var b = texs.filter(function (x, i, self) {
    //             return self.indexOf(x) === i;
    //         });

    //     for(var s=0;s<b.length;s++){
    //         toobjstring += "newmtl " + b[s] + "\n";
    //         var tempcol = b[s].split(",");
    //         toobjstring += "Kd " + tempcol[0] / 255 + " " + tempcol[1]/255 + " " + tempcol[2] / 255 + "\n";
    //     }

    if(!this.app.touch){
        var downloadelement = document.getElementById("DLlink");
        var dd = new Date();
        var fname = voxelID + ".obj";

        downloadelement.download = fname;
        downloadelement.disabled = true;
        downloadelement.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(toobjstring);
    }

    //         for(var l = 0;l<this.entity.children[i].children.length;l++){
    //             //meshs.push(this.entity.children[i].children[l].getPosition().toString());
    //         }

    // var canvas = document.getElementById('application-canvas');
    // var context = canvas.getContext("experimental-webgl", {preserveDrawingBuffer: true});
    // var dataURL = canvas.toDataURL("image/png");
    // window.open(dataURL);
    //     var img;
    //     try {
    //     img = document.getElementById('application-canvas').toDataURL('image/jpeg', 0.9).split(',')[1];
    // } catch(e) {
    //     img = document.getElementById('application-canvas').toDataURL().split(',')[1];
    // }

    // $.ajax({
    //     url: 'https://api.imgur.com/3/image',
    //     type: 'GET',
    //     headers: {
    //         Authorization: 'Client-ID <908a5c7f71a5221>'
    //     },
    //     data: {
    //         image: img
    //     },
    //     dataType: 'json',
    //     success: function(response) {
    //         if(response.success) {
    //             window.location = response.data.link;
    //         }
    //     }
    // });
};

var onFormSend = function(fn,fd){
  var fileName = fn;
  var fileData = fd;

  ncmb.File.upload(fileName, fileData)
    .then(function(res){
      // アップロード後処理
    })
    .catch(function(err){
      // エラー処理
    });
};

Boxmanager.prototype.sender = function(key,value,uname){
    var TestClass = ncmb.DataStore("TestClass");
    var testClass = new TestClass();
    testClass.set("key", key);
    testClass.set("message",value);
    testClass.set("name",uname);
    testClass.save()
         .then(function(obj){
            // 保存に成功した場合の処理
          })
         .catch(function(err){
            // 保存に失敗した場合の処理
            console.error(err);
          });
    
    var fname = key + ".obj";
    
    var blob = new Blob([ toobjstring ], {type: 'text/plain'});
    onFormSend(fname,blob);
};

Boxmanager.prototype.geter = function(objID){
    var loadhtml;
    loadhtml = this.app.assets.find('loading.html');
    var loaddiv = document.createElement('div');
    loaddiv.innerHTML = loadhtml.resource;
    document.body.appendChild(loaddiv);
    
    var TestClass = ncmb.DataStore("TestClass");
    TestClass.equalTo("key", objID)
         .order("score",true)
         .fetchAll()
         .then(function(results){
        ans = results[0].message;
        
        if(results[0].message){
        initmodels = results[0].message;
        initmodels = initmodels.split("a");
        for(var h=0;h<initmodels.length;h++){
            initmodels[h] = initmodels[h].split(",");
        }
        //ボクセルの数だけまわす
        for(var hr=0;hr<initmodels.length;hr++){            
            var coltempnum;
            var texmes;
            var inimat;
            //色情報を含んでいた場合
            if(initmodels[hr][3]){
                inimat = new pc.StandardMaterial();
                inimat.diffuse.set(parseInt(initmodels[hr][3],10)/255,parseInt(initmodels[hr][4],10)/255,parseInt(initmodels[hr][5],10)/255);
                inimat.blendType = pc.BLEND_NORMAL;
                inimat.opacity = parseFloat(initmodels[hr][6],10);
                inimat.update();
                texmes =[parseInt(initmodels[hr][3],10),parseInt(initmodels[hr][4],10),parseInt(initmodels[hr][5],10),parseFloat(initmodels[hr][6],10)];
                __self.entity._children[0]._children[0].script.hoveradd.initaddobj(
                    parseInt(initmodels[hr][0],10),
                    parseInt(initmodels[hr][1],10),
                    parseInt(initmodels[hr][2],10),
                    parseInt(initmodels[hr][3],10),
                    parseInt(initmodels[hr][4],10),
                    parseInt(initmodels[hr][5],10),
                    parseFloat(initmodels[hr][6],10),
                    inimat
                );
                coltempnum = [parseInt(initmodels[hr][3],10),parseInt(initmodels[hr][4],10),parseInt(initmodels[hr][5],10),parseFloat(initmodels[hr][6],10)];
            }else{//色情報を含んでいなかった場合
                texmes =coltempnum;
                __self.entity._children[0]._children[0].script.hoveradd.initaddobj(
                    parseInt(initmodels[hr][0],10),
                    parseInt(initmodels[hr][1],10),
                    parseInt(initmodels[hr][2],10),
                    coltempnum[0],
                    coltempnum[1],
                    coltempnum[2],
                    coltempnum[3],
                    inimat
                );
            }
            texs.push(texmes.toString());
        }
        pool.script.boxmanager.manage();
        pool._children[0].destroy();
        isLoading = false;
        loaddiv.parentNode.removeChild(loaddiv);
    }
        if(results[0].name){
            author.element.text = "CREATED BY " + results[0].name;
            username = results[0].name;
            author.isMine = false;
        }else{
            author.element.text = "";
            author.isMine = false;
        }
        
    })
    .catch(function(err){
        console.log(err);
        meshs.push(pool._children[0].getPosition());
        texs.push(getcolor().toString());
        loaddiv.parentNode.removeChild(loaddiv);
    });
};


function get_url_vars()
{
    var vars = new Object, params;
    var temp_params = window.location.search.substring(1).split('&');
    for(var i = 0; i <temp_params.length; i++) {
        params = temp_params[i].split('=');
        vars[params[0]] = params[1];
    }
    return vars;
}


function get_voxel_id(){
    var l = 11;

    // 生成する文字列に含める文字セット
    var c = "abcdefghijkmnprstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ2345678";

    var cl = c.length;
    var r = "";
    for(var i=0; i<l; i++){
        r += c[Math.floor(Math.random()*cl)];
    }
    return r;
}

function sampleForm(id,value){
    // $.ajax({
    // url: 'https://utautattaro.com/apis/saveimage.php',
    // type:'POST',
    //       dataType: 'jsonp',
    // data: {
    //          "voxelid": id,
    //          "acceptImage": value
    //      }
    // }).done(function(data) {
    // console.log("ok");
    // })
    // .fail(function(jqXHR, textStatus, errorThrown) {
    // console.log("XMLHttpRequest : " + jqXHR.status);
    // console.log("textStatus : " + textStatus);
    // console.log("errorThrown : " + errorThrown);
    // })
    // .always(function() {
    // console.log("finishi");
    // });
    $.ajax({
        type: "POST",
        url: "https://api.utautattaro.com/saveimage.php",
        data: {
            "voxelid": id,
            "acceptImage": value
        },
        success: function(j_data){
            // 処理を記述
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
        }
    });
    
//     var form = document.createElement("form");
//     document.body.appendChild(form);
//     var input = document.createElement("input");
//     input.setAttribute("type","hidden");
//     input.setAttribute("voxelid",id);
//     input.setAttribute("acceptImage",value);
//     form.appendChild(input);
//     form.setAttribute("action","https://deci-ryla.ssl-lolipop.jp/apis/saveimage.php");
//     form.setAttribute("method","POST");
//     form.submit();
}
// swap method called for script hot-reloading
// inherit your script state here
// Boxmanager.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// http://developer.playcanvas.com/en/user-manual/scripting/