const GAME_STATE = {
  paused: true,
  firstClick: true,
  revealeds: 0,
  difficulty: GameMode.EASY,
  customDimensions: null,
  board: [],
  bombs: [],
};

function restartGame() {
  GAME_STATE.firstClick = true;
  GAME_STATE.revealeds = 0;
  GAME_STATE.bombs = [];
  GAME_STATE.board = [];

  gameSetup();
}

function gameSetup() {
  setDimensions(
    GameModeDimensions[GAME_STATE.difficulty] || GAME_STATE.customDimensions
  );
  updateResolution();

  const { cols, rows } = game.settings;

  GAME_STATE.board = [];
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      GAME_STATE.board.push(new Tile(x, y));
    }
  }

  GAME_STATE.paused = false;
}

function gameEnd(won, parent) {
  if (won) {
    showMessage("you won 😎👍");
    return;
  }

  showMessage("you lost 😢");
  revealBombs(parent);
}

function revealBombs(parent = null) {
  const tile = parent ? parent : GAME_STATE.bombs[0];
  const { animOffset } = game.settings;

  let offset = tile.timeOffset;
  GAME_STATE.bombs.forEach((tile) => {
    tile.reveal(offset);
    offset += animOffset * 3;
  });
}

function checkWin() {
  const { rows, cols } = game.settings;
  if (GAME_STATE.revealeds >= rows * cols - game.totalBombs) gameEnd(true);
}

function generateBombs(n, range, x, y) {
  while (n > 0) {
    const rndIndex = Math.floor(Math.random() * GAME_STATE.board.length);
    const tile = GAME_STATE.board[rndIndex];

    let dist = distance(x, y, tile.position.x, tile.position.y);
    if (tile.isMine || dist <= range) continue;

    tile.isMine = true;
    GAME_STATE.bombs.push(tile);
    n--;
  }
}

function calculateValues() {
  GAME_STATE.bombs.forEach((tile) => {
    const neighbors = tile.getNeighbors(GAME_STATE.board);
    neighbors.forEach((nn) => !nn.isMine && nn.value++);
  });
}

// recursive method
function _propagate(tile, offset) {
  const { board } = GAME_STATE;

  const { animOffset } = game.settings;
  const neighbors = tile.getNeighbors(board);
  for (let i = 0; i < neighbors.length; i++) {
    const n = neighbors[i];
    if (n.isMine || n.isRevealed) continue;

    n.reveal(offset);
    if (n.value === 0) propagate(n, n.timeOffset + animOffset);
  }
}

// queue method
function propagate(tile, offset) {
  const { board } = GAME_STATE;
  const { animOffset } = game.settings;

  let neighbors = tile.getNeighbors(board);

  const queue = [...neighbors];
  const counts = [];

  let n = 0;
  let currentCount = neighbors.length;
  while (queue.length > 0) {
    const tile = queue.shift();
    tile.reveal(offset);
    neighbors = tile.getNeighbors(board);
    counts.push(neighbors.length);

    for (let i = 0; i < neighbors.length; i++) {
      const neighbor = neighbors[i];
      if (neighbor.isMine || neighbor.isRevealed) continue;
      neighbor.reveal(offset + animOffset);
      if (neighbor.value === 0) queue.push(neighbor);
    }

    if (++n >= currentCount) {
      n = 0;
      offset += animOffset;
      currentCount = counts.shift();
    }
  }
}

function gameLoop() {
  for (let tile of GAME_STATE.board) {
    tile.render();
  }
}
