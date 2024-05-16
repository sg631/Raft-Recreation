//DEBUG FEATURES ENABLE/DISABLE
var sv_cheats = !1;
const customConsole_enabled = true;
//DEBUG FEATURES ENABLE/DISABLE

var customConsole_open = false;

//Init
import * as THREE from 'three';
//import { GLTFLoader } from '/loaders/GLTFLoader.js'

//const loader = new GLTFLoader();
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
const wilsonSkinTexture = textureLoader.load('wilsonskin.png');




const obstacles = [];
var health = 100;
var maxhealth = 100;
var thirst = 100;
var maxthirst = 100;
var hunger = 100;
var maxhunger = 100;
var stamina = 100;
var maxstamina = 100;

function handleSurvivalState(){
  if (thirst > 0){
    thirst -= 0.002;
  }
  if (hunger > 0){
    hunger -= 0.001;
  }
  if (health > 0 && thirst <= 0 && hunger <= 0){
    health -= 0.005;
  }
  if (keys["shift"]){
    if (stamina > 0){
      stamina -= 0.1
    }
  } else {
    if (stamina < maxstamina){
      stamina += 0.05
    }
  }
  if (stamina <= 0){
    stamina = 0;
  }
  if (stamina >= maxstamina){
    stamina = maxstamina;
  }
  if (health <= 0){
    health = 0;
  }
  if (thirst <= 0){
    thirst = 0;
  }
  if (hunger <= 0){
    hunger = 0;
  }
  
}
function updateSurvivalUI(){
  document.getElementById("healthbarfill").style.width = health.toString() + "%";
  document.getElementById("thirstbarfill").style.width = thirst.toString() + "%";
  document.getElementById("hungerbarfill").style.width = hunger.toString() + "%";
}
function initializeSurvivalUI(){

  var healthbar = document.createElement("div");
  healthbar.style.position = "absolute";
  healthbar.style.left = "10px";
  healthbar.style.bottom = "100px";
  healthbar.style.width = "calc(100% - 20px)";
  healthbar.style.height = "20px";
  healthbar.style.backgroundColor = "white";
  healthbar.style.border = "none";
  healthbar.style.borderRadius = "5px";
  healthbar.style.display = "flex";
  healthbar.style.justifyContent = "left";
  healthbar.style.alignItems = "center";
  healthbar.style.fontSize = "16px";
  healthbar.style.fontWeight = "bold";
  healthbar.style.color = "white";
  healthbar.style.textAlign = "center";
  healthbar.style.padding = "1px";
  healthbar.style.boxSizing = "border-box";
  healthbar.style.zIndex = "1";
  healthbar.style.pointerEvents = "none";
  healthbar.id = "healthbar"
  var healthbarFill = document.createElement("div");
  healthbarFill.style.width = "100%";
  healthbarFill.style.height = "100%";
  healthbarFill.style.backgroundColor = "green";
  healthbarFill.style.borderRadius = "5px";
  healthbarFill.id = "healthbarfill"
  healthbar.appendChild(healthbarFill);
  document.body.appendChild(healthbar);
  var healthbarIcon = document.createElement("img");
  healthbarIcon.src = "health_nobg.png";
  healthbarIcon.style.width = "20px";
  healthbarIcon.style.height = "20px";
  healthbarIcon.style.marginLeft = "5px";
  healthbar.appendChild(healthbarIcon);
  

  var thirstbar = document.createElement("div");
  thirstbar.style.position = "absolute";
  thirstbar.style.left = "10px";
  thirstbar.style.bottom = "125px";
  thirstbar.style.width = "calc(100% - 20px)";
  thirstbar.style.height = "20px";
  thirstbar.style.backgroundColor = "white";
  thirstbar.style.border = "none";
  thirstbar.style.borderRadius = "5px";
  thirstbar.style.display = "flex";
  thirstbar.style.justifyContent = "left";
  thirstbar.style.alignItems = "center";
  thirstbar.style.fontSize = "16px";
  thirstbar.style.fontWeight = "bold";
  thirstbar.style.color = "white";
  thirstbar.style.textAlign = "center";
  thirstbar.style.padding = "1px";
  thirstbar.style.boxSizing = "border-box";
  thirstbar.style.zIndex = "1";
  thirstbar.style.pointerEvents = "none";
  thirstbar.id = "thirstbar"
  var thirstbarFill = document.createElement("div");
  thirstbarFill.style.width = "100%";
  thirstbarFill.style.height = "100%";
  thirstbarFill.style.backgroundColor = "green";
  thirstbarFill.style.borderRadius = "5px";
  thirstbarFill.id = "thirstbarfill"
  thirstbar.appendChild(thirstbarFill);
  document.body.appendChild(thirstbar);
  var thirstbarIcon = document.createElement("img");
  thirstbarIcon.src = "thirst_nobg.png";
  thirstbarIcon.style.width = "20px";
  thirstbarIcon.style.height = "20px";
  thirstbarIcon.style.marginLeft = "5px";
  thirstbar.appendChild(thirstbarIcon);

  var hungerbar = document.createElement("div");
  hungerbar.style.position = "absolute";
  hungerbar.style.left = "10px";
  hungerbar.style.bottom = "150px";
  hungerbar.style.width = "calc(100% - 20px)";
  hungerbar.style.height = "20px";
  hungerbar.style.backgroundColor = "white";
  hungerbar.style.border = "none";
  hungerbar.style.borderRadius = "5px";
  hungerbar.style.display = "flex";
  hungerbar.style.justifyContent = "left";
  hungerbar.style.alignItems = "center";
  hungerbar.style.fontSize = "16px";
  hungerbar.style.fontWeight = "bold";
  hungerbar.style.color = "white";
  hungerbar.style.textAlign = "center";
  hungerbar.style.padding = "1px";
  hungerbar.style.boxSizing = "border-box";
  hungerbar.style.zIndex = "1";
  hungerbar.style.pointerEvents = "none";
  hungerbar.id = "hungerbar"
  var hungerbarFill = document.createElement("div");
  hungerbarFill.style.width = "100%";
  hungerbarFill.style.height = "100%";
  hungerbarFill.style.backgroundColor = "green";
  hungerbarFill.style.borderRadius = "5px";
  hungerbarFill.id = "hungerbarfill"
  hungerbar.appendChild(hungerbarFill);
  document.body.appendChild(hungerbar);
  var hungerbarIcon = document.createElement("img");
  hungerbarIcon.src = "hunger_nobg.png";
  hungerbarIcon.style.width = "20px";
  hungerbarIcon.style.height = "20px";
  hungerbarIcon.style.marginLeft = "5px";
  hungerbar.appendChild(hungerbarIcon);
}
initializeSurvivalUI();
//use an assemblage of meshes to create a shark
const sharkiebodie = 
  new THREE.Mesh(
    new THREE.CylinderGeometry(0.3, 0.5, 2), new THREE.MeshBasicMaterial({ map:waterTexture, color: "rgb(70, 70, 70)" }))
