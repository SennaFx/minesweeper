import { gameSetup, gameLoop } from "./game.js";
import { background } from "./canvas.js";

function mainLoop() {
  // background("#eee");
  gameLoop();

  requestAnimationFrame(mainLoop);
}

gameSetup();

requestAnimationFrame(mainLoop);
