define(function(require, exports, mudule) {
    var Particle = require('../Core/Particle');
    var Effect = require('./Effect');
    var Vector2 = require('../Math/Vector2');
    function ScatterIni2d() {
        this.once = true;
        this.allProcess = true;
        this.size = 4;
    };
    ScatterIni2d.prototype.__proto__ = Effect.prototype;
    ScatterIni2d.prototype.exe = function(particles, i, canvas) {
        for (var i = 0; i < 1000; i++) {
            var particle = new Particle(Number.POSITIVE_INFINITY, this.size);
            particle.set2d(new Vector2(Math.random() * canvas.width, Math.random() * canvas.height), new Vector2(0, 0));
            particle.setColor("rgba(0,0,255,1)");
            particles.push(particle);
        }
    }
    return ScatterIni2d;
});