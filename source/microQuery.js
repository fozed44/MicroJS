var GlobalObject = (function(){
    try { return window; }
    catch(e) {
        throw "microQuery is a strictly browser based implementation and does not work with node.";
    }
})();

(function(_micro){
    
    function queryObjects(_nodes){       
        this.each = function(func){
            for(var x = 0; x < _nodes.length; ++x)
                func.call(_nodes[x], func.arguments);
        }
        this.data = function(dataAttrName){
            return queryObject.data.call(_nodes[0]); 
        }
    };

    function queryObject(element){
        this.data = function(dataAttrName){
            return element.dataset[dataAttrName];
        }
    }

    GlobalObject.m = _micro.query = function(selector){
        if(typeof(selector) == 'string')
            return new queryObjects(
                document.querySelectorAll(selector)
            );
        if(typeof(selector) == 'object')
            return new queryObject(
                selector
            );
        if(selector instanceof 'NodeList')
            return new queryObjects(
                selector
            );
    };   

})(GlobalObject.micro = (GlobalObject.micro || {}));