sharkiebodie.position.y = -3;
sharkiebodie.position.x = 0;
sharkiebodie.position.z = 0;
sharkiebodie.rotation.x = -Math.PI / 2;
scene.add(sharkiebodie);
obstacles.push(sharkiebodie);
//use a group for sharkie
const sharkie = new THREE.Object3D;
sharkie.add(sharkiebodie);
scene.add(sharkie)

// WILSON THE VOLLEYBALL
const wilson = new THREE.Mesh(
  new THREE.SphereGeometry(0.2), new THREE.MeshBasicMaterial( { map: wilsonSkinTexture, color: "rgb(255, 255, 255)" } ))
scene.add(wilson)

// Recolor the water texture to blue
waterTexture.encoding = THREE.sRGBEncoding;
waterTexture.anisotropy = 16;
//Set the repeat to be very small so the water looks detailed

//define a raycaster
const raycaster = new THREE.Raycaster();

// loader.load('shark.glb', function (gltf){
//   sharkie = gltf.scene;
//   sharkie.scale.set(0.1, 0.1, 0.1);
//   sharkie.position.set(0, 0, 0);
//   sharkie.rotation.set(0, 0, 0);
//   scene.add(sharkie);
// });

var raftSpeed = 0.02; // Set the speed of the raft
var raftDirection = new THREE.Vector3(1, 0, 0); // Set the direction of the raft

//----------Code Here--------
var xvelocity = 0;
var yvelocity = 0;
var zvelocity = 0;
const inventorySize = 10;


