// Créer la scène et le moteur Babylon.js
const canvas = document.getElementById("renderCanvas");
const engine = new BABYLON.Engine(canvas, true);

const createScene = function () {
  const scene = new BABYLON.Scene(engine);

  // Caméra
  const camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), scene);
  camera.setTarget(BABYLON.Vector3.Zero());

  // Lumière
  const light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
  light.intensity = 0.7;

  // Sol
  const ground = BABYLON.MeshBuilder.CreateGround("ground", {width: 10, height: 100}, scene);
  
  // Joueur (carré)
  const player = BABYLON.MeshBuilder.CreateBox("player", {height: 1, width: 1, depth: 1}, scene);
  player.position.y = 0.5;
  player.position.z = -4; // Place le joueur en avant de la caméra
  
  // Obstacles (quelques cubes)
  const createObstacle = (zPosition) => {
    const obstacle = BABYLON.MeshBuilder.CreateBox("obstacle", {height: 1, width: 1, depth: 1}, scene);
    obstacle.position.y = 0.5;
    obstacle.position.z = zPosition;
    obstacle.position.x = Math.random() > 0.5 ? 2 : -2; // Aléatoirement à gauche ou à droite
    return obstacle;
  };

  const obstacles = [];
  for (let i = 5; i < 100; i += 10) {
    obstacles.push(createObstacle(i));
  }

  // Mouvement du joueur (gauche/droite)
  window.addEventListener("keydown", function (event) {
    if (event.key === "ArrowLeft" && player.position.x > -2) {
      player.position.x -= 2;
    } else if (event.key === "ArrowRight" && player.position.x < 2) {
      player.position.x += 2;
    }
  });

  // Défilement du sol et des obstacles
  scene.registerBeforeRender(function () {
    ground.position.z += 0.1;
    obstacles.forEach(obstacle => {
      obstacle.position.z += 0.1;
      if (obstacle.position.z > 1) {
        obstacle.position.z = -100; // Réinitialiser les obstacles derrière le joueur
        obstacle.position.x = Math.random() > 0.5 ? 2 : -2;
      }
    });
  });

  return scene;
};

// Appeler la fonction de création de scène
const scene = createScene();

// Boucle de rendu
engine.runRenderLoop(function () {
  scene.render();
});

// Redimensionner le canvas lorsque la fenêtre change de taille
window.addEventListener("resize", function () {
  engine.resize();
});
