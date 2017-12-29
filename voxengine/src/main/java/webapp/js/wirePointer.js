var Wirepointer = pc.createScript('wirepointer');

Wirepointer.prototype.initialize = function() {
    this.isDrawedWirePtr = false;
    this.wirePtrPositions = [];
    this.wirePtrIdxs = [];
    
    this.wirePtrColor = new pc.Color(1, 0, 1, 1);
    this.offset = new pc.Vec3(0, 0, 0);
    this.visible = true;
};

Wirepointer.prototype.update = function(dt) {
    if(this.isDrawedWirePtr && this.visible) {
        for(var i = 0; i < this.wirePtrPositions.length; ++i) {
            voxutil.drawWireFrameBox(
                this.app,
                this.wirePtrPositions[i].clone().add(this.offset),
                this.wirePtrColor
            );
        }
    }
};

Wirepointer.prototype.addPosition = function(p) {
    var str = p.toString();
    if(this.wirePtrIdxs.indexOf(str) === -1) {
        this.wirePtrPositions.push(p.clone());
        this.wirePtrIdxs.push(str);
        this.isDrawedWirePtr = true;
    }
};

Wirepointer.prototype.getPositions = function() {
    var temp = [];
    for(var i = 0; i < this.wirePtrPositions.length; ++i) {
        temp.push(this.wirePtrPositions[i].clone());
    }
    return temp;
};

Wirepointer.prototype.numOfPosition = function() {
    return this.wirePtrPositions.length;
};

Wirepointer.prototype.clear = function() {
    this.wirePtrPositions.length = 0;
    this.wirePtrIdxs.length = 0;
    this.isDrawedWirePtr = false;
};

Wirepointer.prototype.setColor = function(c) {
    this.wirePtrColor = c.clone();
};

Wirepointer.prototype.setOffset = function(offset) {
    this.offset = offset;
};

Wirepointer.prototype.setVisible = function(visible) {
    this.visible = visible;
};