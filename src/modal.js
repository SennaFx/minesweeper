import { GAME_STATE, gameSetup, restartGame } from './game.js'
import { GameMode } from "./settings.js"

const parentModal = document.querySelector(".modal");

const startModal = parentModal.querySelector("#main-modal");
const startBtn = startModal.querySelector("button");
const options = startModal.querySelector("select");

const inputs = startModal.querySelector(".inputs");

const rowsInput = inputs.querySelector("#rows-input");
const colsInput = inputs.querySelector("#cols-input");
const bombsInput = inputs.querySelector("#bombs-input");

const gameOverModal = parentModal.querySelector("#gameover-modal")
const gameOverMessageModal = gameOverModal.querySelector('span.modal-content-message')
const restartBtn = gameOverModal.querySelector('button')

export function showMessage(content, callback) {
  if (callback) callback() 

  const others = parentModal.querySelectorAll('.modal-content');
  others.forEach(modal => modal.style.display = "none")

  gameOverMessageModal.textContent = content;

  parentModal.style.display = "flex";
  gameOverModal.style.display = "flex";
}

options.addEventListener("change", (e) => {
  inputs.style.display = e.target.value === "custom" ? "flex" : "none";
});

startBtn.addEventListener("click", () => {
  closeModal(() => {
    const selectedOption = options.value.toUpperCase();
    const mode = GameMode[selectedOption] || GameMode.EASY;

    const _rows = Math.max(6, rowsInput.value || 0);
    const _cols = Math.max(6, colsInput.value || 0);

    const dimensions = {
      cols: _cols,
      rows: _rows,
      bombs: bombsInput.value || 0,
    };

    GAME_STATE.customDimensions = dimensions;
    GAME_STATE.difficulty = mode;

    gameSetup(dimensions);
  });
});

restartBtn.addEventListener('click', () => {
  closeModal(() => {
    restartGame();
  })
})

function closeModal(callback) {
  if (callback) callback();
  parentModal.style.display = "none";
}


