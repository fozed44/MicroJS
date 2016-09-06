
var GlobalObject = (function(){
    try { return exports; }
    catch (e) { return window; }
})();

(function (_micro) {

    _micro.Delegate = function(){

        var _callbacks = [];

    };

})(GlobalObject.micro = (GlobalObject.micro || {}));