(function() {
    var scripts = document.getElementsByTagName("script"),
        path = scripts[scripts.length-1].src.split("/").slice(0, -1).join("/") + "/";
    var files = [
        "tl.js",
        "tl/sequence.js",
        "tl/Observable.js",
        "tl/LatLng.js",
        "tl/Map.js",
        "tl/Renderer.js",
        "tl/Layer.js",
        "tl/Layer/XYZ.js"
    ];
    var markup = new Array(files.length);
    for (var i=0, ii=files.length; i<ii; ++i) {
        markup[i] = '<script src="' + path + files[i] + '"></script>';
    }
    document.write(markup.join(""));
})();