function generateWhiteNoise(intensity) {
  // Create an audio context
  const audioCtx = new AudioContext();

  // Create a buffer to store the noise data
  const bufferSize = 2 * audioCtx.sampleRate; // Set the buffer size to 2 seconds
  const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);

  // Fill the buffer with random noise values
  const output = noiseBuffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1; // Generate random values between -1 and 1
  }

  // Create a buffer source node
  const bufferSource = audioCtx.createBufferSource();
  bufferSource.buffer = noiseBuffer;

  // Create a gain node to control the intensity of the noise
  const gainNode = audioCtx.createGain();
  gainNode.gain.setValueAtTime(intensity, audioCtx.currentTime);

  // Connect the buffer source to the gain node
  bufferSource.connect(gainNode);

  // Connect the gain node to the audio context's destination
  gainNode.connect(audioCtx.destination);

  // Start the buffer source
  bufferSource.start();

  // Return the buffer source and gain node
  return { bufferSource, gainNode };
}

const soundList = {
  sfx: {
    'footsteps': 'sounds/sfx/footstep.wav',
  },
  music: {
    bgm: {
      'track1': 'sounds/bgm/track1.ogg',
      'track2': 'sounds/bgm/track2.ogg',
    },
  },
  misc: {
    
  },
}
function playRandomBGM(){
  const bgm = soundList.music.bgm[Object.keys(soundList.music.bgm)[Math.floor(Math.random() * Object.keys(soundList.music.bgm).length)]];
  const audio = new Audio(bgm);
  audio.loop = false;
  audio.play();
}
//wait until user can play audio, then play bgm for first time and set a timer to play another random bgm every 5 minutes
var audio = new Audio('sounds/bgm/track1.ogg');
audio.oncanplaythrough = function(){
  playRandomBGM();
  setInterval(playRandomBGM, 300000);
}
function winAchievement(achievement) {
  const achievementConfig = {
    'trash': {
      icon: 'trashcan_nobg.png',
      displayText: 'You are.. TRASH.. sorry wrong achievement.. You picked up.. Trash!'
    },
    'smiley': {
      icon: 'smiley!.jpeg',
      displayText: 'You are.. SMILEY!.. You picked up.. A smiley face! its extremely rare. You should be proud of yourself.'
    }
  };

  if (!localStorage.getItem("achievement: " + achievement)) { // Check if achievement has not been unlocked yet
    const notificationBar = document.createElement('div');
    notificationBar.style.position = 'fixed';
    notificationBar.style.top = '0';
    notificationBar.style.left = '0';
    notificationBar.style.width = '100%';
    notificationBar.style.padding = '10px';
    notificationBar.style.backgroundColor = 'rgba(255, 215, 0, 0.8)';
    notificationBar.style.color = 'black';

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

    localStorage.setItem("achievement: " + achievement, true); // Mark achievement as unlocked
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
  const messageText = document.createElement('div');
  messageText.innerHTML = message;
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
    imagePath: 'undefined_ico.png',
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
    if (player.position.y < -3 && !(player.position.y > -3.1 && player.position.y < -2.9)) {
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
  //If the player is colliding with the water, then add a cube just below the player to avoid flickering
  if (player.position.y > -3.1 && player.position.y < -2.9){
    underwaterViewCube.visible = true;
    underwaterViewCube.position.x = player.position.x;
    underwaterViewCube.position.z = player.position.z;
    underwaterViewCube.position.y = player.position.y - 0.4;
    camera.position.y = -2.7;
  } else {
    underwaterViewCube.visible = false;
  }
}
const underwaterViewCube = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({ color: underwaterFogColor}));
scene.add(underwaterViewCube)
underwaterViewCube.visible = false;

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

      // Move the player away from the obstacle with variable bounce-back distance if the distance to be moved back is less than the minimum distance (to avoid accidental afk movement)
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
var speed = 0.05
//adjust player movement to change respective velocity values base on the direction of the player
var maxSpeed = 0.05; // Set your desired maximum speed value here
var keys = {
  w:false,
  a:false,
  s:false,
  d:false,
  " ":false,
  q:false,
  e:false,
  shift:false,
  tabKey:false,
  m: false,
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
          playerHealth: health,
          playerHunger: hunger,
          playerThirst: thirst,
          playerStamina: stamina,
          /*/playerRaft: raft,
          raftDirection: raftDirection,
          raftSpeed: raftSpeed,*/
          // Add other game state variables as needed
          // Add other relevant game state data to save
      }));
    customAlert("Saved!", "auto-dismiss: 2")
}
//set a timer to save the game every minute
setInterval(() => {saveGame()}, 60000);

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




