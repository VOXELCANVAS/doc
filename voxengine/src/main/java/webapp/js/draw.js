var Draw = pc.createScript('draw');

// initialize code called once per entity
Draw.prototype.initialize = function() {
    
};

// update code called every frame
Draw.prototype.update = function(dt) {
    
};

// swap method called for script hot-reloading
// inherit your script state here
// Draw.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// http://developer.playcanvas.com/en/user-manual/scripting/
// 
// onload = function() {
//     draw();
//   };
//   function draw() {
//     /* canvas要素のノードオブジェクト */
//     var canvas = document.getElementById('canvassample');
//     /* canvas要素の存在チェックとCanvas未対応ブラウザの対処 */
//     if ( ! canvas || ! canvas.getContext ) {
//       return false;
//     }
//     /* 2Dコンテキスト */
//     var ctx = canvas.getContext('2d');
//     /* 四角を描く */
//     ctx.beginPath();
//     ctx.moveTo(20, 20);
//     ctx.lineTo(120, 20);
//     ctx.lineTo(120, 120);
//     ctx.lineTo(20, 120);
//     ctx.closePath();
//     ctx.stroke();
//   }