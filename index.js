const express = require("express")
const morgan = require("morgan")
const http = require("http")
const { Server } = require("socket.io")

const app = express()
const server = http.createServer(app)
const io = new Server(server)

app.use(morgan("dev"))
app.use(express.static(__dirname + "/public"))

app.get("/", (req,res) => {
    res.status(200).sendFile(__dirname + "/view/index.html")
})


io.on('connection', (socket) => {
    socket.on('chat message', (msg) => {
        io.emit('chat message', msg)
    })
    socket.on('disconnect', () => {
        console.log("Disconectado")
    })
})


server.listen(8082, () => console.log("http://localhost:8082"))