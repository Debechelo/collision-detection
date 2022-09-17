import Rectangle from "./rectangle";
import Circle from "./circle";
import Triangle from "./triangle";
import Hexagon from "./hexagon";
import QuadTree from "./quad-tree";

const canvas = document.getElementById("cnvs");

const gameState = {};
const color = ["rgb(0, 0, 200)","rgb(0, 200, 0)","rgb(200, 0, 0)"]

function queueUpdates(numTicks) {
    for (let i = 0; i < numTicks; i++) {
        gameState.lastTick = gameState.lastTick + gameState.tickLength
        update(gameState.lastTick)
    }
}

function draw(tFrame) {
    const context = canvas.getContext('2d');

    context.beginPath()
    context.clearRect(0, 0, canvas.width, canvas.height)
    context.closePath()

    gameState.figures.forEach((figure)=>{
    if(figure.constructor.name == "Rectangle1")
    {
        context.fillStyle = color[figure.hits]
        context.fillRect(figure.x, figure.y, figure.w, figure.h)
    }
    if(figure.constructor.name == "Circle1")
    {
        context.moveTo(figure.x, figure.y)
        context.fillStyle = color[figure.hits]
        context.beginPath();
        context.arc(figure.x, figure.y, figure.r, 0, Math.PI*2)
        context.closePath();
        context.fill()
    } 
    else if(figure.constructor.name == "Triangle1"){
        context.moveTo(figure.x, figure.y);
        context.fillStyle = color[figure.hits]
        context.beginPath();
        for (let i = 0; i < 4; i++) {
            context.lineTo(figure.x - figure.side * Math.sin(i * 2 * Math.PI / 3)
            , figure.y - figure.side * Math.cos(i * 2 * Math.PI / 3));
        }
        context.closePath();
        context.fill()
    }
    else if(figure.constructor.name == "Hexagon1"){
        context.moveTo(figure.x, figure.y);
        context.fillStyle = color[figure.hits]
        context.beginPath();
        for (let i = 0; i < 7; i++) {
            context.lineTo(figure.x + figure.side * Math.cos(i  * Math.PI / 3)
            , figure.y + figure.side * Math.sin(i  * Math.PI / 3));
        }
        context.closePath();
        context.fill()
        }
    })
}

function update(tick) {
    clearTree(gameState.tree)
    gameState.tree = new QuadTree(new Rectangle(0,0,window.innerWidth,window.innerHeight))
    gameState.figures.forEach(p => gameState.tree.insert(p))
    for(let j = gameState.figures.length - 1; j>=0; j--){
        if(gameState.figures[j].hits>2) {
            gameState.figures.splice(j, 1)
        }
    }
    let i = 0;
    gameState.figures.forEach((figure)=>{
        figure.hit  = false
        motionProcessing(figure,i)
        i++;
    })
    //collisionOnFigureQuadTree(gameState.tree)
}

function motionProcessing(figure,i){
    figure.x += figure.speed.x
    figure.y += figure.speed.y
    if(figure.constructor.name != "Circle1")
        {figure.findVertexes()}
    if(figure.contains({x:0,y:figure.y})||figure.contains({x:window.innerWidth,y:figure.y})){
        figure.speed.x *= -1
    }else if(figure.contains({x:figure.x,y:0})||figure.contains({x:figure.x,y:window.innerHeight})){
        figure.speed.y *= -1
    }
    collisionOnFigure(figure,i)
}

function collisionOnFigure(figure,i){
    for(let j = i + 1; j<gameState.figures.length; j++){
        if(figure.hit == false )
        if(figure.intersects(gameState.figures[j])){
            figure.speed.y *= -1
            figure.speed.x *= -1
            figure.hits+=1
            gameState.figures[j].speed.y *= -1
            gameState.figures[j].speed.x *= -1
            gameState.figures[j].hits+=1
            figure.hit = true
        }
    }
}

function collisionOnFigure1(figures,figure){
    for(let j = 0; j< figures.length; j++){
        if(figure.hit == false )
        if(!figure.equal(figures[j]) && figure.intersects(figures[j])){
            figure.speed.y *= -1
            figure.speed.x *= -1
            figure.hits+=1
            figure.hit = true
        }
    }
}

function collisionOnFigureQuadTree(tree){
        if (tree.hasChildren) {
            tree.children.forEach(child => collisionOnFigureQuadTree(child))
        }
        if(!tree.hasChildren){
            tree.figures.forEach((figure)=>{
                collisionOnFigure1(tree.figures,figure)
            })
        }
}

function clearTree(tree){
    if (tree.hasChildren) {
        tree.children.forEach(child => clearTree(child))
    }
    tree.clear()
}

function run(tFrame) {
    gameState.stopCycle = window.requestAnimationFrame(run)

    const nextTick = gameState.lastTick + gameState.tickLength
    let numTicks = 0

    if (tFrame > nextTick) {
        const timeSinceTick = tFrame - gameState.lastTick
        numTicks = Math.floor(timeSinceTick / gameState.tickLength)
    }
    queueUpdates(numTicks)
    draw(tFrame)
    gameState.lastRender = tFrame
    document.addEventListener('keypress', function(){
        console.log('Success onkeypress');
        stopGame(gameState.stopCycle)
    });

}

function stopGame(handle) {
    window.cancelAnimationFrame(handle);
}

function setup() {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    gameState.lastTick = performance.now()
    gameState.lastRender = gameState.lastTick
    gameState.tickLength = 15 //ms
    gameState.figures = []

    for(let i = 0;i<3;i++){
        const triangle = new Triangle(getRandomInt(window.innerWidth-182,96),getRandomInt(window.innerHeight-182,96),getRandomInt(10,100))
        triangle.setSpeed(getRandomSpeed(5), getRandomSpeed(5))
        gameState.figures.push(triangle)
    }
    for(let i = 0;i<3;i++){
        const hexagon = new Hexagon(getRandomInt(window.innerWidth-152,76),getRandomInt(window.innerHeight-152,76),getRandomInt(10,100))
        hexagon.setSpeed(getRandomSpeed(5), getRandomSpeed(5))
        gameState.figures.push(hexagon)
    }
    for(let i = 0;i<0;i++){
        const rectangle = new Rectangle(getRandomInt(window.innerWidth-30,0),getRandomInt(window.innerHeight-30,0)
        ,getRandomInt(10,100),getRandomInt(10,100))
        rectangle.setSpeed(getRandomSpeed(5), getRandomSpeed(5))
        gameState.figures.push(rectangle)
    }
    for(let i = 0;i<0;i++){
        const circle = new Circle(getRandomInt(window.innerWidth-152,76),getRandomInt(window.innerHeight-152,76),getRandomInt(10,100))
        circle.setSpeed(getRandomSpeed(5), getRandomSpeed(5))
        gameState.figures.push(circle)
    }
    gameState.tree = new QuadTree(new Rectangle(0,0,window.innerWidth,window.innerHeight))
    gameState.figures.forEach(p => gameState.tree.insert(p))
}

function getRandomInt(multiplier,minWidth) {
    return Math.floor(Math.random() * multiplier+minWidth);
}

function getRandomSpeed(multiplier) {
    return Math.floor(Math.random() * multiplier-Math.floor((Math.random()*multiplier)));
}

setup();
run();
