var Voxeditor = pc.createScript('voxeditor');

Voxeditor.prototype.initialize = function() {
    // console.log("voxeditor");
    voxeditor = this;
    if(this.app.touch){
        this.app.touch.on(pc.EVENT_TOUCHSTART,this._onPointerTouch,this);
        this.app.touch.on(pc.EVENT_TOUCHMOVE,this._onPointerMove,this);
        this.app.touch.on(pc.EVENT_TOUCHEND,this._onPointerUp,this);
    } else {
        this.app.mouse.on(pc.EVENT_MOUSEDOWN, this._onPointerTouch, this);
        this.app.mouse.on(pc.EVENT_MOUSEMOVE,this._onPointerMove,this);
        this.app.mouse.on(pc.EVENT_MOUSEUP,this._onPointerUp,this);
    }
    
    // ui events
    voxUI.on('UI:colorChange',this._colorChange,this);
    voxUI.on('UI:undo',this._undo,this);
    voxUI.on('UI:redo',this._redo,this);
    voxUI.on('UI:delete', this._delete, this);
    voxUI.on('UI:picker', this._picker, this);
    voxUI.on("UI:gotoedit",this._gotoedit,this);
    voxUI.on("UI:edit", this._edit, this);
    voxUI.on("UI:copy", this._copy, this);
    
    this.currentColor = new pc.Color(1, 1, 1);
    this.currentRGBHex = voxutil.rgbToHex(this.currentColor);
    this.opacity = false;
    
    this.workStack = new Voxworkstack();
    
    this.prevRaycastResult = null;
    this.prevGVoxIdx = null;
    
    // state machine
    this.currentStateName = "";
    this.currentState = null;
    this.stateMap = {};
    
    // camera
    this.cameraEntity = this.entity.root.findByName("Camera");
    
    // pointer
    this.voxPointer = this.entity.root.findByName("VoxPointer").script.voxpointer;
    this.wirePointer = this.entity.root.findByName("WirePointer").script.wirepointer;
    
    if(viewMode){
        this.changeState("view");
    }else{
        this.changeState("put");
    }
};

Voxeditor.prototype.update = function(dt) {
    // console.log(this.cameraEntity.script.mouseInput.lookButtonDown);
    this.checkColor();
};

Voxeditor.prototype.pointerRaycast = function(e) {
    var camera = this.cameraEntity.camera;
    var from = camera.screenToWorld(e.x, e.y, camera.nearClip);
    var to = camera.screenToWorld(e.x, e.y, camera.farClip);
    return this.app.systems.rigidbody.raycastFirst(from, to);
};

Voxeditor.prototype.pointerMoveRaycast = function(e) {
    var result = this.pointerRaycast(e);
    if(result !== null) {
        var gVoxIdx = this.convertRaycastResultToInsideGlobalVoxIdx(result);
        if(this.prevRaycastResult !== null) {
            if(!this.prevGVoxIdx.equals(gVoxIdx)) {
                if(this.currentState !== null) {
                    this.currentState.onForcusVoxChange(e, result, gVoxIdx);
                }
            }
            if(!this.prevRaycastResult.normal.equals(result.normal)) {
                if(this.currentState !== null) {
                    // condole.log("OnFocusSurfaceChange");
                    this.currentState.onForcusSurfaceChange(e, result, gVoxIdx);
                }
            }
        } else {
            if(this.currentState !== null) {
                this.currentState.onPointerEnter(e, result, gVoxIdx);
            }
        }
        this.prevGVoxIdx = gVoxIdx;
    } else {
        if(this.prevRaycastResult !== null) {
            if(this.currentState !== null) {
                this.currentState.onPointerExit(e, result);
            }
        }
        this.prevGVoxIdx = null;
    }
    this.prevRaycastResult = result;
};

