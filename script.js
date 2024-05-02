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
// Recolor the water texture to blue
waterTexture.encoding = THREE.sRGBEncoding;
waterTexture.anisotropy = 16;
//Set the repeat to be very small so the water looks detailed
waterTexture.repeat.set(0.5, 0.5)

const raftSpeed = 0.02; // Set the speed of the raft
const raftDirection = new THREE.Vector3(1, 0, 0); // Set the direction of the raft

//----------Code Here--------
var xvelocity = 0;
var yvelocity = 0;
var zvelocity = 0;
const inventorySize = 10;
const waterGeometry = new THREE.PlaneGeometry(100, 100, 100, 100);
waterGeometry.rotateX(-Math.PI / 2); // Rotate by -90 degrees around the X-axis
//Initialize the inventory system and UI
var inventory = [];
var selectedSlot = 0;
addItemToInventory("ol' metal hook", 1)
// Create a function to add items to the inventory
const allowedItemTypes = ['wood', /*Added wood.jpg to test*/'wood.jpg', 'stone', 'plastic', 'leaf', 'sand', 'clay', 'nail' , 'copper', 'scrap', 'lead', 'tin', 'aluminum', 'coal',]
// Create a function to add items to the inventory
function addItemToInventory(item, count){
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
function initializeInventoryUI() {
  // Create the inventory container
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

  // Assign it to a global variable for later reference
  window.inventoryContainer = inventoryContainer;

  // Update the UI initially
  updateInventoryUI();
}

// Call the initializeInventoryUI function to set up the UI
initializeInventoryUI();

// Function to update Inventory UI
function updateInventoryUI() {
  // Clear existing inventory UI
  window.inventoryContainer.innerHTML = '';

  for (let i = 0; i < inventory.length; i += 2) {
    const item = inventory[i];
    const count = inventory[i + 1];

    // Create a div element for each inventory item
    const itemDiv = document.createElement('div');
    itemDiv.style.color = "black"
    itemDiv.style.fontFamily = "Segoue UI, Helvetica, Sans-serif, system-ui"
    itemDiv.style.width = "100%";
    itemDiv.style.backgroundColor = "white"
    itemDiv.textContent = `${item} x${count}`;
    itemDiv.style.marginBottom = '10px';
    itemDiv.style.cursor = 'pointer';

    window.inventoryContainer.appendChild(itemDiv);
  }
}

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
  depthWrite: true,
  color: 0x0000ff,
}); // Set color to light blue
const water = new THREE.Mesh(waterGeometry, waterMaterial);
scene.add(water);
water.position.y = -3;
const light = new THREE.PointLight(0xffffff, 1, 100);


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
addItemToInventory("inventory test item", 1)

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
  if (Math.random() < 0.5) {
      const plank = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.05, 0.5), new THREE.MeshBasicMaterial({ map: woodTexture}));
    plank.userData.type = "wood";
    const crate = new THREE.Mesh(new THREE.BoxGeometry(1, 2, 1), new THREE.MeshBasicMaterial({ map: textureLoader.load("crate.jpg")}));
    plank.userData.type = "crate";
    
    

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

      plank.position.copy(firstSpawnPosition);
      crate.position.copy(secondSpawnPosition);

      trash.push(plank);
      scene.add(plank);
      if (Math.random() < 0.1){
        trash.push(crate);
        scene.add(crate);
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