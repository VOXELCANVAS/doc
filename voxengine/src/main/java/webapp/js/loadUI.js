var LoadUi = pc.createScript('loadUi');

// initialize code called once per entity
LoadUi.prototype.initialize = function() {
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
};

// update code called every frame
LoadUi.prototype.update = function(dt) {
    
};

// swap method called for script hot-reloading
// inherit your script state here
// LoadUi.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// http://developer.playcanvas.com/en/user-manual/scripting/