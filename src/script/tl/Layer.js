tl.Layer = function(config) {
    this.config = config || {};
};
tl.extend(tl.Layer.prototype, {
    setMap: function(map) {
        this.map = map;
    },
    getData: function(bounds, resolution) {
        // to be implemented by subclasses
    }
});
