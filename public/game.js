var socket = io.connect();

$(document).ready(()=> {
        var circle=new Circle();
        console.log(circle);
        socket.emit('add-me-as-player',circle)
   
     }
);
socket.on('place-all-foods',data=>{
    data.forEach(element => {
        $('#parent').append(' <div class="food" id=' + element.id + ' style="   transform: translate(' + element.x + 'px, ' + element.y + 'px); background-color: rgb(' + element.r + ', ' + element.g + ', ' + element.b + ');"></div>');
    });
})
socket.on('place-all-clients-to-my-screen',data=>{
    data.forEach(element => {
        $('#parent').append(' <div class="character" id=' + element.id + ' style="   transform: translate(' + element.x + 'px, ' + element.y + 'px); background-color: rgb(' + element.r + ', ' + element.g + ', ' + element.b + ');"></div>');
    });
})

socket.on('place-me-at-all-clients-screen',data=>{
    $('#parent').append(' <div class="character" id=' + data.id + ' style="   transform: translate(' + data.x + 'px, ' + data.y + 'px); background-color: rgb(' + data.r + ', ' + data.g + ', ' + data.b + ');"></div>');
})
socket.on('remove-me-from-all-clients-screen',id=>{ 
    console.log(id);
   var circle = document.getElementById(id);
   circle.remove(); 
})

socket.on('move-at-all',(data)=>{
    $('#'+data.id).css({ "transform": "translate(" + data.x + "px," + data.y + "px)" });
})
 

document.onkeydown = check_key;
//basılı tutma, iki tuşa aynı anda basma gibi özellikler
function check_key(e) {
    e = e || window.event;
    let command=""
    switch (e.keyCode) {
        case 38:
            command="up";
            break;
        case 40:
            command="down";
            break;
        case 37:
            command="left";
            break;
        case 39:
            command="right";
           break;
    }
    socket.emit('move-command-triggered',command);
}   

class Circle {
    constructor(socketId) {
        this.id=Math.floor(Math.random()*99999);
        this.socketId=socketId;
        this.x =  Math.floor(Math.random() * 950);
        this.y =  Math.floor(Math.random() * 550);
        this.r =  Math.floor(Math.random() * 255);
        this.g =  Math.floor(Math.random() * 255);
        this.b =  Math.floor(Math.random() * 255);
    }
}