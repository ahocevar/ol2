tl.CRS = (function() {
    var half = 20037508.34;
    return {
        defs: {
            'EPSG:3857': {
                extent: {
                    minX: -half, minY: -half, maxX: half, maxY: half
                },
                forward: function(xy) {
                    var x = xy.x * half / 180;
                    var y = Math.log(Math.tan((90 + xy.y) * Math.PI / 360)) / Math.PI * half;
                    return {x: x, y: y};
                },
                inverse: function(xy) {
                    var x = 180 * xy.x / half;
                    var y = 180 / Math.PI * (2 * Math.atan(Math.exp((xy.y / half) * Math.PI)) - Math.PI / 2);
                    return {x: x, y: y};
                }
            },
            'EPSG:4326': {
                extent: {
                    minX: -180, minY: -90, maxX: 180, maxY: 90
                },
                forward: function(xy) { return xy; },
                inverse: function(xy) { return xy; }
            }
        }
    };
})();