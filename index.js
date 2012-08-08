var seaport = require("seaport")
    , PauseStream = require("pause-stream")
    , pick = require("deck").pick
    , net = require("net")
    , http = require("http")
    , request = require("request")
    , through = require("through")
    , es = require("event-stream")

module.exports = {
    connect: createSeaportConnection
}

function createSeaportConnection() {
    var ports = seaport.connect.apply(seaport, arguments)

    return {
        service: service
        , get: get
    }

    function get(serviceName) {
        var buffer = PauseStream().pause()
            , read = through()

        ports.get(serviceName, function (ports) {
            var meta = pick(ports)

            var protocol = meta.protocol
                , host = meta.host
                , port = meta.port

            if (protocol === "net") {
                var client = net.connect(port, host)
                buffer.pipe(client).pipe(read)
            } else if (protocol === "http") {
                var uri = "http://" + host + ":" + port
                buffer.pipe(request(uri)).pipe(read)
            }

            buffer.resume()
        })

        return es.duplex(buffer, read)
    }

    function service(serviceName, protocol, handler) {
        if (typeof protocol === "function") {
            handler = protocol
            protocol = null
        }

        protocol = protocol || "net"

        var server

        if (protocol === "net") {
            server = net.createServer(handler)
        } else if (protocol === "http") {
            server = http.createServer(duplexer)
        }

        ports.service(serviceName, {
            protocol: protocol
        }, function (port, ready) {
            server.listen(port, ready)
        })

        function duplexer(req, res) {
            handler(es.duplex(res, req))
        }
    }
}