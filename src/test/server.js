var http = require('http');
var destroy = require('server-destroy');


function startAndOff(port) {
    let server = http.createServer(function (req, res) {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.write('Hello World!');
        res.end();
    }).listen(port);
    destroy(server)
    let turnOffAfter = Math.random() * (10000 - 5000) + 5000;
    setTimeout(() => {
        server.destroy()
    }, turnOffAfter)
}

module.exports = function (port) {
    startAndOff(port);
    setInterval(startAndOff, 10000, port);
}
