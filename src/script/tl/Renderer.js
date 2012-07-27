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
                layerData, tile, image, offsetX, offsetY,
                insertAt, width, height, hash,
                reposition = false,
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
                insertAt = layerData.insertAt;
                offsetX = (insertAt.x - bounds.minX) / resolution - me.left;
                offsetY = (bounds.maxY - insertAt.y) / resolution - me.top;
                width =  layerData.tileDelta.x / resolution;
                height = layerData.tileDelta.y / resolution;
                for (var i=0, ii=layerData.data.length; i<ii; ++i) {
                    for (var j=0, jj=layerData.data[i].length; j<jj; ++j) {
                        tile = layerData.data[i][j];
                        image = tile.image;
                        if (!~tl.indexOf(me.renderedTiles, tile)) {
                            image.src = tile.url;
                            fragment.appendChild(image);
                            reposition = true;
                        }
                        hash = [resolution, insertAt.x, insertAt.y].join(',');
                        if (hash !== tile.hash) {
                            /* store resolution and insert offsets - if any is
                            different, width and height need to be recalculated
                            to avoid gaps between tiles */
                            tile.hash = hash;
                            reposition = true;
                            image.style.width = (Math.round(offsetX + (i+1) * width) - Math.round(offsetX + i * width)) + 'px';
                            image.style.height = (Math.round(offsetY + (j+1) * height) - Math.round(offsetY + j * height)) + 'px';
                        }
                        if (reposition) {
                            reposition = false;
                            image.style.left = Math.round(offsetX + i * width) + 'px';
                            image.style.top = Math.round(offsetY + j * height) + 'px';                            
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
                    me.el.removeChild(rendered.image);
                }
            }
            me.renderedTiles = keep;
            me.animationId = null;
        });
    }
});
