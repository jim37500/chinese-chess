function initializeBoard() {
  checkerBoard = [
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', 'w', 'b', '', '', ''],
    ['', '', '', 'b', 'w', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '']
  ];
  
  rows = [
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '']
  ];
  
  columns = [
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '']
  ];
  
  diagonPs = [
    ['', '', ''],
    ['', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', '', ''],
    ['', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', ''],
    ['', '', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', ''],
    ['', '', '']
  ];
  
  diagonNs = [
    ['', '', ''],
    ['', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', '', ''],
    ['', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', ''],
    ['', '', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', ''],
    ['', '', '']
  ];
}

function updateData() {
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      if (checkerBoard[i][j] !== '') {
        rows[i][j] = checkerBoard[i][j]
        columns[j][i] = checkerBoard[i][j]

        const diaPIdx = i - j + 5;
        if (diaPIdx >= 0 && diaPIdx <= 5) {
          diagonPs[diaPIdx][i] = checkerBoard[i][j]
        } else if (diaPIdx > 5 && diaPIdx <= 10) {
          diagonPs[diaPIdx][j] = checkerBoard[i][j]
        };

        const diaNIdx = i + j - 2
        if (diaNIdx >= 0 && diaNIdx <= 5) {
          diagonNs[diaNIdx][i] = checkerBoard[i][j]
        } else if (diaNIdx > 5 && diaNIdx <= 10) {
          diagonNs[diaNIdx][7-i] = checkerBoard[i][j]
        };
      };
    };
  };
}


function updateCheckerBoard() {
  updateData();
  document.querySelectorAll('.piece').forEach((element, idx) => {
    let i = parseInt( idx / 8);
    let j = idx % 8;
    if (checkerBoard[i][j] == 'w') {
      if (element.classList.contains('piece-black')) {
        element.classList.remove('piece-black');
      } 
      element.classList.add('piece-white');
    } else if (checkerBoard[i][j] == 'b') {
      if (element.classList.contains('piece-white')) {
        element.classList.remove('piece-white');
      } 
      element.classList.add('piece-black');
    } else {
      if (element.classList.contains('piece-white')) {
        element.classList.remove('piece-white');
      } else if (element.classList.contains('piece-black')) {
        element.classList.remove('piece-black');
      }
    }
  })
}

function updateTurnInfo(turn) {
  const element = document.querySelector('.js-turn-message').classList
  if (element.contains('white-turn') && turn == 'b') {
    element.remove('white-turn')
  } else if (turn == 'w'){
    element.add('white-turn')
  }
}

function getLinesInfo(i, j) {
  // row
  const rowLine = i;
  const rowLineIdx = j;
  
  // column
  const columnLine = j;
  const columnLineIdx = i;

   // diagonPs
   const diaPLine = i - j + 5;
   let diaPLineIdx;
   if (diaPLine >= 0 && diaPLine <= 5) {
    diaPLineIdx = i;
   } else if (diaPLine > 5 && diaPLine <= 10) {
     diaPLineIdx = j;
   };

   // diagonNs
  const diaNLine = i + j - 2;
  let diaNLineIdx;
  if (diaNLine >= 0 && diaNLine <= 5) {
    diaNLineIdx = i;
  } else if (diaNLine > 5 && diaNLine <= 10) {
    diaNLineIdx = 7 - i;
  };

  return [rowLine, rowLineIdx, columnLine, columnLineIdx,
    diaPLine, diaPLineIdx, diaNLine, diaNLineIdx];



}

function getBoundaryInfo(line, lineIdx, lines, turn) {
  let l = lineIdx - 1;
  let r = lineIdx + 1;
  let leftBoundary = false;
  let rightBoundary = false;

  while (l >= 0) {
    if (lines[line][l] == '') {
      break
    } else if (lines[line][l] == turn) {
      if (lineIdx - l > 1) {
        leftBoundary = true;
      };
      break
    } else {
      l -= 1;
    }
  };

  while (r < lines[line].length) {
    if (lines[line][r] == '') {
      break
    } else if (lines[line][r] == turn) {
      if (r - lineIdx > 1) {
        rightBoundary = true;
      }
      break
    } else {
      r += 1;
    }
  };
  return [leftBoundary, l, rightBoundary, r];
}

function checkLines(line, lineIdx, lines, turn) {
  const [leftBoundary, l, rightBoundary, r] = getBoundaryInfo(line, lineIdx, lines, turn);
  
  if ((leftBoundary && rightBoundary) ||( !leftBoundary && !rightBoundary) || r - l <= 2) {
    return false;
  } else {
    return true
  } ;
}

function generateLinesBools(i, j, turn) {
  const [rowLine, rowLineIdx, columnLine, columnLineIdx, 
    diaPLine, diaPLineIdx, diaNLine, diaNLineIdx] = getLinesInfo(i, j);

  // rows
  const rowBool = checkLines(rowLine, rowLineIdx, rows, turn);

  // columns
  const columnBool = checkLines(columnLine, columnLineIdx, columns, turn);

  // diagonPs
  let diaPBool = false;
  if (diaPLine >= 0 && diaPLine <= 10) {
    diaPBool = checkLines(diaPLine, diaPLineIdx, diagonPs, turn);
  };
  
  // diagonNs
  let diaNBool = false;
  if (diaNLine >= 0 && diaNLine <= 10) {
    diaNBool = checkLines(diaNLine, diaNLineIdx, diagonNs, turn);
  };

  return [rowBool, columnBool, diaPBool,diaNBool];
}

function checkMoveValid(i, j, turn) {
  if (checkerBoard[i][j] == '') {
    const [rowBool, columnBool, diaPBool,diaNBool] = generateLinesBools(i, j, turn);

    // console.log(`${rowBool}, ${columnBool}, ${diaPBool}, ${diaNBool}`);
    

    if (rowBool || columnBool || diaPBool || diaNBool) {
      return true;
    } else {
      return false;
    };
  };
  return false;
}

function changeBoard(i, j, turn) {
  const [rowLine, rowLineIdx, columnLine, columnLineIdx, 
    diaPLine, diaPLineIdx, diaNLine, diaNLineIdx] = getLinesInfo(i, j);

  const [rowBool, columnBool, diaPBool,diaNBool] = generateLinesBools(i, j, turn);

  // row
  if (rowBool) {
    let [leftBoundary, l, rightBoundary, r] = 
      getBoundaryInfo(rowLine, rowLineIdx, rows, turn);
    if (leftBoundary) {
      for (let idx = l; idx <= rowLineIdx; idx++){
        checkerBoard[i][idx] = turn;
      };
    } else if (rightBoundary) {
      for (let idx = rowLineIdx; idx <= r; idx++){
        checkerBoard[i][idx] = turn;
      };
    }
  };

  // column
  if (columnBool) {
    let [leftBoundary, l, rightBoundary, r] = 
      getBoundaryInfo(columnLine, columnLineIdx, columns, turn);
    if (leftBoundary) {
      for (let idx = l; idx <= columnLineIdx; idx++){
        checkerBoard[idx][j] = turn;
      };
    } else if (rightBoundary) {
      for (let idx = columnLineIdx; idx <= r; idx++){
        checkerBoard[idx][j] = turn;
      };
    }
  };

  // diagonPs
  if (diaPBool) {
    let [leftBoundary, l, rightBoundary, r] = 
      getBoundaryInfo(diaPLine, diaPLineIdx, diagonPs, turn);
    if (leftBoundary) {
      for (let idx = l; idx <= diaPLineIdx; idx++){
        if (diaPLine >= 0 && diaPLine <= 5) {
          checkerBoard[idx][idx - diaPLine + 5] = turn;
        } else if (diaPLine > 5 && diaPLine <= 10) {
          checkerBoard[idx + diaPLine - 5][idx] = turn;
        };
      };
    } else if (rightBoundary) {
      for (let idx = diaPLineIdx; idx <= r; idx++){
        if (diaPLine >= 0 && diaPLine <= 5) {
          checkerBoard[idx][idx - diaPLine + 5] = turn;
        } else if (diaPLine > 5 && diaPLine <= 10) {
          checkerBoard[idx + diaPLine - 5][idx] = turn;
        };
      };
    }
    
  }

  // diagonNs
  if (diaNBool) {
    let [leftBoundary, l, rightBoundary, r] = 
      getBoundaryInfo(diaNLine, diaNLineIdx, diagonNs, turn);
    if (leftBoundary) {
      for (let idx = l; idx <= diaNLineIdx; idx++){
        if (diaNLine >= 0 && diaNLine <= 5) {
          checkerBoard[idx][diaNLine - idx + 2] = turn;
        } else if (diaNLine > 5 && diaNLine <= 10) {
          checkerBoard[7 - idx][diaNLine + idx - 5] = turn;
        };
      };
    } else if (rightBoundary) {
      for (let idx = diaNLineIdx; idx <= r; idx++){
        if (diaNLine >= 0 && diaNLine <= 5) {
          checkerBoard[idx][diaNLine - idx + 2] = turn;
        } else if (diaNLine > 5 && diaNLine <= 10) {
          checkerBoard[7 - idx][diaNLine + idx - 5] = turn;
        };
      };
    }
  };
  updateCheckerBoard();
}


function checkEndGame(turn) {
  let count = 0;
  let blackPiece = 0;
  let whitePiece = 0;
  let endGameMessage = '';
  for (let i = 0; i < 8; i ++) {
    for (let j = 0; j < 8; j ++) {
      if (checkerBoard[i][j] == 'b') {
        blackPiece += 1;
      } else if (checkerBoard[i][j] == 'w') {
        whitePiece += 1;
      }

      if (checkMoveValid(i, j, turn)) {
        count += 1
      }
    }
  };
  if (count == 0) {
    isEndGame = true;
    if (blackPiece > whitePiece) {
      endGameMessage = '黑方獲勝';
      blackScore += 1;
    } else if (blackPiece < whitePiece) {
      endGameMessage = '白方獲勝';
      whiteScore += 1;
    } else {
      endGameMessage = '平手';
    }

    document.querySelector('.js-score-text').innerHTML = `黑方： ${blackPiece} ; 
      白方： ${whitePiece}`;
    document.querySelector('.js-result-text').innerHTML = endGameMessage;
    setTimeout(() => {
      document.querySelector('.js-grids').classList.add('is-end-game');
      document.querySelector('.js-black-score').innerHTML = blackScore;
      document.querySelector('.js-white-score').innerHTML = whiteScore;
    }, 1000)
  }
}



// Start here!!
let checkerBoard = [];
let rows = [];
let columns = [];
let diagonPs = []
let diagonNs = [];
let turn = 'b';
let isEndGame = false;
let blackScore = 0;
let whiteScore = 0;

initializeBoard();
updateCheckerBoard();

document.querySelectorAll('.js-single-grid').forEach((element, idx) => {
  element.addEventListener('click', () => {
    let i = parseInt( idx / 8);
    let j = idx % 8
    console.log(`${idx}, ${i}, ${j}`)
    if (!isEndGame && checkMoveValid(i, j, turn)) {
      changeBoard(i, j, turn);
      if (turn === 'b') {
        turn = 'w';
      } else if (turn === 'w') {
        turn = 'b';
      };
      updateTurnInfo(turn);
      checkEndGame(turn);
    }
  })
});

document.querySelector('.js-reset-button').addEventListener('click', () => {
  checkerBoard = [
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', 'w', 'b', '', '', ''],
    ['', '', '', 'b', 'w', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '']
  ];

  isEndGame = false;
  document.querySelector('.js-grids').classList.remove('is-end-game');
  initializeBoard();
  updateCheckerBoard();
});