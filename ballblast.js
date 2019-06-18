//canvas variables
var canvas = document.getElementById('gameCanvas');
var canvasContext = canvas.getContext('2d');
const backgroundGradient = canvasContext.createLinearGradient(0,80,0,canvas.height);
backgroundGradient.addColorStop(0,'#171e26');
backgroundGradient.addColorStop(1,'#3f586b');
var backgroundStars = [];
var groundHeight = 70;
var gameOver = false;
var message = document.getElementsByClassName('messageDiv')[0];



//function to draw the canvas
function createMountainRange(mountainAmount,height,colour){
   for( let i=0 ; i< mountainAmount ; i++ ){
     const mountainWidth = canvas.width / mountainAmount ;
     canvasContext.beginPath();
     canvasContext.moveTo(i * mountainWidth,canvas.height);
     canvasContext.lineTo(i * mountainWidth + mountainWidth  + 325,canvas.height);
     canvasContext.lineTo(i * mountainWidth + mountainWidth / 2,canvas.height - height);
     canvasContext.lineTo(i * mountainWidth - 325,canvas.height);
     canvasContext.fillStyle = colour ;
     canvasContext.fill();
     canvasContext.closePath();

   }
}


//used for creating the stars in the canvas
function stars(x,y,radius,colours){
  this.x = x;
  this.y = y;
  this.radius = radius;
  this.colour = colours;

  this.drawStar = function(){
    canvasContext.beginPath();
    canvasContext.arc(this.x,this.y,this.radius,0,Math.PI*2,false);
    canvasContext.fillStyle= this.colour;
    canvasContext.fill();
    canvasContext.closePath();
  };

}

function createStar(){

  for (let i = 0; i < 150; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const radius = Math.random() * 3;
    backgroundStars.push(new stars(x,y,radius,'white'));
  }
}

function drawStars(){
  for (let i = 0; i < 150; i++) {
    backgroundStars[i].drawStar();

  }
}



//player scores
var playerScore = 0;
var highScore = 0;

//Paddle variables
var paddleWidth = 20;
var paddleHeight = 40;
var paddleX = (canvas.width-paddleWidth)/2;
var paddleY = canvas.height-paddleHeight - groundHeight;
var paddleSpeed=8;
var leftPressed = false;
var rightPressed = false;



//bullet variables
var bulletImage = new Image();
bulletImage.src = 'images/bullet.jpg' ;

var framesPerSecond=100;
var bulletArray = [];
function bullet(){

   //position
   this.x = paddleX + 5;
   this.y = paddleY- 15;
   this.radius = 3;

   this.init = function(){
     bulletArray.push(this);
   };

   this.draw = function(){
     canvasContext.drawImage(bulletImage,this.x,this.y,10,15);
   };

   this.update = function(){
     this.y += -10;
   };
}


function createBullet(){
  var bullets = new bullet();
  bullets.init();

}

function updateBulletPos(){
  for (var i = bulletArray.length; i--;) {
   bulletArray[i].update();

   if(bulletArray[i].y < 0)
   bulletArray.splice(i, 1);
 }
}

function drawBullet(){

   for (var i = bulletArray.length; i--;) {
   bulletArray[i].draw();
   }
}


//function to create random numbers between min and max
function randomIntFromRange(min,max){

   return Math.floor(Math.random() * (max - min + 1) + min);
}

//function to create random colours
var coloursArray = ['#929292','#90EE90','#BDB76B','#AFEEEE','#00008B','#708090','#FFC0CB'] ;
function createRandomcolours(){
  return coloursArray[randomIntFromRange(0,coloursArray.length)];
}

