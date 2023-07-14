const board = (() => {
  const markers = {
    X: Symbol("X"), // Symbol creates a unique value
    O: Symbol("O"),
  };

  const board = [
    [null, null, null],
    [null, null, null],
    [null, null, null],
  ];

  /* Returns a clone of the board array, used by functions like getBoardInfo, to prevent outside code from modifying board directly(through the returned reference).   */
  const cloneBoard = () => board.map((row) => [...row]);

  const setMarkerOnBoard = (marker, row, column) => {
    if (row > 2 || row < 0 || column > 2 || column < 0)
      throw Error("Row or column values should be between 0 and 2");

    if (marker !== markers.X && marker !== markers.O)
      throw Error("Invalid marker");

    if (board[row][column] !== null)
      throw Error(
        `Cell with row:${row} and column:${column} already contains a marker`
      );

    board[row][column] = marker;

    return cloneBoard();
  };

  const getBoardInfo = () => {
    const board = cloneBoard();
    let emptyCells = 0;
    board.forEach(
      (row) => (emptyCells += row.filter((column) => column === null).length)
    );

    return { board, emptyCells };
  };

  // Returns all the markers that can be used in board. (X and O)
  const getMarkers = () => Object.assign({}, markers);

  // Returns the marker at a given cell.
  const getCell = (row, column) => board[row][column];

  const resetBoard = () => {
    board.forEach((row) => row.fill(null));
  };

  return { setMarkerOnBoard, getBoardInfo, getMarkers, getCell, resetBoard };
})();

const Player = (name, board, marker) => {
  /* Board is taken as a parameter to avoid making Player dependent on 
     the global variable board. */

  // Checks if the given marker is valid to be played on the given board
  if (name === undefined) throw new Error("Invalid name");

  if (board === undefined || board === null) throw new Error("Invalid board");

  const validMarkers = board.getMarkers();
  if (marker !== validMarkers.X && marker !== validMarkers.O)
    throw new Error(`Invalid marker: ${marker}`);

  let score = 0;

  const getMarker = () => marker;

  const getName = () => name;

  const incrScore = () => ++score;

  const getScore = () => score;

  const getPlayerInfo = () => ({ name, marker, score });

  return { getMarker, getName, incrScore, getScore, getPlayerInfo };
};

const game = ((board, Player, document) => {
  const getInitialPlayerInfo = () => {
    /* Get all the initial player info from the DOM */

    // Temporarily returning mock data
    return {
      playerX: Player("Player One", board, board.getMarkers().X),
      playerO: Player("Player Two", board, board.getMarkers().O),
    };
  };

  const players = getInitialPlayerInfo(document);
  if (!players.playerO || !players.playerX)
    throw new Error("Invalid number of players");

  // PlayerX is assumed to have the first turn to play
  let activePlayer = players.playerX;
  const lastUpdatedCell = { row: -1, column: -1 };

  const updateActivePlayer = () => {
    activePlayer =
      activePlayer === players.playerX ? players.playerO : players.playerX;
  };

  const placeMarker = (row, column) => {
    try {
      board.setMarkerOnBoard(activePlayer.getMarker(), row, column);
      lastUpdatedCell.row = row;
      lastUpdatedCell.column = column;
    } catch (err) {
      lastUpdatedCell.row = -1;
      lastUpdatedCell.column = -1;
      console.error(`Unable to place the marker on board: ${err}`);
      throw err;
    }
  };

  // Returns the marker of the player who won or null or 1 on draw
  const checkStatus = () => {
    const { board: currBoard, emptyCells } = board.getBoardInfo();
    if (emptyCells === 0) return 1;
    let gameOver = false;

    // row check
    gameOver = currBoard[lastUpdatedCell.row].every(
      (column) => column === currBoard[lastUpdatedCell.row][0]
    );
    if (gameOver) return currBoard[lastUpdatedCell.row][0];

    // column check
    gameOver = true;
    for (let i = 1; i < 3; i++) {
      if (
        currBoard[i][lastUpdatedCell.column] !==
        currBoard[0][lastUpdatedCell.column]
      ) {
        gameOver = false;
      }
    }
    if (gameOver) return currBoard[0][lastUpdatedCell.column];

    // Diagonal 1
    gameOver = true;
    for (let n = 1, i = 0, j = 0; n < 3; n++) {
      if (currBoard[++i][++j] !== currBoard[0][0]) gameOver = false;
    }
    if (gameOver) return currBoard[0][0];

    // Diagonal 2
    gameOver = true;
    for (let n = 1, i = 0, j = 2; n < 3; n++) {
      if (currBoard[++i][--j] !== currBoard[0][2]) gameOver = false;
    }
    if (gameOver) return currBoard[0][2];

    return null;
  };
})(board, Player, document);

game.start();