Voxeditor.prototype.convertRaycastResultToInsideGlobalVoxIdx = function(result) {
    var normal = result.normal.clone();
    normal.scale(0.05);
    var point = result.point.clone();
    point.sub(normal);
    return voxengine.convertToGlobalVoxIdx(point);
};

Voxeditor.prototype.convertRaycastResultToOutSideGlobalVoxIdx = function(result) {
    var normal = result.normal.clone();
    normal.scale(0.05);
    var point = result.point.clone();
    point.add(normal);
    return voxengine.convertToGlobalVoxIdx(point);
};

Voxeditor.prototype.checkColor = function() {
    var hex = document.getElementById("color").value;
    if(this.currentRGBHex !== hex) {
        this.currentRGBHex = hex;
        this.currentColor.fromString(hex);
        this.currentColor.a = this.opacity ? 0.5 : 1;
        voxUI.backgroundColor(this.currentColor);
        
        if(this.currentState !== null) {
            this.currentState.colorChange(this.currentColor);
        }
    }
};

Voxeditor.prototype.changeState = function(stateName) {
    if(this.currentStateName === stateName) {
        return;
    }
    var nextState = this.stateMap[stateName];
    if(nextState === void 0) {
        // switch文使いたくない・・・
        switch(stateName) {
            case("put"): {
                nextState = new PutState(this);
            } break;
            case("remove"): {
                nextState = new RemoveState(this);
            } break;
            case("pick"): {
                nextState = new PickState(this);
            } break;
            case("view"): {
                nextState = new ViewState(this);
            } break;
            case("edit"): {
                nextState = new EditState(this);
            } break;
            case("edit_copy"): {
                nextState = new EditCopyState(this);
            } break;
            default: {
                return;
            } break;
        }
        this.stateMap[stateName] = nextState;
    }
    if(this.currentState !== null) {
        this.currentState.onExit(stateName);
    }
    nextState.onEnter();
    this.currentState = nextState;
    this.currentStateName = stateName;
};


// ---------------------------------------------
// events
// ---------------------------------------------
Voxeditor.prototype._onPointerTouch = function(e) {
    var result;
    
    if(this.app.touch) {
        result = this.pointerRaycast(e.changedTouches[0]);
    } else {
        result = this.pointerRaycast(e);
    }
    if(result === null || viewMode) {
        // this.workStack.removeVox(new pc.Vec3(0, -4, 0));
        // this.workStack.putVox(new pc.Vec3(0, -4, 0), new pc.Color(1, 1, 1, 1));
        if(!this.app.touch) {
            switch (e.button) {
                case pc.MOUSEBUTTON_LEFT: {
                     this.cameraEntity.script.mouseInput.lookButtonDown = true;
                } break;
                case pc.MOUSEBUTTON_RIGHT:
                case pc.MOUSEBUTTON_MIDDLE: {
                     this.cameraEntity.script.mouseInput.panButtonDown = true;
                } break;    
             }
        } else {
            // this.workStack.removeVox(new pc.Vec3(0, -2, 0));
            // this.workStack.putVox(new pc.Vec3(0, -2, 0), new pc.Color(1, 1, 1, 1));
            // this.cameraEntity.script.touchInput.lookButtonDown = true;
            this.cameraEntity.script.touchInput.checkvox = false;
            // console.log(this.cameraEntity.script.mouseInput.lookButtonDown);
        }
    } else {
        var gVoxIdx = this.convertRaycastResultToInsideGlobalVoxIdx(result);
        if(this.app.touch){
            this.cameraEntity.script.touchInput.checkvox = true;
            console.log();
            if(this.currentState !== null) {
                this.currentState.onPointerDown(e.changedTouches[0], result, gVoxIdx);
            }
        }else{
             switch (e.button) {
                 case pc.MOUSEBUTTON_LEFT: {
                     if(this.currentState !== null) {
                        this.currentState.onPointerDown(e, result, gVoxIdx);
                    }
                 } break;
             }
        }
    }
};

