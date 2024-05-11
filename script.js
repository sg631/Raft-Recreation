//Init
import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();

renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

renderer.domElement.style.position = "absolute";
renderer.domElement.style.left = "0px";
renderer.domElement.style.top = "0px";

const fogColor = 0x87ceeb; // Set fog color to match the background color
scene.fog = new THREE.Fog(fogColor, 1, 15); // Linear fog

renderer.setClearColor(0x87ceeb); // Set background color to light blue

const textureLoader = new THREE.TextureLoader();

const waterTexture = textureLoader.load('water.jpg');
const woodTexture = textureLoader.load('wood.jpg');
const plankTexture = textureLoader.load('plank.jpeg')
const scrapTexture = textureLoader.load('scrap.jpg');
const crateTexture = textureLoader.load('cratetexture.jpg');
const leafTexture = textureLoader.load('leaf.jpg')

// Recolor the water texture to blue
waterTexture.encoding = THREE.sRGBEncoding;
waterTexture.anisotropy = 16;
//Set the repeat to be very small so the water looks detailed

var raftSpeed = 0.02; // Set the speed of the raft
var raftDirection = new THREE.Vector3(1, 0, 0); // Set the direction of the raft

//----------Code Here--------
var xvelocity = 0;
var yvelocity = 0;
var zvelocity = 0;
const inventorySize = 10;


function winAchievement(achievement) {
  const achievementConfig = {
    'trash': {
      icon: 'placeholder',
      displayText: 'You are.. TRASH.. sorry wrong achievement.. You picked up.. Trash!'
    },
    'smiley': {
      icon: 'smiley!.jpeg',
      displayText: 'EXTREMELY EXTREMELY RARE: Smiley! You have a 0.00001% (1/10,000,000) chance of getting this achievement and item every frame. Keep the item and treasure it'
    }
  };

  if (!localStorage.getItem(achievement)) { // Check if achievement has not been unlocked
    const notificationBar = document.createElement('div');
    notificationBar.style.position = 'fixed';
    notificationBar.style.top = '0';
    notificationBar.style.left = '0';
    notificationBar.style.width = '100%';
    notificationBar.style.padding = '10px';
    notificationBar.style.backgroundColor = 'rgba(255, 215, 0, 0.8)';
    notificationBar.style.color = 'black';
    notificationBar.style.fontSize = '20px';
    notificationBar.style.textAlign = 'center';
    notificationBar.style.zIndex = '9999';
    notificationBar.style.display = 'none';
    const achievementIcon = document.createElement('img');
    achievementIcon.src = achievementConfig[achievement].icon;
    achievementIcon.style.width = '50px';
    achievementIcon.style.height = '50px';
    achievementIcon.style.marginRight = '10px';
    notificationBar.appendChild(achievementIcon);

    const achievementText = document.createElement('span');
    achievementText.textContent = achievementConfig[achievement].displayText;
    notificationBar.appendChild(achievementText);

    document.body.appendChild(notificationBar);

    setTimeout(() => {
      document.body.removeChild(notificationBar);
    }, 5000); // Auto-dismiss after 5 seconds

    localStorage.setItem(achievement, true); // Mark achievement as unlocked
  }
}
function customAlert(message, parameters, ...buttons) {
  const alertContainer = document.createElement('div');
  alertContainer.style.position = 'absolute';
  alertContainer.style.top = '50%';
  alertContainer.style.left = '50%';
  alertContainer.style.transform = 'translate(-50%, -50%)';
  alertContainer.style.padding = '20px';
  alertContainer.style.background = 'rgba(255, 255, 255, 0.8)';
  alertContainer.style.border = '2px solid black';
  alertContainer.style.zIndex = '999';
  //Take the parameters string and detect what parameters there are, in the format "parameter1: value1, value, etc.;parameter2: value2, value, etc."
  const parametersArray = parameters.split(';');
  const parameterObjects = {};
  for (const parameter of parametersArray){
    const [parameterName, parameterValue] = parameter.split(':');
    parameterObjects[parameterName] = parameterValue;
  }
  //Get the custom parameter "auto-dismiss" and if it is defined delete the message after the value seconds
  const autoDismiss = parameterObjects['auto-dismiss'];
  if (autoDismiss){
    setTimeout(() => {
      alertContainer.remove();
    }, autoDismiss * 1000);
  }
  const messageText = document.createElement('p');
  messageText.textContent = message;
  alertContainer.appendChild(messageText);

  buttons.forEach(buttonLabel => {
    const button = document.createElement('button');
    button.textContent = buttonLabel;
    button.style.marginTop = '10px';
    button.style.padding = '5px 10px';
    button.style.background = 'lightgray';
    button.style.cursor = 'pointer';
    button.addEventListener('click', () => {
      document.body.removeChild(alertContainer);
    });
    alertContainer.appendChild(button);
  });

  document.body.appendChild(alertContainer);
}
const waterGeometry = new THREE.PlaneGeometry(100, 100, 100, 100);
waterGeometry.rotateX(-Math.PI / 2); // Rotate by -90 degrees around the X-axis
//Initialize the inventory system and UI
var inventory = [];
var selectedSlot = 0;
addItemToInventory("plastic_hook", 1)
// Create a function to add items to the inventory
const allowedItemTypes = ['wood', /*Added wood.jpg to test*/'wood.jpg', 'stone', 'plastic', 'leaf', 'sand', 'clay', 'nail' , 'copper', 'scrap', 'lead', 'tin', 'aluminum', 'coal',]
// Create a function to add items to the inventory
function addItemToInventory(item, count){
  // Check if the item is defined and included in allowedItemTypes
  if (item) {
    // Check if the item is already in the inventory
    let index = inventory.indexOf(item);

    if (index !== -1){
      // If it is, increment the count
      inventory[index + 1] += count;
    } else {
      // If it is not, add it to the inventory
      inventory.push(item);
      inventory.push(count);
    }
  }
}

