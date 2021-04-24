const Colors = (() => {
	const X_COLOR = "rgb(42, 141, 255)"
	const O_COLOR = "rgb(255, 113, 113)"

	return { X_COLOR, O_COLOR }
})()

const gameBoard = (() => {
	// The internal table matrix
	const _boardMatrix = Array(3)
		.fill(null)
		.map(() => Array(3).fill(""))

	const myMatrix = Array(3)
		.fill(null)
		.map(() => Array(3).fill(0))

	// Update an individual cell (used when pressed)
	const _fillCellForPlayer = (tableCell, coords, currentPlayer) => {
		playerSymbol = currentPlayer.getSymbol()
		tableCell.textContent = playerSymbol
		if (playerSymbol === "X") {
			tableCell.style.color = Colors.X_COLOR
		} else {
			tableCell.style.color = Colors.O_COLOR
		}
		_boardMatrix[coords.y][coords.x] = playerSymbol
	}

	// Draw the game in the HTML page
	const draw = (currentPlayer, turnEndedCallback, gameEnded) => {
		const boardContainer = document.getElementById("board-container")

		// If the table was already drawn, remove it
		while (boardContainer.childNodes.length !== 0) {
			boardContainer.removeChild(boardContainer.childNodes[0])
		}

		// Draw a new table
		const boardTable = document.createElement("table")
		boardTable.className = "padded-table"
		_boardMatrix.forEach((row, rowIndex) => {
			// Create a new row
			const boardTableRow = document.createElement("tr")
			row.forEach((cell, columnIndex) => {
				// Create a new column in the row for each cell
				const boardTableCell = document.createElement("td")
				boardTableCell.textContent = cell
				boardTableRow.appendChild(boardTableCell)

				// This cell is empty
				if (!cell && !gameEnded) {
					// Adjust the cursor & background-color when hovering
					boardTableCell.addEventListener("mouseenter", () => {
						boardTableCell.style.cursor = "pointer"
						boardTableCell.style.backgroundColor = "#f7f7f7"
					})
					// Restore the background-color when leaving the cell with the cursor
					boardTableCell.addEventListener("mouseleave", () => {
						boardTableCell.style.backgroundColor = "#FFFFFF"
					})

					// The cell was clicked
					boardTableCell.addEventListener("click", () => {
						_fillCellForPlayer(
							boardTableCell,
							{ x: columnIndex, y: rowIndex },
							currentPlayer
						)
						turnEndedCallback()
					})
				}
				// This cell has a symbol in it
				else {
					if (cell === "X") {
						boardTableCell.style.color = Colors.X_COLOR
					} else {
						boardTableCell.style.color = Colors.O_COLOR
					}

					boardTableCell.addEventListener("mouseenter", () => {
						boardTableCell.style.cursor = "default"
					})
				}
			})
			boardTable.appendChild(boardTableRow)
		})
		boardContainer.appendChild(boardTable)
	}

	const isTableFull = () => {
		for (let y = 0; y < 3; y++) {
			for (let x = 0; x < 3; x++) {
				if (_boardMatrix[y][x] === "") {
					return false
				}
			}
		}
		return true
	}

	const getWinner = () => {
		// Check for row winner
		for (let y = 0; y < 3; y++) {
			let rowHasSameSymbol = true
			for (let x = 1; x < 3; x++) {
				if (_boardMatrix[y][x] !== _boardMatrix[y][0]) {
					rowHasSameSymbol = false
					break
				}
			}
			if (_boardMatrix[y][0] && rowHasSameSymbol) {
				return _boardMatrix[y][0]
			}
		}

		// Check for column winner
		for (let x = 0; x < 3; x++) {
			let columnHasSameSymbol = true
			for (let y = 0; y < 3; y++) {
				if (_boardMatrix[y][x] !== _boardMatrix[0][x]) {
					columnHasSameSymbol = false
					break
				}
			}
			if (_boardMatrix[0][x] && columnHasSameSymbol) {
				return _boardMatrix[0][x]
			}
		}

		// Check for main diagonal winner
		if (
			_boardMatrix[0][0] === _boardMatrix[1][1] &&
			_boardMatrix[1][1] === _boardMatrix[2][2] &&
			_boardMatrix[0][0]
		) {
			return _boardMatrix[0][0]
		}
		// Check for secondary diagonal winner
		if (
			_boardMatrix[0][2] === _boardMatrix[1][1] &&
			_boardMatrix[1][1] === _boardMatrix[2][0] &&
			_boardMatrix[0][2]
		) {
			return _boardMatrix[0][2]
		}
		return null
	}

	const reset = (currentPlayer, turnEndedCallback) => {
		_boardMatrix.map((x) => x.fill(""))
		draw(currentPlayer, turnEndedCallback)
	}

	return { draw, getWinner, isTableFull, reset }
})()

const Player = (symbol) => {
	const getSymbol = () => symbol
	return { getSymbol }
}

const Game = (() => {
	const playerX = Player("X")
	const playerO = Player("O")
	let currentPlayer = playerX

	const play = () => {
		_drawCurrentPlayerText()
		const winner = gameBoard.getWinner()
    const isTableFull = gameBoard.isTableFull()
		const isDraw = !winner && isTableFull
    const gameEnded = winner || isDraw
		gameBoard.draw(currentPlayer, turnEndedCallback, gameEnded)



		// The game ended
		if (winner || gameBoard.isTableFull()) {
			const restartButton = document.getElementById("restart-button")
			restartButton.style.display = "block"

			const currentTurn = document.getElementById("current-turn")
			currentTurn.style.display = "none"
			if (isDraw) {
				const drawText = document.getElementById("draw-text")
				drawText.style.display = "inline-block"
			} else {
				const winnerText = document.getElementById("winner-text")
				winnerText.style.display = "inline-block"

				const winnerSymbol = document.getElementById("winner-symbol")
				winnerSymbol.textContent = winner
				winnerSymbol.style.color =
					winner === "X" ? Colors.X_COLOR : Colors.O_COLOR
				winnerSymbol.style.fontWeight = "600"
			}
		}
	}

	const restartButton = document.getElementById("restart-button")
	restartButton.addEventListener("click", () => {
		restart()
	})

	const restart = () => {
		// Reset the DOM
		const restartButton = document.getElementById("restart-button")
		restartButton.style.display = "none"

		const currentTurn = document.getElementById("current-turn")
		currentTurn.style.display = "block"

		const drawText = document.getElementById("draw-text")
		drawText.style.display = "none"
		const winnerText = document.getElementById("winner-text")
		winnerText.style.display = "none"
		// Reset the player
		currentPlayer = playerX
		_drawCurrentPlayerText()

		// Clear up the board
		gameBoard.reset(currentPlayer, turnEndedCallback)
	}

	const _drawCurrentPlayerText = () => {
		const currentTurnSymbol = document.getElementById("current-turn-symbol")
		const currentSymbol = currentPlayer.getSymbol()
		currentTurnSymbol.textContent = currentSymbol
		currentTurnSymbol.style.color =
			currentSymbol === "X" ? Colors.X_COLOR : Colors.O_COLOR
		currentTurnSymbol.style.fontWeight = "600"
	}

	const turnEndedCallback = () => {
		if (currentPlayer === playerX) {
			currentPlayer = playerO
		} else {
			currentPlayer = playerX
		}
		play()
	}

	play()

	return { play, restart }
})()
