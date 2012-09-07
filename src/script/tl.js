window.tl = {
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
        return target;
    },
    bind: function(fn, scope) {
        if (Function.prototype.bind) {
            return fn.bind(scope);
        } else {
            return function() { fn.apply(scope, arguments); };
        }
    },
    indexOf: function(array, obj) {
        if (Array.prototype.indexOf) {
            return array.indexOf(obj);
        } else {
            for (var i=array.length-1; i>=0; --i) {
                if (array[i] === obj) {
                    return i;
                }
            }
            return -1;
        }
    },
    addEventListener: function(element, type, listener) {
        if (element.addEventListener) {
            element.addEventListener(type, listener, false);
        } else if (element.attachEvent) {
            element.attachEvent("on"+type, listener);
        }
    },
    removeEventListener: function(element, type, listener) {
        if (element.removeEventListener) {
            element.removeEventListener(type, listener, false);
        } else if (element.detachEvent) {
            element.detachEvent("on"+type, listener);
        }
    },
    preventDefault: function(evt) {
        if (evt.preventDefault) {
            evt.preventDefault();
        } else {
            evt.returnValue = false;
        }
    },
    stopPropagation: function(evt) {
        if (evt.stopPropagation) {
            evt.stopPropagation();
        } else {
            evt.cancelBubble = true;
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
    cancelAnimationFrame: function(id) {
        (window.cancelAnimationFrame ||
            window.webkitCancelAnimationFrame ||
            window.mozCancelAnimationFrame ||
            window.oCancelAnimationFrame ||
            window.msCancelAnimationFrame ||
            window.clearTimeout)(id);
    },
    hasTransform3d: /gecko/i.test(navigator.userAgent),
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