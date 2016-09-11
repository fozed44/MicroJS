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
                { name: "Heading A", value: "Value A" },
                { name: "Heading B", value: "Long Value" },
                { name: "Heading C", value: "Much Longer Value" },
                { name: "Heading D", value: "Value D" }
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