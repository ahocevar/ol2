tl.Map = function(cfg) {
    var me = this;
    tl.Observable.prototype.constructor.apply(this, arguments);
    me._resolution = me._resolutions[0];
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
            x: me._center.x - evt.dx * me._resolution,
            y: me._center.y + evt.dy * me._resolution
        });
    });
    me.on("dragend", function() {
        me.el.className = me.el.className.replace(" drag", "");
    }, this);
};
tl.inherit(tl.Map, tl.Observable);
tl.extend(tl.Map.prototype, {
    projection: 'EPSG:3857',
    _zoom: null,
    _center: null,
    _layers: null,
    _renderer: null,
    //TODO consider maxResolution and minResolution instead
    _resolutions: [
        156543.03390625, 78271.516953125, 39135.7584765625,
        19567.87923828125, 9783.939619140625, 4891.9698095703125,
        2445.9849047851562, 1222.9924523925781, 611.4962261962891,
        305.74811309814453, 152.87405654907226, 76.43702827453613,
        38.218514137268066, 19.109257068634033, 9.554628534317017,
        4.777314267158508, 2.388657133579254, 1.194328566789627,
        0.5971642833948135, 0.29858214169740677, 0.14929107084870338,
        0.07464553542435169
    ],
    _resolution: null,
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
            resolution = this._resolution;
        return {
            minX: center.x - mapSize.w * resolution / 2,
            maxY: center.y + mapSize.h * resolution / 2,
            maxX: center.x + mapSize.w * resolution / 2,
            minY: center.y - mapSize.h * resolution / 2
        };
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
            var bounds = this.bounds(),
                resolution = this._resolution,
                data = [];
            if (this._zoom !== null) {
                for (var i=0, ii=this._layers.length; i<ii; ++i) {
                    data.push(this._layers[i].getData(bounds, resolution));
                }
                this._renderer.render(data, bounds, resolution);
            }
            return this;
        }
    },
    zoom: function(zoom) {
        if (!arguments.length) {
            return this._zoom;
        } else {
            this._zoom = zoom;
            this._resolution = this._resolutions[zoom];
            this.center(this._center);
            return this;
        }
    }
});