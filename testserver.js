var http = require('http'),
    fs   = require('fs');

http.createServer(function(req,res){
    var path = req.url.replace(/\/?(?:\?.*)?$/, '').toLowerCase();
    switch(path){
        case '':
            serveStaticFile(res, '\\index.html');
            break;
        case '/paneltest':
            res.writeHead(200, {"Content-Type": "application/json"});
            var json = JSON.stringify([
                { 
                    key: "panel1", 
                    heading: "panel one heading", 
                    items: [
                        { key: "panel1 itemA", value: "Panel1 Value A" },
                        { key: "panel1 itemB", value: "panel1 value B" }
                    ]
                },
                {
                    key: "panel2",
                    heading: "panel two heading",
                    items:
                    [
                        { key: "panel2 item A", value: "panel2 value A" },
                        { key: "panel2 item B", value: "panel2 value B" },
                        { key: "panel2 item C", value: "panel2 value C" },
                        { key: "panel2 item D", value: "panel2 value D" }
                    ]
                }
            ]);
            res.end(json);
            break;
        default:
            serveStaticFile(res, path );
            break;
    }
}).listen(3000);

function serveStaticFile(res, path, responseCode){
    responseCode = responseCode || 200;
    var contentType = getContentType(path);
    fs.readFile(__dirname + path, function(err, data){
        if(err){
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('500 - Internal Error');
        } else {
            res.writeHead(responseCode, { 'Content-Type': contentType });
            res.end(data);
        }
    });
}

function getContentType(filename){
    var extension = filename.split('.').pop();
    if(!extension) return 'text/plain';
    switch(extension){
        case 'js':
            return 'text/javascript';
        case 'css':
            return 'text/css';
        case 'html':
            return 'text/html';
        default:
            return 'text/plain';
    }
}