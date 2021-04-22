const gameBoard = (() => {
  const _boardMatrix = new Array(3).fill(new Array(3).fill(0))

  const draw = () => {
    const boardContainer = document.getElementById("board-container")

    // If the table was already drawn, remove it
    if (boardContainer.childNodes.length === 1) {
      boardContainer.removeChild(boardContainer.childNodes[0])
    }

    // Draw a new table
    const boardTable = document.createElement("table")
    _boardMatrix.forEach((row) => {
      const boardTableRow = document.createElement("tr")
      row.forEach((cell) => {
        const boardTableCell = document.createElement("td")
        boardTableCell.textContent = cell
        boardTableRow.appendChild(boardTableCell)
      })
      boardTable.appendChild(boardTableRow)
    })
    boardContainer.appendChild(boardTable)
  }

  return { draw }
})()

const Player = (symbol) => {
  const getSymbol = () => symbol
  return { getSymbol }
}

const playerX = Player("X")
const playerO = Player("O")
gameBoard.draw()
