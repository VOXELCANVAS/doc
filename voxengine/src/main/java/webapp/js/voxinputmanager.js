var Voxinputmanager = pc.createScript('voxinputmanager');
Voxinputmanager.attributes.add("version", {
    type: "string",
    title: "version",
});
Voxinputmanager.attributes.add("cameraEntity",{type:"entity"});
Voxinputmanager.attributes.add("viewMode", {
    type: "boolean",
    title: "View mode",
});
Voxinputmanager.attributes.add("Engine", {
    type: "entity",
    title: "voxengine",
});

// initialize code called once per entity
Voxinputmanager.prototype.initialize = function() {
    console.info("Hello voxelover! VOXELCANVAS version : " + this.version + " available.");
    //google analytics
     (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

    ga('create', 'UA-83861814-4', 'auto');
    ga('send', 'pageview');

$(document).ready(function() {
    $(".dropdown-menu").click(function(e) {
        e.stopPropagation();
    }); 
});
    //
    //
//     var tuterialasset;
//     tuterialasset = this.tuterialHTML;
//     var tuterialdiv = document.createElement("div");
//     tuterialdiv.id="tuterial";
//     tuterialdiv.innerHTML = tuterialasset.resource;
//     document.body.appendChild(tuterialdiv);
//     tuterialasset.on('load', function () {
//         tuterialdiv.innerHTML = tuterialasset.resource;
//     });
//     // document.getElementById("quit").onclick = function(){
//     //     tuterialdiv.hidden=true;
//     // };
    
//     document.getElementById("tuterial").addEventListener("mousedown", function (e) { 
//     e.stopPropagation(); 
//     });
//     document.getElementById("tuterial").addEventListener("touchstart", function (e) { 
//     e.stopPropagation(); 
//     });
    
        //HTMLリソースのロード及び初期化
//     var htmlAsset;
//     htmlAsset = this.app.assets.find('index.html');
//     var div = document.createElement('div');
//     div.id = "EditorUI";
//     div.innerHTML = htmlAsset.resource;
//     document.body.appendChild(div);

//     htmlAsset.on('load', function () {
//         div.innerHTML = htmlAsset.resource;
//     });
    
//     viewMode = this.viewMode;
//     if(location.pathname.indexOf("view") > -1){
//         viewMode = true;
//     }
    
    var devhtmlAsset;
    devhtmlAsset = this.app.assets.find('dev.index.html');
    var devdiv = document.createElement('div');
    devdiv.id = "devEditorUI";
    devdiv.innerHTML = devhtmlAsset.resource;
    document.body.appendChild(devdiv);

    devhtmlAsset.on('load', function () {
        devdiv.innerHTML = devhtmlAsset.resource;
    });
    
    viewMode = this.viewMode;
    if(location.pathname.indexOf("view") > -1){
        viewMode = true;
    }
    
     if(viewMode) {
         devdiv.hidden = true;
         this.app.root.findByName("platforms").script.platform.childrenEnable(false);
//         var viewasset = this.app.assets.find("view.html");
//         var viewdiv = document.createElement('div');
//         viewdiv.id = "ViewUI";
//         viewdiv.innerHTML = viewasset.resource;
//         document.body.appendChild(viewdiv);

//         viewasset.on('load', function () {
//             viewdiv.innerHTML = viewasset.resource;
//         });
     }
    
    // CSSリソースのロード及び初期化
    var cssAsset = this.app.assets.find('style.css');

    var style = document.createElement('style');
    document.head.appendChild(style);
    style.innerHTML = cssAsset.resource;

    cssAsset.on('load', function() {
        style.innerHTML = cssAsset.resource;
    });
    
        // CSSリソースのロード及び初期化
    var bootstrap = this.app.assets.find('bootstrap.min.css');

    var bootstyle = document.createElement('style');
    document.head.appendChild(bootstyle);
    bootstyle.innerHTML = bootstrap.resource;

    cssAsset.on('load', function() {
        bootstyle.innerHTML = bootstrap.resource;
    });
    
    if(this.app.touch){
        this.cameraEntity.script.touchInput.enabled = true;
    }else{
        this.cameraEntity.script.mouseInput.enabled = true;
    }
    var intocolor = document.getElementById("intocolor");
    var intobgcolor = document.getElementById("insertbackgroundcolor");
    var intolgcolor = document.getElementById("lightcolor");
    
    
    if (checkSupport('color')) {
      // 対応している
        intocolor.innerHTML = "<input class='form-control' style='width:80px;height:25px;' id='color' value='#ffffff' type='color'list='color-list'name='color'size='40'><datalist id='color-list'><option value='#000000'>black</option><option value='#c0c0c0'>silver</option><option value='#808080'>gray</option><option value='#ffffff'>white</option><option value='#800000'>maroon</option><option value='#ff0000'>red</option><option value='#800080'>purple</option><option value='#ff00ff'>fuchsia</option><option value='#008000'>green</option><option value='#00ff00'>lime</option><option value='#808000'>olive</option><option value='#ffff00'>yellow</option><option value='#000080'>navy</option><option value='#0000ff'>blue</option><option value='#008080'>teal</option><option value='#00ffff'>aqua</option></datalist>";
        intobgcolor.innerHTML = "Background color<input class='form-control' style='width:150px;' id='background:color' value='#ffffff' type='color'list='color-list'name='color'size='40'><datalist id='color-list'><option value='#000000'>black</option><option value='#c0c0c0'>silver</option><option value='#808080'>gray</option><option value='#ffffff'>white</option><option value='#800000'>maroon</option><option value='#ff0000'>red</option><option value='#800080'>purple</option><option value='#ff00ff'>fuchsia</option><option value='#008000'>green</option><option value='#00ff00'>lime</option><option value='#808000'>olive</option><option value='#ffff00'>yellow</option><option value='#000080'>navy</option><option value='#0000ff'>blue</option><option value='#008080'>teal</option><option value='#00ffff'>aqua</option></datalist>";
        intolgcolor.innerHTML = "Light color<input class='form-control' style='width:150px;' id='light:color' value='#ffffff' type='color'list='color-list'name='color'size='40'><datalist id='color-list'><option value='#000000'>black</option><option value='#c0c0c0'>silver</option><option value='#808080'>gray</option><option value='#ffffff'>white</option><option value='#800000'>maroon</option><option value='#ff0000'>red</option><option value='#800080'>purple</option><option value='#ff00ff'>fuchsia</option><option value='#008000'>green</option><option value='#00ff00'>lime</option><option value='#808000'>olive</option><option value='#ffff00'>yellow</option><option value='#000080'>navy</option><option value='#0000ff'>blue</option><option value='#008080'>teal</option><option value='#00ffff'>aqua</option></datalist>";
    } else {
      // 対応していない
        intocolor.innerHTML = "<select class='form-control' style='width:80px;height:25px;' id='color' list='color-string-list'><datalist id='color-string-list'><option value='#ffffff'>white</option><option value='#000000'>black</option><option value='#c0c0c0'>silver</option><option value='#808080'>gray</option><option value='#800000'>maroon</option><option value='#ff0000'>red</option><option value='#800080'>purple</option><option value='#ff00ff'>fuchsia</option><option value='#008000'>green</option><option value='#00ff00'>lime</option><option value='#808000'>olive</option><option value='#ffff00'>yellow</option><option value='#000080'>navy</option><option value='#0000ff'>blue</option><option value='#008080'>teal</option><option value='#00ffff'>aqua</option></datalist></select>";
        intobgcolor.innerHTML = "Background color<select class='form-control' style='width:150px;' id='background:color' list='color-string-list'><datalist id='color-string-list'><option value='#ffffff'>white</option><option value='#000000'>black</option><option value='#c0c0c0'>silver</option><option value='#808080'>gray</option><option value='#800000'>maroon</option><option value='#ff0000'>red</option><option value='#800080'>purple</option><option value='#ff00ff'>fuchsia</option><option value='#008000'>green</option><option value='#00ff00'>lime</option><option value='#808000'>olive</option><option value='#ffff00'>yellow</option><option value='#000080'>navy</option><option value='#0000ff'>blue</option><option value='#008080'>teal</option><option value='#00ffff'>aqua</option></datalist></select>";
        intolgcolor.innerHTML = "Light color<select class='form-control' style='width:150px;' id='light:color' list='color-string-list'><datalist id='color-string-list'><option value='#ffffff'>white</option><option value='#000000'>black</option><option value='#c0c0c0'>silver</option><option value='#808080'>gray</option><option value='#800000'>maroon</option><option value='#ff0000'>red</option><option value='#800080'>purple</option><option value='#ff00ff'>fuchsia</option><option value='#008000'>green</option><option value='#00ff00'>lime</option><option value='#808000'>olive</option><option value='#ffff00'>yellow</option><option value='#000080'>navy</option><option value='#0000ff'>blue</option><option value='#008080'>teal</option><option value='#00ffff'>aqua</option></datalist></select>";
    }
    

};

// Voxinputmanager.prototype._opengallery = function(ev){
//     $.colorbox({href:"https://api.utautattaro.com/images/index_boots.php",iframe:true,width:"90%", height:"90%"});
// };
//$.colorbox({href:"https://voxelcanvas.me/tuterial.html",iframe:true,width:"90%", height:"90%"});
// update code called every frame
Voxinputmanager.prototype.update = function(dt) {
    
};

function checkSupport (type) {
  var obj = document.createElement('input');
  obj.setAttribute('type', type);
  return obj.type != 'text';
}

// swap method called for script hot-reloading
// inherit your script state here
// Voxinputmanager.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// http://developer.playcanvas.com/en/user-manual/scripting/