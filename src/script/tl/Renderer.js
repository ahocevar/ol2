tl.Renderer = function(target) {
    var el = document.createElement("div");
    el.style.position = "absolute";
    target.appendChild(el);
    this.el = el;
    this.renderedTiles = [];
};
tl.extend(tl.Renderer.prototype, {
    div: null,
    resolution: null,
    bounds: null,
    left: 0,
    top: 0,
    animationId: null,
    render: function(data, bounds, resolution) {
        var me = this;
        if (me.animationId) {
            tl.cancelAnimationFrame(me.animationId);
        }
        me.animationId = tl.requestAnimationFrame(function() {        
            var fragment = document.createDocumentFragment(),
                layerData, tile, offset,
                keep = [];
            if (resolution !== me.resolution) {
                me.resolution = resolution;
                me.left = 0;
                me.top = 0;
            } else {
                me.left -= (bounds.minX - me.bounds.minX) / resolution;
                me.top += (bounds.maxY - me.bounds.maxY) / resolution;
            }
            tl.setStyle(me.el,
                {transform: tl.hasTransform3d ?
                    "translate3d(" + me.left + "px," + me.top + "px,0)" :
                    "translate(" + me.left + "px," + me.top + "px)"},
                {left: me.left + "px", top: me.top + "px"}
            );
            me.bounds = bounds;
            for (var l=0, ll=data.length; l<ll; ++l) {
                layerData = data[l];
                offset = {
                    x: layerData.insertAt.x - bounds.minX - me.left * resolution,
                    y: bounds.maxY + layerData.insertAt.y - me.top * resolution
                };
                for (var i=0, ii=layerData.data.length; i<ii; ++i) {
                    for (var j=0, jj=layerData.data[i].length; j<jj; ++j) {
                        tile = layerData.data[i][j];
                        if (!~tl.indexOf(me.renderedTiles, tile)) {
                            tile.style.left = ((offset.x + i * layerData.tileDelta.x) / resolution) + "px";
                            tile.style.top = ((offset.y + j * layerData.tileDelta.y) / resolution) + "px";
                            fragment.appendChild(tile);
                        }
                        keep.push(tile);
                    }
                }
            }
            me.el.appendChild(fragment);
            var rendered, r;
            for (r=me.renderedTiles.length-1; r>=0; --r) {
                rendered = me.renderedTiles[r];
                if (!~tl.indexOf(keep, rendered)) {
                    me.el.removeChild(rendered);
                }
            }
            me.renderedTiles = keep;
            me.animationId = null;
        });
    }
});
