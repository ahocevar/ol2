tl.Renderer = function(map) {
    this.map = map;
    var container = document.createElement("div");
    container.style.position = "absolute";
    container.style.left = "0";
    container.style.top = "0";
    map.el.appendChild(container);
    this.div = container;
};
tl.extend(tl.Renderer.prototype, {
    map: null,
    div: null,
    left: 0,
    top: 0,
    render: function(data, bounds) {
        this.div.innerHTML = "";
        var resolution = this.map._resolution,
            fragment = document.createDocumentFragment(),
            layerData, tile, offset;
        for (var l=0, ll=data.length; l<ll; ++l) {
            layerData = data[l];
            // TODO coordinate range!
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
        this.div.appendChild(fragment);
    },
    moveByPx: function(dx, dy) {
        this.left += dx;
        this.top += dy;
        this.div.style.left = this.left + "px";
        this.div.style.top = this.top + "px";
    }
});
