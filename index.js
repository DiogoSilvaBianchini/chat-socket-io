const express = require("express")
const { Server } = require("socket.io")
const http = require("http")
const morgan = require("morgan")

const app = express()
const server = http.createServer(app)
const io = new Server(server)

app.use(express.static(__dirname + "/public"))
app.use(morgan("dev"))

app.get("/", (req,res) => {
    return res.status(200).sendFile(__dirname + "/view/index.html")
})

io.on("connection", (socket) => {
    socket.on('front', (listUrl) => {
        io.emit('front', listUrl)
    })
})

server.listen(8082, () => console.log("http://localhost:8082"))