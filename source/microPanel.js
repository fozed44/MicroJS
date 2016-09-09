var GlobalObject = (function(){
    try { return window; }
    catch(e) { return exports; }
})();

(function(_micro){

    _micro.Panel = new function() {       

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