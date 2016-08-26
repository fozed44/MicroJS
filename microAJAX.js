
var GlobalObject = (function(){
    try { return exports; }
    catch (e) { return window; }
})();

(function (_micro) {

    function AJAXResult(http) {

        xhttp = http;

        _successHandler   = function () {}
        _errorHandler     = function () {}
        _completedHandler = function () {}
        _timeoutHandler   = function () {}

        this.success = function (handler) {
            _successHandler = handler;
            return this;
        };
        this.error = function (handler) {
            _errorHandler = handler;
            return this;
        };
        this.completed = function (handler) {
            _completedHandler = handler;
            return this;
        };
        this.timeout = function (handler) {
            _timeoutHandler = handler;
            return this;
        }

        xhttp.onreadystatechange = function () {
            if (this.readyState !== 4) return;

            if (xhttp.status == 200) _successHandler(xhttp.responseText);
            else _errorHandler(xhttp.status, xhttp.statusTest);
            _completedHandler(xhttp.status, xhttp.statusText)
        }

        xhttp.ontimeout = function () {
            _timeoutHandler();
        }
    }

    _micro.AJAX = new function () {

        // ---------------------------------------------------------------
        // --
        // -- INTERFACE
        // --

        this.get = function (getOptions) {
            return getInternal(getOptions);
        }

        this.post = function (postOptions) {
            return postInternal(postOptions);
        }

        // --
        // -- END INTERFACE
        // ---------------------------------------------------------------

        function CreateHttpObject() {
            try { return new XMLHttpRequest(); }
            catch (e) {
                try { return new ActiveXObject("Microsoft.XMLHTTP"); }
                catch (e) { return new ActiveXObject("Msxml2.XMLHTTP"); }
            }
        }

        function getInternal(getOptions) {
            http = CreateHttpObject();
            http.open(
                "GET",
                addDataToUrl(
                    getUrlOptionsProperty(getOptions),
                    getOptions
                ),
                true
            )
            http.timeout = getTimeoutOptionsProperty(getOptions);
            http.send();
            return new AJAXResult(http);
        }

        function postInternal(postOptions) {
            http = CreateHttpObject();
            http.open(
                "POST",
                getUrlOptionsProperty(postOptions),
                true
            );
            http.timeout = getTimeoutOptionsProperty(postOptions);
            http.SetRequestHeader("X-requested-With:", "XMLHttpRequest");
            http.send(parseDataProperty(postOptions));
            return new AJAXResult(http);
        }

        function getUrlOptionsProperty(options) {
            if (!options.url || typeof (options.url) != "string")
                throw "AJAX: Invalid options. url property is missing or invalid.";
            return options.url;
        }

        function getTimeoutOptionsProperty(options) {
            if (options.timout != undefined && typeof (options.timeout) != "number")
                throw "microAJAX: Invalid options. timeout property is not a number.";
            return options.timeout;
        }

        function addDataToUrl(url, getOptions) {
            var parsedData = parseDataProperty(getOptions);
            return url + (parsedData.length ? ("?" + parsedData) : "");
        }

        function countObjectProperties(object) {
            if (Object.Keys) return Object.Keys(object).length;

            var propertyCount = 0;
            for (var property in object)
                if (object.hasOwnProperty(property)) propertyCount++;
            return propertyCount;
        }

        function parseDataProperty(options) {
            if (!options.data || countObjectProperties(options.data) == 0) return "";

            var parsed = "";
            for (var property in options.data)
                if (Object.hasOwnProperty(property))
                    parsed += property + "=" + object[property] + "&";
            return parsed.length ? parsed.slice(0, -1) : "";
        }
    }

})(GlobalObject.micro = (GlobalObject.micro || {}));