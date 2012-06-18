tl.sequence = {
    "drag": function(options) {
        var previous = null;
        
        function dragstart(evt) {
            if (!previous) {
                evt.dx = 0;
                evt.dy = 0;
                previous = evt;
                if (evt.stopPropagation) {
                    evt.stopPropagation();
                } else {
                    evt.cancelBubble = true;
                }
                return true;
            }
        }
        
        function drag(evt) {
            if (previous) {
                evt.dx = evt.screenX - previous.screenX;
                evt.dy = evt.screenY - previous.screenY;
                previous = {screenX: evt.screenX, screenY: evt.screenY};
                return true;
            }
        }
        
        function dragend(evt) {
            if (previous) {
                previous = null;
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
                    var now = new Date().getTime();
                    if (!previous || now - previous > delay) {
                        previous = now;
                    } else {
                        previous = false;
                        return true;
                    }
                }
            }
        };
    }
};