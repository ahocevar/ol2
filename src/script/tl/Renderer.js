tl.Renderer = function(target) {
    var el = document.createElement("div");
    el.style.position = "absolute";
    target.appendChild(el);
    this.el = el;
    this.renderedTiles = [];
};
tl.extend(tl.Renderer.prototype, {
    el: null,
    resolution: null,
    bounds: null,
    left: 0,
    top: 0,
    timestamp: 0,
    animationId: null,
    render: function(data, bounds, resolution) {
        var me = this;
        if (me.animationId) {
            tl.cancelAnimationFrame(me.animationId);
        }
        me.animationId = tl.requestAnimationFrame(function() {        
            var keep = [],
                queue = [];
            if (resolution !== me.resolution) {
                me.resolution = resolution;
                me.bounds = null;
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
            for (var l=0, ll=data.length; l<ll; ++l) {
                me.processTiles(data[l], bounds, resolution, keep, queue);
            }
            var rendered, r;
            for (r=me.renderedTiles.length-1; r>=0; --r) {
                rendered = me.renderedTiles[r];
                if (!~tl.indexOf(keep, rendered)) {
                    me.el.removeChild(rendered.image);
                }
            }
            me.loadTiles(queue);
            me.bounds = bounds;
            me.renderedTiles = keep;
            me.animationId = null;
        });
    },
    processTiles: function(layerData, bounds, resolution, keep, queue) {
        var me = this,
            tileDelta = layerData.tileDelta,
            insertAt = layerData.insertAt,
            centerX = (bounds.maxX + bounds.minX) / 2,
            centerY = (bounds.maxY + bounds.minY) / 2,
            offsetX = (insertAt.x - bounds.minX) / resolution - me.left,
            offsetY = (bounds.maxY - insertAt.y) / resolution - me.top,
            width =  tileDelta.x / resolution,
            height = tileDelta.y / resolution,
            tile, image, hash, reposition, distanceFromCenter;
        for (var i=0, ii=layerData.data.length; i<ii; ++i) {
            for (var j=0, jj=layerData.data[i].length; j<jj; ++j) {
                tile = layerData.data[i][j];
                image = tile.image;
                if (!~tl.indexOf(me.renderedTiles, tile)) {
                    distanceFromCenter = Math.sqrt(
                        Math.pow(insertAt.x + (i+0.5) * tileDelta.x - centerX, 2) +
                        Math.pow(insertAt.y - (j+0.5) * tileDelta.y - centerY, 2)
                    );
                    queue.push([tile, distanceFromCenter]);
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
    },
    loadTiles: function(queue) {
        var me = this,
            fragment = document.createDocumentFragment(),
            tile;
        queue.sort(me.sortTiles);
        for (var i=0, ii=queue.length; i<ii; ++i) {
            tile = queue[i][0];
            me.loadTile(tile, -~((i / 4) | 0) * 10);
            fragment.appendChild(tile.image);
        }
        me.el.appendChild(fragment);
    },
    sortTiles: function(a, b) {
        return a[1] - b[1];
    },
    loadTile: function(tile, delay) {
        var me = this;
        tile.timestamp = new Date().getTime();
        window.setTimeout(function() {
            if (tile.timestamp >= me.timestamp) {
                var image = tile.image;
                tl.addEventListener(image, 'load', function onload() {
                    tl.removeEventListener(image, 'load', onload);
                    image.className += ' loaded';
                });
                tile.image.src = tile.url;
            }
        }, delay);
    },
    abort: function() {
        this.timestamp = new Date().getTime();
    }
});
