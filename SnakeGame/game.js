// game.js

let score = 0;

// Retrieve player name from localStorage
const playerName = localStorage.getItem("playerName") || "Guest";

// Display the score (optional: you can display the player's name if desired)
document.getElementById("scoreNumber").innerHTML = score;

// Event listener for "Play Again" button
document.getElementById("startGame").addEventListener("click", function(){
    window.game.scene.keys["SnakeScene"].snake.resetGame();
});

// Event listener for "Home" button
document.getElementById("backToHome").addEventListener("click", function(){
    window.location.href = "index.html";
});

class SnakeScene extends Phaser.Scene {
    constructor() {
        super({
            key: "SnakeScene"
        });
    }

    preload() {
        this.load.image("food","assets/alien.png");
        this.load.image("snakeRight","assets/myphoto.png");
        this.load.image("snakeLeft","assets/myphoto.png");
        this.load.image("snakeUp","assets/myphoto.png");
        this.load.image("snakeDown","assets/myphoto.png");
        this.load.image("bodyHorizontal","assets/body_horizontal.png");
        this.load.image("bodyVertical","assets/body_vertical.png");
        this.load.image("bodyRightUp","assets/body_rightup.png");
        this.load.image("bodyRightDown","assets/body_rightdown.png");
        this.load.image("bodyDownRight","assets/body_downright.png");
        this.load.image("bodyUpRight","assets/body_upright.png");
        this.load.image("tailRight","assets/tail_right.png");
        this.load.image("tailLeft","assets/tail_left.png");
        this.load.image("tailUp","assets/tail_up.png");
        this.load.image("tailDown","assets/tail_down.png");
        this.load.image("background","assets/stars.jpg");
        this.load.audio("eat","assets/eat.mp3");
        this.load.audio("hit","assets/hit.wav");
    }

    create() {
        let bg = this.add.image(0, 0, 'background');
        bg.setDisplaySize(window.innerWidth, window.innerHeight);
        bg.setOrigin(0, 0);
        
        this.snake = new Snake(this, 400, 100);
        this.food = new Food(this, 400, 300);
        this.physics.world.enable(this.food);
        this.physics.world.enable(this.snake.body[0]);
        this.cursors = this.input.keyboard.createCursorKeys();
    }

    update(time) {
        if(!this.snake.alive) return;
        let directions = {
            "left" : Phaser.Math.Vector2.LEFT,
            "right" : Phaser.Math.Vector2.RIGHT,
            "up" : Phaser.Math.Vector2.UP,
            "down" : Phaser.Math.Vector2.DOWN,
        };
        let animations = {
            "left": "moveLeft",
            "right": "moveRight",
            "up": "moveUp",
            "down": "moveDown",
        };

        for(let [direction, vector] of Object.entries(directions)) {
            if(this.cursors[direction].isDown) {
                this.snake.faceDirection(vector, animations[direction]);
            }
        }

        if(this.snake.update(time)) {
            if(this.physics.overlap(this.snake.body[0], this.food)) {
                this.food.reposition();
                this.snake.grow();
            }
        }
    }
}

let snakeHead;
class Snake{
    constructor(scene) {
        this.scene = scene;
        this.body=[];
        this.positions=[];
        this.directions=[];
        this.gameStarted = false;
        this.keyLock = false;
        this.moveEvents = [];
        this.bodyParts = [];
        this.body.push(this.scene.physics.add.sprite(100,300,"snakeRight"));
        snakeHead = this.body[0];
        snakeHead.setCollideWorldBounds(true);
        snakeHead.body.onWorldBounds = true;
        snakeHead.body.world.on("worldbounds",this.endGame,this);
        this.bodyPartLength = snakeHead.displayWidth;
        this.body.push(this.scene.physics.add.sprite(100 - this.bodyPartLength,300,"tailLeft"));
        this.direction = Phaser.Math.Vector2.RIGHT;
        this.directions.unshift(this.direction.clone());
        this.eat = this.scene.sound.add("eat");
        this.hit = this.scene.sound.add("hit");
        this.moveTime =0;
        this.score =0;
        this.speed = 150;
        this.alive = true;
        scene.anims.create({
            key: "moveUp",
            frames: [{key: "snakeUp"}],
        });
        scene.anims.create({
            key: "moveDown",
            frames: [{key: "snakeDown"}],
        });
        scene.anims.create({
            key: "moveLeft",
            frames: [{key: "snakeLeft"}],
        });
        scene.anims.create({
            key: "moveRight",
            frames: [{key: "snakeRight"}],
        });
    }

    faceDirection(vector, animation) {
        this.gameStarted = true;
        let oppositeVector = new Phaser.Math.Vector2(-vector.x,-vector.y);
        if(!this.keyLock && !this.direction.equals(oppositeVector)) {
            this.moveEvents.push(vector);
            this.keyLock = true;
            snakeHead.anims.play(animation,true);
        }
    }

    update(time) {
        if(time >= this.moveTime && this.gameStarted) {
            this.keyLock = false;
            if(this.moveEvents.length > 0) {
                this.direction = this.moveEvents.shift();
            }
            this.move();
            return true;
        }
        return false;
    }

