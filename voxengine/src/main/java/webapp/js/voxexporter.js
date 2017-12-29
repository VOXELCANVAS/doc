var Voxexporter = pc.createScript('voxexporter');
var self;
// initialize code called once per entity
Voxexporter.prototype.initialize = function() {
    voxUI.on("UI:download",this._download,this);
    self = this;
    this.voxzip = null;
    //window.setTimeout(saveZip,2000);
};

function readyDownload(){
    //ダウンロードモーダルが開いたときに呼ばれる
    document.getElementById("downloadimage").src = getimgdata();//ダウンロード画像にcanvasデータ挿入
    $('#downloadbutton').button('loading');//ボタンをプロセッシング状態に変更
    setTimeout(handleDownload,1000);//1000ms後にobj化開始
}

function handleDownload() {
    //var blob = new Blob([ generateObj() ], { "type" : "text/plain" });//obj作成
    
    //document.getElementById("downloadbutton").href = window.URL.createObjectURL(blob);//blobをダウンロードさせる
    //ボタンをダウンロード可能な状態に
    var modelid = get_random_string();
    var output = voxengine.exportObjFormat(modelid);
    saveZip(output.obj,output.mtl,output.png,modelid);
    $('#downloadbutton').button('reset');
//     if (window.navigator.msSaveBlob) { 
//         window.navigator.msSaveBlob(blob, "voxel.obj"); 

//         // msSaveOrOpenBlobの場合はファイルを保存せずに開ける
//         window.navigator.msSaveOrOpenBlob(blob, "voxel.obj"); 
//     } else {
//         document.getElementById("DLlink").href = window.URL.createObjectURL(blob);
//     }
}

//zipでおとすぞい
const saveZip = (obj,mtl,png,modelid) => {
    var zip = new JSZip();
    zip.file(modelid + ".obj",obj);
    zip.file(modelid + ".mtl",mtl);
    zip.file(modelid + ".png",png, {binary: true});
    zip.generateAsync({type:"blob"})
        .then(function(content) {
            var mes = "Process:download:ready";
            ga('send', 'event', {
              'eventCategory': "Process",
              'eventAction': mes,
              'eventLabel' : content.size
            });
            document.getElementById("downloadbutton").href = window.URL.createObjectURL(content);
            //saveAs(content, "voxel.zip");
        });

};

function generateObj(){
    var toobjstring = "";
    var data = voxengine.exportPesudeObjFormat();
    var meshs = data.meshs;
    var texs = data.colors;
    
    toobjstring = "# powerd by VOXELCANVAS\n";
    toobjstring += "# https://voxelcanvas.me\n\n";
    toobjstring += "# Author ryotaro,seiro\n";
    toobjstring += "# https://utautattaro.com/\n";
    toobjstring += "# https://seir.online/\n";
    toobjstring += "\n\n\n";
    
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
    
    return toobjstring;
}

// update code called every frame
Voxexporter.prototype.update = function(dt) {
    
};

// swap method called for script hot-reloading
// inherit your script state here
// Voxexporter.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// http://developer.playcanvas.com/en/user-manual/scripting/