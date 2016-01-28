var prefix = "[origami.js]";

Origami.warning = function warning(message, obj){
    if (console && console.warn)
        console.warn(prefix, message, obj);
};

Origami.error = function error(message){
    throw new Error(prefix.concat(' ' + message));
};