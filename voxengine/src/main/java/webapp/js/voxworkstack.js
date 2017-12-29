var Voxworkstack = function(){
    this.commandStack = [];
    this.workPtr = -1;
};

Voxworkstack.prototype.push = function(command) {
    if(this.workPtr < 0) {
        this.commandStack.length = 0;
    } else if((this.workPtr + 1) !== this.commandStack.length){
        this.commandStack.splice(
            this.workPtr + 1,
            (this.commandStack.length - 1) - this.workPtr
        );
    }
    this.commandStack.push(command);
    this.workPtr++;
};

Voxworkstack.prototype.undo = function() {
    if(0 <= this.workPtr && this.workPtr < this.commandStack.length) {
        this.commandStack[this.workPtr].undo();
        this.workPtr--;
    }
};

Voxworkstack.prototype.redo = function() {
    if(0 <= (this.workPtr + 1) && (this.workPtr + 1) < this.commandStack.length) {
        this.workPtr++;
        this.commandStack[this.workPtr].do();
    }
};

Voxworkstack.prototype.exeCommand = function(command) {
    if(command.do()) {
        this.push(command);
        resetSaveWindow();
        // var data = voxengine.exportPesudeObjFormat();
    }
};

Voxworkstack.prototype.putVox = function(position, color) {
    this.exeCommand(new PutVoxCommand(position, color));
};

Voxworkstack.prototype.putVoxes = function(idxs, colors, offset) {
    this.exeCommand(new PutVoxesCommand(idxs, colors, offset));
};

Voxworkstack.prototype.putVoxesByCube = function(start, end, color) {
    this.exeCommand(new PutVoxesByCubeCommand(start, end, color));
};

Voxworkstack.prototype.removeVox = function(position) {
    this.exeCommand(new RemoveVoxCommand(position));
};

Voxworkstack.prototype.removeVoxesByCube = function(start, end) {
    this.exeCommand(new RemoveVoxesByCubeCommand(start, end));
};

Voxworkstack.prototype.changeVoxColor = function(position, to) {
    this.exeCommand(new ChangeVoxColorCommand(position, to));
};

Voxworkstack.prototype.changeVoxesColor = function(idxs, to) {
    this.exeCommand(new ChangeVoxesColorCommand(idxs, to));
};

// ---------------------------------------------
// putvox command
// ---------------------------------------------
var PutVoxCommand = function(position, color) {
    this.position = position.clone();
    this.color = color.clone();
};

PutVoxCommand.prototype.do = function() {
    return voxengine.putVoxWithVec3(this.position, this.color);
};

PutVoxCommand.prototype.undo = function() {
    voxengine.removeVoxWithVec3(this.position);
};

// ---------------------------------------------
// putvoxes command
// ---------------------------------------------
// 汎用的な一括配置コマンド
var PutVoxesCommand = function(idxs, colors, offset) {
    this.idxs = voxutil.cloneArray(idxs);
    for(var i = 0; i < this.idxs.length; ++i) {
        this.idxs[i].add(offset);
    }
    this.colors = voxutil.cloneArray(colors);
    this.putIdxs = null;
};

PutVoxesCommand.prototype.do = function() {
    var i = 0;
    if(this.putIdxs === null) {
        this.putIdxs = [];
        for(; i < this.idxs.length; ++i) {
            if(voxengine.putVoxWithVec3(this.idxs[i], this.colors[i])) {
                this.putIdxs.push(i);
            }
        }
    } else {
        for(; i < this.putIdxs.length; ++i) {
            voxengine.putVoxWithVec3(this.idxs[this.putIdxs[i]], this.colors[this.putIdxs[i]]);
        }
    }
    return this.putIdxs.length > 0;
};

PutVoxesCommand.prototype.undo = function() {
    if(this.putIdxs !== null) {
        for(i = 0; i < this.putIdxs.length; ++i) {
            voxengine.removeVoxWithVec3(this.idxs[this.putIdxs[i]]);
        }
    }
};

// 矩形領域を指定した一括配置コマンド
var PutVoxesByCubeCommand = function(start, end, color) {
    this.color = color.clone();
    this.putIdxs = null;
    this.targetIdxs = voxengine.getVoxIdxsInSpace(start, end);
};

PutVoxesByCubeCommand.prototype.do = function() {
    var i;
    if(this.putIdxs === null) {
        this.putIdxs = [];
        for(i = 0; i < this.targetIdxs.length; ++i) {
            if(voxengine.putVoxWithVec3(this.targetIdxs[i], this.color)) {
                this.putIdxs.push(i);
            }
        }
    } else {
        for(i = 0; i < this.putIdxs.length; ++i) {
            voxengine.putVoxWithVec3(this.targetIdxs[this.putIdxs[i]], this.color);
        }
    }
    return this.putIdxs.length > 0;
};

