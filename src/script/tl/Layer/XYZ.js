tl.Layer.XYZ = function(config) {
    tl.Layer.prototype.constructor.apply(this, arguments);
    this.url = config.url;
};
tl.inherit(tl.Layer.XYZ, tl.Layer);
tl.extend(tl.Layer.XYZ.prototype, {
    resolutions: [
        156543.03390625, 78271.516953125, 39135.7584765625,
        19567.87923828125, 9783.939619140625, 4891.9698095703125,
        2445.9849047851562, 1222.9924523925781, 611.4962261962891,
        305.74811309814453, 152.87405654907226, 76.43702827453613,
        38.218514137268066, 19.109257068634033, 9.554628534317017,
        4.777314267158508, 2.388657133579254, 1.194328566789627,
        0.5971642833948135, 0.29858214169740677, 0.14929107084870338,
        0.07464553542435169
    ],
    tileSize: {w: 256, h: 256},
    tileOrigin: {x: -20037508.34, y: 20037508.34},
    url: null,
    getData: function(bounds, resolution) {
        var me = this,
            stretch = me.resolutions[me.zoomForResolution(resolution)] / resolution,
            tileSize = {
                w: me.tileSize.w * stretch,
                h: me.tileSize.h * stretch
            },
            tileDelta = {
                x: me.tileSize.w * resolution,
                y: me.tileSize.h * resolution
            },
            insertIndex = {
                x: Math.floor((bounds.left - me.tileOrigin.x) / tileDelta.x),
                y: Math.floor((me.tileOrigin.y - bounds.top) / tileDelta.y)
            },
            insertAt = {
                x: me.tileOrigin.x + tileDelta.x * insertIndex.x,
                y: tileDelta.y * insertIndex.y - me.tileOrigin.y
            },
            gridSize = {
                w: Math.round(1 + (bounds.right - bounds.left) / tileDelta.x),
                h: Math.round(1 + (bounds.top - bounds.bottom) / tileDelta.y)
            },
            data = [],
            img, z = this.zoomForResolution(resolution),
            imgTemplate = document.createElement("img");
        imgTemplate.style.position = "absolute";
        imgTemplate.style.width = tileSize.w + "px";
        imgTemplate.style.height = tileSize.h + "px";
        imgTemplate.galleryImg = "no";
        for (var i=0, ii=gridSize.w; i<ii; ++i) {
            data[i] = [];
            for (var j=0, jj=gridSize.h; j<jj; ++j) {
                img = imgTemplate.cloneNode(false);
                img.src = this.url
                    .replace("{x}", insertIndex.x + i)
                    .replace("{y}", insertIndex.y + j)
                    .replace("{z}", z);
                data[i][j] = img;
            }
        }
        return {
            data: data,
            insertAt: insertAt,
            tileDelta: tileDelta
        };
    },
    zoomForResolution: function(resolution) {
        var delta = Number.POSITIVE_INFINITY,
            currentDelta,
            resolutions = this.resolutions;
        for (var i=resolutions.length-1; i>=0; --i) {
            currentDelta = Math.abs(resolutions[i] - resolution);
            if (currentDelta > delta) {
                break;
            }
            delta = currentDelta;
        }
        return i+1;
    }
});