const noPermCommands = {
  help: { runJS: "displayCommandHelp()", runArgs: {} },
  sv_cheats: { runJS: "toggleCheats()", runArgs: {} },
  load: { runJS: "loadGame()", runArgs: {} },
  clear_save: { runJS: "localStorage.clear();window.location.reload();", runArgs: {} },
  save: { runJS: "saveGame()", runArgs: {} },
  msg: {
    runJS: "customAlert('~message~', 'auto-dismiss:~autodismisstime~')",
    runArgs: {
      message: { desc: "The message to be displayed", type: "string", required: true },
      autodismisstime: { desc: "The amount of time before the message autodismisses", type: "string", required: false },
      custombuttons: { desc: "The custom buttons to be displayed", type: "array", required: false }
    }
  }
};

const cheatCommands = {
  execute: { runJS: "eval('~evalcode~')", runArgs: { evalcode: { desc: "The code to run", type: "string" } } },
  sv_gravity: { runJS: "gravityFactor = ~gravity~", runArgs: { gravity: { desc: "The gravity to be set", type: "number", required: true } } },
  sv_maxspeed: { runJS: "maxspeed = ~maxspeed~", runArgs: { maxSpeed: { desc: "The max speed to be set", type: "number", required: true } } },
  sv_speed: { runJS: "speed = ~speed~", runArgs: { speed: { desc: "The speed to be set", type: "number", required: true } } },
  set_thirst: { runJS: "thirst = ~thirst~", runArgs: { thirst: { desc: "the thirst of the player", type: "number", required: true } } },
  set_hunger: { runJS: "hunger = ~hunger~", runArgs: {hunger: { desc: "the hunger of the player", type: "number", required: true }}},
};

function toggleCheats() {
  sv_cheats = !sv_cheats;
  customAlert(`Cheats Status: ${sv_cheats ? "Enabled" : "Disabled"}`, "auto-dismiss: 3");
}

function displayCommandHelp() {
  let nopermcommandList = "<ul>";
  for (const command in noPermCommands) {
    nopermcommandList += `<li>${command}</li>`;
  }
  nopermcommandList += "</ul>";

  let cheatcommandList = "<ul>";
  for (const command in cheatCommands) {
    cheatcommandList += `<li>${command}</li>`;
  }
  cheatcommandList += "</ul>";

  customAlert(`Commands | No Permission Required: ${nopermcommandList}<br>Commands | Cheats: ${cheatcommandList}`, "", "OK");
}

function predictCommand(input) {
  const parts = input.split(" ");
  const command = parts[0];
  const args = parts.slice(1);

  let runJS;
  if (command in noPermCommands) {
    runJS = noPermCommands[command].runJS;
  } else if (sv_cheats && command in cheatCommands) {
    runJS = cheatCommands[command].runJS;
  }

  if (runJS) {
    args.forEach((arg, index) => {
      const argName = Object.keys(noPermCommands[command]?.runArgs ?? cheatCommands[command]?.runArgs ?? {})[index];
      if (argName) {
        runJS = runJS.replace(`~${argName}~`, arg);
      }
    });
    return runJS;
  }

  return null;
}

function displayPredictions(predictions) {
  let predictionList = document.getElementById("predictionList");
  if (!predictionList) {
    predictionList = document.createElement("ul");
    predictionList.id = "predictionList";
    predictionList.style.position = "absolute";
    predictionList.style.top = "60px";
    predictionList.style.left = "0";
    predictionList.style.backgroundColor = "#fff";
    predictionList.style.border = "1px solid #ccc";
    predictionList.style.width = "100%";
    predictionList.style.listStyle = "none";
    predictionList.style.padding = "0";
    predictionList.style.margin = "0";
    document.getElementById("customConsoleInput").parentNode.appendChild(predictionList);
  }

  predictionList.innerHTML = "";
  predictions.forEach(prediction => {
    const li = document.createElement("li");
    li.style.padding = "5px";
    li.style.cursor = "pointer";
    li.textContent = prediction;
    li.addEventListener("click", () => {
      document.getElementById("customConsoleInput").value = prediction;
      predictionList.innerHTML = "";
    });
    predictionList.appendChild(li);
  });
}



