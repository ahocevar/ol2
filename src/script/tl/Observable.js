tl.Observable = function(cfg) {
    var el = typeof cfg == "string" ? cfg : cfg.el;
    if (typeof el == "string") {
        el = document.getElementById(el);
    }
    var i, sequence;
    for (i=this.sequences.length-1; i>=0; --i) {
        sequence = this.sequences[i];
        for (var t in sequence) {
            tl.addEventListener(el, t, tl.bind(sequence[t], this));
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
    fire: function(type, evt) {
        evt.object = this;
        var listeners = this.listeners[type], listener;
        if (listeners) {
            for (var i=0, ii=listeners.length; i<ii; ++i) {
                listener = listeners[i];
                listener.fn.call(listener.scope, type, evt);
            }
        }
    }
});

