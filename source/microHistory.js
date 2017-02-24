window.micro = (window.micro || {});

/*
*/
window.micro.History = (new function() {

    var _popStateCallbacks  = [],
        _hasOnPopStateFired = false;

    if(window.onpopstate
    && typeof window.onpopstate == "function")
        _popStateCallbacks.push(window.onpopstate);
        
    window.onpopstate = _popstateHandler;

    this.push = function (state, url){            
        window.history.pushState(
            state, 
            null, 
            url || ""
        );
    };

    this.onPopState = function(callback){
        _popStateCallbacks.push(callback);
    };

    function _popstateHandler(event){
        _popStateCallbacks.forEach(function(callback){
            callback(event.state);
        });
    }

    (function(){
        micro.Event.addHandler(window, 'onLoadComplete', function(){
            if(window.history.state && !_hasOnPopStateFired)
                _popstateHandler({state: history.state});
        });
    })();
})();
