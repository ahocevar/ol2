tl.Map = function(cfg) {
    var me = this;
    tl.Observable.prototype.constructor.apply(this, arguments);
    me._layers = [];
    me._renderer = cfg.Renderer ? new cfg.Renderer(me) : new tl.Renderer(me.el);
    var div = this.el;
    div.className = "tl unselectable";
    div.style.overflow = "hidden";
    div.style.position = "relative";
    // prevent default select and drag-drop
    tl.addEventListener(div, 'mousedown', tl.preventDefault);
    me.on("dragstart", function() {
        me.el.className += " drag";
    }, me);
    me.on("drag", function(type, evt) {
        me.center({
            x: me._center.x - evt.dx * me.resolution(),
            y: me._center.y + evt.dy * me.resolution()
        });
    });
    me.on("dragend", function() {
        me.el.className = me.el.className.replace(" drag", "");
    }, this);
};
tl.inherit(tl.Map, tl.Observable);
tl.extend(tl.Map.prototype, {
    projection: 'EPSG:3857',
    _zoom: 0,
    _center: null,
    _layers: null,
    _renderer: null,
    _size: null,
    sequences: [tl.sequence.dragclick()],
    add: function(item) {
        item.setMap(this);
        if (item instanceof tl.Layer) {
            this._layers.push(item);
        }
    },
    size: function() {
        if (!this._size) {
            var style = document.defaultView ?
                document.defaultView.getComputedStyle(this.el) :
                this.el.currentStyle;
            this._size = {
                w: parseInt(style.width, 10),
                h: parseInt(style.height, 10)
            };
        }
        return this._size;
    },
    bounds: function() {
        var center = this.center(),
            mapSize = this.size(),
            resolution = this.resolution();
        return {
            minX: center.x - mapSize.w * resolution / 2,
            maxY: center.y + mapSize.h * resolution / 2,
            maxX: center.x + mapSize.w * resolution / 2,
            minY: center.y - mapSize.h * resolution / 2
        };
    },
    resolution: function() {
        var def = tl.CRS.defs[this.projection],
            size = Math.max(
                def.extent.maxX - def.extent.minX,
                def.extent.maxY - def.extent.minY
            );
        return size / 256 / Math.pow(2, this._zoom);
    },
    render: function() {
        if (!this._center) {
            return;
        }
        var bounds = this.bounds(),
            resolution = this.resolution(),
            data = [];
        for (var i=0, ii=this._layers.length; i<ii; ++i) {
            data.push(this._layers[i].getData(bounds, resolution));
        }
        this._renderer.render(data, bounds, resolution);
        return this;
    },
    center: function(center) {
        if (!arguments.length) {
            return this._center;
        } else {
            if (center instanceof Array) {
                center = new tl.LatLng(center);
            }
            if (center instanceof tl.LatLng) {
                this._center = center.to(this.projection);
            } else {
                this._center = center;
            }
            this.render();
            return this;
        }
    },
    zoom: function(zoom) {
        if (!arguments.length) {
            return this._zoom;
        } else {
            this._zoom = zoom;
            this.render();
            return this;
        }
    }
});