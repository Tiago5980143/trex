var trex, trex_correndo, trex_colidiu;
var solo, soloinvisivel, imagemdosolo;

var nuvem, grupodenuvens, imagemdanuvem;
var grupodeobstaculos, obstaculo1, obstaculo2, obstaculo3, obstaculo4, obstaculo5, obstaculo6;

var pontuacao;

var JOGAR = 1;
var ENCERRAR = 0;
var estadoJogo = JOGAR;

var fimDeJogo, reiniciar;
var imgFimDeJogo, imgReiniciar;

var somSalto, somMorte, somCheckPoint;



function preload(){
  //carrega a animação do trex no jogo
  trex_correndo = loadAnimation("trex1.png","trex3.png","trex4.png");
  
  //carrega a imagem do trex "morto" no jogo
  trex_colidiu = loadAnimation("trex_collided.png");
  
  //carrega a imagem do solo no jogo
  imagemdosolo = loadImage("ground2.png");
  
  //carrega a imagem das nuvens no jogo
  imagemdanuvem = loadImage("cloud.png");
  
  //carrega as imagens dos objetos no jogo
  obstaculo1 = loadImage("obstacle1.png");
  obstaculo2 = loadImage("obstacle2.png");
  obstaculo3 = loadImage("obstacle3.png");
  obstaculo4 = loadImage("obstacle4.png");
  obstaculo5 = loadImage("obstacle5.png");
  obstaculo6 = loadImage("obstacle6.png");
    
  //carrega as imagens de game-over/restart
  imgReiniciar = loadImage("restart.png");
  imgFimDeJogo = loadImage("gameOver.png");
  
  somSalto = loadSound("jump.mp3");
  somMorte= loadSound("die.mp3");
  somCheckPoint= loadSound("checkPoint.mp3");
  
}

function setup() {
  //cria a tela
  createCanvas(600, 200);

  
  //define o trex
  trex = createSprite(50,180,20,50);
  trex.addAnimation("running", trex_correndo);
  trex.addAnimation("collided" , trex_colidiu);
  trex.scale = 0.5;
  trex.setCollider("circle",0,0,40);
  //trex.debug = true; - faz a hit circle aparecer
  
  //define o solo
  solo = createSprite(200,180,400,20);
  solo.addImage("ground",imagemdosolo);
  
  //define o solo invisivel
  soloinvisivel = createSprite(200,190,400,10);
  soloinvisivel.visible = false;
   
  //define os grupos
  grupodeobstaculos = createGroup();
  grupodenuvens = createGroup();
  
  //atribui valor 0 para a pontuação
  pontuacao = 0;
  
  //define mensagem de game over
  fimDeJogo = createSprite(300,100);
  fimDeJogo.addImage(imgFimDeJogo);
  fimDeJogo.scale = 0.5;
  
  //define botão restart
  reiniciar = createSprite(300,140);
  reiniciar.addImage(imgReiniciar);
  reiniciar.scale = 0.5;
  
  
}

function draw() {
  //define a cor do fundo
  background(180);
  
  //exibindo pontuação
  text("Pontuação: "+ pontuacao, 500,50);
    
  //console.log("modo: ",estadoJogo);
  
  if(estadoJogo === JOGAR){
    
    //tirar visibilidade imagens
    fimDeJogo.visible = false;
    reiniciar.visible = false;
    
    //mover o solo
    solo.velocityX = -4;
    
    //marcando pontuação
    pontuacao = pontuacao + Math.round(frameCount/60);
    
    if(pontuacao> 0 && pontuacao %100 === 0){
      somCheckPoint.play();
    }
    
    //faz o solo "infinito", o solo se repete
    if (solo.x < 0){
      solo.x = solo.width/2;
    }
    
    //saltar quando a tecla de espaço é pressionada
    if(keyDown("space")&& trex.y >= 150) {
       trex.velocityY = -13;
      
       somSalto.play();
    }
  
    //adicionar gravidade
    trex.velocityY = trex.velocityY + 0.8
   
    //gerar as nuvens
    gerarNuvens();
  
    //gerar obstáculos no solo
    gerarObstaculos();
    
    //se o obstaculo toca no trex o estado do jogo muda
    if(grupodeobstaculos.isTouching(trex)){
        estadoJogo = ENCERRAR;
        somMorte.play();
    }
    
    
  }
    else if (estadoJogo === ENCERRAR) {
       
      
      //adicionar visibilidade imagens
      fimDeJogo.visible = true;
      reiniciar.visible = true;
      
      //atribui a velocidade 0 para o solo
      solo.velocityX = 0;
      //atribui a velocidade 0 para o trex
      trex.velocityY = 0;
     
      //altera a animação do Trex
      trex.changeAnimation("collided", trex_colidiu);
     
      //define o tempo de vida dos objetos do jogo para que nunca sejam destruídos
      grupodeobstaculos.setLifetimeEach(-1);
      grupodenuvens.setLifetimeEach(-1);
     
       //atribui a velocidade 0 aos objetos
      grupodeobstaculos.setVelocityXEach(0);
      grupodenuvens.setVelocityXEach(0); 
      
      if (mousePressedOver(reiniciar)){
        //console.log("funcionou");
        reset();
      }
      
    }

  
  //evita que o trex caia do solo
  trex.collide(soloinvisivel);

  //desenha as sprites
  drawSprites();
}

function gerarObstaculos(){
  
  //vai dividir o frameCount por 60
  //quando o resto da divisao for 0 cria uma sprite nuvem
 if (frameCount % 60 === 0){
   var obstaculo = createSprite(400,165,10,40);
  obstaculo.velocityX = -6;
      
    //gerar obstáculos aleatórios
    var rand = Math.round(random(1,6));
   //switch = troca
    switch(rand) {
      case 1: obstaculo.addImage(obstaculo1);
              break;
      case 2: obstaculo.addImage(obstaculo2);
              break;
      case 3: obstaculo.addImage(obstaculo3);
              break;
      case 4: obstaculo.addImage(obstaculo4);
              break;
      case 5: obstaculo.addImage(obstaculo5);
              break;
      case 6: obstaculo.addImage(obstaculo6);
              break;
      default: break;
    }
   
    //atribuir escala e tempo de duração ao obstáculo     
    obstaculo.scale = 0.5;
    obstaculo.lifetime = 300;
   
    //adicionar cada obstáculo ao grupo
    grupodeobstaculos.add(obstaculo);
   
  }
}

function gerarNuvens() {
  
  if (frameCount % 60 === 0) {
    nuvem = createSprite(600,100,40,10);
    nuvem.y = Math.round(random(10,60));
    nuvem.addImage(imagemdanuvem);
    nuvem.scale = 0.5;
    nuvem.velocityX = -3;
    
    //atribuir tempo de duração à variável
    nuvem.lifetime = 200; 
    
    //ajustando a profundidade
    nuvem.depth = trex.depth;
    trex.depth = trex.depth + 1;
        
    //adiciondo nuvem ao grupo
    grupodenuvens.add(nuvem);
    
  }
}

function reset(){

  estadoJogo = JOGAR;
  
    fimDeJogo.visible = false;
    reiniciar.visible = false;
  
  grupodeobstaculos.destroyEach();
  grupodenuvens.destroyEach();
  
 trex.changeAnimation("running",trex_correndo);
  
  pontuacao = 0;
  
}
