Origami.warning = function warning(message){
    if (console && console.warn)
        console.warn(message);
};

Origami.logging = function logging(message){
    if (console && console.log)
        console.log(message);
};
