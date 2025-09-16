const board = document.getElementById("board");
const diceResult = document.getElementById("diceResult");
const turnText = document.getElementById("turn");
const messageBox = document.getElementById("message");
const winnerBox = document.getElementById("winner");

let playerPositions = [1, 1];
let currentPlayer = 0;
let snakes = {};
let ladders = {};

function randomSnakesAndLadders() {
  snakes = {};
  ladders = {};

  // Generate 5 snakes randomly
  for (let i = 0; i < 5; i++) {
    let head = Math.floor(Math.random() * 80) + 20; // between 20 and 100
    let tail = Math.floor(Math.random() * (head - 10)) + 1;
    snakes[head] = tail;
  }

  // Generate 5 ladders randomly
  for (let i = 0; i < 5; i++) {
    let bottom = Math.floor(Math.random() * 80) + 1;
    let top = bottom + Math.floor(Math.random() * (100 - bottom));
    if (top > bottom) ladders[bottom] = top;
  }
}

function buildBoard() {
  board.innerHTML = "";
  let reverse = false;
  let number = 100;
  for (let row = 0; row < 10; row++) {
    let cells = [];
    for (let col = 0; col < 10; col++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.id = "cell-" + number;
      cell.innerHTML = number;

      if (snakes[number]) {
        const snakeTag = document.createElement("div");
        snakeTag.classList.add("snake");
        snakeTag.textContent = "🐍↓" + snakes[number];
        cell.appendChild(snakeTag);
      }
      if (ladders[number]) {
        const ladderTag = document.createElement("div");
        ladderTag.classList.add("ladder");
        ladderTag.textContent = "🪜↑" + ladders[number];
        cell.appendChild(ladderTag);
      }

      cells.push(cell);
      number--;
    }
    if (reverse) cells.reverse();
    reverse = !reverse;
    cells.forEach(cell => board.appendChild(cell));
  }
  updateBoard();
}

function updateBoard() {
  document.querySelectorAll(".player").forEach(p => p.remove());
  playerPositions.forEach((pos, idx) => {
    const token = document.createElement("div");
    token.classList.add("player");
    token.textContent = idx === 0 ? "🔵" : "🔴";
    const cell = document.getElementById("cell-" + pos);
    if (cell) cell.appendChild(token);
  });
  turnText.textContent = currentPlayer === 0 ? "🔵 Player 1's Turn" : "🔴 Player 2's Turn";
}

function rollDice() {
  if (winnerBox.textContent) return; // stop if game won

  const roll = Math.floor(Math.random() * 6) + 1;
  diceResult.textContent = `Dice Rolled: ${roll}`;
  messageBox.textContent = "";

  let pos = playerPositions[currentPlayer] + roll;
  if (pos <= 100) {
    if (snakes[pos]) {
      messageBox.textContent = "🐍 Oh no! Snake bite! Back to " + snakes[pos];
      pos = snakes[pos];
    } else if (ladders[pos]) {
      messageBox.textContent = "🪜 Great! Climbed a ladder to " + ladders[pos];
      pos = ladders[pos];
    }
    playerPositions[currentPlayer] = pos;
  }

  if (pos === 100) {
    winnerBox.textContent = (currentPlayer === 0 ? "🔵 Player 1" : "🔴 Player 2") + " Wins! 🎉";
    return;
  }

  currentPlayer = currentPlayer === 0 ? 1 : 0;
  updateBoard();
}

function resetGame() {
  playerPositions = [1, 1];
  currentPlayer = 0;
  winnerBox.textContent = "";
  diceResult.textContent = "";
  messageBox.textContent = "";
  randomSnakesAndLadders();
  buildBoard();
}

randomSnakesAndLadders();
buildBoard();
