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
    to: function(crs) {
        return tl.CRS.defs[crs].forward(this);
    }
});
tl.LatLng.from = function(crs, xy) {
    xy = tl.CRS.defs[crs].inverse(xy);
    return new tl.LatLng(xy.y, xy.x);
};