// Check if element exists in a Array of NodeItems
function exists(el, arr) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i].element.isEqualNode(el))
            return arr[i];
    }
    return false;
}

// Read arguments and apply rules
function argumentsByRules(argsArray, rules) {
    var params = ['x', 'y', 'width', 'height'],
        args = new Object();

    if (rules) 
        params = rules;
    
    for (var i = 0; i < argsArray.length; i++) {
        if (typeof(argsArray[i]) === "object")
            args["style"] = argsArray[i];
        else
            if (params.length)
                args[params.shift()] = argsArray[i];
    }

    if (args.style && args.style.border) {
        args.border = style.border.split(' ');
        args.border[0] = style.border[0].replace(/[^0-9]/g, '');
    }

    return args;
}