const grid = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""]
]

const players = ["X", "O"]
const game = document.querySelector('#game')
const gameContainer = document.querySelector('.game_container')

let currentPlayer = 0
let vsComputer = false

function createmap(map) {
    const versusPlayer = document.querySelector('#vsPlayer')
    versusPlayer.classList.add('selected')
    const announce = document.createElement('h2')
    announce.id = 'announce'
    game.appendChild(announce)
    updateAnnouncement()

    map.forEach((row, rowIndex) => {
        const tocAudio = document.querySelector('#toc')
        const rowContainer = document.createElement('div')
        rowContainer.classList.add('row')
        game.appendChild(rowContainer)

        row.forEach((cell, cellIndex) => {
            const cellContainer = document.createElement('div')
            cellContainer.classList.add('cell')
            cellContainer.addEventListener('click', () => {
                if (!cellContainer.dataset.value && !vsComputer) {
                    tocAudio.play()
                    cellContainer.dataset.value = players[currentPlayer]
                    cellContainer.textContent = players[currentPlayer]
                    map[rowIndex][cellIndex] = players[currentPlayer]

                    if (checkwin()) {
                        announce.innerHTML = `${players[currentPlayer]} a gagné`
                    } else {
                        currentPlayer = 1 - currentPlayer
                        if (draw()) {
                            announce.innerHTML = `ÉGALITÉ !`
                        } else {
                            updateAnnouncement()
                        }
                    }
                } else if (!cellContainer.dataset.value && vsComputer && currentPlayer === 0) {
                    tocAudio.play()
                    cellContainer.dataset.value = players[currentPlayer]
                    cellContainer.textContent = players[currentPlayer]
                    map[rowIndex][cellIndex] = players[currentPlayer]

                    if (checkwin()) {
                        announce.innerHTML = `${players[currentPlayer]} a gagné`
                    } else {
                        currentPlayer = 1 - currentPlayer
                        if (!draw()) {
                            setTimeout(computerMove, 500)
                        } else {
                            announce.innerHTML = `ÉGALITÉ !`
                        }
                    }
                }
            })
            rowContainer.appendChild(cellContainer)
        })
    })
}

function restart() {
    grid.forEach(row => row.fill(''))
    currentPlayer = 0
    const update = document.querySelector('#announce')
    update.innerHTML = `Au tour de ${players[currentPlayer]} de jouer`
    const cells = document.querySelectorAll('.cell')
    cells.forEach(cell => {
        cell.dataset.value = ""
        cell.textContent = ""
        cell.classList.remove('victory')
    })
}

function checkwin() {
    const victoryAudio = document.querySelector('#victory')
    const cells = document.querySelectorAll('.cell')
    for (let i = 0; i < 3; i++) {
        if (grid[0][i] && grid[0][i] === grid[1][i] && grid[0][i] === grid[2][i]) {
            cells.forEach((cell, index) => {
                if (index === i || index === i + 3 || index === i + 6) {
                    cell.classList.add('victory')
                    victoryAudio.play()
                }
            })
            return true
        }
        if (grid[i][0] && grid[i][0] === grid[i][1] && grid[i][0] === grid[i][2]) {
            cells.forEach((cell, index) => {
                if (index >= i * 3 && index < (i + 1) * 3) {
                    cell.classList.add('victory')
                    victoryAudio.play()
                }
            })
            return true
        }
    }
    if (grid[0][0] && grid[0][0] === grid[1][1] && grid[0][0] === grid[2][2]) {
        cells.forEach((cell, index) => {
            if (index === 0 || index === 4 || index === 8) {
                cell.classList.add('victory')
                victoryAudio.play()
            }
        })
        return true
    }
    if (grid[0][2] && grid[0][2] === grid[1][1] && grid[0][2] === grid[2][0]) {
        cells.forEach((cell, index) => {
            if (index === 2 || index === 4 || index === 6) {
                cell.classList.add('victory')
                victoryAudio.play()
            }
        })
        return true
    }
    return false
}

function draw() {
    const cells = document.querySelectorAll('.cell')
    let isDraw = true

    for (let cell of cells) {
        if (cell.textContent === "") {
            isDraw = false
            break
        }
    }

    if (isDraw) {
        const drawSound = document.querySelector('#draw-sound')
        const announce = document.querySelector('#announce')
        announce.innerHTML = `ÉGALITÉ !`
        drawSound.play()
    }

    return isDraw
}

function updateAnnouncement() {
    const update = document.querySelector('#announce')
    update.innerHTML = `Au tour de ${players[currentPlayer]} de jouer`
}

function computerMove() {
    const emptyCells = []
    const cells = document.querySelectorAll('.cell')

    cells.forEach((cell, index) => {
        if (cell.textContent === "") {
            emptyCells.push(index)
        }
    })

    if (emptyCells.length > 0) {
        const randomIndex = Math.floor(Math.random() * emptyCells.length)
        const cellIndex = emptyCells[randomIndex]
        const cell = cells[cellIndex]

        cell.dataset.value = players[currentPlayer]
        cell.textContent = players[currentPlayer]

        const rowIndex = Math.floor(cellIndex / 3)
        const colIndex = cellIndex % 3
        grid[rowIndex][colIndex] = players[currentPlayer]

        if (checkwin()) {
            announce.innerHTML = `${players[currentPlayer]} a gagné`
        } else {
            currentPlayer = 1 - currentPlayer
            if (draw()) {
                announce.innerHTML = `ÉGALITÉ !`
            } else {
                updateAnnouncement()
            }
        }
    }
}

document.querySelector('#vsPlayer').addEventListener('click', () => {
    const versusComputer = document.querySelector('#vsComputer')
    const versusPlayer = document.querySelector('#vsPlayer')
    versusPlayer.classList.add('selected')
    versusComputer.classList.remove('selected')
    vsComputer = false
    restart()
})

document.querySelector('#vsComputer').addEventListener('click', () => {
    const versusComputer = document.querySelector('#vsComputer')
    const versusPlayer = document.querySelector('#vsPlayer')
    vsComputer = true
    versusComputer.classList.add('selected')
    versusPlayer.classList.remove('selected')
    restart()
})

document.querySelector('#restart').addEventListener('click', () => {
    restart()
})

createmap(grid)