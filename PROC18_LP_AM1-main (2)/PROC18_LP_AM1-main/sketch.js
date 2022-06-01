var PLAY = 1;
var END = 0;
var gameState = PLAY;

var gallo, gallo_running, gallo_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4;
var backgroundImg
var score=0;
var jumpSound, collidedSound;

var gameOver, restart;


function preload(){
  
  
  backgroundImg = loadImage("fondo.png");
  sunAnimation = loadImage("sun.png");
  gallo_running = loadImage("gallo.png");
  
  
  gallo_collided = loadImage("gallorostizado.png");
  
  groundImage = loadImage("ground.png");
  
  cloudImage = loadImage("cloud.png");

  obstacle1 = loadImage("maiz.png");
  obstacle2 = loadImage("maiz2.png");
  obstacle3 = loadImage("maiz3.png");
  obstacle4 = loadImage("maiz4.png");
  
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  sun = createSprite(width-50,100,10,10);
  sun.addAnimation("sun", sunAnimation);
  sun.scale = 0.1
  
  gallo = createSprite(50,height-70,20,50);
  
  
  gallo.addImage("running", gallo_running);
  gallo.addImage("collided", gallo_collided);
  gallo.setCollider('circle',0,0,350)
  gallo.scale = 0.08
  // trex.debug=true
  
  invisibleGround = createSprite(width/2,height-10,width,125);  
  invisibleGround.shapeColor = "#f4cbaa";
  
  ground = createSprite(width/2,height,width,2);
  ground.addImage("ground",groundImage);
  ground.x = width/2
  ground.velocityX = -(6 + 3*score/100);
  
  gameOver = createSprite(width/2,height/2- 50);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(width/2,height/2);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.1;

  gameOver.visible = false;
  restart.visible = false;
  
 
  // invisibleGround.visible =false

  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  
  score = 0;
}

function draw() {
  //gallo.debug = true;
  background(backgroundImg);
  textSize(20);
  fill("black")
  text("Puntaje: "+ score,30,50);
  
  
  if (gameState===PLAY){
    score = score + Math.round(getFrameRate()/60);
    ground.velocityX = -(6 + 3*score/100);
    
    if((touches.length > 0 || keyDown("SPACE")) && gallo.y  >= height-120) {
      
      gallo.velocityY = -10;
       touches = [];
    }
    
    gallo.velocityY = gallo.velocityY + 0.8
  
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
  
    gallo.collide(invisibleGround);
    spawnClouds();
    spawnObstacles();
  
    if(obstaclesGroup.isTouching(gallo)){
        
        gameState = END;
    }
  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    
    //establecer velocidad para cada objeto del juego en 0
    ground.velocityX = 0;
    gallo.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    
    //cambiar la animación del trex
    gallo.changeAnimation("collided",gallo_collided);
    
    //establecer tiempo de vida a los objetos del juego para que nunca se destruyan.
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    if(touches.length>0 || keyDown("SPACE")) {      
      reset();
      touches = []
    }
  }

  if(mousePressedOver(restart)) {
    reset();

  }
  
  
  drawSprites();
}

function spawnClouds() {
  //escribir código aquí para aparecer nubes.
  if (frameCount % 60 === 0) {
    var cloud = createSprite(width+20,height-300,40,10);
    cloud.y = Math.round(random(100,220));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //asignar tiempo de vida a la variable
    cloud.lifetime = 300;
    
    //ajustar la profundidad.
    cloud.depth = gallo.depth;
    gallo.depth = gallo.depth+1;
    
    //agregar cada nube a un grupo.
    cloudsGroup.add(cloud);
  }
  
}

function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(1000,height-95,20,30);
    obstacle.setCollider('circle',0,0,45)
    // obstacle.debug = true
  
    obstacle.velocityX = -(6 + 3*score/100);
    
    //generar obstáculos aleatorios.
    var rand = Math.round(random(1,4));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;                
      default: break;
    }
    
    //asignar tamaño y tiempo de vida al obstáculo.           
    obstacle.scale = 0.3;
    obstacle.lifetime = 300;
    obstacle.depth = gallo.depth;
    gallo.depth +=1;
    //agregar cada obstáculo a cada grupo.
    obstaclesGroup.add(obstacle);
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  gallo.changeAnimation("running",gallo_running);
  
  score = 0;
  
}