Voxeditor.prototype._onPointerMove = function(e) {
    //ボクセル連続追加について
    //マウスが押されているかどうかはe.buttons[0] = true/false
    //カメラ移動かボクセル追加は
    //this.cameraEntity.script.mouseInput.lookButtonDown が
    //true:カメラ移動中
    //false:ボクセル追加中
    //すなわちfalseの時にボクセル連続追加をいれてくれー
    
    // 連続設置の場合、ポインターを動かさなくても設置する場所が変化するから
    // pointerMove以外に何か作ったほうがええな
    if(this.app.touch) {
        this.pointerMoveRaycast(e.changedTouches[0]);
    } else {
        this.pointerMoveRaycast(e);
    }
};

Voxeditor.prototype._onPointerUp = function(e) {
    var result;
    if(this.app.touch) {
        result = this.pointerRaycast(e.changedTouches[0]);
    } else {
        result = this.pointerRaycast(e);
    }
    var gVoxIdx = null;
    if(result !== null) {
        gVoxIdx = this.convertRaycastResultToInsideGlobalVoxIdx(result);
    }
    if(this.app.touch){
        if(this.currentState !== null) {
            this.currentState.onPointerUp(e.changedTouches[0], result, gVoxIdx);
        }
    }else{
         switch (e.button) {
             case pc.MOUSEBUTTON_LEFT: {
                 if(this.currentState !== null) {
                    this.currentState.onPointerUp(e, result, gVoxIdx);
                }
             } break;
         }
    }
};

Voxeditor.prototype._colorChange = function() {
    this.opacity = !this.opacity;
    this.currentColor.a = this.opacity ? 0.5 : 1;
    voxUI.backgroundColor(this.currentColor);
    
    if(this.currentState !== null) {
        this.currentState.colorChange(this.currentColor);
    }
};

Voxeditor.prototype._undo = function(){
    this.workStack.undo();
};

Voxeditor.prototype._redo = function(){
    this.workStack.redo();
};

Voxeditor.prototype._delete = function() {
    if(voxUI.delete.checked) {
        this.changeState("remove");
    } else {
        this.changeState("put");
    }
};

Voxeditor.prototype._picker = function() {
    if(voxUI.picker.checked) {
        this.changeState("pick");
    } else {
        this.changeState("put");
    }
};

Voxeditor.prototype._gotoedit = function(){
    this.changeState("put");
    
};

Voxeditor.prototype._edit = function() {
    if(voxUI.edit.checked) {
        this.changeState("edit");
    } else {
        this.changeState("put");
    }
};

Voxeditor.prototype._copy = function() {
    if(this.currentState !== null) {
        this.currentState.copy();
    }
};

// ---------------------------------------------
// editor state
// ---------------------------------------------
/*
 * onEnter : 自分の状態に変わるとき
 * onExit : 別の状態に変わるとき
 * onPointerDown : ボクセル上での押下
 * onPointerUp : ボクセル上での押上
 * onPointerEnter : ボクセルに侵入
 * onPointerExit : ボクセルから離脱
 * onFocusVoxChange : 参照しているボクセルの変化
 * onFocusSurfaceChange : 参照している面の変化 
 */
var EditorState = function() { };
EditorState.prototype.onEnter = function() { };
EditorState.prototype.onExit = function(nextName) { };

EditorState.prototype.onPointerDown = function(e, result, gVoxIdx) { };
EditorState.prototype.onPointerUp = function(e, result, gVoxIdx) { };

EditorState.prototype.onPointerEnter = function(e, result, gVoxIdx) { };
EditorState.prototype.onPointerExit = function(e, result) { };
EditorState.prototype.onForcusVoxChange = function(e, result, gVoxIdx) { };
EditorState.prototype.onForcusSurfaceChange = function(e, result, gVoxIdx) { };

EditorState.prototype.copy = function() { };
EditorState.prototype.colorChange = function(color) { };

