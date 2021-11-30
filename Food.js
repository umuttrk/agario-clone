class Food{
    constructor(){
        this.id=Math.floor(Math.random()*99999);
        this.x =  Math.floor(Math.random() * 1448);
        this.y =  Math.floor(Math.random() * 768);
        this.r =  Math.floor(Math.random() * 255);
        this.g =  Math.floor(Math.random() * 255);
        this.b =  Math.floor(Math.random() * 255);
    }
}
module.exports=Food;