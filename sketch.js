var JOGAR = 1;
var ENCERRAR = 0;
var estadoJogo = JOGAR;

var trex, trex_correndo, trex_colidiu;
var solo, soloInvisivel, imagemDoSolo;

var grupoDeNuvens, imagemDaNuvem;
var grupodeobstaculos, obstaculo1, obstaculo2, obstaculo3, obstaculo4, obstaculo5, obstaculo6;

var pontuacao=0;

var fimDeJogo, reiniciar;



function preload(){
  trex_correndo =   loadAnimation("menino1.png","menino2.png","menino3.png");
  trex_colidiu = loadAnimation("menino4.png");
  
  imagemDoSolo = loadImage("ground2.png");
  
  imagemDaNuvem = loadImage("cloud.png");
  
  obstaculo1 = loadImage("caixa.png");
  
  
  imgFimDeJogo = loadImage("gameOver.png");
  imgReiniciar = loadImage("restart.png");
}

function setup() {
  createCanvas(600, 200);
  
  trex = createSprite(50,180,20,50);
  
  trex.addAnimation("running", trex_correndo);
  trex.addAnimation("collided", trex_colidiu);
  trex.scale = 0.5;
  
  solo = createSprite(200,180,400,20);
  solo.addImage("ground",imagemDoSolo);
  solo.x = solo.width /2;
  solo.velocityX = -(6 + 3*pontuacao/100);
  
  fimDeJogo = createSprite(300,100);
  fimDeJogo.addImage(imgFimDeJogo);
  
  reiniciar = createSprite(300,140);
  reiniciar.addImage(imgReiniciar);
  
  fimDeJogo.scale = 0.5;
  reiniciar.scale = 0.5;

  fimDeJogo.visible = false;
  reiniciar.visible = false;
  
  soloInvisivel = createSprite(200,190,400,10);
  soloInvisivel.visible = false;
  
  grupoDeNuvens = new Group();
  grupoDeObstaculos = new Group();
  
  pontuacao = 0;
}

function draw() {
  //trex.debug = true;
  background(255);
  text("Pontuação: "+ pontuacao, 500,50);
  
  if (estadoJogo === JOGAR){
    pontuacao = pontuacao + Math.round(getFrameRate()/60);
    solo.velocityX = -(6 + 3*pontuacao/100);
  
    if(keyDown("space") && trex.y >= 200) {
      trex.velocityY = -12;
    }
  
    trex.velocityY = trex.velocityY + 0.8
  
    if (solo.x < 0){
      solo.x = solo.width/2;
    }
  
    trex.collide(soloInvisivel);
    gerarNuvens();
    gerarObstaculos();
  
    if(grupoDeObstaculos.isTouching(trex)){
        estadoJogo = ENCERRAR;
    }
  }
  else if (estadoJogo === ENCERRAR) {
    fimDeJogo.visible = true;
    reiniciar.visible = true;
    
    //define velocidade de cada objeto do jogo como 0
    solo.velocityX = 0;
    trex.velocityY = 0;
    grupoDeObstaculos.setVelocityXEach(0);
    grupoDeNuvens.setVelocityXEach(0);
    
    //altera a animação do Trex
    trex.changeAnimation("collided",trex_colidiu);
    
    //define o tempo de vida dos objetos do jogo para que nunca sejam destruídos
    grupoDeObstaculos.setLifetimeEach(-1);
    grupoDeNuvens.setLifetimeEach(-1);
    
    if(mousePressedOver(reiniciar)) {
      reset();
    }
  }
  
  
  drawSprites();
}

function gerarNuvens() {
  //escreva o código aqui para gerar as nuvens 
  if (frameCount % 60 === 0) {
    nuvem = createSprite(600,120,40,10);
    nuvem.y = Math.round(random(80,120));
    nuvem.addImage(imagemDaNuvem);
    nuvem.scale = 0.5;
    nuvem.velocityX = -3;
    
     //atribuir tempo de duração à variável
    nuvem.lifetime = 200; 
    
    //ajustando a profundidade
    nuvem.depth = trex.depth;
    trex.depth = trex.depth + 1;
        
    //adicionando nuvem ao grupo
   grupoDeNuvens.add(nuvem);
  }
  
}

function gerarObstaculos() {
  if(frameCount % 60 === 0) {
    var obstaculo = createSprite(600,165,10,40);
    //obstaculo.debug = true;
    obstaculo.velocityX = -(6 + 3*pontuacao/100);
    obstaculo.addImage(obstaculo1)
    
    
    //atribuir escala e tempo de duração ao obstáculo           
    obstaculo.scale = 0.07;
    obstaculo.lifetime = 300;
    //adicionar cada obstáculo ao grupo
    grupoDeObstaculos.add(obstaculo);
  }
}

function reset(){
  estadoJogo = JOGAR;
  fimDeJogo.visible = false;
  reiniciar.visible = false;
  
  grupoDeObstaculos.destroyEach();
  grupoDeNuvens.destroyEach();
  
  trex.changeAnimation("running",trex_correndo);
  
 
  
  pontuacao = 0;
  
}