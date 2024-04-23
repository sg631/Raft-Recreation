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
//----------Code Here--------
var xvelocity = 0;
var yvelocity = 0;
var zvelocity = 0;
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

const gravityFactor = 0.01; // Adjust gravity strength as needed
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

//adjust player movement to change respective velocity values based on the direction of the player
document.addEventListener('keydown', (event) => {
  if (event.key == "w"){
    if ((Math.abs(xvelocity) < maxSpeed)  && (Math.abs(zvelocity) < maxSpeed)){
      xvelocity -= Math.sin(player.rotation.y) * speed;
      zvelocity -= Math.cos(player.rotation.y) * speed;
    }
  }
  if (event.key == "s"){
    if ((Math.abs(xvelocity) < maxSpeed) && (Math.abs(zvelocity) < maxSpeed)){
      xvelocity += Math.sin(player.rotation.y) * speed;
      zvelocity += Math.cos(player.rotation.y) * speed;
    }
  }
  if (event.key == "a"){
    xvelocity -= Math.sin(player.rotation.y + Math.PI / 2) * speed;
    zvelocity -= Math.cos(player.rotation.y + Math.PI / 2) * speed;
  }
  if (event.key == "d"){
    xvelocity += Math.sin(player.rotation.y + Math.PI / 2) * speed;
    zvelocity += Math.cos(player.rotation.y + Math.PI / 2) * speed;
  }

  // Limit player speed
  xvelocity = Math.min(maxSpeed, Math.max(-maxSpeed, xvelocity));
  zvelocity = Math.min(maxSpeed, Math.max(-maxSpeed, zvelocity));
});

const player = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({ color: 0x00ff00 }));
scene.add(player)
const referenceViewingObject = new THREE.Mesh( new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({ color: 0x00ff00}))
scene.add(referenceViewingObject)
referenceViewingObject.position.z = -3
const referenceViewingObject2 = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial( { color: 0x00ff00}))
scene.add(referenceViewingObject2)
referenceViewingObject2.position.y = -3
const obstacles = [];
obstacles.push(referenceViewingObject);
obstacles.push(referenceViewingObject2)
//Render Loop
//Render Loop
//Render Loop
//Render Loop
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
  xvelocity *= 0.9;
  yvelocity *= 0.9;
  zvelocity *= 0.9;

  // Limit player speed
  xvelocity = Math.min(maxSpeed, Math.max(-maxSpeed, xvelocity));
  zvelocity = Math.min(maxSpeed, Math.max(-maxSpeed, zvelocity));

  // Update camera position and rotation
  camera.position.copy(player.position);
  camera.rotation.copy(player.rotation);

  // Render the scene
  renderer.render(scene, camera);
}
animate();