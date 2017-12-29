var VoxUi = pc.createScript('voxUi');

//GET
//voxUI.color.value
//voxUI.opacity.value
//voxUI.picker.checked
//voxUI.delete.checked
//voxUI.edit.checked
//voxUI.on("UI:redo.callback,this);
//voxUI.on("UI:undo.callback,this);
//voxUI.on("UI:share.callback,this);
//voxUI.on("UI:download.callback,this);
//voxUI.on("UI:gallery.callback,this);
//voxUI.backgroundColor(pc.Color());

// initialize code called once per entity
VoxUi.prototype.initialize = function() {
    voxUI = this;
    
    pc.events.attach(voxUI);
    this.color   =   document.getElementById("color");
    this.opacity =   document.getElementById("opacity");
    this.picker  =   document.getElementById("colpic");
    this.edit    =   document.getElementById("copypaste");
    this.delete  =   document.getElementById("delete");
    this.undo    =   document.getElementById("undo");
    this.redo    =   document.getElementById("redo");
    this.hiddenundo    =   document.getElementById("hiddenundo");
    this.hiddenredo    =   document.getElementById("hiddenredo");
    this.save    =   document.getElementById("save");
    this.share   =   document.getElementById("sharelink");
    this.gallery =   document.getElementById("gallery");
    this.hidden  =   document.getElementById("hiddenbutton");
    this.open    =   document.getElementById("openelement");
    this.workspace  =   document.getElementById("workspace");
    this.camera_range = document.getElementById("camera:range");
    this.camera_vignette = document.getElementById("camera:vignette");
    this.camera_bloom = document.getElementById("camera:bloom");
    this.camera_sepia = document.getElementById("camera:sepia");
    this.background_tropical = document.getElementById("background:tropical");
    this.background_heliport = document.getElementById("background:heliport");
    this.background_color = document.getElementById("background:color");
    this.light_x = document.getElementById("light:x");
    this.light_y = document.getElementById("light:y");
    this.light_z = document.getElementById("light:z");
    this.lgiht_color = document.getElementById("light:color");
    this.platform = document.getElementById("platform");
    //this.rec = document.getElementById("rec");
    
    
    //document.getElementById("mode:put").hidden = false;
    //this.currentwork = "mode:put";
    
    // if(viewMode){
    //     this.gotoedit =  document.getElementById("toEdit");
    //     this.gotoedit.addEventListener("click",function(e){
    //         document.getElementById("EditorUI").hidden = false;
    //         document.getElementById("ViewUI").hidden = true;
    //         viewMode = false;
    //         voxUI.fire("UI:gotoedit");
    //     });
    // }
    if(getDevice() == "mobile"){
        // document.getElementById("hiddenmobile").hidden = true;
        // document.getElementById("savewindow").hidden = true;
        var elements = document.getElementsByClassName("redoundo");
        for(let i = 0;i < elements.length;i++){
            elements[i].style.cssText = "padding: 10px 5px;";
        }
    }
    
    document.getElementById("game_ui").addEventListener("mousedown", function (e) { 
    e.stopPropagation(); 
    });
    document.getElementById("game_ui").addEventListener("touchstart", function (e) { 
    e.stopPropagation(); 
    });
    
    document.getElementById("modal-dl").addEventListener("mousedown", function (e) { 
    e.stopPropagation(); 
    });
    document.getElementById("modal-dl").addEventListener("touchstart", function (e) { 
    e.stopPropagation(); 
    });
    document.getElementById("modal-share").addEventListener("mousedown", function (e) { 
    e.stopPropagation(); 
    });
    document.getElementById("modal-share").addEventListener("touchstart", function (e) { 
    e.stopPropagation(); 
    });
    document.getElementById("modal-save").addEventListener("mousedown", function (e) { 
    e.stopPropagation(); 
    });
    document.getElementById("modal-save").addEventListener("touchstart", function (e) { 
    e.stopPropagation(); 
    });
    document.getElementById("modal-rename").addEventListener("mousedown", function (e) { 
    e.stopPropagation(); 
    });
    document.getElementById("modal-rename").addEventListener("touchstart", function (e) { 
    e.stopPropagation(); 
    });
    
    this.color.addEventListener("change",function(e){
        this.color = document.getElementById("color");
        voxUI.fire("UI:color");
        ga('send', 'event', {
                  'eventCategory': "UI",
                  'eventAction': "UI:color",
                  'eventLabel' : voxUI.color.value
        });
        e.stopPropagation();
    },false);
    // this.hidden.addEventListener("click",function(e){
    //     document.getElementById("game_ui").hidden = true;
    //     document.getElementById("openbutton").hidden = false;
    //     voxUI.fire("UI:hidden");
    //     ga('send', 'event', {
    //               'eventCategory': "UI",
    //               'eventAction': "UI:hidden",
    //               'eventLabel' : "none"
    //     });
    //     e.stopPropagation();
    // },false);
    // this.open.addEventListener("click",function(e){
    //     document.getElementById("game_ui").hidden = false;
    //     document.getElementById("openbutton").hidden = true;
    //     voxUI.fire("UI:open");
    //             ga('send', 'event', {
    //               'eventCategory': "UI",
    //               'eventAction': "UI:open",
    //               'eventLabel' : "none"
    //     });
    //     e.stopPropagation();
    // },false);
    this.opacity.addEventListener("click",function(e){ 
        this.opacity = document.getElementById("opacity");
        voxUI.fire("UI:colorChange");
        ga('send', 'event', {
                  'eventCategory': "UI",
                  'eventAction': "UI:opacity",
                  'eventLabel' : voxUI.opacity.value
        });
        e.stopPropagation();
    },false);
    this.picker.addEventListener("click",function(e){
        this.picker = document.getElementById("colpic");
        voxUI.fire("UI:picker");
        ga('send', 'event', {
                  'eventCategory': "UI",
                  'eventAction': "UI:picker",
                  'eventLabel' : voxUI.picker.value
        });
        e.stopPropagation();
    },false);
    this.edit.addEventListener("click",function(e){
        this.edit = document.getElementById("copypaste");
        voxUI.fire("UI:edit");
        ga('send', 'event', {
                  'eventCategory': "UI",
                  'eventAction': "UI:edit",
                  'eventLabel' : voxUI.edit.value
        });
        e.stopPropagation();
    },false);
    this.delete.addEventListener("click",function(e){
        this.delete = document.getElementById("delete");
        voxUI.fire("UI:delete");
        ga('send', 'event', {
                  'eventCategory': "UI",
                  'eventAction': "UI:delete",
                  'eventLabel' : voxUI.delete.value
        });
        e.stopPropagation();
    },false);
    this.undo.addEventListener("click",function(e){
        this.undo = document.getElementById("undo");
        voxUI.fire("UI:undo");
        ga('send', 'event', {
                  'eventCategory': "UI",
                  'eventAction': "UI:undo",
                  'eventLabel' : "none"
        });
        e.stopPropagation();
    },false);
    this.redo.addEventListener("click",function(e){
        this.redo = document.getElementById("redo");
        voxUI.fire("UI:redo");
        ga('send', 'event', {
                  'eventCategory': "UI",
                  'eventAction': "UI:redo",
                  'eventLabel' : "none"
        });
        e.stopPropagation();
    },false);
    this.hiddenundo.addEventListener("click",function(e){
        this.hiddenundo = document.getElementById("hiddenundo");
        voxUI.fire("UI:undo");
        ga('send', 'event', {
                  'eventCategory': "UI",
                  'eventAction': "UI:hiddenundo",
                  'eventLabel' : "none"
        });
        e.stopPropagation();
    },false);
    this.hiddenredo.addEventListener("click",function(e){
        this.hiddenredo = document.getElementById("hiddenredo");
        voxUI.fire("UI:redo");
                ga('send', 'event', {
                  'eventCategory': "UI",
                  'eventAction': "UI:hiddenredo",
                  'eventLabel' : "none"
        });
        e.stopPropagation();
    },false);
    // this.share.addEventListener("click",function(e){
    //     this.share =  document.getElementById("sharelink");
    //     voxUI.fire("UI:share");
    //             ga('send', 'event', {
    //               'eventCategory': "UI",
    //               'eventAction': "UI:share",
    //               'eventLabel' : "none"
    //     });
    //     e.stopPropagation();
    // },false);
    this.gallery.addEventListener("click",function(e){
        this.gallery = document.getElementById("gallery");
        $.colorbox({href:"https://api.utautattaro.com//images/index_editor.php",iframe:true,width:"80%", height:"80%"});
        voxUI.fire("UI:gallery");
                ga('send', 'event', {
                  'eventCategory': "UI",
                  'eventAction': "UI:gallery",
                  'eventLabel' : "none"
        });
        e.stopPropagation();
    },false);
    
    this.camera_range.addEventListener("change",function(e){
        this.camera_range = document.getElementById("camera:range");
        voxUI.fire("UI:camera:range");
                ga('send', 'event', {
                  'eventCategory': "UI",
                  'eventAction': "UI:camera:range",
                  'eventLabel' : voxUI.camera_range.value
        });
    },false);
    
    this.camera_vignette.addEventListener("change",function(e){
        this.camera_vignette = document.getElementById("camera:vignette");
        voxUI.fire("UI:camera:vignette");
                ga('send', 'event', {
                  'eventCategory': "UI",
                  'eventAction': "UI:camera:vignette",
                  'eventLabel' : voxUI.camera_range.checked
        });
    },false);
    
    this.camera_bloom.addEventListener("change",function(e){
        this.camera_bloom = document.getElementById("camera:bloom");
        voxUI.fire("UI:camera:bloom");
                ga('send', 'event', {
                  'eventCategory': "UI",
                  'eventAction': "UI:camera:bloom",
                  'eventLabel' : voxUI.camera_bloom.checked
        });
    },false);
    
    this.camera_sepia.addEventListener("change",function(e){
        this.camera_sepia = document.getElementById("camera:sepia");
        voxUI.fire("UI:camera:sepia");
                ga('send', 'event', {
                  'eventCategory': "UI",
                  'eventAction': "UI:camera:sepia",
                  'eventLabel' : voxUI.camera_sepia.checked
        });
    },false);
    
    this.background_tropical.addEventListener("click",function(e){
        this.background_tropical = document.getElementById("background:tropical");
        voxUI.fire("UI:background:tropical");
                ga('send', 'event', {
                  'eventCategory': "UI",
                  'eventAction': "UI:background:tropical",
                  'eventLabel' : "none"
        });
    },false);
    
    this.background_heliport.addEventListener("click",function(e){
        this.background_heliport = document.getElementById("background:heliport");
        voxUI.fire("UI:background:heliport");
                ga('send', 'event', {
                  'eventCategory': "UI",
                  'eventAction': "UI:background:heliport",
                  'eventLabel' : "none"
        });
    },false);
    
    this.background_color.addEventListener("change",function(e){
        this.background_color = document.getElementById("background:color");
        voxUI.fire("UI:background:color");
                ga('send', 'event', {
                  'eventCategory': "UI",
                  'eventAction': "UI:background:color",
                  'eventLabel' : voxUI.background_color.value
        });
    },false);
    
    this.light_x.addEventListener("change",function(e){
        this.light_x = document.getElementById("light:x");
        voxUI.fire("UI:light:x");
                ga('send', 'event', {
                  'eventCategory': "UI",
                  'eventAction': "UI:light:x",
                  'eventLabel' : voxUI.light_x.value
        });
    },false);
    
    this.light_y.addEventListener("change",function(e){
        this.light_y = document.getElementById("light:y");
        voxUI.fire("UI:light:y");
                ga('send', 'event', {
                  'eventCategory': "UI",
                  'eventAction': "UI:light:y",
                  'eventLabel' : voxUI.light_y.value
        });
    },false);
    
    this.light_z.addEventListener("change",function(e){
        this.light_z = document.getElementById("light:z");
        voxUI.fire("UI:light:z");
                ga('send', 'event', {
                  'eventCategory': "UI",
                  'eventAction': "UI:light:z",
                  'eventLabel' : voxUI.light_z.value
        });
    },false);
    
    this.lgiht_color.addEventListener("change",function(e){
        this.lgiht_color = document.getElementById("light:color");
        voxUI.fire("UI:light:color");
                ga('send', 'event', {
                  'eventCategory': "UI",
                  'eventAction': "UI:light:color",
                  'eventLabel' : voxUI.lgiht_color.value
        });
    },false);
    
    this.platform.addEventListener("change",function(e){
        this.platform = document.getElementById("platform");
        voxUI.fire("UI:platform");
                ga('send', 'event', {
                  'eventCategory': "UI",
                  'eventAction': "UI:platform",
                  'eventLabel' : voxUI.platform.checked
        });
    },false);
    
    //モーダルが開いた時
    $('.modal').on('shown.bs.modal', function (event) {
        var action = "UI:modal:open:" + event.currentTarget.id;
        ga('send', 'event', {
                  'eventCategory': "UI",
                  'eventAction': action,
                  'eventLabel' : "none"
        });
        voxUI.fire(action);
	});
    
    //モーダルが閉じた時
    $('.modal').on('hidden.bs.modal', function (event) {
        var action = "UI:modal:hidden:" + event.currentTarget.id;
        ga('send', 'event', {
                  'eventCategory': "UI",
                  'eventAction': action,
                  'eventLabel' : "none"
        });
        voxUI.fire(action);
	});
    
    $("*").on('click',function(ev){
        if(ev.currentTarget.id){
            if(ev.currentTarget.type == "button"){
                let action = "UI:button:click:" + ev.currentTarget.id;
                ga('send', 'event', {
                  'eventCategory': "UI",
                  'eventAction': action,
                  'eventLabel' : "none"
                });
                voxUI.fire(action);
            }
            else if(ev.currentTarget.type == "text"){
                let action = "UI:text:focus:" + ev.currentTarget.id;
                ga('send', 'event', {
                  'eventCategory': "UI",
                  'eventAction': action,
                  'eventLabel' : "none"
                });
                voxUI.fire(action);
            }
        }

    });
    
    // this.rec.addEventListener("click",function(e){
    //     this.rec = document.getElementById("rec");
    //     voxUI.fire("UI:rec");
    //             ga('send', 'event', {
    //               'eventCategory': "UI",
    //               'eventAction': "UI:rec",
    //               'eventLabel' : "none"
    //     });
    // },false);
    
    
    // document.getElementById("modechange:put").addEventListener("click",function(e){
    //     document.getElementById(voxUI.currentwork).hidden = true;
    //     document.getElementById("mode:put").hidden = false;
    //     voxUI.currentwork = "mode:put";
    // },false);
    
    // document.getElementById("modechange:edit").addEventListener("click",function(e){
    //     document.getElementById(voxUI.currentwork).hidden = true;
    //     document.getElementById("mode:edit").hidden = false;
    //     voxUI.currentwork = "mode:edit";
    // },false);
    
//     document.getElementById("modechange:view").addEventListener("click",function(e){
//         document.getElementById(voxUI.currentwork).hidden = true;
//         document.getElementById("mode:view").hidden = false;
//         voxUI.currentwork = "mode:view";
//     },false);
    
    // document.getElementById("modechange:environment").addEventListener("click",function(e){
    //     document.getElementById(voxUI.currentwork).hidden = true;
    //     document.getElementById("mode:environment").hidden = false;
    //     voxUI.currentwork = "mode:environment";
    // },false);
    
    this.backgroundColor = function(color){
        //document.getElementById("openbutton").style.cssText = "background-color:rgba("+parseInt(color.r * 255,10)+","+parseInt(color.g * 255,10)+","+parseInt(color.b * 255,10)+","+color.a+");";
        //document.getElementById("game_ui").style.cssText = "background-color:rgba("+parseInt(color.r * 255,10)+","+parseInt(color.g * 255,10)+","+parseInt(color.b * 255,10)+","+color.a+");";
    };
    
    this.setUncheck = function(ui){
        ui.checked = false;
    };
    this.setColor = function(color){
        var setstring = "#";
        setstring += (parseInt(color.r * 255,10).toString(16).length < 2)?"0"+parseInt(color.r * 255,10).toString(16):parseInt(color.r * 255,10).toString(16);
        setstring += (parseInt(color.g * 255,10).toString(16).length < 2)?"0"+parseInt(color.g * 255,10).toString(16):parseInt(color.g * 255,10).toString(16);
        setstring += (parseInt(color.b * 255,10).toString(16).length < 2)?"0"+parseInt(color.b * 255,10).toString(16):parseInt(color.b * 255,10).toString(16);
        if(color.a < 1){
            if(!document.getElementById("opacity").checked){
                document.getElementById("opacity").checked = true;
                this.opacity = document.getElementById("opacity");
                voxUI.fire("UI:colorChange");
            }
        }else{
            if(document.getElementById("opacity").checked){
                document.getElementById("opacity").checked = false;
                this.opacity = document.getElementById("opacity");
                voxUI.fire("UI:colorChange");
            }

        }
        if(checkSupport('color')){
            //カラーエレメント
            document.getElementById("color").value = setstring;
            this.color = document.getElementById("color");
            var list = document.getElementById("color-list").children;
            var isnew = true;
            for(let i=0;i<list.length;i++){
                if(color.toString()==list[i].value){
                    isnew = false;
                }
            }
            if(isnew){
                var option = document.createElement("option");
                option.value = color.toString();
                option.innerHTML = color.toString();
                document.getElementById("color-list").appendChild(option);    
            }
        }else{
            //カラーエレメントじゃない
            var list = document.getElementById("color").children;
            var isnew = true;
            for(let i=0;i<list.length;i++){
                if(color.toString()==list[i].value){
                    isnew = false;
                }
            }
            if(isnew){
                var option = document.createElement("option");
                option.value = color.toString();
                option.innerHTML = color.toString();
                document.getElementById("color").appendChild(option);    
            }
            document.getElementById("color").value = color.toString();
        }
        
    };
};

VoxUi.prototype.update = function(dt){
    if(this.app.keyboard.isPressed(pc.KEY_CONTROL)){
        if(this.app.keyboard.wasPressed(pc.KEY_Z)){
            voxUI.fire("UI:undo");
        }else if(this.app.keyboard.wasPressed(pc.KEY_Y)){
            voxUI.fire("UI:redo");
        }else if(this.app.keyboard.wasPressed(pc.KEY_C)){
            voxUI.fire("UI:copy");
        }
    }
};

VoxUi.prototype.setLighttorange = function(rotation){
    document.getElementById("light:x").value = rotation.x;
    document.getElementById("light:y").value = rotation.y;
    document.getElementById("light:z").value = rotation.z;
};

function getDevice(){
    var ua = navigator.userAgent;
    if(ua.indexOf('iPhone') > 0 || ua.indexOf('iPod') > 0 || ua.indexOf('Android') > 0 && ua.indexOf('Mobile') > 0){
        return 'mobile';
    }else if(ua.indexOf('iPad') > 0 || ua.indexOf('Android') > 0){
        return 'mobile';
    }else{
        return 'other';
    }
}