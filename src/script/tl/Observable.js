tl.Observable = function(cfg) {
    var el = typeof cfg == "string" ? cfg : cfg.el;
    if (typeof el == "string") {
        el = document.getElementById(el);
    }
    var mouseEvents = [], i, sequence;
    for (i=this.sequences.length-1; i>=0; --i) {
        sequence = this.sequences[i];
        for (var s in sequence) {
            for (var t in sequence[s]) {
                el["on" + t] = this.handle.bind(this);
            }
        }
    }
    this.listeners = {};
    this.el = el;
};
tl.extend(tl.Observable.prototype, {
    on: function(evt, fn, scope) {
        if (!this.listeners[evt]) {
            this.listeners[evt] = [];
        }
        this.listeners[evt].push({
            fn: fn,
            scope: scope
        });
    },
    handle: function(evt) {
        var sequences = this.sequences, sequence, type = evt.type, part;
        for (var i=0, ii=sequences.length; i<ii; ++i) {
            sequence = sequences[i];
            for (var p in sequence) {
                part = sequence[p];
                if (part[type]) {
                    if (part[type](evt)) {
                        evt.preventDefault();
                        this.fire.call(this, p, evt);
                    }
                }
            }
        }
    },
    fire: function(type, evt) {
        var listeners = this.listeners[type], listener;
        if (listeners) {
            for (var i=0, ii=listeners.length; i<ii; ++i) {
                listener = listeners[i];
                listener.fn.call(listener.scope, type, evt);
            }
        }
    }
});