// ---------------------------------------------
// put state
// ---------------------------------------------
var PutState = function(owner) {
    this.owner = owner;
    this.startGVoxIdx = null;
};
PutState.prototype = new EditorState();

PutState.prototype.onEnter = function() {
    voxUI.setUncheck(voxUI.picker);
    voxUI.setUncheck(voxUI.delete);
};

PutState.prototype.onPointerDown = function(e, result, gVoxIdx) {
    if(result !== null) {
        this.startGVoxIdx = this.owner.convertRaycastResultToOutSideGlobalVoxIdx(result);
    }
};

PutState.prototype.onPointerUp = function(e, result, gVoxIdx) {
    if(result !== null && this.startGVoxIdx !== null) {
        var endGVoxIdx = this.owner.convertRaycastResultToOutSideGlobalVoxIdx(result);
        if(this.startGVoxIdx.equals(endGVoxIdx)) {
            this.owner.workStack.putVox(this.startGVoxIdx, this.owner.currentColor);
        } else {
            this.owner.workStack.putVoxesByCube(this.startGVoxIdx, endGVoxIdx, this.owner.currentColor);
            this.owner.voxPointer.changeSizeToOne();
            this.owner.voxPointer.entity.setPosition(endGVoxIdx);
        }
    }
    this.startGVoxIdx = null;
};

PutState.prototype.onPointerEnter = function(e, result, gVoxIdx) {
    var outsideGVoxIdx = this.owner.convertRaycastResultToOutSideGlobalVoxIdx(result);
    this.owner.voxPointer.entity.enabled = true;
    if(this.startGVoxIdx === null) {
        this.owner.voxPointer.changeSizeToOne();
        this.owner.voxPointer.entity.setPosition(outsideGVoxIdx);
    } else {
        this.owner.voxPointer.changeSize(this.startGVoxIdx, outsideGVoxIdx);
    }
};

PutState.prototype.onPointerExit = function(e, result) {
    this.owner.voxPointer.entity.enabled = false;
};

PutState.prototype.onForcusVoxChange = function(e, result, gVoxIdx) {
    var outsideGVoxIdx = this.owner.convertRaycastResultToOutSideGlobalVoxIdx(result);
    if(this.startGVoxIdx === null) {
        this.owner.voxPointer.entity.setPosition(outsideGVoxIdx);
    } else {
        this.owner.voxPointer.changeSize(this.startGVoxIdx, outsideGVoxIdx);
    }
};

PutState.prototype.onForcusSurfaceChange = function(e, result, gVoxIdx) {
    var outsideGVoxIdx = this.owner.convertRaycastResultToOutSideGlobalVoxIdx(result);
    if(this.startGVoxIdx === null) {
        this.owner.voxPointer.entity.setPosition(outsideGVoxIdx);
    } else {
        this.owner.voxPointer.changeSize(this.startGVoxIdx, outsideGVoxIdx);
    }
};


// ---------------------------------------------
// remove state
// ---------------------------------------------
var RemoveState = function(owner) {
    this.startGVoxIdx = null;
    this.owner = owner;
};

RemoveState.prototype = new EditorState();

RemoveState.prototype.onEnter = function() {
    // voxUI.setUncheck(voxUI.picker);
};

RemoveState.prototype.onExit = function(nextName) {
    voxUI.setUncheck(voxUI.delete);
};

RemoveState.prototype.onPointerDown = function(e, result, gVoxIdx) {
    if(result !== null) {
        this.startGVoxIdx = gVoxIdx;
    }
};

RemoveState.prototype.onPointerUp = function(e, result, gVoxIdx) {
    if(result !== null && this.startGVoxIdx !== null) {
        if(this.startGVoxIdx.equals(gVoxIdx)) {
            this.owner.workStack.removeVox(this.startGVoxIdx);
        } else {
            this.owner.workStack.removeVoxesByCube(this.startGVoxIdx, gVoxIdx);
            this.owner.voxPointer.changeSizeToOne();
            this.owner.voxPointer.entity.setPosition(gVoxIdx);
        }
    }
    this.startGVoxIdx = null;
};