//Function to update Inventory UI
// Create a container for the inventory UI
const inventoryContainer = document.createElement('div');
inventoryContainer.style.position = 'absolute';
inventoryContainer.style.bottom = '10px';
inventoryContainer.style.right = '10px';
inventoryContainer.style.padding = '10px';
inventoryContainer.style.background = 'rgba(255, 255, 255, 0.8)';
document.body.appendChild(inventoryContainer);

// Function to initialize and update Inventory UI
// Initialize the inventory icons array
const inventoryConfig = {
  'wood': {
    imagePath: 'plank.jpg',
    displayName: 'Wood Plank',
    isTool: false,
    durability: 0,
  },
  'scrap': {
    imagePath: 'scrap.jpg',
    displayName: 'Scrap',
    isTool: true,
    durability: 50,
  },
  'stone': {
    imagePath: 'stone_icon.jpg',
    displayName: 'Stone',
    isTool: false,
    durability: 0,
  },
  'leaf': {
    imagePath: 'leaf.jpg',
    displayName: 'Leaf',
    isTool: false,
    durability: 0,
  },
  'plastic': {
    imagePath: 'plastic.jpg',
    displayName: 'Plastic',
    isTool: false,
    durability: 0,
  },
  'smiley': {
    imagePath: 'smiley!.jpeg',
    displayName: 'Smiley Face',
    isTool: false,
    durability: 0,
  },
  'plastic_hook': {
    imagePath: 'placeholder',
    displayName: 'Plastic Hook',
    isTool: true,
    durability: 100,
  }
  // Add more items as needed
};
// Function to get the image path for an item
// Function to get the image path for an item
// Function to get the image path for an item
function getItemImagePath(item) {
  const variationKey = `${item}_${selectedSlot + 1}`; // Update key to match item names and selected slot

  if (inventoryConfig[variationKey]) {
    return inventoryConfig[variationKey].imagePath; // Access imagePath property of the item object
  } else if (inventoryConfig[item]) {
    return inventoryConfig[item].imagePath; // Access imagePath property of the item object
  } else {
    return 'undefined_ico.png'; // Return a placeholder image path if the item is not found
  }
}

