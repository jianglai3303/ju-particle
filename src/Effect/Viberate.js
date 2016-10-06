define(function(require, exports, mudule) {
    var Particle = require('../Core/Particle');
    var Effect = require('./Effect');
    var Vector2 = require('../Math/Vector2');
    function Viberate(v) {
        if(!v) return;
        this.v = v;
    };
    Viberate.prototype.__proto__ = Effect.prototype;
    Viberate.prototype.exe = function(particles, i, canvas) {
        if(Math.random()<0.1){
            particles[i].pos3.x += Math.random()*1-0.5;
            particles[i].pos3.y += Math.random()*1-0.5;
            particles[i].pos3.z += Math.random()*1-0.5;
        }
        
    }
    return Viberate;
});