var onlineCircles = [];



var foods = [];
const express = require('express')
const app = express();
const server = app.listen(3000, "0.0.0.0", () => {
    console.log("server is listening on port 3000");
})
const Food = require('./Food');
const io = require('socket.io')(server);
for (let index = 0; index < 200; index++) {
    foods.push(new Food());
}

const getCircle = (socketId) => onlineCircles.find((e, i) => {
    i += 1;
    return e.socketId === socketId
});

io.sockets.on("connection", socket => {

    console.log("a client connected");
    socket.on('add-me-as-player', data => {
        data.socketId = socket.id;
        onlineCircles.push(data);
        socket.broadcast.emit('place-me-at-all-clients-screen', data);
        socket.emit('place-all-clients-to-my-screen', onlineCircles);
        io.sockets.emit('place-all-foods', foods);
    })


    socket.on('move-command-triggered', command => {
        const circle = getCircle(socket.id);
        foods.forEach((element, index) => {
            if (element.x < circle.x + circle.size && element.x > circle.x && element.y < circle.y + circle.size && element.y > circle.y) {
                console.log(element.id + " yenildi");
                var a = onlineCircles.findIndex(e => e === circle);
                onlineCircles[a].size += 1;
                io.sockets.emit('remove-a-food', { element, circle });
                foods.splice(index, 1);
                return null;
            }
        });

        switch (command) {
            case 'up':
                circle.y > 0 ? circle.y = circle.y - 20 : circle.y = 0;
                break;
            case 'down':
                circle.y < 800 - circle.size ? circle.y = circle.y + 20 : circle.y = 800 - circle.size;
                break;
            case 'left':
                circle.x > 0 ? circle.x = circle.x - 20 : circle.x = 0;
                break;
            case 'right':
                circle.x < 1500 - circle.size ? circle.x = circle.x + 20 : circle.x = 1500 - circle.size;
                break;
        }
        io.sockets.emit('move-at-all', circle);
        // io.sockets.emit('remove-a-food', eatenFood);

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