// Function to initialize and update Inventory UI with icons
function initializeInventoryUI() {
  const inventoryContainer = document.createElement('div');
  inventoryContainer.style.position = 'absolute';
  inventoryContainer.style.bottom = '10px';
  inventoryContainer.style.right = '10px';
  inventoryContainer.style.padding = '10px';
  inventoryContainer.style.height = "50px";
  inventoryContainer.style.width = "calc(100% - 40px)";
  inventoryContainer.style.background = 'rgba(255, 255, 255, 0.8)';
  inventoryContainer.style.color = "black";
  document.body.appendChild(inventoryContainer);

  window.inventoryContainer = inventoryContainer;

  updateInventoryUI();
}

// Function to update Inventory UI with icons
// Function to update Inventory UI with icons and count in a horizontal list
// Function to update Inventory UI with icons and durability bars for tools
// Function to update Inventory UI with icons and durability bars for tools
function updateInventoryUI() {
  window.inventoryContainer.innerHTML = '';

  for (let i = 0; i < inventory.length; i += 2) {
    const item = inventory[i];
    const count = inventory[i + 1];

    const slotDiv = document.createElement('div');
    slotDiv.style.display = 'inline-block';
    slotDiv.style.marginRight = '10px';
    slotDiv.style.padding = '5px';
    slotDiv.style.border = '1px solid transparent';

    if (i === selectedSlot * 2) {
      slotDiv.style.border = '1px solid blue'; // Add blue outline to the selected slot
    }

    const iconImg = document.createElement('img');
    const imagePath = getItemImagePath(item);
    iconImg.src = imagePath;
    iconImg.style.width = '24px'; // Set the width of the icon image
    iconImg.style.height = '24px'; // Set the height of the icon image
    slotDiv.appendChild(iconImg);

    const textSpan = document.createElement('span');
    textSpan.textContent = `x${count}`;
    slotDiv.appendChild(textSpan);

    // Check if inventoryConfig for the item is defined before accessing isTool property
    if (inventoryConfig[item] && inventoryConfig[item].isTool && inventoryConfig[item].durability) {
      const durabilityBar = document.createElement('div');
      durabilityBar.style.width = '60px'; // Set the width of the durability bar
      durabilityBar.style.height = '10px'; // Set the height of the durability bar
      durabilityBar.style.backgroundColor = 'lightgray'; // Set the background color of the durability bar
      durabilityBar.style.border = '1px solid black'; // Add border to the durability bar

      const durabilityProgress = document.createElement('div');
      const durabilityPercentage = (inventoryConfig[item].durability / 100) * 100; // Calculate durability percentage
      durabilityProgress.style.width = `${durabilityPercentage}%`; // Set the width of the durability progress bar
      durabilityProgress.style.height = '100%'; // Set the height of the durability progress bar
      durabilityProgress.style.backgroundColor = 'lightgreen'; // Set the background color of the durability progress bar

      durabilityBar.appendChild(durabilityProgress);
      slotDiv.appendChild(durabilityBar);
    }

    window.inventoryContainer.appendChild(slotDiv);
  }
}

// Update selected slot based on number keys
document.addEventListener('keydown', (event) => {
  if (event.key >= '1' && event.key <= '9') {
    selectedSlot = parseInt(event.key) - 1; // Set selected slot based on number key pressed
    updateInventoryUI(); // Update the UI to reflect the selected slot
  }
});

// Call the initializeInventoryUI function to set up the UI
initializeInventoryUI();

// Initialize the vertices array
waterGeometry.vertices = [];

