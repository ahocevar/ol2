tl.sequence = {
    "dragclick": function(options) {
        var previous, dragFn, dragendFn, dragged, timestamp;
        
        function drag(evt) {
            dragged = true;
            var current = evt.touches ? evt.touches[0] : evt;
            evt.dx = current.clientX - previous.clientX;
            evt.dy = current.clientY - previous.clientY;
            previous = {clientX: current.clientX, clientY: current.clientY};
            // prevent viewport dragging on touch devices
            tl.preventDefault(evt);
            this.fire('drag', evt);
        }
        
        function dragend(evt) {
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
                var current = evt.touches ? evt.touches[0] : evt;
                previous = {clientX: current.clientX, clientY: current.clientY};
                dragged = undefined;
                dragFn = tl.bind(drag, this);
                dragendFn = tl.bind(dragend, this);
                tl.addEventListener(document, 'mousemove', dragFn);
                tl.addEventListener(document, 'touchmove', dragFn);
                tl.addEventListener(document, 'mouseup', dragendFn);
                tl.addEventListener(document, 'touchend', dragendFn);
                this.fire('dragstart', evt);
            }
        }
        
        function dblclick(evt) {
            if (!dragged) {
                var now = new Date().getTime();
                if (!timestamp || now - timestamp > 250) {
                    timestamp = now;
                } else {
                    timestamp = undefined;
                    this.fire('dblclick', evt);
                }
            }
        }
        
        function click(evt) {
            if (!dragged) {
                this.fire('click', evt);
            }
        }

        return {
            mousedown: dragstart,
            touchstart: dragstart,
            mouseup: dblclick,
            touchend: dblclick,
            click: click
        };
    }
};