RemoveState.prototype.onPointerEnter = function(e, result, gVoxIdx) {
    this.owner.voxPointer.entity.enabled = true;
    if(this.startGVoxIdx === null) {
        this.owner.voxPointer.changeSizeToOne();
        this.owner.voxPointer.entity.setPosition(gVoxIdx);
    } else {
        this.owner.voxPointer.changeSize(this.startGVoxIdx, gVoxIdx);
    }
};

RemoveState.prototype.onPointerExit = function(e, result) {
    this.owner.voxPointer.entity.enabled = false;
};

RemoveState.prototype.onForcusVoxChange = function(e, result, gVoxIdx) {
    this.owner.voxPointer.entity.enabled = true;
    if(this.startGVoxIdx === null) {
        this.owner.voxPointer.entity.setPosition(gVoxIdx);
    } else {
        this.owner.voxPointer.changeSize(this.startGVoxIdx, gVoxIdx);
    }
};


// ---------------------------------------------
// pick state
// ---------------------------------------------
var PickState = function(owner) {
    this.owner = owner;
};
    
PickState.prototype = new EditorState();

PickState.prototype.onEnter = function() {
    // voxUI.setUncheck(voxUI.delete);
};

PickState.prototype.onExit = function(nextName) {
    voxUI.setUncheck(voxUI.picker);
};

PickState.prototype.onPointerUp = function(e, result, gVoxIdx) {
    
    if(result === null || result.entity.name !== "Voxchunk") {
        return;
    }
    var pickedVox = voxengine.getVoxWithVec3(gVoxIdx);
    if(pickedVox === null) {
        return;
    }
    var pickedColor = pickedVox.color.clone();
    voxUI.setColor(pickedColor);
    voxUI.backgroundColor(pickedColor);
    
    this.owner.voxPointer.entity.setPosition(
        this.owner.convertRaycastResultToOutSideGlobalVoxIdx(result));
    this.owner.changeState("put");
};

PickState.prototype.onPointerEnter = function(e, result, gVoxIdx) {
    this.owner.voxPointer.entity.enabled = true;
    this.owner.voxPointer.entity.setPosition(gVoxIdx);
};

PickState.prototype.onPointerExit = function(e, result) {
    this.owner.voxPointer.entity.enabled = false;
};

PickState.prototype.onForcusVoxChange = function(e, result, gVoxIdx) {
    this.owner.voxPointer.entity.setPosition(gVoxIdx);
};

// ---------------------------------------------
// edit state
// ---------------------------------------------
var EditState = function(owner) {
    this.owner = owner;
    this.isDowned = false;
};
EditState.prototype = new EditorState();

EditState.prototype.onEnter = function() {
    this.owner.wirePointer.setColor(new pc.Color(1, 1, 1, 1));
    this.owner.wirePointer.setOffset(new pc.Vec3(0, 0, 0));
    this.owner.wirePointer.setVisible(true);
};

EditState.prototype.onExit = function(nextName) {
    if(nextName !== "edit_copy") {
        voxUI.setUncheck(voxUI.edit);
        this.owner.wirePointer.clear();
        this.owner.wirePointer.setVisible(false);
    }
};

EditState.prototype.onPointerDown = function(e, result, gVoxIdx) {
    // カメラにも対応
    if(result !== null && result.entity.name == "Voxchunk") {
        this.isDowned = true;
        this.owner.wirePointer.addPosition(gVoxIdx);
        // console.log(this.owner.wirePointer);
    }
};

EditState.prototype.onPointerUp = function(e, result, gVoxIdx) {
    this.isDowned = false;
};