// Populate the vertices array
for (let i = 0; i <= 100; i++) {
    for (let j = 0; j <= 100; j++) {
        const vertex = new THREE.Vector3();
        vertex.x = (j - 50);
        vertex.z = (i - 50);
        waterGeometry.vertices.push(vertex);
    }
}
var underwaterFogColor = 0x0000ff; // Intense blue color
const waterMaterial = new THREE.MeshBasicMaterial({
  map: waterTexture,
  side: THREE.DoubleSide,
  opacity: 0.7,
  transparent: true,
  depthWrite: false,
  color: 0x0000ff,
}); // Set color to light blue
const water = new THREE.Mesh(waterGeometry, waterMaterial);
scene.add(water);
water.position.y = -3;
const sun = new THREE.DirectionalLight(0xffffff, 1);


function updateFogColor() {
    // Check if the player is underwater (below a certain y-coordinate)
    if (player.position.y < -3) {
        renderer.setClearColor(underwaterFogColor);
        //intensify fog using exponential
        gravityFactor = 0.004;
        scene.fog = new THREE.FogExp2(underwaterFogColor, 0.5);
        scene.fog.color.set(underwaterFogColor); // Set intense blue color for underwater fog
    } else {
        renderer.setClearColor(0x87ceeb);
        gravityFactor = 0.02;
        scene.fog = new THREE.Fog(fogColor, 1, 15)
        scene.fog.color.set(fogColor); // Set default fog color when not underwater
    }
}

function handleObstacleCollisions(player, obstacles, minDistance, speed, gravityFactor) {
  const playerVelocity = new THREE.Vector3(xvelocity, yvelocity, zvelocity);
  const playerVelocityMagnitude = playerVelocity.length();

  let isColliding = false;

  for (const obstacle of obstacles) {
    const distanceToObstacle = player.position.distanceTo(obstacle.position);

    if (distanceToObstacle <= 1) {
      const direction = new THREE.Vector3();
      obstacle.getWorldPosition(direction);
      direction.sub(player.position).normalize();

      let bounceBackDistance = calculateBounceBackDistance(playerVelocityMagnitude, speed);
      if (distanceToObstacle < minDistance) {
        bounceBackDistance = -minDistance; // Ensure player stays at minimum distance
      }

      // Move the player away from the obstacle with variable bounce-back distance
      player.position.add(direction.multiplyScalar(bounceBackDistance));

      isColliding = true;
    }
  }

  if (isColliding) {
    yvelocity = 0; // Reset y velocity on collision
  } else {
    yvelocity -= gravityFactor; // Apply gravity if not colliding
  }
}

var gravityFactor = 0.01; // Adjust gravity strength as needed
//pointerlock
document.addEventListener( 'click', (event) => {
  event.preventDefault();
  document.body.requestPointerLock();
});
const sensitivity = 0.005;
document.addEventListener('mousemove', (event) => {
    //player first person shooter camera
    player.rotation.reorder('YXZ'); // Change rotation order to YXZ
    player.rotation.y -= event.movementX * sensitivity; // Update y rotation on the y-axis
    player.rotation.x -= event.movementY * sensitivity; // Update x rotation on the x-axis
    player.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, player.rotation.x)); // Limit x rotation
});
const speed = 0.05
//adjust player movement to change respective velocity values base on the direction of the player
const maxSpeed = 0.05; // Set your desired maximum speed value here
var keys = {
  w:false,
  a:false,
  s:false,
  d:false,
  " ":false,
  q:false,
  e:false,
  shift:false,
  tabKey:false
}
document.addEventListener('keydown', (event) => {
  keys[event.key] = true;
})
document.addEventListener('keyup', (event) => {
  keys[event.key] = false;
})
//adjust player movement to change respective velocity values based on the direction of the player
function updatePlayerMovement(){
  if (keys["w"]){
    if ((Math.abs(xvelocity) < maxSpeed)  && (Math.abs(zvelocity) < maxSpeed)){
      xvelocity -= Math.sin(player.rotation.y) * speed;
      zvelocity -= Math.cos(player.rotation.y) * speed;
    }
  }
  if (keys["s"]){
    if ((Math.abs(xvelocity) < maxSpeed) && (Math.abs(zvelocity) < maxSpeed)){
      xvelocity += Math.sin(player.rotation.y) * speed;
      zvelocity += Math.cos(player.rotation.y) * speed;
    }
  }
  if (keys["a"]){
    xvelocity -= Math.sin(player.rotation.y + Math.PI / 2) * speed;
    zvelocity -= Math.cos(player.rotation.y + Math.PI / 2) * speed;
  }
  if (keys["d"]){
    xvelocity += Math.sin(player.rotation.y + Math.PI / 2) * speed;
    zvelocity += Math.cos(player.rotation.y + Math.PI / 2) * speed;
  }
  if (keys[" "]) {
    if (yvelocity == 0){
      yvelocity += speed * 5;
    } else if (player.position.y < -3){
      yvelocity += speed * 0.5;
    }
  }
  
    // Limit player speed
    xvelocity = Math.min(maxSpeed, Math.max(-maxSpeed, xvelocity));
    zvelocity = Math.min(maxSpeed, Math.max(-maxSpeed, zvelocity));
}

