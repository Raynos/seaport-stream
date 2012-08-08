var seaport = require("../..")

require("./seaport")

var ports = seaport.connect("localhost", 9093)

ports.service("magic@1.2.3", handleStream)

function handleStream(stream) {
    stream.write("hello from magic!")
    stream.on("data", function (data) {
        console.log("[MAGIC]", data.toString())
    })
}