// For consistency with CommonJS environments' exports
if ( typeof module !== "undefined" && module && module.exports ){
    module.exports = Origami.init.bind(this);
}

// For CommonJS with exports, but without module.exports, like Rhino
if ( typeof exports !== "undefined" && exports ) {
    exports.origami = Origami.init.bind(this);
}

// For browser, export only select globals
if (typeof window === "object") {
    window.origami = Origami.init.bind(Origami);
}