//Rocks variables
var rockArray = [];
function rock(x,y,speedX,speedY,radius,colour,parent){
  this.x = x;
  this.y = y;
  this.radius = radius;
  this.strength = Math.floor(this.radius);
  this.colour = colour;
  this.parent = parent;
  this.speedX = speedX;
  this.speedY = speedY;

//  this.friction = 0.8 ;
  this.gravity = 0.05;

  this.drawRock = function(){
  canvasContext.beginPath();
  canvasContext.arc(this.x,this.y,this.radius,0,Math.PI*2,false);
  canvasContext.fillStyle= this.colour;
  canvasContext.fill();
  canvasContext.beginPath();
  canvasContext.font = "15px Assistant";
  canvasContext.fillStyle = 'white';
  canvasContext.textAlign = "center";
  canvasContext.textBaseline = 'middle';
  canvasContext.fillText(this.strength, this.x, this.y) ;
  canvasContext.fill();
  canvasContext.closePath();
  };

  this.update = function(){


  if(this.y+this.radius + this.speedY  >canvas.height - groundHeight || this.y - this.radius<0){
    this.speedY = -this.speedY  ;
  }else{
    this.speedY += this.gravity;
  }

  if(this.x + this.radius> canvas.width || this.x - this.radius< 0){
    this.speedX = -this.speedX;
  }

  if((this.x >paddleX) && (this.x < paddleX + paddleWidth) && (this.y > paddleY) && (this.y < paddleY + paddleHeight)){
    gameOver = true ;


  }
   this.x += this.speedX;
   this.y += this.speedY;
  };


}

function drawRocks(){
  for (var i = rockArray.length; i--;) {
  rockArray[i].drawRock();
  }
}

function updateRockPos() {

  for (var i = rockArray.length; i--;) {
   rockArray[i].update();
}


}

var ticker= 0;
var rockSpawnRate = 9000;
function createRock(){


  if(ticker % 2 ==0){

    const x = canvas.width -70;
    const y = canvas.height / 2 -100;
    const radius = randomIntFromRange(40,60);
    const speedX = randomIntFromRange(-3,-1);
    const speedY = randomIntFromRange(-2, 2);
    const colour =  createRandomcolours();
    rockArray.push(new rock(x,y,speedX,speedY,radius,colour,true)) ;

  }
  else {

    const x =  70;
    const y = canvas.height / 2 - 100;
    const radius = randomIntFromRange(30,40);
    const speedX = randomIntFromRange(1,3);
    const speedY = randomIntFromRange(-2, 2);
    const colour =  createRandomcolours();
    rockArray.push(new rock(x,y,speedX,speedY,radius,colour,true));

  }


}

//collision detection
function collision(bullet,bulletIndex){

  for(let i = 0; i < rockArray.length; i++){
          var rocks = rockArray[i];
          var strength = rocks.strength;

    if(rocks.radius + bullet.radius >= (Math.hypot(rocks.x - bullet.x, rocks.y - bullet.y))){

            //When it is obtained from some other rock destroy it on zero value
        if(rocks.strength == 1 && rocks.parent == false){

              bulletArray.splice(bulletIndex, 1);
              rockArray.splice(i, 1);
              playerScore += 1;
              }
      //if the rock is a new rock it splits into two new rocks if the radius is more then 40
      else if(rocks.strength == 1 && rocks.parent == true ){
        if(rocks.radius> 40){
          bulletArray.splice(bulletIndex, 1);
          rockArray.push(new rock(rocks.x, rocks.y, rocks.speedX, -rocks.speedY, rocks.radius/2, rocks.colour, false));
          rockArray.push(new rock(rocks.x, rocks.y, -rocks.speedX, -rocks.speedY, rocks.radius - (rocks.radius/2), rocks.colour, false));
          rockArray.splice(i, 1);
          playerScore += 1;
        }
        //when the radius of the rock is less than 40 the rock is destroyed
        else{
          bulletArray.splice(bulletIndex,1);
          rockArray.splice(i,1);
          playerScore += 1;
        }
              }
      //Reduce the strength by 1 on bullet contact
      else{
        rocks.strength -= 1;
        bulletArray.splice(bulletIndex, 1);
        playerScore += 1;
              }

         }
      }
  }



