/* Copyright (c) 2006-2012 by OpenLayers Contributors (see authors.txt for 
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */

/**
 * @requires OpenLayers/Renderer/Canvas.js
 * @requires OpenLayers/Format/GeoJSON.js
 */

/**
 * Class: OpenLayers.Renderer.CanvasOsmb
 * A renderer for extruding heights, based on http://osmbuildings.org.
 * Supports polygons and multipolygons only, and requires
 * 
 * Inherits:
 *  - <OpenLayers.Renderer.Canvas>
 */
OpenLayers.Renderer.CanvasOsmb = OpenLayers.Class(OpenLayers.Renderer.Canvas, {
    
    format: null,
    
    isNew: true,
    
    osmbCanvas: null,
    
    setSize: function(size) {
        OpenLayers.Renderer.Canvas.prototype.setSize.apply(this, arguments);
        if (!this.osmb) {
            this.osmb = new OSMBuildings();
            this.osmb.createCanvas(this.container);
            this.osmbCanvas = this.container.lastChild;
            this.osmb.setSize(this.map.size.w, this.map.size.h);
            this.format = new OpenLayers.Format.GeoJSON({
                externalProjection: new OpenLayers.Projection("EPSG:4326"),
                internalProjection: this.map.getProjectionObject()
            });
            this.map.events.on({
                move: this.onMove,
                scope: this
            });
        } else {
            this.osmb.onResize({ width: this.map.size.w, height: this.map.size.h });
        }
    },
    
    setExtent: function(extent, zoomChanged) {
        this.setOsmbOrigin();
        this.osmb.setCamOffset(0, 0);
        if (zoomChanged) {
            this.osmb.onZoomEnd({zoom: this.map.zoom});
        } else {
            this.osmb.onMoveEnd();
        }
        return OpenLayers.Renderer.Canvas.prototype.setExtent.apply(this, arguments);
    },
    
    onMove: function() {
        this.osmb.setCamOffset(this.map.layerContainerOriginPx.x, this.map.layerContainerOriginPx.y);
        this.osmb.render();
    },
    
    drawFeature: function(feature) {
        var renderedFeature = this.features[feature.id];
        var rendered = OpenLayers.Renderer.Canvas.prototype.drawFeature.apply(this, arguments);
        this.isNew = this.isNew || (rendered && !renderedFeature) || (!rendered && !!renderedFeature);
        if (this.isNew) {
            var json = {
                type: 'FeatureCollection',
                features: []
            };
            var jsonFeature;
            for (var f in this.features) {
                jsonFeature = this.format.extract.feature.call(this.format, this.features[f][0]);
                jsonFeature.properties.height = this.features[f][1].height;
                json.features.push(jsonFeature);
            }
            this.osmb.geoJSON(json, false);
            this.isNew = false;
        }
        return rendered;        
    },
    
    setOsmbOrigin: function () {
        var origin = this.map.getLonLatFromPixel({x: 0, y: 0}),
            res = this.getResolution(),
            ext = this.map.getMaxExtent(),
            x = Math.round((origin.lon - ext.left) / res),
            y = Math.round((ext.top - origin.lat) / res)
        ;
        this.osmb.setOrigin(x, y);
    },

    CLASS_NAME: 'OpenLayers.Renderer.OsmbCanvas'
    
});

