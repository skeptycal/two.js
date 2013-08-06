(function() {

  var Vector = Two.Vector = function(x, y) {

    this.x = x || 0;
    this.y = y || 0;

  };

  _.extend(Vector, {

    MakeGetterSetter: function(object, property, value) {

      var secret = '_' + property;

      Object.defineProperty(object, property, {

        get: function() {
          return this[secret];
        },
        set: function(v) {
          this[secret] = v;
          this.trigger(Two.Events.change, property);
        }

      });

      object[secret] = value; // Initialize private attribute.

    }

  });

  _.extend(Vector.prototype, Backbone.Events, {

    set: function(x, y) {
      if (this._bound) {
        this._x = x;
        this._y = y;
        return this.trigger(Two.Events.change);
      }
      this.x = x;
      this.y = y;
      return this;
    },

    copy: function(v) {
      if (this._bound) {
        this._x = v.x;
        this._y = v.y;
        return this.trigger(Two.Events.change);
      }
      this.x = v.x;
      this.y = v.y;
      return this;
    },

    clear: function() {
      if (this._bound) {
        this._x = 0;
        this._y = 0;
        return this.trigger(Two.Events.change);
      }
      this.x = 0;
      this.y = 0;
      return this;
    },

    clone: function() {
      return new Vector(this.x, this.y);
    },

    add: function(v1, v2) {
      if (this._bound) {
        this._x = v1.x + v2.x;
        this._y = v1.y + v2.y;
        return this.trigger(Two.Events.change);
      }
      this.x = v1.x + v2.x;
      this.y = v1.y + v2.y;
      return this;
    },

    addSelf: function(v) {
      if (this._bound) {
        this._x += v.x;
        this._y += v.y;
        return this.trigger(Two.Events.change);
      }
      this.x += v.x;
      this.y += v.y;
      return this;
    },

    sub: function(v1, v2) {
      if (this._bound) {
        this._x = v1.x - v2.x;
        this._y = v1.y - v2.y;
        return this.trigger(Two.Events.change);
      }
      this.x = v1.x - v2.x;
      this.y = v1.y - v2.y;
      return this;
    },

    subSelf: function(v) {
      if (this._bound) {
        this._x -= v.x;
        this._y -= v.y;
        return this.trigger(Two.Events.change);
      }
      this.x -= v.x;
      this.y -= v.y;
      return this;
    },

    multiplySelf: function(v) {
      if (this._bound) {
        this._x *= v.x;
        this._y *= v.y;
        return this.trigger(Two.Events.change);
      }
      this.x *= v.x;
      this.y *= v.y;
      return this;
    },

    multiplyScalar: function(s) {
      if (this._bound) {
        this._x *= s;
        this._y *= s;
        return this.trigger(Two.Events.change);
      }
      this.x *= s;
      this.y *= s;
      return this;
    },

    divideScalar: function(s) {
      if (s) {
        if (this._bound) {
          this._x /= s;
          this._y /= s;
          return this.trigger(Two.Events.change);
        }
        this.x /= s;
        this.y /= s;
      } else {
        this.set(0, 0);
      }
      return this;
    },

    negate: function() {
      return this.multiplyScalar(-1);
    },

    dot: function(v) {
      if (this._bound) {
        return this._x * v.x + this._y * v.y;
      }
      return this.x * v.x + this.y * v.y;
    },

    lengthSquared: function() {
      if (this._bound) {
        return this._x * this._x + this._y * this._y;
      }
      return this.x * this.x + this.y * this.y;
    },

    length: function() {
      return Math.sqrt(this.lengthSquared());
    },

    normalize: function() {
      return this.divideScalar(this.length());
    },

    distanceTo: function(v) {
      return Math.sqrt(this.distanceToSquared(v));
    },

    distanceToSquared: function(v) {
      var dx, dy;
      if (this._bound) {
        dx = this._x - v.x, dy = this._y - v.y;
      } else {
        dx = this.x - v.x, dy = this.y - v.y;
      }
      return dx * dx + dy * dy;
    },

    setLength: function(l) {
      return this.normalize().multiplyScalar(l);
    },

    equals: function(v) {
      return (this.distanceTo(v) < 0.0001 /* almost same position */);
    },

    lerp: function(v, t) {
      var x, y;
      if (this._bound) {
        x = (v.x - this._x) * t + this._x;
        y = (v.y - this._y) * t + this._y;
      } else {
        x = (v.x - this.x) * t + this.x;
        y = (v.y - this.y) * t + this.y;
      }
      return this.set(x, y);
    },

    isZero: function() {
      return (this.length() < 0.0001 /* almost zero */ );
    }

  });

  /**
   * Override Backbone bind / on in order to add properly broadcasting.
   * This allows Two.Vector to not broadcast events unless event listeners
   * are explicity bound to it.
   */

    Two.Vector.prototype.bind = Two.Vector.prototype.on = function() {

      if (!this._bound) {
        Two.Vector.MakeGetterSetter(this, 'x', this.x);
        Two.Vector.MakeGetterSetter(this, 'y', this.y);
        this._bound = true; // Reserved for event initialization check
      }

      Backbone.Events.bind.apply(this, arguments);

      return this;

    };

})();