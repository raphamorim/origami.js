var scribble = (function(){
   this.contexts = [];
   this.on = function(){
       [].slice.call(arguments);
       console.log(arguments);

       for (var i = 0; i < arguments.length; i++){
          this.createCanvasContext(arguments[i]);
       }

       return this;
   }

   this.createCanvasContext = function(el) {
       var canvas = document.querySelector(el),
           context = canvas.getContext('2d');

       this.contexts.push((context || false));
   }

   //#TODO: Remove this hack
   this.args = function(argsArray){
       var argsPattern = ['x', 'y', 'width', 'height'],
           args = new Object();
       for (var i = 0; i < argsArray.length; i++) {
          if (!argsPattern.length)
            break;
          if (typeof(argsArray[i]) === "object")
            args["style"] = argsArray[i];
          else {
            args[argsPattern[0]] = argsArray[i];
            argsPattern = argsPattern.slice(1);
          }
       }

       return args;
   }

   this.square = function(x, y, size){
       var args = this.args(([].slice.call(arguments) || []));
       console.log(args);
       for (var i = 0; i < contexts.length; i++){
          contexts[i].beginPath();
          contexts[i].lineWidth="4";
          contexts[i].strokeStyle="green";
          contexts[i].rect(args.x, args.y, args.width, args.width);
          contexts[i].stroke();
       }
       return this;
   }

   return {
      on: this.on.bind(this)
   }
})();
