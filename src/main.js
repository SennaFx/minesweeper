const flagImg = loadImage("flag.png");

const mouse = {
  x: -100,
  y: -100,
  targetTile: null,
};

function mouseMove(mouseX, mouseY) {
  mouse.x = mouseX;
  mouse.y = mouseY;

  // unhighlight previous
  if (mouse.targetTile != null) {
    mouse.targetTile.toggleHighlight();
  }

  // highlight next
  const tile = getTile(mouseX, mouseY, GAME_STATE.board);
  if (tile != null) tile.toggleHighlight();
  mouse.targetTile = tile;
}

function rightClick(mouseX, mouseY) {
  if (GAME_STATE.paused) return;

  const tile = mouse.targetTile;
  if (tile == null) return;
  tile.setFlag();
}

function leftClick(mouseX, mouseY) {
  if (GAME_STATE.paused) return;

  const tile = mouse.targetTile;
  if (tile == null) return;

  if (GAME_STATE.firstClick) {
    const { i, j } = getIndices(mouseX, mouseY);
    generateBombs(game.totalBombs, 3, i, j);
    calculateValues();
    GAME_STATE.firstClick = false;
  }

  if (tile.isRevealed) return;

  if (tile.isMine) {
    tile.reveal();
    gameEnd(false, tile);
    return;
  }

  tile.reveal();
  if (tile.value === 0)
    propagate(tile, tile.timeOffset + game.settings.animOffset);
  checkWin();
}

function mainLoop() {
  background("#eee");
  gameLoop();

  requestAnimationFrame(mainLoop);
}

gameSetup();
requestAnimationFrame(mainLoop);
