var KeyboardInput = pc.createScript('keyboardInput');

// initialize code called once per entity
KeyboardInput.prototype.initialize = function() {
    this.orbitCamera = this.entity.script.orbitCamera;
};


KeyboardInput.prototype.postInitialize = function() {
    if (this.orbitCamera) {
        this.startDistance = this.orbitCamera.distance;
        this.startYaw = this.orbitCamera.yaw;
        this.startPitch = this.orbitCamera.pitch;
        this.startPivotPosition = this.orbitCamera.pivotPoint.clone();
    }
};

// update code called every frame
KeyboardInput.prototype.update = function(dt) {
    if (this.orbitCamera) {
        if (this.app.keyboard.wasPressed(pc.KEY_SPACE)) {
            this.orbitCamera.distance = this.startDistance;
            this.orbitCamera.yaw = this.startYaw;
            this.orbitCamera.pitch = this.startPitch;
            this.orbitCamera.pivotPoint = this.startPivotPosition;
        }
    }
};
