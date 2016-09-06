var GlobalObject = (function(){
    try { return window; } 
    catch (e) { return exports; }
})();

(function (_micro) {


    _micro.QueryStringSerializer = new function(){
        
        //------------------------------------------------------
        //-- Interface
        //--

        this.serialize = function (object) {
            var result = serializeObject(object);
            return result
                   ? '?' + result.slice(0, result.length - 1)
                   : "";
        };

        //--
        //-- Interface
        //------------------------------------------------------
         
        function serializeObject (object, parentName) {
            if(parentName = (parentName || "")) parentName += '.';
            var result = "";
            for (var property in object) 
                if (object.hasOwnProperty(property))
                    result += serializeElement(parentName+property, object[property]);
            return result;
        };

        function serializeElement(elementName, element) {
            if (typeof (element) == "function")
                return "";

            if (element instanceof Array)
                return serializeArray(elementName, element);

            if (typeof (element) == "object")
                return serializeObject(element, elementName);

            return elementName + '=' + element + '&';
        };

        function serializeArray(propertyName, array) {
            var result = "";
            array.forEach(function(item){
                result += serializeElement(propertyName, item)
            });
            return result;
        };
    };

})(GlobalObject.micro = (GlobalObject.micro || {}));