GlobalObject = (function(){
    try { return window; }
    catch (e) { return exports; }
})();

if(micro) throw "microCore.js must be the first micro file included.";

micro = {

    attachEventHandler: function(event, handler){
        if(GlobalObject.attachEvent)
            GlobalObject.attachEvent(event, handler);
        else {
            if(typeof event == 'function'){
                current = event;
                event = function(){
                    current();
                    handler();
                }
            } else 
                event = handler;                
        }
    },

    onloadComplete: function(){
        
    },

}