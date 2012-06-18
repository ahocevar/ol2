tl.Renderer = function(map) {
    this.map = map;
    var container = document.createElement("div");
    container.style.position = "absolute";
    map.el.appendChild(container);
    this.div = container;
};
tl.extend(tl.Renderer.prototype, {
    map: null,
    div: null,
    left: 0,
    top: 0,
    dx: 0,
    dy: 0,
    animationId: null,
    render: function(data, bounds) {
        this.div.innerHTML = "";
        var resolution = this.map._resolution,
            fragment = document.createDocumentFragment(),
            layerData, tile, offset;
        for (var l=0, ll=data.length; l<ll; ++l) {
            layerData = data[l];
            offset = {
                x: layerData.insertAt.x - bounds.left,
                y: bounds.top + layerData.insertAt.y
            };
            for (var i=0, ii=layerData.data.length; i<ii; ++i) {
                for (var j=0, jj=layerData.data[i].length; j<jj; ++j) {
                    tile = layerData.data[i][j];
                    tile.style.left = ((offset.x + i * layerData.tileDelta.x) / resolution) + "px";
                    tile.style.top = ((offset.y + j * layerData.tileDelta.y) / resolution) + "px";
                    fragment.appendChild(tile);
                }
            }
        }
        tl.setStyle(this.div,
            {transform: tl.hasTransform3d ? "translate3d(0,0,0)" : "translate(0,0)"},
            {left: "0", top: "0"}
        );
        this.div.appendChild(fragment);
    },
    moveByPx: function(dx, dy) {
        var me = this;
        me.left += dx;
        me.top += dy;
        if (!me.animationId) {
            me.animationId = tl.requestAnimationFrame(function() {
                tl.setStyle(me.div,
                    {transform: tl.hasTransform3d ?
                        "translate3d(" + me.left + "px," + me.top + "px,0)" :
                        "translate(" + me.left + "px," + me.top + "px)"},
                    {left: me.left + "px", top: me.top + "px"}
                );
                me.animationId = null;  
            });
        }
    }
});