const player = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({ color: 0x00ff00 }));
scene.add(player)
player.position.y = -2.05;
//make the raft an array with each object having collision and having each object with their geometry and material defined, thereby allowing a build system to be built in the future
const raft = []
const obstacles = [];
const trash = [];
raft.push(new THREE.Mesh(new THREE.BoxGeometry(1, 0.5, 1), new THREE.MeshBasicMaterial({map: woodTexture})))


function calculateBounceBackDistance(velocityMagnitude, speed) {
  // Calculate the bounce-back distance based on the player's velocity magnitude
  let bounceBackFactor = 1; // Adjust this factor as needed
  let bounceBackDistance = -speed * bounceBackFactor * (velocityMagnitude / maxSpeed);

  return bounceBackDistance;
}

const minDistance = 0.1; // Set your desired minimum distance to prevent clipping

// Define variables for pause menu elements
let pauseMenu = document.createElement("div");
pauseMenu.style.position = "fixed";
pauseMenu.style.top = "50%";
pauseMenu.style.left = "50%";
pauseMenu.style.transform = "translate(-50%, -50%)";
pauseMenu.style.padding = "20px";
pauseMenu.style.background = "rgba(255, 255, 255, 0.8)";
pauseMenu.style.border = "2px solid black";
pauseMenu.style.zIndex = "999";
pauseMenu.style.display = "none"; // Initially hide pause menu

// Resume button
let resumeButton = document.createElement("button");
resumeButton.textContent = "Resume";
resumeButton.style.marginTop = "10px";
resumeButton.style.padding = "5px 10px";
resumeButton.style.background = "lightgray";
resumeButton.style.cursor = "pointer";
resumeButton.addEventListener("click", () => {
    pauseMenu.style.display = "none";
    // Add any logic to resume the game if needed
});
pauseMenu.appendChild(resumeButton);

// Save button
function saveGame(){
      // Implement save functionality using localStorage
      // For example:
      localStorage.setItem("gameState", JSON.stringify({
          playerPosition: player.position,
          playerRotation: player.rotation,
          playerInventory: inventory,
          /*/playerRaft: raft,
          raftDirection: raftDirection,
          raftSpeed: raftSpeed,*/
          // Add other game state variables as needed
          // Add other relevant game state data to save
      }));
}
//set a timer to save the game every two minutes
setInterval(() => {saveGame();customAlert("Saved!", "auto-dismiss: 2")}, 60000);

//make a save button
let saveButton = document.createElement("button");
saveButton.textContent = "Save";
saveButton.style.marginTop = "10px";
saveButton.style.padding = "5px 10px";
saveButton.style.background = "lightgray";
saveButton.style.cursor = "pointer";
saveButton.addEventListener("click", () => saveGame());
pauseMenu.appendChild(saveButton);