function initializeCustomConsole() {
  const customConsole = document.createElement("div");
  customConsole.id = "customconsole";
  customConsole.style.position = "fixed";
  customConsole.style.top = "50%";
  customConsole.style.left = "50%";
  customConsole.style.transform = "translate(-50%, -50%)";
  customConsole.style.padding = "20px";
  customConsole.style.background = "rgba(255, 255, 255, 0.8)";
  customConsole.style.border = "2px solid black";
  customConsole.style.zIndex = "999";
  customConsole.style.display = "none";

  const customConsoleInput = document.createElement("input");
  customConsoleInput.id = "customConsoleInput";
  customConsoleInput.type = "text";
  customConsoleInput.style.width = "100%";
  customConsoleInput.style.height = "30px";
  customConsoleInput.style.marginTop = "10px";
  customConsoleInput.style.padding = "5px";
  customConsoleInput.style.border = "1px solid #ccc";
  customConsoleInput.style.borderRadius = "4px";
  customConsoleInput.style.fontSize = "16px";
  customConsoleInput.style.fontFamily = "Arial, sans-serif";
  customConsoleInput.style.boxSizing = "border-box";
  customConsoleInput.style.outline = "none";
  customConsoleInput.style.backgroundColor = "rgba(255, 255, 255, 0.8)";

  customConsole.appendChild(customConsoleInput);
  document.body.appendChild(customConsole);

  customConsoleInput.addEventListener("input", () => {
    const input = customConsoleInput.value;
    const predictions = [];
    for (const command in noPermCommands) {
      if (command.startsWith(input)) {
        predictions.push(command);
      }
    }
    for (const command in cheatCommands) {
      if (command.startsWith(input)) {
        predictions.push(command);
      }
    }
    displayPredictions(predictions);
  });

  customConsoleInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const command = customConsoleInput.value;
      const predictedCommand = predictCommand(command);
      if (predictedCommand) {
        console.log(`Running: ${predictedCommand}`);
        eval(predictedCommand);
      } else {
        console.log(`Invalid command: ${command}`);
      }
      customConsoleInput.value = "";
      toggleCustomConsole();
      document.getElementById("predictionList").innerHTML = "";
    }
  });
}

function executeCommand(input) {
  const parts = input.split(" ");
  const command = parts[0];
  const code = parts.slice(1).join(" ");

  if (command === "execute") {
    return cheatCommands.execute.runJS.replace("~evalcode~", code);
  }

  return null;
}

function toggleCustomConsole() {
  const customConsole = document.getElementById("customconsole");
  if (customConsole.style.display === "none") {
      customConsole.style.display = "block";
      document.getElementById("customConsoleInput").focus();
  } else {
      customConsole.style.display = "none";
      document.getElementById("predictionList").innerHTML = ""; // Clear predictions
  }
}

// Initialize custom console
initializeCustomConsole();

