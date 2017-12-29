var CheckEditorUi = pc.createScript('checkEditorUi');

// initialize code called once per entity
CheckEditorUi.prototype.initialize = function() {
    document.getElementById("delete").addEventListener("click",alert("click"),false);
};

// update code called every frame
CheckEditorUi.prototype.update = function(dt) {
    
};

// swap method called for script hot-reloading
// inherit your script state here
// CheckEditorUi.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// http://developer.playcanvas.com/en/user-manual/scripting/