// Quit button
let quitButton = document.createElement("button");
quitButton.textContent = "Quit";
quitButton.style.marginTop = "10px";
quitButton.style.padding = "5px 10px";
quitButton.style.background = "lightgray";
quitButton.style.cursor = "pointer";
quitButton.addEventListener("click", () => {
    // Show confirmation dialog
    if (confirm("Are you sure you want to quit?")) {
        // Close the page
        if (confirm("Do you want to save before quitting?")){
          saveGame()
        }
        window.close();
    }
});
pauseMenu.appendChild(quitButton);

// Add pause menu to the document body
document.body.appendChild(pauseMenu);

// Function to toggle pause menu visibility
function togglePauseMenu() {
    pauseMenu.style.display = pauseMenu.style.display === "none" ? "block" : "none";
}

// Event listener for pausing the game
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        togglePauseMenu();
    }
});

// Function to load game state from localStorage
function loadGame() {
    let gameState = localStorage.getItem("gameState");
    if (gameState) {
        gameState = JSON.parse(gameState);

        // Apply player position and rotation
        if (gameState.playerPosition) {
            player.position.copy(gameState.playerPosition);
        }
        if (gameState.playerRotation) {
            player.rotation.copy(gameState.playerRotation);
        }

        // Apply player inventory
        if (gameState.playerInventory) {
            inventory = gameState.playerInventory;
            updateInventoryUI(); // Update inventory UI after loading inventory
        }
        // Apply player raft
        /*if (gameState.playerRaft) {
            raft.length = 0; // Clear existing raft
            for (const meshData of gameState.playerRaft) {
                // Check if meshData is valid and create a new mesh object
                if (meshData && meshData.geometry && meshData.material) {
                    const mesh = new THREE.Mesh(meshData.geometry, meshData.material);
                    // Add the mesh to the raft array
                    raft.push(mesh);
                } else {
                    console.error("Invalid mesh data:", meshData);
                }
            }
        }*/
        // Apply raft direction
        if (gameState.raftDirection){
          raftDirection = gameState.raftDirection;
        }
        // Apply raft speed
        if (gameState.raftSpeed){
          raftSpeed = gameState.raftSpeed;
        }

        // Add other relevant game state variables and apply them here

        // Example:
        // if (gameState.otherVariable) {
        //     otherVariable = gameState.otherVariable;
        // }

        // Example for raft:
        // if (gameState.raftPosition) {
        //     raft.position.copy(gameState.raftPosition);
        // }
    }
}


// Call loadGameState function when your game starts or when needed
loadGame();

// Function to initialize crafting menu UI
function initializeCraftingMenu() {
  const craftingMenu = document.createElement('div');
  craftingMenu.style.position = 'absolute';
  craftingMenu.style.top = '50%';
  craftingMenu.style.left = '50%';
  craftingMenu.style.transform = 'translate(-50%, -50%)';
  craftingMenu.style.padding = '20px';
  craftingMenu.style.background = 'rgba(255, 255, 255, 0.8)';
  craftingMenu.style.border = '2px solid black';
  craftingMenu.style.zIndex = '999';
  craftingMenu.style.display = 'none'; // Initially hide crafting menu
  craftingMenu.id = "craftingMenu";

  // Add crafting recipes to the menu
  for (const recipe in craftingRecipes) {
    const recipeElement = document.createElement('div');
    recipeElement.textContent = recipe;
    recipeElement.style.marginTop = '10px';
    recipeElement.style.cursor = 'pointer';
    recipeElement.addEventListener('click', () => craftItem(recipe));
    craftingMenu.appendChild(recipeElement);
  }

  document.body.appendChild(craftingMenu);
}

// Define crafting recipes
const craftingRecipes = {
  'Wood to Stone Test': {
    materials: { 'wood': 5 },
    result: 'stone'
  },
  // Add more crafting recipes as needed
};
// Call initializeCraftingMenu to set up the crafting menu
initializeCraftingMenu();
function toggleCraftingMenu() {
  document.getElementById("craftingMenu").style.display = craftingMenu.style.display === 'none' ? 'block' : 'none';
}


