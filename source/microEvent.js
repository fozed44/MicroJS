GlobalObject = (function(){
    try { return window; }
    catch (e) { return exports; }
})();

(function(_micro){

    _micro.Event = new function(){

        var _events = {};
        
        this.addHandler = function(parentObject, eventName, handler){
            if (parentObject.addEventListener)
                parentObject.addEventListener(eventName, handler)
            else if(parentObject.attachEvent)
                parentObject.attachEvent(eventName, handler);
            else {
                if(typeof parentObject[eventName] == 'function'){
                    current = parentObject[eventName];
                    parentObject[eventName] = function(){
                        current();
                        handler();
                    }
                } else 
                    parentObject[eventName] = handler;                
            }
        };

        this.register = function(eventName, canBubble, cancelable) {
            _events[eventName] = document.createEvent('Event');
            _events[eventName].initEvent(eventName, !!canBubble, !!cancelable);
        };

        this.fire = function(eventName, element){
            (element || GlobalObject).dispatchEvent(_events[eventName]);
        };
    };
})(GlobalObject.micro = (GlobalObject.micro || {}));

GlobalObject.micro.Event.register('onLoadComplete');
GlobalObject.micro.Event.addHandler(GlobalObject, 'load', function(){
    setTimeout(function(self){
        GlobalObject.micro.Event.fire('onLoadComplete');
    },1000);
});

// micro.Event.addHandler(GlobalObject, 'load', function(){
//     setTimeout(micro.Event.onloadComplete,1000)
// });
