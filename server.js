var onlineCircles = [];
var foods = [];
const express = require('express')
const app = express();
const server = app.listen(3000, "0.0.0.0", () => {
    console.log("server is listening on port 3000");
})
const Food = require('./Food');
const io = require('socket.io')(server);
for (let index = 0; index < 50; index++) {
    foods.push(new Food());
}

const getCircle = (socketId) => onlineCircles.find(e => e.socketId === socketId);

io.sockets.on("connection", socket => {

    console.log("a client connected");
    socket.on('add-me-as-player', data => {
        data.socketId = socket.id;
        onlineCircles.push(data);
        socket.broadcast.emit('place-me-at-all-clients-screen', data);
        socket.emit('place-all-clients-to-my-screen', onlineCircles);
        io.sockets.emit('place-all-foods',foods);
    })


    socket.on('move-command-triggered', command => {
        const circle = getCircle(socket.id);
        switch (command) {
            case 'up':
                circle.y > 0 ? circle.y = circle.y - 20 : circle.y = 0;
                break;
            case 'down':
                circle.y < 720 ? circle.y = circle.y + 20 : circle.y = 720;
                break;
            case 'left':
                circle.x > 0 ? circle.x = circle.x - 20 : circle.x = 0;
                break;
            case 'right':
                circle.x < 1420 ? circle.x = circle.x + 20 : circle.x = 1420;
                break;
        }
        io.sockets.emit('move-at-all', circle);
    })
    socket.on('disconnect', () => {
        console.log("a client disconnected");
        let _id;
        onlineCircles.forEach((element, index) => {
            if (element.socketId === socket.id) {
                _id = element.id;
                onlineCircles.splice(index, 1);
            }
        });
        socket.broadcast.emit('remove-me-from-all-clients-screen', _id);
    })

})
app.use(express.static(__dirname + '/public'));