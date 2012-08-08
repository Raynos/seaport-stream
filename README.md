# seaport-stream [![build status][1]][2]

Create streams over seaport

Basically seaport but allows you to get streams and service streams rather then mess with the details of the IO protocol

## Example Client

``` js
var seaport = require("seaport-stream")

var ports = seaport.connect("localhost", 9093)

var stream = ports.get("magic@1.2.x")

stream.on("data", function (data) {
    console.log("[CLIENT]", data.toString())
})
stream.write("hello from client!")
```

## Example Server

``` js
var seaport = require("seaport-stream")

var ports = seaport.connect("localhost", 9093)

ports.service("magic@1.2.3", handleStream)

function handleStream(stream) {
    stream.write("hello from magic!")
    stream.on("data", function (data) {
        console.log("[MAGIC]", data.toString())
    })
}
```

## Installation

`npm install seaport-stream`

## Contributors

 - Raynos

## MIT Licenced

  [1]: https://secure.travis-ci.org/Raynos/seaport-stream.png
  [2]: http://travis-ci.org/Raynos/seaport-stream