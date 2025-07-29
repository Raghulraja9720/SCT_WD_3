const board = document.getElementById("board");
const statusText = document.getElementById("status");
const resetBtn = document.getElementById("resetBtn");
const toggleBtn = document.getElementById("toggleMode");

let cells = [];
let currentPlayer = "X";
let gameActive = true;
let vsComputer = false;

function createBoard() {
  board.innerHTML = "";
  cells = Array(9).fill("");
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.dataset.index = i;

    const content = document.createElement("div");
    content.classList.add("cell-content");
    cell.appendChild(content);

    board.appendChild(cell);

    cell.addEventListener("click", () => handleMove(i));
  }
}

function handleMove(index) {
  if (!gameActive || cells[index]) return;

  cells[index] = currentPlayer;
  board.children[index].firstChild.textContent = currentPlayer;

  if (checkWin(currentPlayer)) {
    highlightWin(checkWin(currentPlayer));
    statusText.textContent = `🎉 Player ${currentPlayer} Wins!`;
    gameActive = false;
    return;
  }

  if (!cells.includes("")) {
    statusText.textContent = "It's a Draw!";
    gameActive = false;
    return;
  }

  currentPlayer = currentPlayer === "X" ? "O" : "X";
  statusText.textContent = `Player ${currentPlayer}'s Turn`;

  if (vsComputer && currentPlayer === "O") {
    setTimeout(computerMove, 400);
  }
}

function computerMove() {
  if (!gameActive) return;

  // Use minimax for best move
  const bestIndex = minimax(cells, "O").index;
  handleMove(bestIndex);
}

function checkWin(player) {
  const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];
  for (const pattern of winPatterns) {
    if (pattern.every(i => cells[i] === player)) return pattern;
  }
  return null;
}

function highlightWin(indices) {
  indices.forEach(i => board.children[i].classList.add("win"));
}

function resetGame() {
  currentPlayer = "X";
  gameActive = true;
  statusText.textContent = `Player ${currentPlayer}'s Turn`;
  createBoard();
}

toggleBtn.addEventListener("click", () => {
  vsComputer = !vsComputer;
  toggleBtn.textContent = `Mode: Player vs ${vsComputer ? "Computer" : "Player"}`;
  resetGame();
});

resetBtn.addEventListener("click", resetGame);

createBoard();

/* --- Minimax Algorithm --- */
function minimax(newBoard, player) {
  const availSpots = newBoard
    .map((val, idx) => (val === "" ? idx : null))
    .filter((val) => val !== null);

  // Check terminal states
  if (checkWinner(newBoard, "X")) return { score: -10 };
  if (checkWinner(newBoard, "O")) return { score: 10 };
  if (availSpots.length === 0) return { score: 0 };

  let moves = [];

  for (let i = 0; i < availSpots.length; i++) {
    let move = {};
    move.index = availSpots[i];
    newBoard[availSpots[i]] = player;

    if (player === "O") {
      let result = minimax(newBoard, "X");
      move.score = result.score;
    } else {
      let result = minimax(newBoard, "O");
      move.score = result.score;
    }

    newBoard[availSpots[i]] = "";
    moves.push(move);
  }

  // Pick the best move
  let bestMove;
  if (player === "O") {
    let bestScore = -Infinity;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score > bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score < bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  }
  return moves[bestMove];
}

function checkWinner(boardState, player) {
  const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];
  return winPatterns.some(pattern => pattern.every(i => boardState[i] === player));
}
