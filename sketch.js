 

var foodS = 0,timeS = 0, foodStock,dog,happydog,database;
var feedPet, addFood;
var fedTime, lastFed;
var foodObj;
var changeGameState,readGameState
var gameState = "Hungry";
var currentTime

function preload()
{
  //load images here
  dog1 = loadImage("virtual pet images/Dog.png")
  dog2 = loadImage("virtual pet images/happy dog.png")
  
}

function setup() {
	createCanvas(500, 500);
  
  
  

  database = firebase.database ();
  foodStock = database.ref("Food");
  foodStock.on("value",readFoodStock);
  fedTime = database.ref("FeedTime");
  fedTime.on("value",readTime);     

  readGameState = database.ref('gameState')
  readGameState.on("value",function(data){
    gameState = data.val()
});




  feedPet = createButton("Feed the Pet");
  addFood = createButton("Add Food for Pet");

  feedPet.position(500,100);
  feedPet.mousePressed(feedDog);
  addFood.position(600,100);
  addFood.mousePressed(addFoods);

  dog = createSprite(350,250,30,30)
  dog.addImage(dog1);
  dog.scale=0.2;

  foodObj = new food(foodS, timeS);
  
  console.log(foodS);
}

function draw() {  
  background(46,139,87)
  foodObj.updatefoodStock(foodS);


  fill(255,255,254);
  textSize(15);
  if(timeS >= 12){
    text("Last feed: "+timeS%12 + " PM", 80, 20);
  }else if (timeS == 0){
    text("Last feed: 12 AM", 80, 20);
  }else {
    text("Last feed: "+timeS+ "AM", 80, 20);
  }


  if(gameState !== "Hungry"){
    feedPet.hide()
    addFood.hide()
    //dog.remove()
  }else{
    feedPet.show()
    addFood.show()
    dog.addImage(dog1)
  }

  foodObj.display();
   currentTime = hour()
  if(currentTime == (timeS+1)){
    update("Playing")
    foodObj.garden()
  }else if(currentTime == (timeS +2)){
    update("Sleeping")
    foodObj.bedroom()
  }else if(currentTime > (timeS + 2) && currentTime <= (timeS + 4)){
     update("Bathing")
     foodObj.washroom();
  }else{
    update("Hungry")
    dog.addImage(dog1)
    
  }

  if(gameState === "Hungry"){

  }

  drawSprites();
  //add styles here
  fill("black")
  text("Food Remaining : "+foodS,150,150 )
  text("Time Fed : "+timeS,150,120 )
  //console.log(foodStock)

  
}

function update(x){
  database.ref('/').update({
    gameState: x
  })
}

function feedDog(){
  var newval = 0;
  dog.addImage(dog2);
  if (foodObj != null){
    
  foodObj.updatefoodStock(foodObj.getfoodStock()-1);
  if (foodObj.getfoodStock() <= 0){
    newval = 0;
  } else {
    newval = foodObj.getfoodStock();
  }
  
  database.ref('/').update({
    FeedTime:hour(),
    Food:newval
  })
} else {
  console.log("Food Object is null");
}
}

function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}

function readFoodStock(data){
  foodS = data.val();
}

function readTime(data){
  timeS = data.val();
}

function writeStock(x){
  if (x <= 0) {
    x = 0;
  } else {
    x = x - 1;
  }
  database.ref('/').update({
     Food:x
  })

}