EditState.prototype.onPointerEnter = function(e, result, gVoxIdx) {
    this.owner.voxPointer.entity.enabled = true;
    this.owner.voxPointer.changeSizeToOne();
    this.owner.voxPointer.entity.setPosition(gVoxIdx);
};

EditState.prototype.onPointerExit = function(e, result) {
    this.owner.voxPointer.entity.enabled = false;
};

EditState.prototype.onForcusVoxChange = function(e, result, gVoxIdx) {
    if(this.isDowned && result.entity.name === "Voxchunk") {
        this.owner.wirePointer.addPosition(gVoxIdx);
    }
    this.owner.voxPointer.entity.setPosition(gVoxIdx);
};

EditState.prototype.copy = function() {
    if(this.owner.wirePointer.numOfPosition() > 0) {
        this.owner.changeState("edit_copy");
    }
};

EditState.prototype.colorChange = function(color) {
    // 選択部分の色をすべて変更する
    var idxs = this.owner.wirePointer.getPositions();
    if(idxs.length > 1) {
        this.owner.workStack.changeVoxesColor(idxs, color);
    } else if(idxs.length === 1){
        this.owner.workStack.changeVoxColor(idxs[0], color);
    }
};

// ---------------------------------------------
// edit_copy
// ---------------------------------------------
var EditCopyState = function(owner) {
    this.owner = owner;
    this.idxs = null;
    this.colors = null;
    this.startIdx = null;
    this.offset = null;
};
EditCopyState.prototype = new EditorState();

EditCopyState.prototype.onEnter = function() {
    this.owner.voxPointer.entity.enabled = false;
    this.owner.wirePointer.setColor(new pc.Color(0.25, 0.25, 0.25, 1));
    var temp = this.owner.wirePointer.getPositions();
    this.idxs = [];
    this.colors = [];
    for(var i = 0; i < temp.length; ++i) {
        var vox = voxengine.getVoxWithVec3(temp[i]);
        if(vox !== null) {
            this.idxs.push(temp[i].clone());
            this.colors.push(vox.color.clone());
        }
    }
    this.startIdx = this.idxs[0];
    this.offset = new pc.Vec3(0, 0, 0);
};

EditCopyState.prototype.onExit = function(nextName) {
    this.owner.wirePointer.clear();
    this.owner.wirePointer.setVisible(false);
    voxUI.setUncheck(voxUI.edit);
    // this.owner.voxPointer.entity.enabled = true;
    this.idxs = null;
    this.colors = null;
    this.startIdx = null;
    this.offset = null;
};

EditCopyState.prototype.onPointerDown = function(e, result, gVoxIdx) {
    if(result !== null) {
        var outsideGVoxIdx = this.owner.convertRaycastResultToOutSideGlobalVoxIdx(result);
        this.owner.workStack.putVoxes(this.idxs, this.colors, this.offset);
    }
};

EditCopyState.prototype.onPointerEnter = function(e, result, gVoxIdx) {
    this.owner.wirePointer.setVisible(true);
};

EditCopyState.prototype.onPointerExit = function(e, result) {
    this.owner.wirePointer.setVisible(false);
};

EditCopyState.prototype.onForcusVoxChange = function(e, result, gVoxIdx) {
    var outsideGVoxIdx = this.owner.convertRaycastResultToOutSideGlobalVoxIdx(result);
    this.offset = outsideGVoxIdx.sub(this.startIdx);
    this.owner.wirePointer.setOffset(this.offset);
};

EditCopyState.prototype.onForcusSurfaceChange = function(e, result, gVoxIdx) {
    var outsideGVoxIdx = this.owner.convertRaycastResultToOutSideGlobalVoxIdx(result);
    this.offset = outsideGVoxIdx.sub(this.startIdx);
    this.owner.wirePointer.setOffset(this.offset);
};

// ---------------------------------------------
// view state
// ---------------------------------------------
var ViewState = function(owner) {
    this.owner = owner;
};
ViewState.prototype = new EditorState();

