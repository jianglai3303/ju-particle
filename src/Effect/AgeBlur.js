define(function(require,exports,mudule){
	var Effect = require('./Effect');
	function AgeBlur(){
	};
	AgeBlur.prototype.__proto__ = Effect.prototype;
	AgeBlur.prototype.exe = function(particles , i , canvas){
		var colors = calRGBA(particles[i].color);
		var alpha = 1 - (particles[i].age / particles[i].life);
        particles[i].color = calColor(colors[0], colors[1], colors[2], alpha);
	}
	//rgba to color string
	var calColor = function(r, g, b, a) {
	    var draw = [];
	    draw.push("rgba(" + Math.floor(r));
	    draw.push(Math.floor(g));
	    draw.push(Math.floor(b));
	    draw.push(a + ")");
	    return draw.join(",");
	};

	//color string to rgba
	var calRGBA = function(color) {
	    return (color.substring(color.indexOf('(') + 1, color.indexOf(')'))).split(',');
	};
	return AgeBlur;
});