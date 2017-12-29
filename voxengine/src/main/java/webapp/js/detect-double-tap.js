// The touch event API can be found at http://developer.playcanvas.com/en/api/pc.TouchEvent.html
var DetectDoubleTap = pc.createScript('detectDoubleTap');

DetectDoubleTap.attributes.add("doubleTapSpeed", {type: "number", default: 0.5, title: "Double Tap Speed", 
    description: "The maximum time (secs) allowed between tap to register as a double tap"});

// initialize code called once per entity
DetectDoubleTap.prototype.initialize = function() {
    doubletap = 0;
    // Set the timeSinceLastTap to be outside the time window for a double tap so the user's first tap
    // in the app won't be registered as double tap
    this.timeSinceLastTap = this.doubleTapSpeed;  
    
    // Check if the device has tap support before registering the events
    if (this.app.touch) {
        this.app.touch.on(pc.EVENT_TOUCHSTART, this.onTouchStart, this);
    }
};

// update code called every frame
DetectDoubleTap.prototype.update = function(dt) {
    // Always add time since last frame to timeSinceLastTap so we know when the user has 
    // tapped last    
    this.timeSinceLastTap += dt;
};

DetectDoubleTap.prototype.onTouchStart = function(touchEvent) {
    // Only register a tap if one finger is used at one time
    if (touchEvent.touches.length > 1) {
        return;
    }
    
    // Check if user has previously tapped within the time window to be registered as a double tap
    if (this.timeSinceLastTap < this.doubleTapSpeed) {
        // User has double tapped so let's perform an action
        doubletap++;

        // We should also set the timeSinceLastTap to be outside the time window so their third tap
        // won't accidently be registered as a double tap
        this.timeSinceLastTap = this.doubleTapSpeed;  
    }
    else {
            // Reset timeSinceLastTap if the click was done after the time allowed for a double
            // tap to register
            this.timeSinceLastTap = 0;
    }
};