const express = require("express");
const http = require("http");
const path = require("path");
const socketIO = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);


app.use(express.static(path.join(__dirname, "public")));

// Set the view engine to ejs
app.set("view engine", "ejs");

// Serve the index.ejs file from the views directory
app.get('/', function(req, res) {
    res.render("index");
});

// Socket.IO connection handler
io.on("connection", function(socket) {
    console.log("connected");

    socket.on("send-position",function(data){
        io.emit("receive-location",{id:socket.id,...data});

    });

    socket.on("disconnect",function(){
io.emit("user-disconnected",socket.id);
    });
});

// Start the server
server.listen(3000, () => {
    console.log("App is listening on port 3000");
});