//buttons
var highScore=document.getElementById('highscore');
var reset=document.getElementById('reset');
var mute=document.getElementById('mute');
var pause = false;

//when the arrow keys or a,d key is leftPressed
function keyDownHandler(evt){
  if(evt.key == "Right" || evt.key == "ArrowRight" || evt.keyCode == 68)
  rightPressed = true;

  else if(evt.key == "Left" || evt.key == "ArrowLeft" || evt.keyCode == 65)
  leftPressed = true;

}

function keyUpHandler(evt){
  if(evt.key == "Right" || evt.key == "ArrowRight" || evt.keyCode == 68)
  rightPressed = false;

  else if(evt.key == "Left" || evt.key == "ArrowLeft" || evt.keyCode == 65)
  leftPressed = false;

}

document.addEventListener('keydown',keyDownHandler);
document.addEventListener('keyup',keyUpHandler);

//moves everything in the canvas
function moveEverything(){

//paddle movement
  if(rightPressed && paddleX < canvas.width - paddleWidth)
  paddleX += paddleSpeed;

  else if(leftPressed && paddleX > 0)
  paddleX -= paddleSpeed;

  //bullet movement
  updateBulletPos();

  //rock movement
  updateRockPos();

//displays player score
/*  if(collision){
  updatePlayerScore();
} */


  //collision detection
  for(let j = 0; j < bulletArray.length; j++)
  {
      collision(bulletArray[j], j);
  }
}


//function to draw rectangles in canvas
  function colourRect(leftX,topY,width,height,drawColour){
  canvasContext.fillStyle= drawColour;
  canvasContext.fillRect(leftX,topY,width,height);
}

//draws everything in the canvas
function drawEverything(){


   //draws the canvas
  colourRect(0,0,canvas.width,canvas.height,backgroundGradient);
  drawStars();
  createMountainRange(1,canvas.height - 50,'#384551');
  createMountainRange(2,canvas.height - 100,'#2B3843');
  createMountainRange(3,canvas.height - 300,'#26333E');
  colourRect(0,canvas.height - groundHeight,canvas.width,groundHeight,'#182028');

  //draws the bullets
  drawBullet();

  //draws the Rocks
  drawRocks();

  //display player scores
  updatePlayerScore();


  //draws the paddle
  colourRect(paddleX,paddleY,paddleWidth,paddleHeight,'red');

}




//to pause the game
function togglePause(){
   if(!pause){
     pause = true;
   }
   else if(pause){
     pause = false;
   }
}

document.addEventListener('keydown',function(evt){
  if (evt.keyCode === 80){
    togglePause();
  }
})

//function to update playerscore for every frame
function updatePlayerScore(){
  canvasContext.font = "20px Assistant";
  var displayPlayerScore = "Your score :" + playerScore;
  canvasContext.fillStyle = 'white';
  canvasContext.fillText(displayPlayerScore,1500,80);
}



//function to display message when the rock collides with cannon
var messageh3 = document.getElementsByTagName('h3')[3];
function gameOverMessage(){
   messageh3.innerHTML += playerScore;
}

//function to restart game after space is pressed
document.addEventListener("keydown",function(evt){
  if(gameOver == true && evt.keyCode ==32){
    document.location.reload();
  }
})



//renders the canvas frame when the gameLoop function is called
function gameLoop(){
if(!gameOver){
if(!pause){
   moveEverything();
   drawEverything();


 }


ticker++;
window.requestAnimationFrame(gameLoop);
}
else{

  canvasContext.clearRect(0,0,canvas.width,canvas.height);
  message.style.display = "block";
  gameOverMessage();

}



}
if(!pause){
  setInterval(createBullet,framesPerSecond);
var interRocks = setInterval(createRock, rockSpawnRate);
createStar();
}
gameLoop();


//rest the game
  reset.addEventListener("click",function(){
    document.location.reload();
  })
