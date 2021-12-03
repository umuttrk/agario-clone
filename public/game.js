var socket = io.connect();

$(document).ready(() => {
    let person = prompt("Please enter your name", "Harry Potter");

    var circle = new Circle(person);
    console.log(circle);
    socket.emit('add-me-as-player', circle)
    
}
);
socket.on('place-all-foods', data => {
    data.forEach(element => {
        $('#parent').append(' <div class="food" id=' + element.id + ' style=" transform: translate(' + element.x + 'px, ' + element.y + 'px); background-color: rgb(' + element.r + ', ' + element.g + ', ' + element.b + ');"></div>');
    });
})
socket.on('remove-a-food', data => {
    
    console.log(data.element.id + " gone!");
    var food = document.getElementById(data.element.id);
   
    console.log(food);
    $('#' + data.circle.id).css({ "width": data.circle.size + 1, "height": data.circle.size + 1 })
    //  food.remove(); 
    food.parentNode.removeChild(food);
})
socket.on('add-a-food', food => {
    $('#parent').append(' <div class="food" id=' + food.id + ' style=" transform: translate(' + food.x + 'px, ' + food.y + 'px); background-color: rgb(' + food.r + ', ' + food.g + ', ' + food.b + ');"></div>');
})
socket.on('place-all-clients-to-my-screen', data => {
    data.forEach(element => {
        $('#parent').append(' <div class="character" id=' + element.id + ' style="  width:' + element.size + 'px; height:' + element.size + 'px; transform: translate(' + element.x + 'px, ' + element.y + 'px); background-color: rgb(' + element.r + ', ' + element.g + ', ' + element.b + ');"></div>');
    });
})

socket.on('place-me-at-all-clients-screen', data => {
    $('#parent').append(' <div class="character" id=' + data.id + ' style="  width:' + data.size + 'px; height:' + data.size + 'px;  transform: translate(' + data.x + 'px, ' + data.y + 'px); background-color: rgb(' + data.r + ', ' + data.g + ', ' + data.b + ');"></div>');
})
socket.on('remove-me-from-all-clients-screen', id => {
    var circle = document.getElementById(id);
    circle.remove();
})

socket.on('move-at-all', (data) => {
    $('#' + data.id).css({ "transform": "translate(" + data.x + "px," + data.y + "px)" });
})


document.onkeydown = check_key;
//basılı tutma, iki tuşa aynı anda basma gibi özellikler
function check_key(e) {
    e = e || window.event;
    let command = ""
    switch (e.keyCode) {
        case 38:
            command = "up";
            break;
        case 40:
            command = "down";
            break;
        case 37:
            command = "left";
            break;
        case 39:
            command = "right";
            break;
    }
    socket.emit('move-command-triggered', command);
}

class Circle {
    constructor(name,socketId) {
        this.id = Math.floor(Math.random() * 99999);
        this.socketId=socketId;
        this.size = 40;
        this.name=name;
        this.x = Math.floor(Math.random() * 950);
        this.y = Math.floor(Math.random() * 550);
        this.r = Math.floor(Math.random() * 255);
        this.g = Math.floor(Math.random() * 255);
        this.b = Math.floor(Math.random() * 255);
    }
}