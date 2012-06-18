window.tl = {
    hasTransform3d: /gecko/i.test(navigator.userAgent),
    inherit: function(Class, Superclass) {
        var F = function() {};
        F.prototype = Superclass.prototype;
        Class.prototype = new F();        
    },
    extend: function(target, source) {
        for (var p in source) {
            if (source.hasOwnProperty(p)) {
                target[p] = source[p];
            }
        }
    },
    requestAnimationFrame: function(fn) {
        return (window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            window.setTimeout)(fn, 16);
    },
    setStyle: function(elem, style, fallback) {
        var supported, apply = {};
        for (var s in style) {
            supported = false;
            var tries = [s], currentTry, i;
            if (s === "transform") {
                tries.push("-webkit-transform", "MozTransform", "msTransform", "OTransform");
            }
            for (i=tries.length-1; i>=0; --i) {
                currentTry = tries[i];
                if (elem.style[currentTry] !== undefined) {
                    apply[currentTry] = style[s];
                    supported = true;
                    break;
                }
            }
        }
        if (!supported) {
            apply = fallback;
        }
        for (var f in apply) {
            elem.style[f] = apply[f];
        }
    }
};