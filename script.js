const board = (() => {
  const markers = {
    X: Symbol("X"),
    O: Symbol("O"),
  };

  const board = [
    [null, null, null],
    [null, null, null],
    [null, null, null],
  ];

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

  const getBoardInfo = () => cloneBoard();

  const getMarkers = () => Object.assign({}, markers);

  const getCell = (row, column) => board[row][column];

  return { setMarkerOnBoard, getBoardInfo, getMarkers, getCell };
})();
