//--------------- POST EFFECT DEFINITION ------------------------//
pc.extend(pc, function () {
    /**
     * @name pc.SepiaEffect
     * @class Implements the SepiaEffect color filter.
     * @constructor Creates new instance of the post effect.
     * @extends pc.PostEffect
     * @param {pc.GraphicsDevice} graphicsDevice The graphics device of the application
     * @property {Number} amount Controls the intensity of the effect. Ranges from 0 to 1.
     */
    var SepiaEffect = function (graphicsDevice) {
        this.shader = new pc.Shader(graphicsDevice, {
            attributes: {
                aPosition: pc.SEMANTIC_POSITION
            },
            vshader: [
                "attribute vec2 aPosition;",
                "",
                "varying vec2 vUv0;",
                "",
                "void main(void)",
                "{",
                "    gl_Position = vec4(aPosition, 0.0, 1.0);",
                "    vUv0 = (aPosition.xy + 1.0) * 0.5;",
                "}"
            ].join("\n"),
            fshader: [
                "precision " + graphicsDevice.precision + " float;",
                "",
                "uniform float uAmount;",
                "uniform sampler2D uColorBuffer;",
                "",
                "varying vec2 vUv0;",
                "",
                "void main() {",
                "    vec4 color = texture2D(uColorBuffer, vUv0);",
                "    vec3 c = color.rgb;",
                "",
                "    color.r = dot(c, vec3(1.0 - 0.607 * uAmount, 0.769 * uAmount, 0.189 * uAmount));",
                "    color.g = dot(c, vec3(0.349 * uAmount, 1.0 - 0.314 * uAmount, 0.168 * uAmount));",
                "    color.b = dot(c, vec3(0.272 * uAmount, 0.534 * uAmount, 1.0 - 0.869 * uAmount));",
                "",
                "    gl_FragColor = vec4(min(vec3(1.0), color.rgb), color.a);",
                "}"
            ].join("\n")
        });

        // Uniforms
        this.amount = 1;
    };

    SepiaEffect = pc.inherits(SepiaEffect, pc.PostEffect);

    SepiaEffect.prototype = pc.extend(SepiaEffect.prototype, {
        render: function (inputTarget, outputTarget, rect) {
            var device = this.device;
            var scope = device.scope;

            scope.resolve("uAmount").setValue(this.amount);
            scope.resolve("uColorBuffer").setValue(inputTarget.colorBuffer);
            pc.drawFullscreenQuad(device, outputTarget, this.vertexBuffer, this.shader, rect);
        }
    });

    return {
        SepiaEffect: SepiaEffect
    };
}());


//--------------- SCRIPT DEFINITION------------------------//
var Sepia = pc.createScript('sepia');

Sepia.attributes.add('amount', {
    type: 'number',
    default: 1,
    min: 0,
    max: 1,
    title: 'Amount'
});

// initialize code called once per entity
Sepia.prototype.initialize = function() {
    this.effect = new pc.SepiaEffect(this.app.graphicsDevice);
    this.effect.amount = this.amount;
    var self = this;

    this.on('attr:amount', function (value) {
        this.effect.amount = value;
    }, this);

    var queue = this.entity.camera.postEffects;
    //queue.addEffect(this.effect);

    this.on('state', function (enabled) {
        if (enabled) {
            queue.addEffect(this.effect);
        } else {
            queue.removeEffect(this.effect);
        }
    });

    this.on('destroy', function () {
        queue.removeEffect(this.effect);
    });
    
    voxUI.on("UI:camera:sepia",function(){
        if(voxUI.camera_sepia.checked){
            queue.addEffect(self.effect);
        } else {
            queue.removeEffect(self.effect);
        }
    });
};