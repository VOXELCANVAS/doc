var Setname = pc.createScript('setname');
var __self;

// initialize code called once per entity
Setname.prototype.initialize = function() {
    __self = this;
    if(!get_url_vars().m){
        if(localStorage.getItem("name")){
            username = localStorage.getItem("name");
            this.entity.element.text = "CREATED BY " + username;        
        }else{
            if(!viewMode){
                $(".tuterialelement").colorbox({iframe:true, width:"85%", height:"85%"});
                $('#tuterialelement').trigger('click');
            }
        }        
    }

    voxUI.on("UI:author",function(){
        var authorname;
        if(this.entity.username){
            authorname = this.entity.username;
        }else{
            authorname = "voxelover";
        }
        this.entity.element.text = "CREATED BY " + authorname;
    },this);

    this.entity.element.on("mousedown",this.setname,this);
};

// update code called every frame
Setname.prototype.update = function(dt) {
};

Setname.prototype.setname = function(ev){
    // var newname;
    // while(!newname || !inputCheck(newname) || newname.length > 20){//usernameが格納されるまで回す
    //         newname = window.prompt("Input your name\nAlphabet or number only\nunder 20 chars");//window.promptで名前を取得
    // }
    // username = newname;
    // localStorage.setItem("name",username);//Webストレージに格納
    // this.entity.element.text = "CREATED BY " + username;        
    // if(ev){
    //     ev.stopPropagation();         
    // }
    if(!viewMode)
        $('#rename').trigger('click');
};

function setnewname(){
    var newname;
    newname = document.getElementById("newname").value;
    if(newname && inputCheck(newname) && newname.length < 20){
        username = newname;
        localStorage.setItem("name",username);//Webストレージに格納
        __self.entity.element.text = "CREATED BY " + username;
    }
}

function inputCheck(val) {
if (val.match(/[^A-Za-z0-9]+/)) {
//半角英数字以外の文字が存在する場合、エラー
return false;
}
return true;
}

// swap method called for script hot-reloading
// inherit your script state here
// Setname.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// http://developer.playcanvas.com/en/user-manual/scripting/