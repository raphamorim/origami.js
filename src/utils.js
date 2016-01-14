
// Missing Description
function exists(el, arr) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i].element.isEqualNode(el))
            return arr[i];
    }
    return false;
}