// Event listener for z key press
document.addEventListener("keydown", (e) => {
    if (e.key === "z") {
        toggleCraftingMenu();
        e.preventDefault();
    }
});

// Function to handle crafting logic
function craftItem(recipeName) {
    const materials = craftingRecipes[recipeName].materials;

    // Check if the player has enough materials in their inventory
    for (const material in materials) {
        if (inventory[material] >= materials[material]) {
            customAlert("Insufficient materials to craft " + recipeName, "auto-dismiss: 2");
            return; // Stop crafting if materials are insufficient
        }
    }

    // Subtract materials from inventory
    for (const material in materials) {
        inventory[material] -= materials[material];
    }

    // Add crafted item to inventory
    addItemToInventory(craftingRecipes[recipeName].result, 1);

    // Update inventory UI
    updateInventoryUI();

    // Display crafting success message
    customAlert("Crafted " + recipeName, "auto-dismiss: 2");
}





function animate() {
  requestAnimationFrame(animate);
  // Handle collisions with obstacles and gravity effect
  handleObstacleCollisions(player, obstacles, minDistance, speed, gravityFactor);

  // Update player position based on velocity
  player.position.add(new THREE.Vector3(xvelocity, yvelocity, zvelocity));
  //addItemToInventory("inventory test item", 1)
  //console.log(inventory.toString())
  // Update player and camera velocity damping
  xvelocity *= 0.7; // Adjust damping factor for player movement
  yvelocity *= 0.7;
  zvelocity *= 0.7;

  // Update camera position and rotation
  camera.position.copy(player.position);
  camera.rotation.copy(player.rotation);
  raft.forEach((element) => {
    //check if the element has already been added to the scene
    if (!scene.children.includes(element)){
      scene.add(element);
      obstacles.push(element);
      element.position.y = -3;
    }
  });
  // Render the scene
  renderer.render(scene, camera);
  updateFogColor();
  updatePlayerMovement();
  //Randomly spawn grabbable planks and materials and junk that moves away from the player
  if (Math.random() < 0.1) {
    const leafMaterial = new THREE.MeshBasicMaterial({ 
      map: leafTexture,
      transparent: true, // Enable transparency
      alphaTest: 0.5, // Set the alpha test threshold value (adjust as needed)
      side: THREE.DoubleSide, // Render both sides of the material
    });
      const plank = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.05, 0.5), new THREE.MeshBasicMaterial({ map: woodTexture}));
    plank.userData.type = "wood";
    const crate = new THREE.Mesh(new THREE.BoxGeometry(1, 2, 1), new THREE.MeshBasicMaterial({ map: crateTexture}));
    crate.userData.type = "crate";
    
    const leaf = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 0.5), leafMaterial);
    leaf.userData.type = "leaf";

      // Randomize offset in X and Z directions
      var offsetX = (Math.random() - 0.5) * 50; // Adjust multiplier to widen the range
      var offsetZ = (Math.random() - 0.5) * 50; // Adjust multiplier to widen the range

      // Calculate the spawn position based on raft direction and speed, with the random offsets
      const firstSpawnPosition = raftDirection.clone().multiplyScalar(raftSpeed * 200); // Far behind the player
      firstSpawnPosition.x += offsetX;
      firstSpawnPosition.z += offsetZ;
      firstSpawnPosition.y = -3; // Ensure it spawns at ocean level
    var offsetX = (Math.random() - 0.5) * 50; // Adjust multiplier to widen the range
    var offsetZ = (Math.random() - 0.5) * 50; // Adjust multiplier to widen the range
    const secondSpawnPosition = raftDirection.clone().multiplyScalar(raftSpeed * 200); // Far behind the player
    secondSpawnPosition.x += offsetX;
    secondSpawnPosition.z += offsetZ;
    secondSpawnPosition.y = -3; // Ensure it spawns at ocean level
    var offsetX = (Math.random() - 0.5) * 50;
    var offsetZ = (Math.random() - 0.5) * 50;
    const thirdSpawnPosition = raftDirection.clone().multiplyScalar(raftSpeed * 200);
