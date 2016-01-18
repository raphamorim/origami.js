Origami.warning = function warning(message){
    if (console && console.warn)
        console.warn(message);
};

Origami.error = function error(message){
    throw new Error("Origami Error: " + message);
};

Origami.logging = function logging(message){
    if (console && console.log)
        console.log(message);
};
