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
scene.fog = new THREE.Fog(fogColor, 1, 50); // Linear fog

renderer.setClearColor(0x87ceeb); // Set background color to light blue

const textureLoader = new THREE.TextureLoader();
const waterTexture = textureLoader.load('water.jpg');

// Recolor the water texture to blue
waterTexture.encoding = THREE.sRGBEncoding;
waterTexture.anisotropy = 16;
//Set the repeat to be very small so the water looks detailed
waterTexture.repeat.set(0.5, 0.5)

const raftSpeed = 0.05; // Set the speed of the raft
const raftDirection = new THREE.Vector3(1, 0, 0); // Set the direction of the raft

//----------Code Here--------
var xvelocity = 0;
var yvelocity = 0;
var zvelocity = 0;
const waterGeometry = new THREE.PlaneGeometry(100, 100, 100, 100);
waterGeometry.rotateX(-Math.PI / 2); // Rotate by -90 degrees around the X-axis

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
const underwaterFogColor = 0x0000ff; // Intense blue color
const waterMaterial = new THREE.MeshBasicMaterial({ map: waterTexture, color: underwaterFogColor, opacity: 100}); // Set color to light blue
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
        scene.fog = new THREE.Fog(fogColor, 1, 50)
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
const speed = 0.1
//adjust player movement to change respective velocity values base on the direction of the player
const maxSpeed = 0.1; // Set your desired maximum speed value here
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
const referenceViewingObject = new THREE.Mesh( new THREE.SphereGeometry(10), new THREE.MeshBasicMaterial({ color: "yellow"}))
scene.add(referenceViewingObject)
referenceViewingObject.position.z = -30
const raftPart = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load('wood.jpg') }))
scene.add(raftPart)
raftPart.position.y = -3
const obstacles = [];
obstacles.push(referenceViewingObject);
obstacles.push(raftPart)

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

  // Update player and camera velocity damping
  xvelocity *= 0.7; // Adjust damping factor for player movement
  yvelocity *= 0.7;
  zvelocity *= 0.7;

  // Update camera position and rotation
  camera.position.copy(player.position);
  camera.rotation.copy(player.rotation);

  // Render the scene
  renderer.render(scene, camera);
  updateFogColor();
  updatePlayerMovement();
}

animate();