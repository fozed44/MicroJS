var GlobalObject = (function(){
    try { return window; }
    catch (e) { return exports; }
});

(function(_micro){

    this.History = new function() {
        _popStateCallbacks = [];

        if(GlobalObject.onpopstate
        && typeof GlobalObject.onpopstate == "function")
            _popStateCallbacks.push(GlobalObject.onpopstate);
            
        GlobalObject.onpopstate = _popstateHandler; 

        this.push = function (state, url){            
            GlobalObject.History.pushState(
                state, 
                null, 
                url || ""
            );
        }

        this.onpopstate = function(callback){
            _popStateCallbacks.push(callback);
        }

        function _popstateHander(event){
            _popStateCallbacks.forEach(function(callback){
                callback(event.stateData);
            });
        }

    }

})(GlobalObject.micro = (GlobalObject.mirco || {}));