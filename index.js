const gameBoard = (() => {
  const _boardMatrix = new Array(3).fill(new Array(3).fill(0))

  const print = () => console.log(_boardMatrix)
  return { print }
})()

const Player = (symbol) => {
  const getSymbol = () => symbol
  return { getSymbol }
}

const playerX = Player("X")
const playerO = Player("O")