    move() {
        let oldHeadPosition = {x: snakeHead.x, y: snakeHead.y};
        this.directions.unshift(this.direction.clone());
        snakeHead.x += this.direction.x * this.bodyPartLength;
        snakeHead.y += this.direction.y * this.bodyPartLength;

        if(snakeHead.x > game.config.width || snakeHead.x < 0 || snakeHead.y > game.config.height || snakeHead.y < 0) return;

        for(let i=1; i<this.body.length; i++) {
            let oldBodyPosition = {x:this.body[i].x, y: this.body[i].y};
            let oldBodyDirection = this.directions[i];
            this.body[i].x = oldHeadPosition.x;
            this.body[i].y = oldHeadPosition.y;
            oldHeadPosition = oldBodyPosition;
            this.setBodyPartTexture(i, oldBodyDirection);
        }
        this.setTailTexture();
        if(this.positions.length > this.body.length * this.bodyPartLength) {
            this.positions.pop();
            this.directions.pop();
        }
        this.moveTime = this.scene.time.now + this.speed;
    }

    setBodyPartTexture(i, oldBodyDirection) {
        if(!oldBodyDirection.equals(this.directions[i-1])) {
            let prevDirection = `${this.directions[i-1].x},${this.directions[i-1].y}`;
            let currDirection = `${oldBodyDirection.x},${oldBodyDirection.y}`;
            let textureMap = {
                "1,0,0,-1": "bodyUpRight",
                "0,1,-1,0": "bodyUpRight",
                "-1,0,0,1": "bodyRightUp",
                "0,-1,1,0": "bodyRightUp",
                "0,1,1,0": "bodyRightDown",
                "-1,0,0,-1": "bodyRightDown",
                "0,-1,-1,0": "bodyDownRight",
                "1,0,0,1": "bodyDownRight",
            };
            let directionKey = `${prevDirection},${currDirection}`;
            this.body[i].setTexture(textureMap[directionKey]);
        } else {
            if(oldBodyDirection.y !=0) {
                this.body[i].setTexture("bodyVertical");
            } else {
                this.body[i].setTexture("bodyHorizontal");
            }
        }
    }

    setTailTexture() {
        let tailIndex = this.body.length - 1;
        if(tailIndex > 0) {
            let prevDirection = this.directions[tailIndex-1];
            let textureMap = {
                "0,-1": "tailDown",
                "0,1": "tailUp",
                "-1,0": "tailRight",
                "1,0": "tailLeft",
            };
            let directionKey = `${prevDirection.x},${prevDirection.y}`;
            this.body[tailIndex].setTexture(textureMap[directionKey]);
        }
    }

    grow() {
        let newPart = this.scene.physics.add.sprite(-1 * this.bodyPartLength, -1 * this.bodyPartLength, "tailRight");
        this.scene.physics.add.collider(snakeHead, newPart, this.endGame, null, this.scene.snake);
        let collider = this.scene.physics.add.collider(snakeHead, newPart, this.endGame, null, this.scene.snake);
        this.bodyParts.push(newPart);
        this.body.push(newPart);

        this.eat.play();
        score++;
        document.getElementById("scoreNumber").innerHTML = score;
    }

    endGame() {
        this.alive = false;
        document.getElementById("gameControlPanel").style.display = "flex";
        document.getElementById("finalScore").innerHTML = score;

        // Store the score and name in localStorage
        storeScore(playerName, score);

        this.bodyParts.forEach(newPart => {
            newPart.body.enable = false;
        });
        this.hit.play();
    }

    resetGame = () => {
        // Reset score
        score = 0;
        document.getElementById("scoreNumber").innerHTML = score;

        // Reset snake
        this.scene.scene.restart();

        // Hide control panel
        document.getElementById("gameControlPanel").style.display = "none";
    }
}

class Food extends Phaser.GameObjects.Image{
    constructor(scene, x, y) {
        super(scene, x, y, "food");
        this.scene.add.existing(this);
    }

    reposition() {
        let bodyPartLength = this.scene.snake.bodyPartLength;
        let x = Phaser.Math.Between(0, (this.scene.game.config.width / bodyPartLength) - 1);
        let y = Phaser.Math.Between(0, (this.scene.game.config.height / bodyPartLength) - 1);
        x = bodyPartLength * x + 0.5 * bodyPartLength;
        y = bodyPartLength * y + 0.5 * bodyPartLength;
        let bodyParts = this.scene.snake.body;
        this.setPosition(x, y);
        for(let i=1; i<bodyParts.length; i++) {
            let spriteBounds = bodyParts[i].getBounds();
            if(spriteBounds.contains(x, y)) {
                this.reposition();
                break;
            }
        }
    }
}

const config = {
    type : Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    physics:{
        default: "arcade",
        arcade:{
            gravity:{y:0},
        },
    },
    scene: [SnakeScene],
};

window.game = new Phaser.Game(config);

// Function to store the score in localStorage
function storeScore(name, score) {
    // Retrieve existing scores
    let scores = JSON.parse(localStorage.getItem("scores")) || [];

    // Add the new score
    scores.push({ name: name, score: score });

    // Save back to localStorage
    localStorage.setItem("scores", JSON.stringify(scores));
}
