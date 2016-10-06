define(function(require,exports,mudule){
    CanvasRender = function(canvas, mode) {
        this.canvas = canvas;
        this.mode = mode;
    };

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

    CanvasRender.prototype.clearCanvas = function() {
        var ctx = this.canvas.getContext('2d');
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    CanvasRender.prototype.renderNotClear  = function(particles) {
        this.draw(particles);
    };
    CanvasRender.prototype.draw  = function(particles) {
        var ctx = this.canvas.getContext('2d');
        if (this.mode == 'solid') {
            for (var i = 0; i < particles.length; i++) {
                ctx.fillStyle = particles[i].color;
                ctx.beginPath();
                ctx.arc(particles[i].position.x, particles[i].position.y, particles[i].size, 0, Math.PI * 2, true);
                ctx.closePath();
                ctx.fill();
            }
        } else if (this.mode == 'blur') {
            for (var i = 0; i < particles.length; i++) {
                var gradient = ctx.createRadialGradient(particles[i].position.x, 
                                                        particles[i].position.y, 
                                                        particles[i].size / 5, 
                                                        particles[i].position.x, 
                                                        particles[i].position.y, 
                                                        particles[i].size);
                gradient.addColorStop(0, particles[i].color);
                var colors = calRGBA(particles[i].color);
                var finalCol = calColor(colors[0], colors[1], colors[2], 0);
                gradient.addColorStop(1, finalCol);
                ctx.fillStyle = gradient;
                ctx.fillRect(particles[i].position.x - particles[i].size, 
                             particles[i].position.y - particles[i].size, 
                             2 * particles[i].size, 
                             2 * particles[i].size);
            }
        }
    };
    CanvasRender.prototype.render = function(particles) {
        this.clearCanvas();
        this.draw(particles);
    };
    return CanvasRender;
});