var seaport = require("../..")

var ports = seaport.connect("localhost", 9093)

var stream = ports.get("magic@1.2.x")

stream.on("data", function (data) {
    console.log("[CLIENT]", data.toString())
})
stream.write("hello from client!")