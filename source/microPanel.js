var GlobalObject = (function(){
    try { return window; }
    catch(e) { return exports; }
})();

(function(_micro){

    /*
        micro.Panel

            Panelizes any elements that have a .micro-panel css class.

        Remarks

            All elements that have the .micro-panel class will be 'panelized'. In other words, this means that a panel
            with a heading and/or one or more data items will appear just above the panelized element whenever the
            mouse hovers over the panelized element.

        Configuration

            Configuring the panel from html.

                data-heading:
                    Panel heading.
                data-items:
                    The items to be displayed below the heading. Each item has two parts, a key and a name. When configured
                    from within the element via html attributes the key and name are not labeled. Instead, the items are
                    configured via a pipe seperated list - key1|value1|key2|value2|key3|value3 etc.
                vertical-offset:
                    An integer, whose units are pixels, specifying the virtical displacement of the panel from its normal
                    position.
                horizontal-offset:
                    An integer, whose units are pixels, specifying the horizontal displacement of the panel from its normal
                    position.

            Using remote data.

                data-remote-address:
                    The server address that can respond with data that can be used to populate the panel.
                data-remote-key:
                    A string that the server can use to determine exactly what data should be returned for a particular
                    panel.

                Panels can get their data from a remote endpoint. In order for a panel to retrieve its data from the server,
                it must have an address defined via the data-remote-address attribute, and it also must have a key defined
                by the data-remote-key. The key is a string the the server can use to determine exactly what data to return
                for a particular panel.

            Serving data to the panel.

                The Pane class does not send a single request for each panel on the page, instead the panel class sends
                only one request containing an array whose length equals the number of panels on the page that are configured
                to populate their data from the server. To clarify, the server will recieve an array containing all of the
                panel keys.

                To populate the panels, the server should return an array of objects contianing the panel data. The format
                of the data returned by the server is as follows:
                
                [
                    { 
                        key:     panelKey
                        heading: panelHeading,
                        items:
                            [
                                { key: itemKey, value: itemValue },
                                { key: itemKey, value: itemValue },
                                { key: itemKey, value: itemValue }
                            ]
                    },
                    { 
                        key:     panelKey
                        heading: panelHeading,
                        items:
                            [
                                { key: itemKey, value: itemValue },
                                { key: itemKey, value: itemValue },
                                { key: itemKey, value: itemValue }
                            ]
                    }
                ]
    */
    _micro.Panel = new function Panel() {

        var _serverResults = null;

        var _serverConfig = {
            remoteAddress: "",
            remoteKeys: []
        };

        function throwGenericError(){
            throw 'microPanel: unknown error!';
        }

        /*
            Verify that the data returned from the server conforms to the daya layout that is described
            in the comments at the beginning of this file.
        */
        function verifyServerData(serverData){
            if(!Array.isArray(serverData)){
                console.log('server result is not an array');
                throwGenericError();
            }
            var invalid = false;
            serverData.forEach(function(panel){
                if(!panel.hasOwnProperty('key')){
                    console.log('an object returned from the server is missing a "key" property.');
                    invalid = true;
                }
                if(!panel.hasOwnProperty('heading')) {
                    console.log('An object returned from the server is missing a "heading" property.');
                    invalid = true;
                }
                if(!panel.hasOwnProperty('items')) {
                    console.log('An object returned from the server is missing an "items" property.');
                    invalid = true;
                }
                if(!Array.isArray(panel.items)) {
                    console.log('An object returned from the server has an "items" property that is not an array.');
                    invalid = false;
                }
                for(var item in panel.items){
                    if(item.hasOwnProperty('key')){
                        console.log('An object returned from the server has is missing an "items.key" property.');
                        invalid = true;
                    }
                    if(item.hasOwnProperty('value')){
                        console.log('An object returned from the server is missing an "items.value" property.')
                        invalid = true;
                    }
                }
            });
            if(invalid)
                throwGenericError();

        }

        /*
            Load data from the server.
        */
        function queryServer(){
            _micro.AJAX.get({
                url:  _serverConfig.remoteAddress,
                data: _serverConfig.remoteKeys
            }).success(function(data){
                var parsedServerData = JSON.parse(data);
                verifyServerData(parsedServerData);
                _serverResults = parsedServerData;
                panelizeRemoteElements();
            }).error(function(errorMessage){
                console.log('Error loading panel data from server' + errorMessage);
            });
        }

        /*
            Return true if the element requires a server load.
        */
        function requiresServerLoad(element){
            if(m(element).data('remoteAddress'))
                return true;
            return false;
        }

        /*
            Creates a configuration object, the properties of which is are follows:

            heading: (data-heading)
                Panel heading.
            items: (data-items)
                Items displayed  below the heading
            verticalOffset: (data-vertical-offset)
                Allows a panel to be rendered above or below its normal position.
            horizontalOffset: (data-horizontal-offset)
                Allows a panel to be rendered to the right or left of its normal posiition.

        */
        function getLocalElementConfig(element){
            var mElement = m(element);            
            return {
                verticalOffset:   mElement.data('verticalOffset'),
                horizontalOffset: mElement.data('horizontalOffset'),
                heading:          mElement.data('heading'),
                items:            parseLocalItems(mElement.data('items'))
            };
        }

        function getRemoteElementConfig(element){
            var mElement = m(element);
            var remoteKey = mElement.data('remoteKey');
            var serverResult = getServerResult(remoteKey);
            return {
                verticalOffset: mElement.data('verticalOffset'),
                horizontalOffset: mElement.data('horizontalOffset'),
                heading: serverResult['heading'],
                items:   serverResult['items']
            }
        }

        /*
            Return the element of Array _serverResults whose key property equals the input string 'remoteKey'.
            If an element with a key value of 'remoteKey' does not exist in the _serverResults array, an
            exception is thrown. 'remoteKey' should always be the value of a data-remote-key attribute found
            in one of the elements in the page. If an element has a data-remote-key attribute equal to
            'remoteKey', then the data returned from the server should always contain an entry for that key.
        */
        function getServerResult(remoteKey){
            for(var x = 0; x < _serverResults.length; ++x){
                if(_serverResults[x].key == remoteKey)
                    return _serverResults[x];
            }
            console.log("microPanel: remoteKey '" + remoteKey + "' was not found in server results.");
            throwGenericError();
        }

        /*
            Parse the item list. The item list is a pipe delemited list of key value pairs.
        */
        function parseLocalItems(itemData){
            var items = itemData.split('|');
            if(!items.length)
                return [];
            if(items.length & 1){
                console.log('microPanel: Panel with invalid item data.');
                throwGenericError();
            }
            var result = [];
            for(var x = 0; x < items.length; x += 2){
                result.push({
                    key: items[x],
                    value: items[x+1]
                });
            }
            return result;
        }

        /*
            Return the remote address used by the inpute element. This function will throw an exception if that is
            the case. However, this does not mean that either all panels must get their data from the server
            or all panels must get their data locally.
        */
        function readRemoteAddress(element){
            var remoteAddress = m(element).data('remoteAddress');
            if(_serverConfig.remoteAddress
            && _serverConfig.remoteAddress != remoteAddress)
                throw 'microPanel: Multipe server addresses are not suppored.'
            _serverConfig.remoteAddress = remoteAddress;
        }

        /*
            Reads the remote key from the element and adds it to _serverConfig.remoteKeys.
        */
        function readRemoteKey(element){
            _serverConfig.remoteKeys.push(
                m(element).data('remoteKey')
            );
        }

        /*
            read the remote address and remote key from the element.
        */
        function readServerInfo(element){
            readRemoteAddress(element);
            readRemoteKey(element);
        }

        function createPanelContainer() {
            var panelContainer = document.createElement('div');
            panelContainer.className = 'micro-panel-container';
            return panelContainer;
        } 

        function createPanel(config){            
            var panel = document.createElement('div');
            panel.className = 'micro-panel-panel';
            panel.style.bottom = config.verticalOffset   || panel.style.bottom;
            panel.style.left   = config.horizontalOffset || panel.style.left;
            return panel;
        }

        function createHeader(element, config){
            var headerText = config.heading;
            var headerDiv = document.createElement('div');
            var header = document.createTextNode(headerText);
            headerDiv.className = 'micro-panel-heading';
            headerDiv.appendChild(header);
            return headerDiv;
        }

        function createDataItem(text){
            var containerDiv = document.createElement('div');
            containerDiv.className = 'micro-panel-data-item';
            containerDiv.appendChild(document.createTextNode(text));
            return containerDiv;
        }

        function appendDataItems(panel, config){
            config.items.forEach(function(item){
                panel.appendChild(createDataItem(item.key + ' ' + item.value));
            });
        }

        function assemblePanel(element, config){
            var container = createPanelContainer();
            var panel = createPanel(config);
            var header = createHeader(element, config);
            container.appendChild(panel);
            panel.appendChild(header);
            appendDataItems(panel, config);
            return container;
        }

        function addMouseHandlers(element, panel){
            _micro.Event.addHandler(element, 'mouseover', function(){
                element.appendChild(panel);
            });
            _micro.Event.addHandler(element, 'mouseleave', function(){
               element.removeChild(panel)
            });
        }

        function panelizeLocalElement(element){
            var localElementConfig = getLocalElementConfig(element);
            var panel = assemblePanel(element, localElementConfig);
            addMouseHandlers(element,panel);
        }

        function panelizeRemoteElement(element){
            var remoteElementConfig = getRemoteElementConfig(element);
            var panel = assemblePanel(element, remoteElementConfig);
            addMouseHandlers(element, panel);
        }

        function panelizeRemoteElements(){
            m('.micro-panel').each(function(){
                if(!requiresServerLoad(this))
                    return;
                panelizeRemoteElement(this);
            });
        }

        function panelizeAllElements(){
            var serverLoadRequired = {
                value: false
            };
            m('.micro-panel').each(function(serverLoadRequired){
                var thisElementRequiresServerLoad = requiresServerLoad(this);
                if(thisElementRequiresServerLoad){
                    serverLoadRequired.value = thisElementRequiresServerLoad;
                    readServerInfo(this);
                } else {
                    panelizeLocalElement(this);
                }
            },serverLoadRequired);
            if(serverLoadRequired.value)
                queryServer();
        }

        (function(){
            _micro.Event.addHandler(GlobalObject, 'onLoadComplete', function(){
                panelizeAllElements();
            });
        })();

    }

})(GlobalObject.micro = (GlobalObject.micro || {}));