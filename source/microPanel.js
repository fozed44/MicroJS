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
                    configured via a comma seperated list - key1,name1,key2,name2,key3,name3 etc.
                vertical-offset:
                    An integer, whose units are pixels, specifying the virtical displacement of the panel from its normal
                    position.
                horizontal-offset:
                    An integer, whose units are pixels, specifying the horizontal displacement of the panel from its normal
                    position.

            Using remote data.

                The panel can get its data from a remote JSON enpoint
    */
    _micro.Panel = new function() {

        /*
            Creates a configuration object, the properties of which is are follows:

            remoteAddress: (data-remote-address)
                Server path to an endpoint that the panel can use to populate its data.
            remoteDataKey: (data-remote-key)
                A string that is sent to the server via a ?key= query string entry that
                the server should use to determine the correct data to return for this
                particular panel.
            heading: (data-heading)
                Panel heading.
            items: (data-items)
                Items displayed  below the heading
            verticalOffset: (data-vertical-offset)
                Allows a panel to be rendered above or below its normal position.
            horizontalOffset: (data-horizontal-offset)
                Allows a panel to be rendered to the right or left of its normal posiition.

        */
        function createConfigObject(element){
            var mElement = m(element);            
            return {
                remoteAddress: mElement.data('remote-address'),
            };
        }

        function createPanelContainer() {
            var panelContainer = document.createElement('div');
            panelContainer.className = 'micro-panel-container';
            return panelContainer;
        } 

        function createPanel(){            
            var panel = document.createElement('div');
            panel.className = 'micro-panel-panel';
            return panel;
        }

        function createHeader(element){
            var headerText = m(element).data('heading');
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

        function assemble(element){
            var container = createPanelContainer();
            var panel = createPanel();
            var header = createHeader(element);
            container.appendChild(panel);
            panel.appendChild(header);
            panel.appendChild(createDataItem("test:  Item 1"));
            panel.appendChild(createDataItem('test:  Long Long Long Item'));
            panel.appendChild(createDataItem('test:  Item 2'));
            return container;
        }

        function panelizeElement(element){
            var panel = assemble(element);
            element.appendChild(panel);
            _micro.Event.addHandler(element, 'mouseover', function(){
                element.appendChild(panel);
            });
            _micro.Event.addHandler(element, 'mouseleave', function(){
               element.removeChild(panel)
            });
        }

        function panelizeAllElements(){
            m('.micro-panel').each(function(){
                panelizeElement(this);
            });
        }

        (function(){
            _micro.Event.addHandler(GlobalObject, 'onLoadComplete', function(){
                panelizeAllElements();
            });
        })();

    }

})(GlobalObject.micro = (GlobalObject.micro || {}));