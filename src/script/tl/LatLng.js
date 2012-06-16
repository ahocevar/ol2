tl.LatLng = function(lat, lng) {
    if (arguments.length === 1) {
        this.x = lat[1];
        this.y = lat[0];
    } else {
        this.x = lng;
        this.y = lat;
    }
};
tl.extend(tl.LatLng.prototype, {
    x: null,
    y: null,
    transforms: {
        "EPSG:4326": {
            "EPSG:3857": function(xy) {
                var x = xy.x * 20037508.34 / 180;
                var y = Math.log(Math.tan((90 + xy.y) * Math.PI / 360)) / Math.PI * 20037508.34;
                return {x: x, y: y};
            }
        },
        "EPSG:3857": {
            "EPSG:4326": function(xy) {
                var x = 180 * xy.x / 20037508.34;
                var y = 180 / Math.PI * (2 * Math.atan(Math.exp((xy.y / 20037508.34) * Math.PI)) - Math.PI / 2);
                return {x: x, y: y};
                
            }
        }
    },
    to: function(crs) {
        return this.transforms["EPSG:4326"][crs](this);
    }
});
tl.LatLng.from = function(crs, xy) {
    xy = tl.LatLng.prototype.transforms[crs]["EPSG:4326"](xy);
    return new tl.LatLng(xy.y, xy.x);
};