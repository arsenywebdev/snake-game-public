// 31:49
// Need to share it in GitHub
const canvas = document.getElementById("game")
const ctx = canvas.getContext("2d")

class Snakepart {
    constructor(x, y) {
        this.x = x
        this.y = y
    }
}

// game properties
let speed = 7

let tileCount = 20
let tileSize = canvas.width / tileCount - 2

// sound
const gulpSound = new Audio("gulp.mp3")
const gameOverSound = new Audio("game-over.wav")
const speedIncreaseSound = new Audio("speedIncrease.wav")

// player
let headX = 10
let headY = 10
let tailLength = 2
const snakeParts = []

let score = 0

let xVelocity = 0 //horizontal movement
let yVelocity = 0 //vertical movement

// apple
let appleX = 5
let appleY = 5

// game loop
function drawGame() {
    changeSnakePosition()

    let result = isGameOver() // true == gameOver, false == continue
    if (result) {
        gameOverSound.play()
        return
    }

    clearScreen()
    checkAppleCollision()
    drawApple()
    drawSnake()
    drawScore()
    levelUpdate()
    setTimeout(drawGame, 1000 / speed)
}

function levelUpdate() {
    if (score == 5) {
        speed = 10
        speedIncreaseSound.play()
    }
    if (score == 10) {
        speed = 13
        speedIncreaseSound.play()
    }
    if (score == 20) {
        speed = 20
        speedIncreaseSound.play()
    }

}

function isGameOver() {
    let gameOver = false

    if (yVelocity === 0 && xVelocity === 0) {
        return false
    }

    //walls 
    //l wall
    if (headX < 0) {
        gameOver = true
    }
    // r wall
    else if (headX >= tileCount) {
        gameOver = true
    }
    // u wall
    else if (headY < 0) {
        gameOver = true
    }
    // d wall
    else if (headY >= tileCount) {
        gameOver = true
    }

    for (let i = 0; i < snakeParts.length; i++) {
        let part = snakeParts[i]
        if (part.x === headX && part.y === headY) {
            gameOver = true
            break
        }
    }

    if (gameOver) {
        ctx.font = "50px Verdana"

        var gradient = ctx.createLinearGradient(0, 0, canvas.width, 0)
        //gradient.addColorStop("0", "magenta")
        gradient.addColorStop("0", "blue")
        gradient.addColorStop("1.0", "red")

        ctx.fillStyle = gradient

        ctx.fillText("Game Over!", canvas.width / 6.5, canvas.height / 2)
    }

    return gameOver
}

function drawScore() {
    ctx.fillStyle = "white"
    ctx.font = "10px Verdana"
    ctx.fillText("Score: " + score, canvas.width - 50, 10)
}

function clearScreen() {
    ctx.fillStyle = 'black'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
}

function drawSnake() {

    ctx.fillStyle = 'green'
    for (let i = 0; i < snakeParts.length; i++) {
        let part = snakeParts[i]
        ctx.fillRect(part.x * tileCount, part.y * tileCount, tileSize, tileSize)
    }

    snakeParts.push(new Snakepart(headX, headY))
    while (snakeParts.length > tailLength) {
        snakeParts.shift()
    }

    ctx.fillStyle = 'orange'
    ctx.fillRect(headX * tileCount, headY * tileCount, tileSize, tileSize)

}

function changeSnakePosition() {
    headX = headX + xVelocity
    headY = headY + yVelocity
}

function drawApple() {
    ctx.fillStyle = 'red'
    ctx.fillRect(appleX * tileCount, appleY * tileCount, tileSize, tileSize)
}

function checkAppleCollision() {
    if (appleX == headX && appleY == headY) {
        appleX = Math.floor(Math.random() * 20)
        appleY = Math.floor(Math.random() * 20)
        tailLength++
        score++
        gulpSound.play()
    }
}


// Waiting untill player start pressing the buttons
document.body.addEventListener('keydown', keyDown)

function keyDown(event) {
    // up
    if (event.keyCode == 38) {
        if (yVelocity == 1) return
        yVelocity = -1
        xVelocity = 0
    }

    //down
    if (event.keyCode == 40) {
        if (yVelocity == -1) return
        yVelocity = 1
        xVelocity = 0
    }

    // left
    if (event.keyCode == 37) {
        if (xVelocity == 1) return
        yVelocity = 0
        xVelocity = -1
    }

    //right
    if (event.keyCode == 39) {
        if (xVelocity == -1) return
        yVelocity = 0
        xVelocity = 1
    }

}


drawGame()