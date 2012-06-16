window.tl = {
    inherit: function(Class, Superclass) {
        var F = function() {};
        F.prototype = Superclass.prototype;
        Class.prototype = new F;        
    },
    extend: function(target, source) {
        for (var p in source) {
            if (source.hasOwnProperty(p)) {
                target[p] = source[p];
            }
        }
    }
};