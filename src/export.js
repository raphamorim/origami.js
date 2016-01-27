// For consistency with CommonJS environments' exports
if ( typeof module !== "undefined" && module && module.exports ){
    module.exports = extend(Origami.init.bind(this), Origami);
}

// For CommonJS with exports, but without module.exports, like Rhino
if ( typeof exports !== "undefined" && exports ) {
    exports.origami = extend(Origami.init.bind(this), Origami);
}

// For browser, export only select globals
if (typeof window === "object") {
    window.origami = extend(Origami.init.bind(Origami), Origami);
}