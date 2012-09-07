tl.Layer.WMS = function(config) {
    tl.Layer.XYZ.apply(this, arguments);
    this.url = config.url;
    this.params = config.params;
};
tl.inherit(tl.Layer.WMS, tl.Layer.XYZ);
tl.extend(tl.Layer.WMS.prototype, {
    version: '1.1.1',
    projection: 'EPSG:3857', 
    getUrl: function(x, y, z) {
        var resolution = this.resolutions[z],
            width =  this.tileSize.w * resolution,
            height = this.tileSize.h * resolution,
            minX = this.tileOrigin.x + x * width,
            maxY = this.tileOrigin.y - y * height,
            maxX = minX + width,
            minY = maxY - height,
            bbox = [minX, minY, maxX, maxY];
        var params = tl.extend({
            SERVICE: 'WMS',
            VERSION: this.version,
            REQUEST: 'GetMap',
            SRS: this.projection,
            WIDTH: this.tileSize.w,
            HEIGHT: this.tileSize.h,
            STYLES: '',
            FORMAT: 'image/png',
            TRANSPARENT: true,
            BBOX: bbox.join(',')
        }, this.params);
        var url = this.url;
        for (var param in params) {
            url += (~url.indexOf('?') ? '&' : '?') +
                param + '=' + encodeURIComponent(params[param]);
        }
        return url;
    }
});
