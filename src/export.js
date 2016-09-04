var factory = extend(Origami.init.bind(this), Origami)

// For consistency with CommonJS environments' exports
if ( typeof module !== "undefined" && module && module.exports ){
    module.exports = factory;
}

// For CommonJS with exports, but without module.exports, like Rhino
else if ( typeof exports !== "undefined" && exports ) {
    exports.origami = factory;
}

// For browser, export only select globals
else if ( typeof window === "object" ) {
    window.origami = extend(Origami.init.bind(Origami), Origami);
}
