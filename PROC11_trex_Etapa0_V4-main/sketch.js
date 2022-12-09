var invisibleGround
var trex ,trex_running;
var trex_collided,trex_collidedImage;
var ground,groundImage;
var cloud,cloudImage;
var obstacle1,obstacle2,obstacle3,obstacle4,obstacle5,obstacle6;
var score=0;
var play=1,end=0;
var gameState=play;
var obstacleGroup;
var cloudGroup;
var gameOver;
var gameOverImg;
var restart,restartImg;
var jumpSound;
var dieSound;
var checkPointSound;
//var serve=2;





function preload(){
 trex_running=loadAnimation ("trex1.png","trex3.png","trex4.png"); 
trex_collidedImage=loadAnimation ("trex_collided.png");
groundImage=loadAnimation("ground2.png");
cloudImage=loadAnimation("cloud.png");
obstacle1=loadImage("obstacle1.png");
obstacle2=loadImage("obstacle2.png");
obstacle3=loadImage("obstacle3.png");
obstacle4=loadImage("obstacle4.png");
obstacle5=loadImage("obstacle5.png");
obstacle6=loadImage("obstacle6.png");
gameOverImg=loadImage("gameOver.png");
restartImg=loadImage("restart.png");
jumpSound=loadSound("jump.mp3");
dieSound=loadSound("die.mp3");
checkPointSound=loadSound("checkPoint.mp3");

}

function setup(){
  createCanvas(windowWidth,windowHeight)
  
  //crear sprite de Trex
 trex=createSprite(50,height-70,20,50);
 trex.addAnimation("running",trex_running);
 trex.scale=0.5

obstacleGroup = createGroup();
cloudGroup = createGroup()

trex.addAnimation("collided",trex_collidedImage);





gameOver=createSprite(width/2,height/2-50)
gameOver.addImage(gameOverImg);
gameOver.scale=0.7

restart=createSprite(width/2,height/2)
restart.addImage(restartImg);
restart.scale=0.4


 //crear sprite de suelo
ground=createSprite(width/2,height-10,width,125);
ground.addAnimation("ground",groundImage);
ground.x=ground.width/2;

//piso invible pa el t-rex volador
invisibleGround=createSprite (width/2,height-10,width,125)
invisibleGround.visible=false;

// tirar 1 dado en las nubes y obtaculos
var rand=Math.round(random(1,100));
//console.log(rand)

trex.setCollider("circle",0,0,40);
//trex.debug=true

}




function draw(){
  background("white")
  //console.log(frameCount)
  text("puntuacion: "+score,500,50);
  //console.log(trex.y);




//INICIO O FIN DEL JUEGO
if(gameState==play){
  
 gameOver.visible=false
 restart.visible=false


//velocidad al suelo
  ground.velocityX=-(10+score/3000);
 
 
  //puntaje para presumir
 
 score=score+Math.round(frameCount /60);

 if (score>0 && score%1000===0){
  checkPointSound.play();
 } 










 //piso sumamente infinito
if (ground.x<0){
  ground.x=ground.width/2;
}
 //hacer que el t-rex salte al usar barra espaciadora

 if (touches.length > 0 || keyDown("space")&& trex.y >= height-161)  {
  trex.velocityY=-10;
  jumpSound.play();
  touches = [];
    }
  
    //gravedad 2.0 :v
   trex.velocityY=trex.velocityY+0.8;

   spawnClouds();
   spawnObstacles();
   
  
   
   
   if (obstacleGroup.isTouching(trex)){
    gameState=end;
    dieSound.play();
   }
 }



else if(gameState===end){
 
  ground.velocityX=0;

  

  obstacleGroup.setVelocityXEach(0);
  cloudGroup.setVelocityXEach(0);

gameOver.visible=true
restart.visible=true

trex.velocityY=0;

obstacleGroup.setLifetimeEach(-1);
cloudGroup.setLifetimeEach(-1);


//GAME-OVER DINO
trex.changeAnimation("collided",trex_collidedImage)

}


if (mousePressedOver(restart)){
  console.log("reiniciando juego");
  reiniciar();
}

/*else if(gameState==server){
  //gameState=1;
  //keyDown("space");
  //ground.velocityX=0;
  /*if (keyDown("space")){
    gameState=1
  }


 }
*/



 
 
 
  
 //evitar que el t-rex caiga al infinito

 trex.collide(invisibleGround);

  

  drawSprites();

}





function spawnObstacles(){

  if(frameCount%60==0){
  var obstacle=createSprite(width+10,height-95,20,30);
  obstacle.velocityX=-(6+score/3000);
  var rand=Math.round(random(1,6));

  switch(rand){

    case 1: obstacle.addImage(obstacle1);
    break;

    case 2: obstacle.addImage(obstacle2);
    break;

    case 3: obstacle.addImage(obstacle3);
    break;

    case 4: obstacle.addImage(obstacle4);
    break;

    case 5: obstacle.addImage(obstacle5);
    break;

    case 6: obstacle.addImage(obstacle6);
    break;

    default: break;

  }
//vida y tamaño (sigo si cretividad :v)
  obstacle.scale=0.5;
  obstacle.lifetime=220;

  obstacleGroup.add(obstacle);

  }





}













function spawnClouds(){
  //generacion nubosa de nubes
  if(frameCount%44==0){
    cloud=createSprite (width+20,height-300,40,10);
    cloud.addAnimation("cloudImage",cloudImage);
    cloud.y=Math.round(random(100,220));
    cloud.scale=0.6
    cloud.velocityX=-(3+score/3000);

    //eliminar nubes pa evitar lag
    cloud.lifetime=200

    //profundidad (se me acabo la creatividad)
    cloud.depth=trex.depth;
    trex.depth=trex.depth+1;
    //console.log(trex.depth)
    //console.log(cloud.depth)
    cloudGroup.add(cloud);
  }
  
}


function reiniciar(){


  gameState=play
gameOver.visible=false
restart.visible=false
score=0
obstacleGroup.destroyEach();
cloudGroup.destroyEach();
trex.changeAnimation("running",trex_running)



}