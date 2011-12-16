var fs   = require("fs"  );
var http = require("http");
var url  = require("url" );

/** favicon is the static icon for the site. 
 *  It is also used by iOS when it's added to the home screen.
 */
var favicon = fs.readFileSync('./favicon.ico');
var router = function(req, res) {
    syslog("ReqHeader|" + req.connection.remoteAddress 
         + "|" + JSON.stringify(req.headers)
    );
    var path = url.parse(req.url).pathname;
    switch(path) {
        case '/favicon.ico':
            syslog("favicon.ico is requested.");
            res.writeHead(200, {'Content-Type': 'image/gif' });
            res.end(favicon, 'binary');
        break;
        case '/suggest/':
            respond(req, res);
        break;
        default:
            res.writeHead(200, {'Content-Type': 'text/plain' });
            res.end("Cannot find page.");
    }
}

var syslog = function(text) {
    var ts = new Date();
    console.log(ts.toISOString() + "|" + text + "~~");
}


var respond = function(request, response) {
    syslog("Request " + url.parse(request.url).pathname 
         + " received. Sending back response..."
    );
    response.writeHead(200, {'Content-Type': 'text/html'});
    response.write('<!DOCTYPE HTML>\n');
    response.write('<HTML><HEAD><TITLE>PortfolioPlot</TITLE>'
                 + '<link rel="apple-touch-icon" href="/favicon.ico" />'
                 + '</HEAD><BODY>\n'
    );
    response.write('[{"id":"NFLX","text":"NFLX","extra":"Netflix Inc."}\n');
    response.write(',{"id":"AAPL","text":"AAPL","extra":"Apple Inc."}\n');
    response.write(',{"id":"INTC","text":"INTC","extra":"Intel Corp."}\n');
    response.write(',{"id":"GOOG","text":"GOOG","extra":"Google Inc."}\n');
    response.write(']');
    response.end('</BODY></HTML>');
}

var server = http.createServer(router);
server.listen(3690);

console.log("Server launched on port 3690.");

