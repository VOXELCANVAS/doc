var Voxloader = pc.createScript('voxloader');
Voxloader.attributes.add("createdby",{type:"entity"});
var _self;

Voxloader.attributes.add("deleteEntitys", {
    type: "string",
    array: true,
});
Voxloader.attributes.add("platforms", {
    type: "entity"
});

// initialize code called once per entity
Voxloader.prototype.initialize = function() {
    _self = this;
    this.senderVoxelID = get_url_vars().m;//ここで受け取ってくる
    //なるほど
    ncmb = new NCMB("b2f6f4a56fca380280fa846bcb875beaa7baf4d349a151dc37024dfc965fdd63","ca4ba6d24f03c71067591619abb0cf22a36bcdf3b10bf8ecdfb6f145a3c66629");
    //みてます
    if(this.senderVoxelID){
        this.geter(this.senderVoxelID);
        for(let i = 0 ;i<this.deleteEntitys.length;i++){
            if(this.app.root.findByName(this.deleteEntitys[i])){
                this.app.root.findByName(this.deleteEntitys[i]).enabled = false;
            }
        }
        this.platforms.script.platform.childrenEnable(false);
    }
};

// update code called every frame
Voxloader.prototype.update = function(dt) {
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

Voxloader.prototype.geter = function(voxelID){
    var TestClass = ncmb.DataStore("TestClass");
    TestClass.equalTo("key", voxelID)
         .order("score",true)
         .fetchAll()
         .then(function(results){//取得完了
        if(results[0].message){//ボクセル情報が入ってたら
            voxengine.importOriginalFormat(results[0].message);
            /*
        initmodels = results[0].message;
        initmodels = initmodels.split("a");//ボクセル単位で区切る
        for(var h=0;h<initmodels.length;h++){
            initmodels[h] = initmodels[h].split(","); //initmodels[ボクセル番号][要素](x,y,z,r,g,b,a) 前と同じボクセルは色を省略可能
        }
        //ボクセルの数だけまわす
        for(var hr=0;hr<initmodels.length;hr++){            
            var tempColor;
            //色情報を含んでいた場合
            if(initmodels[hr][3]){
                voxengine.putVoxWithVec3(
                    new pc.Vec3(initmodels[hr][0],
                                initmodels[hr][1],
                                initmodels[hr][2]),
                    new pc.Color(parseFloat(initmodels[hr][3])/255,
                                 parseFloat(initmodels[hr][4])/255,
                                 parseFloat(initmodels[hr][5])/255,
                                 initmodels[hr][6])
                );
                tempColor = new pc.Color(parseFloat(initmodels[hr][3])/255,
                                 parseFloat(initmodels[hr][4])/255,
                                 parseFloat(initmodels[hr][5])/255,
                                 initmodels[hr][6]);
            }else{//色情報を含んでいなかった場合
                voxengine.putVoxWithVec3(
                    new pc.Vec3(initmodels[hr][0],
                                initmodels[hr][1],
                                initmodels[hr][2]),
                                tempColor);
            }
        }
        */
    }
        if(results[0].name){
            _self.createdby.username = results[0].name;
            _self.createdby.element.text = "CREATED BY " + results[0].name;
        }
        voxUI.fire("UI:author");
    })
    .catch(function(err){//読み込み失敗
        console.log(err);
    });
};

// swap method called for script hot-reloading
// inherit your script state here
// Voxloader.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// http://developer.playcanvas.com/en/user-manual/scripting/