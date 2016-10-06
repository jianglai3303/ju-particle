define(function(require, exports, mudule) {
    var Particle = require('../Core/Particle');
    var Effect = require('./Effect');
    var Vector3 = require('../Math/Vector3');
    function ScatterIni3d() {
        this.once = true;
        this.scale = 1;
        this.layer = false;
        this.allProcess = true;
    };
    ScatterIni3d.prototype.__proto__ = Effect.prototype;
    ScatterIni3d.prototype.exe = function(particles, i, canvas) {
        for (var i = 0; i < 400; i++) {
            var particle = new Particle(Number.POSITIVE_INFINITY, 4);
            particle.setColor("rgba(0,0,255,1)");
            if (this.layer) {
                var pos = new Vector3(this.scale * (Math.random() * 0.1 - 0.05) * canvas.width, this.scale * (Math.random() * 0.1 - 0.05) * canvas.height, -50);
            } else {
                var pos = new Vector3(this.scale * (Math.random() * 0.1 - 0.05) * canvas.width, this.scale * (Math.random() * 0.1 - 0.05) * canvas.height, this.scale * Math.random() * -10);
            }

            var velocity = new Vector3(0, 0, 0);
            particle.set3d(pos, velocity);
            particles.push(particle);
        }
    }
    return ScatterIni3d;
});