var Check = pc.createScript('check');

// initialize code called once per entity
Check.prototype.initialize = function() {
    templateDirection = {
        positiveX : new pc.Vec3(0,0,-90),
        negativeX : new pc.Vec3(0,0,90),
        positiveY : new pc.Vec3(0,0,0),
        negativeY : new pc.Vec3(180,0,0),
        positiveZ : new pc.Vec3(90,0,0),
        negativeZ : new pc.Vec3(-90,0,0)
    };
    temp = this.app.root.findByName("boxtemp");
    shadowtemp = this.app.root.findByName("shadowtemp");
    hovertemp = this.app.root.findByName("hovertemp");
    pool = this.app.root.findByName("boxel");
    cam = this.app.root.findByName("Camera");
    
   
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-83861814-4', 'auto');
  ga('send', 'pageview');
};


Check.prototype.checkdirection = function(angle){
    var ans = new pc.Vec3();
    
    if(angle.equals(templateDirection.negativeX)) ans = pc.Vec3.RIGHT;
    if(angle.equals(templateDirection.negativeY)) ans = pc.Vec3.UP;
    if(angle.equals(templateDirection.negativeZ)) ans = pc.Vec3.BACK;
    if(angle.equals(templateDirection.positiveX)) ans = pc.Vec3.LEFT;
    if(angle.equals(templateDirection.positiveY)) ans = pc.Vec3.DOWN;
    if(angle.equals(templateDirection.positiveZ)) ans = pc.Vec3.FORWARD;
    
    return ans;
};

// swap method called for script hot-reloading
// inherit your script state here
// Check.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// http://developer.playcanvas.com/en/user-manual/scripting/