PutVoxesByCubeCommand.prototype.undo = function() {
    if(this.putIdxs !== null) {
        for(i = 0; i < this.putIdxs.length; ++i) {
            voxengine.removeVoxWithVec3(this.targetIdxs[this.putIdxs[i]]);
        }
    }
};

// ---------------------------------------------
// removevox command
// ---------------------------------------------
var RemoveVoxCommand = function(position) {
    this.position = position.clone();
    this.color = null;
};

RemoveVoxCommand.prototype.do = function() {
    if(this.color === null) {
        var vox = voxengine.getVoxWithVec3(this.position);
        if(vox !== null) {
            this.color = vox.color.clone();
        } else {
            return false;
        }
    }
    return voxengine.removeVoxWithVec3(this.position);
};

RemoveVoxCommand.prototype.undo = function() {
    if(this.color !== null) {
        voxengine.putVoxWithVec3(this.position, this.color);
    }
};

// ---------------------------------------------
// remove voxes command
// ---------------------------------------------
var RemoveVoxesByCubeCommand = function(start, end) {
    this.removeIdxs = null;
    this.removeVoxColors = null;
    this.targetIdxs = voxengine.getVoxIdxsInSpace(start, end);
};

RemoveVoxesByCubeCommand.prototype.do = function() {
    var i;
    if(this.removeIdxs === null) {
        this.removeIdxs = [];
        this.removeVoxColors = [];
        for(i = 0; i < this.targetIdxs.length; ++i) {
            var vox = voxengine.getVoxWithVec3(this.targetIdxs[i]);
            if(vox !== null && vox.visible) {
                this.removeIdxs.push(i);
                this.removeVoxColors.push(vox.color.clone());
                voxengine.removeVoxWithVec3(this.targetIdxs[i]);
            }
        }
    } else {
        for(i = 0; i < this.removeIdxs.length; ++i) {
            voxengine.removeVoxWithVec3(this.targetIdxs[this.removeIdxs[i]]);
        }
    }
    // console.log(this.removeIdxs);
    return this.removeIdxs.length > 0;
};

RemoveVoxesByCubeCommand.prototype.undo = function() {
    if(this.removeIdxs !== null) {
        for(i = 0; i < this.removeIdxs.length; ++i) {
            voxengine.putVoxWithVec3(this.targetIdxs[this.removeIdxs[i]], this.removeVoxColors[i]);
        }
    }
};

// ---------------------------------------------
// change vox color command
// ---------------------------------------------
var ChangeVoxColorCommand = function(position, to) {
    this.position = position.clone();
    this.from = null;
    this.to = to.clone();
};

ChangeVoxColorCommand.prototype.do = function() {
    if(this.from === null) {
        var vox = voxengine.getVoxWithVec3(this.position);
        if(vox !== null) {
            this.from = vox.color.clone();
        } else {
            return false;
        }
    }
    return voxengine.setVoxColorWithVec3(this.position, this.to);
};

ChangeVoxColorCommand.prototype.undo = function() {
    if(this.from === null) {
        return;
    }
    voxengine.setVoxColorWithVec3(this.position, this.from);
};

// ---------------------------------------------
// change voxes color command
// ---------------------------------------------
var ChangeVoxesColorCommand = function(idxs, to) {
    this.idxs = voxutil.cloneArray(idxs);
    this.changedIdxs = null;
    this.changedColors = null;
    this.to = to.clone();
};

ChangeVoxesColorCommand.prototype.do = function() {
    var i = 0;
    if(this.changedIdxs === null) {
        this.changedIdxs = [];
        this.changedColors = [];
        for(; i < this.idxs.length; ++i) {
            var vox = voxengine.getVoxWithVec3(this.idxs[i]);
            if(vox !== null && vox.visible) {
                this.changedIdxs.push(i);
                this.changedColors.push(vox.color.clone());
                voxengine.setVoxColorWithVec3(this.idxs[i], this.to);
            }
        }
    } else {
        for(; i < this.changedIdxs.length; ++i) {
            voxengine.setVoxColorWithVec3(this.idxs[this.changedIdxs[i]], this.to);
        }
    }
    return this.changedIdxs.length > 0;
};

ChangeVoxesColorCommand.prototype.undo = function() {
    if(this.changedIdxs !== null) {
        for(i = 0; i < this.changedIdxs.length; ++i) {
            voxengine.setVoxColorWithVec3(this.idxs[this.changedIdxs[i]], this.changedColors[i]);
        }
    }
};