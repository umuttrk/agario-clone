var onlineCircles = [];
const express = require('express')
const app = express();
const server = app.listen(3000, "0.0.0.0", () => {
    console.log("server is listening on port 3000");
})

const io = require('socket.io')(server);

const getCircle=(socketId)=>onlineCircles.find(e=>e.socketId===socketId);

io.sockets.on("connection", socket => {
    console.log("a client connected");
    socket.on('add-me-as-player',data=>{
        data.socketId=socket.id;
        onlineCircles.push(data);
        socket.broadcast.emit('place-me-at-all-clients-screen',data);
        socket.emit('place-all-clients-to-my-screen',onlineCircles);
    })

    socket.on('move-command-triggered',command=>{
        const circle=getCircle(socket.id);
        switch (command) {
            case 'up':
                circle.y=circle.y-10;
                break;
            case 'down':
                circle.y=circle.y+10;
                break;
            case 'left':
                circle.x=circle.x-10;
                break;
            case 'right':  
                circle.x=circle.x+10; 
                break; 
        }
        io.sockets.emit('move-at-all',circle);
    })
    socket.on('disconnect',()=>{
        console.log("a client disconnected");
        let _id;
        onlineCircles.forEach((element,index) => {
            if (element.socketId===socket.id) {
                _id=element.id;
                onlineCircles.splice(index,1);
            }            
        });
        socket.broadcast.emit('remove-me-from-all-clients-screen',_id);
    })

})
app.use(express.static(__dirname + '/public'));