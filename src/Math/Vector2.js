define(function(require, exports, mudule) {

    Vector2 = function(x, y) {
        this.x = x;
        this.y = y;
    }

    Vector2.prototype.copy = function() {
        return new Vector2(this.x, this.y);
    };
    Vector2.prototype.add = function(v) {
        return new Vector2(this.x + v.x, this.y + v.y);
    }
    Vector2.prototype.subtract = function(v) {
        return new Vector2(this.x - v.x, this.y - v.y);
    }
    Vector2.prototype.multiply = function(v) {
        return new Vector2(this.x * v.x, this.y * v.y);
    }
    Vector2.prototype.dot = function(v) {
        return this.x * v.x + this.y * v.y;
    }
    Vector2.prototype.dist = function(v) {
        return (this.x - v.x) * (this.x - v.x) + (this.y - v.y) * (this.y - v.y);
    }
    Vector2.prototype.norm = function() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    Vector2.prototype.unit = function() {
        return new Vector2(this.x/this.norm(),this.y/this.norm());
    }


    Vector2.zero = new Vector2(0, 0);

    return Vector2;
});