// Event listener to toggle console with backtick key
document.addEventListener('keydown', (event) => {
  if (event.key === '`') {
    toggleCustomConsole();
    event.preventDefault();
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
        if (gameState.playerHealth){
          health = gameState.playerHealth;
        }
        if (gameState.playerHunger){
          hunger = gameState.playerHunger;
        }
        if (gameState.playerThirst){
          thirst = gameState.playerThirst;
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
    materials: {'wood': 1},
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
        const inventoryItemIndex = inventory.indexOf(material);
        const inventoryItemCount = inventoryItemIndex !== -1 ? inventory[inventoryItemIndex + 1] : 0;
        if (inventoryItemCount < materials[material]) {
            customAlert("Insufficient materials to craft " + recipeName, "auto-dismiss: 2");
            return; // Stop crafting if materials are insufficient
        }
    }

    // Subtract materials from inventory
    for (const material in materials) {
        const inventoryItemIndex = inventory.indexOf(material);
        if (inventoryItemIndex !== -1) {
            inventory[inventoryItemIndex + 1] -= materials[material];
            if (inventory[inventoryItemIndex + 1] <= 0) {
                // Remove the item from inventory if its count becomes zero or negative
                inventory.splice(inventoryItemIndex, 2);
            }
        }
    }

    // Add crafted item to inventory
    addItemToInventory(craftingRecipes[recipeName].result, 1);

    // Update inventory UI
    updateInventoryUI();

    // Display crafting success message
    customAlert("Crafted " + recipeName, "auto-dismiss: 2");
}


function animate() {
  // handleCustomConsole()
  requestAnimationFrame(animate);
  customConsole_open = false;
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
        // Cast a ray from the player's position in the direction they are facing
        raycaster.setFromCamera({ x: 0, y: 0 }, camera);

        // Check for intersections
        const intersects = raycaster.intersectObjects(trash);

        // If there are intersections, pick up the item
        if (intersects.length > 0) {
            const intersectedObject = intersects[0].object;
            const trashPiece = intersectedObject;

            // Check if the player is close enough and facing the item
            if (player.position.distanceTo(trashPiece.position) < ((trashPiece.scale.x + trashPiece.scale.y + trashPiece.scale.z) / 3 * 3) &&
                player.rotation.y > -Math.PI / 2 && player.rotation.y < Math.PI / 2 &&
                player.rotation.x > -Math.PI / 2 && player.rotation.x < Math.PI / 2) {
                if (keys["e"]) {
                    scene.remove(trashPiece);
                    trash.splice(trash.indexOf(trashPiece), 1);
                    const trashType = trashPiece.userData.type;
                    winAchievement("trash");
                    // Add the item to the inventory based on its type
                    if (trashType != "crate" && trashType != "barrel") {
                        if (inventory.length < inventorySize) {
                            addItemToInventory(trashType, 1);
                        }
                    }
                    if (trashType === "barrel") {
                        const items = ["wood", "stone", "leaf"];
                        const itemCounts = [Math.floor(Math.random() * 5) + 1, Math.floor(Math.random() * 5) + 1, Math.floor(Math.random() * 5) + 1];
                        for (let i = 0; i < items.length; i++) {
                            const item = items[i];
                            const count = itemCounts[i];
                            for (let j = 0; j < count; j++) {
                                addItemToInventory(item, 1);
                            }
                        }
                    }
                    if (trashType === "crate") {
                        const items = ["wood", "stone", "leaf", "scrap"];
                        const itemCounts = [Math.floor(Math.random() * 3) + 4, Math.floor(Math.random() * 3) + 4, Math.floor(Math.random() * 3) + 4];
                        for (let i = 0; i < items.length; i++) {
                            const item = items[i];
                            const count = itemCounts[i];
                            for (let j = 0; j < count; j++) {
                                addItemToInventory(item, 1);
                            }
                        }
                    }
                    updateInventoryUI();
                }
            }
        }

    
  });
  updateInventoryUI();
  //use white noise gen for the footsteps when in water
  
  if (keys['m']){
    //winAchievement("MMMM")
  }
  if (keys['w'] || keys['a'] || keys['s'] || keys['d']){
    // play footsteps sound effect
    if (Math.random() < 1){
      
      if (player.position.y > -2.9){
        
        footstepAudio.play();
      } else {
        // const oceanSteps = generateWhiteNoise(0.4);
        oceanSteps.play();
      }
    }
    
  }
  //Make Sharkie chase the player; Sharkie already defined, so we just need to make him chase player
  const sharkieSpeed = 0.01;
  if (player.position.y > -3){
    //Move it towards the player, using vectors toward the player
    var vector = new THREE.Vector3(player.position.x - sharkie.position.x, player.position.y - sharkie.position.y, player.position.z - sharkie.position.z);
    sharkie.position.add(vector.multiplyScalar(sharkieSpeed));
    //Make it look at the player
    sharkiebodie.lookAt(player.position);
    
  } else {
    //Make the sharkie circle around the raft
    sharkie.position.x = raft.position.x + raftDirection.x * raftSpeed;
    sharkie.position.z = raft.position.z + raftDirection.z * raftSpeed
  }
  //Make wilson always just in the distance, just out of reach
  wilson.position.x = player.position.x + 8
  wilson.position.y = -2.8
  wilson.position.z = player.position.z + 8
  //Make the center of the water always align with the center of the player, for infinite ocean effect.
  water.position.x = player.position.x + water.scale.x / 2;
  water.position.z = player.position.z + water.scale.z / 2;
  //If the player just enters the water then play splash sound (only if the players colliding with the water plane)
  if (player.position.y < -2.9 && player.position.y > -3.1){
    if (Math.random() < 0.1){
      splashAudio.play();
    }
  }
  updateSurvivalUI();
  handleSurvivalState();
}
const footstepAudio = new Audio("sounds/sfx/footstep.wav");
const oceanSteps = new Audio("sounds/sfx/swimstep.wav");
const splashAudio = new Audio("sounds/sfx/splash.wav");
animate();