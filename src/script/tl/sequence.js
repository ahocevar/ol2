tl.sequence = {
    "drag": function(options) {
        var previous = null;
        
        function dragstart(evt) {
            if (!previous) {
                evt.dx = 0;
                evt.dy = 0;
                previous = evt;
                evt.stopPropagation();
                return true;
            }
        }
        
        function drag(evt) {
            if (previous) {
                evt.dx = evt.clientX - previous.clientX;
                evt.dy = evt.clientY - previous.clientY;
                previous = evt;
                return true;
            }
        }
        
        function dragend(evt) {
            if (previous) {
                previous = false;
                return true;
            }
        }
        
        return {
            dragstart: {
                mousedown: dragstart,
                touchstart: dragstart 
            },
            drag: {
                mousemove: drag,
                touchmove: drag
            },
            dragend: {
                mouseup: dragend,
                touchend: dragend
            }
        };
    },
    "dblclick": function(options) {
        options = options || {};
        var previous = false;
        var delay = options.delay || 500;
        return {
            dblclick: {
                mouseup: function(evt) {
                    if (!previous || Date.now() - previous > delay) {
                        previous = Date.now();
                    } else {
                        previous = false;
                        return true;
                    }
                }
            }
        };
    }
};