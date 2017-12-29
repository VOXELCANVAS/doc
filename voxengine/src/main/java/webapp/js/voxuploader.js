var Voxuploader = pc.createScript('voxuploader');
var voxelID;
var endpoint;

// initialize code called once per entity
Voxuploader.prototype.initialize = function() {
};

function readyShare(){
    document.getElementById("finalimage").src = getimgdata();
    if(document.domain != "launch.playcanvas.com"){
        //本番環境
        voxelID = get_random_string();
        endpoint = "https://api.utautattaro.com/saveimage.php";
    }else{
        //開発環境
        voxelID = getTimestamp();
        endpoint = "https://api.utautattaro.com/dev.saveimage.php";
        //window.setTimeout(openGallery,2000);
    }
    
    document.getElementById("customVoxelID").value = voxelID;
}

function sharewithOwnURL(){
    voxelID = document.getElementById("customVoxelID").value;
    var data = document.getElementById("finalimage");
    caputureSendServer(voxelID,endpoint,data.src);
    sendToKVS(voxelID,voxengine.exportOriginalFormat(),getUsername());
    
    var url = "https://voxelcanvas.me/create?m="+voxelID;
    document.getElementById("outputurl").value = url;
    $(document).ready(function(){
        $("#outputurl").click(function(){
            $(this).select();
        });
    });
    
    document.getElementById("tweetbutton").classList.remove("disabled");
    
    var mes = "Process:share:done";
    ga('send', 'event', {
      'eventCategory': "Process",
      'eventAction': mes,
      'eventLabel' : url
    });
    //var post;
    //post = "https://api.utautattaro.com/getapi.php?url=https://voxelcanvas.me/build/?m=" + voxelID;
    //$.colorbox({href:post,iframe:true,width:"90%", height:"90%"});
}

function sharetoTwitter(){
    var url = "https://twitter.com/share?url=https%3A%2F%2Fvoxelcanvas.me%2Fcreate?m="+voxelID+"&via=voxelcanvas&related=voxelcanvas%2Cutautattaro&hashtags=voxel%2Cvoxelart&text=made%20with%20VOXELCANVAS";
    if(window.open(url,"","width=640,height=480")){
        
    }else{
        window.location.href=url;
    }
}

function easySave(){
        var voxelID;
    if(document.domain != "launch.playcanvas.com"){
        //本番環境
        voxelID = get_random_string();
    }else{
        //開発環境
        voxelID = getTimestamp();
    }
    sendToKVS(voxelID,voxengine.exportOriginalFormat(),getUsername());
    var url = "https://voxelcanvas.me/create?m="+voxelID;
        if(document.getElementById("savewindow")){
        // document.getElementById("url").value = url;
        // document.getElementById("savewindow").style.cssText = "right:0%;";
        // document.getElementById("save").innerHTML = "saved<img src='https://utautattaro.com/storage/ic_save_white_24dp_1x.png' width='15px' height='15px'/>";
    }
    document.getElementById("easysaveimage").src = getimgdata();
    document.getElementById("easysaveurl").value = url;
    $(document).ready(function(){
        $("#easysaveurl").click(function(){
            $(this).select();
        });
    });
    
    var mes = "Process:easysave:done";
    ga('send', 'event', {
      'eventCategory': "Process",
      'eventAction': mes,
      'eventLabel' : url
    });
}

function getUsername(){
    if(localStorage.getItem("name")){
        username = localStorage.getItem("name");
    }else{
        username = "voxelover";
    }
    return username;
}


function resetSaveWindow(){
    // document.getElementById("savewindow").style.cssText = "right:-30%;";
    // document.getElementById("save").innerHTML = "save<img src='https://utautattaro.com/storage/ic_save_white_24dp_1x.png' width='15px' height='15px'/>";
}

// update code called every frame
Voxuploader.prototype.update = function(dt) {
};

function sendToKVS(key,value,uname){
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
}

function openGallery(){
    window.open("https://api.utautattaro.com/dev.images","","width=1280,height=800");
}

function getimgdata(){
    return document.getElementById('application-canvas').toDataURL();
}

function caputureSendServer(id,ep,data){
    //var imgdata = getimgdata();
    $.ajax({
        type: "POST",
        //url: "https://api.utautattaro.com/saveimage.php",　本番環境
        url:ep,
        data: {
            "voxelid": id,
            "acceptImage": data
        },
        success: function(j_data){
            // 処理を記述
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
        }
    });
}

function get_random_string(){
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

function getTimestamp(){
    var today = new Date();
    var month = today.getMonth() + 1;
    var hour = ("0"+today.getHours()).slice(-2);
    var minutes = ("0"+today.getMinutes()).slice(-2);
    var second = ("0"+today.getSeconds()).slice(-2);
    return today.getFullYear() + "-" + month + "-" + today.getDate() + "-" + hour + "-" + minutes + "-" + second;
}

// swap method called for script hot-reloading
// inherit your script state here
// Voxuploader.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// http://developer.playcanvas.com/en/user-manual/scripting/
// 
// 
