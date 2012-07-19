tl.sequence = {
    "drag": function(options) {
        var previous, dragFn, dragendFn;
        
        function drag(evt) {
            evt.dx = evt.screenX - previous.screenX;
            evt.dy = evt.screenY - previous.screenY;
            previous = {screenX: evt.screenX, screenY: evt.screenY};
            this.fire('drag', evt);
        }
        
        function dragend (evt) {
            if (previous) {
                tl.removeEventListener(document, 'mousemove', dragFn);
                tl.removeEventListener(document, 'touchmove', dragFn);
                tl.removeEventListener(document, 'mouseup', dragendFn);
                tl.removeEventListener(document, 'touchend', dragendFn);
                dragType = undefined;
                previous = undefined;
                this.fire('dragend', evt);
            }
        }
    
        function dragstart(evt) {
            if (!previous) {
                evt.dx = 0;
                evt.dy = 0;
                previous = evt;
                dragFn = tl.bind(drag, this);
                dragendFn = tl.bind(dragend, this);
                tl.addEventListener(document, 'mousemove', dragFn);
                tl.addEventListener(document, 'touchmove', dragFn);
                tl.addEventListener(document, 'mouseup', dragendFn);
                tl.addEventListener(document, 'touchend', dragendFn);
                tl.preventDefault(evt);
                this.fire('dragstart', evt);
            }
        }
        
        return {
            dragstart: {
                mousedown: dragstart,
                touchstart: dragstart 
            }
            // other listeners for this sequence are registered in dragstart
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
                        this.fire('dblclick', evt);
                    }
                }
            }
        };
    }
};