thirdSpawnPosition.x += offsetX;
    thirdSpawnPosition.z += offsetZ
    thirdSpawnPosition.y = -3; // Ensure it spawns at ocean level
    
      plank.position.copy(firstSpawnPosition);
      crate.position.copy(secondSpawnPosition);
      leaf.position.copy(thirdSpawnPosition);

      trash.push(plank);
      trash.push(leaf);
      scene.add(leaf)
      scene.add(plank);
      if (Math.random() < 0.01){
        trash.push(crate);
        scene.add(crate);
        if (Math.random() < 0.000001){
          addItemToInventory("smiley", 1);
          winAchievement("smiley")
        }
      }
  }

  // Update trash position and movement
  // Update trash position and movement
  trash.forEach((trashPiece, index) => {
      // Move trash away from the player and raft
      trashPiece.position.add(raftDirection.clone().multiplyScalar(raftSpeed));

      // Check if the trash piece is behind the fog
      if (trashPiece.position.distanceTo(player.position) > 20) {
          // Remove the trash piece from the scene
          scene.remove(trashPiece);
          trash.splice(index, 1);
      }
  });
  




  // Update trash position and movement
  trash.forEach((trashPiece) => {
      // Rotate trash
      trashPiece.rotation.x += raftSpeed;
      trashPiece.rotation.y += raftSpeed;

      // Move trash away from the player and raft
trashPiece.position.add(raftDirection.clone().multiplyScalar(raftSpeed));
      //The player can press e while looking at the trash from a close distance to pick it up, only if the player is looking at the trash using ray tracing
      if (player.position.distanceTo(trashPiece.position) < ((trashPiece.scale.x + trashPiece.scale.y + trashPiece.scale.z)/3 * 3) && player.rotation.y > -Math.PI / 2 && player.rotation.y < Math.PI / 2 && player.rotation.x > -Math.PI / 2 && player.rotation.x < Math.PI / 2){
        if (keys["e"]){
          scene.remove(trashPiece);
          trash.splice(trash.indexOf(trashPiece), 1);
          //add to inventory the type of trash picked up (use the type property unless its crate or barrel)
          //debug test
          console.log(trashPiece.userData.type)
          winAchievement("trash");
          const trashType = trashPiece.userData.type;
          //extra debug
          // addItemToInventory(trashType, 1)
          //If it is not a crate or barrel, add it to the inventory
          if (trashType != "crate" && trashType != "barrel"){
            //Check if the trashType is an allowed type
            if (inventory.length <= inventorySize){
              //Use function to add item to inventory
              addItemToInventory(trashType, 1);
            }
          }
          //If it is a barrel, add a random amount of each item to the inventory between 1 and 5
          if (trashType === "barrel"){
            const items = ["wood", "stone", "leaf"];
            const itemCounts = [Math.floor(Math.random() * 5) + 1, Math.floor(Math.random() * 5) + 1, Math.floor(Math.random() * 5) + 1];
            for (let i = 0; i < items.length; i++) {
              const item = items[i];
              const count = itemCounts[i];
              for (let j = 0; j < count; j++) {
                //Use function to add item to inventory
                addItemToInventory(item, 1);
              }
            }
          }
          //If it is a crate, add a random amount of each item to the inventory between 4 and 7
          if (trashType === "crate"){
            const items = ["wood", "stone", "leaf", "scrap"];
            const itemCounts = [Math.floor(Math.random() * 3) + 4, Math.floor(Math.random() * 3) + 4, Math.floor(Math.random() * 3) + 4];
            for (let i = 0; i < items.length; i++) {
              const item = items[i];
              const count = itemCounts[i];
              for (let j = 0; j < count; j++) {
                //Use function to add to inventory
                addItemToInventory(item, 1);
              }
            }
          }
          //Update inventory UI
          updateInventoryUI();
        }
      }
    
  });
  updateInventoryUI();
  
}

animate();