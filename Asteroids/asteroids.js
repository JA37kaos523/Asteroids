let canvas;
let ctx;
let canvasWidth = 1400;
let canvasHeight = 900;
let keys = [];
let ship;
let bullets = [];
let asteroids = [];
let score = 0;
let lives = 3;
let colors = ["yellow", "red"];
let level = 1;
let numberOfStartingAsteroids = 1;
let asteroidStartingSpeed = 3;
let killCount = 0;
let totalBullets = 0;
let hits = 0;
let killStreak = 0;


document.addEventListener("DOMContentLoaded", SetupCanvas);

function SetupCanvas() {
    canvas = document.getElementById("my-canvas");
    ctx = canvas.getContext("2d");
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ship = new Ship();

    for (let i = 0; i < numberOfStartingAsteroids; i++) {
        asteroids.push(new Asteroid());
    }

    document.body.addEventListener("keydown", function(e) {
        keys[e.keyCode] = true;

    });
    document.body.addEventListener("keyup", function(e) {
        keys[e.keyCode] = false;
        if (e.keyCode === 32) {
            totalBullets += 1;
            bullets.push(new Bullet(ship.angle));
        }

    });
    Render();
}

class Ship {
    constructor() {
        this.visible = true;
        this.x = canvasWidth / 2;
        this.y = canvasHeight / 2;
        this.movingForward = false;
        this.speed = 0.1;
        this.velX = 0;
        this.velY = 0;
        this.rotateSpeed = 0.002;
        this.radius = 15;
        this.angle = 0;
        this.strokeColor = "white";
        this.noseX = canvasWidth / 2 + 15;
        this.noseY = canvasHeight / 2;
    }
    Rotate(dir) {
        this.angle += this.rotateSpeed * dir;
    }
    Update() {
        let radians = this.angle / Math.PI * 180;
        if (this.movingForward) {
            this.velX += Math.cos(radians) * this.speed;
            this.velY += Math.sin(radians) * this.speed;
        }
        if (this.x < this.radius) {
            this.x = canvas.width;
        }
        if (this.x > canvas.width) {
            this.x = this.radius;
        }
        if (this.y < this.radius) {
            this.y = canvas.height;
        }
        if (this.y > canvas.height) {
            this.y = this.radius;
        }
        this.velX *= 0.99;
        this.velY *= 0.99;
        this.x -= this.velX;
        this.y -= this.velY;
    }

    Draw() {
        ctx.strokeStyle = this.strokeColor;
        ctx.beginPath();
        let vertAngle = ((Math.PI * 2) / 3);
        let radians = this.angle / Math.PI * 180;
        this.noseX = this.x - this.radius * Math.cos(radians);
        this.noseY = this.y - this.radius * Math.sin(radians);
        for (let i = 0; i < 3; i++) {
            ctx.lineTo(this.x - this.radius * Math.cos(vertAngle * i + radians), this.y - this.radius * Math.sin(vertAngle * i + radians));
        }
    


        ctx.closePath();
        ctx.stroke(); 
    }
}

class Bullet {
    constructor(angle) {
        this.visible = true;
        this.x = ship.noseX;
        this.y = ship.noseY;
        this.angle = angle;
        this.height = 8;
        this.width = 8;
        this.speed = 10;
        this.velX = 0;
        this.velY = 0;
    }
    Update() {
        let radians = this.angle / Math.PI * 180;
        this.x -= Math.cos(radians) * this.speed;
        this.y -= Math.sin(radians) * this.speed;
    }

    Draw() {
        ctx.fillStyle = "white";
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

class Asteroid {
    constructor(x, y, radius, level, collisionRadius) {
        this.visible = true;;
        this.x = x || Math.floor(Math.random() * canvasWidth);
        this.y = y || Math.floor(Math.random() * canvasHeight);
        this.speed = asteroidStartingSpeed;
        this.radius = radius || 50; 
        this.angle = Math.floor(Math.random() * 359);
        this.strokeColor = "white";
        this.collisionRadius = collisionRadius || 46;
        this.level = level || 1;
    }
    Update() {
        let radians = this.angle / Math.PI * 180;
        this.x += Math.cos(radians) * this.speed;
        this.y += Math.sin(radians) * this.speed;
        if (this.x < this.radius) {
            this.x = canvas.width;
        }
        if (this.x > canvas.width) {
            this.x = this.radius;
        }
        if (this.y < this.radius) {
            this.y = canvas.height;
        }
        if (this.y > canvas.height) {
            this.y = this.radius;
        }
    }
    Draw() {
        ctx.beginPath();
        ctx.strokeStyle = colors[Math.floor(Math.random() * 2)];
        let vertAngle = ((Math.PI * 2) / 6);
        let radians = this.angle / Math.PI * 180;
        for (let i = 0; i < 6; i++) {
            ctx.lineTo(this.x - this.radius * Math.cos(vertAngle * i + radians), this.y - this.radius * Math.sin(vertAngle * i + radians));
        }
        ctx.closePath();
        ctx.stroke(); 
    }
}

function CircleCollision(p1x, p1y, r1, p2x, p2y, r2) {
    let radiusSum;
    let xDiff;
    let yDiff;
    radiusSum = r1 + r2;
    xDiff = p1x - p2x;
    yDiff = p1y - p2y;
    if (radiusSum > Math.sqrt(xDiff * xDiff + yDiff * yDiff)) {
        return true;
    } else {
        return false;
    }
}

function DrawLifeShips() {
    let startX = 1350;
    let startY = 20;
    let points = [[15, 19], [-15, 19]];
    ctx.strokeStyle = "red";
    
    for (let i = 0; i < lives; i++) {
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        for (let i = 0; i < points.length; i++) {
            ctx.lineTo(startX + points[i][0], startY + points[i][1]);
        }
        ctx.closePath();
        ctx.stroke();
        startX -= 50;
    }
}

function advanceLevel() {
    if (asteroids.length === 0) {
        numberOfStartingAsteroids += 1;
        asteroidStartingSpeed += 1;
        for (let i = 0; i < numberOfStartingAsteroids; i++) {
            asteroids.push(new Asteroid());
        }
        level += 1;
        
    }
}

function Render() {
    advanceLevel();
    ship.movingForward = (keys[87]);
    if (keys[68]) {
        ship.Rotate(1);
    }
    if (keys[65]) {
        ship.Rotate(-1);
    }
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.textAlign = "center";
    ctx.fillStyle = "white";
    ctx.font = "21px Arial";
    ctx.fillText("SCORE: " + score.toString(), 100, 30);

 
    ctx.font = "32px Arial";
    ctx.fillText("Level " + level.toString(), canvasWidth / 2, 35);
    
    ctx.font = "35px Arial";
    ctx.fillText("Kill Count: " + killCount.toString(), canvasWidth / 2, Math.floor(canvasHeight * 0.98));

    ctx.textAlign = "left";
    ctx.fillText("Accuracy: " + Math.floor((isNaN(hits / totalBullets * 100) ? 0 : hits / totalBullets * 100)).toString() + "%", 40, Math.floor(canvasHeight * 0.98));

    ctx.textAlign = "right";
    ctx.fillText("Kill Streak: " + killStreak.toString(), 1300,  Math.floor(canvasHeight * 0.98));

    if (lives <= 0) {
        ship.visible = false;
        ctx.fillStyle = "white";
        ctx.font = "75px Arial";
        ctx.fillStyle = "red";
        ctx.textAlign = "center";
        ctx.fillText("Game Over", canvasWidth / 2, canvasHeight / 2);
    }
    DrawLifeShips();

    if (asteroids.length !== 0) {
        for (let i = 0; i < asteroids.length; i++) {
            if (CircleCollision(ship.x, ship.y, 11, asteroids[i].x, asteroids[i].y, asteroids[i].collisionRadius)) {
                ship.x = canvasWidth / 2;
                ship.y = canvasHeight / 2;
                ship.velX = 0;
                ship.velY = 0;
                lives -= 1;
                killStreak = 0;
            }
        }
    }
    
    if (asteroids.length !== 0 && bullets.length !== 0) {
loop1:
        for (let i = 0; i < asteroids.length; i++) {
            for (let c = 0; c < bullets.length; c++) {
                if (CircleCollision(bullets[c].x, bullets[c].y, 3, asteroids[i].x, asteroids[i].y, asteroids[i].collisionRadius)) {
                    killCount += 1;
                    hits += 1;
                    killStreak += 1;
                    if (asteroids[i].level === 1) {
                        asteroids.push(new Asteroid(asteroids[i].x - 50, asteroids[i].y - 5, 25, 2, 22));
                        asteroids.push(new Asteroid(asteroids[i].x + 50, asteroids[i].y + 5, 25, 2, 22));
                    } else if (asteroids[i].level === 2) {
                        asteroids.push(new Asteroid(asteroids[i].x - 5, asteroids[i].y - 5, 15, 3, 12));
                        asteroids.push(new Asteroid(asteroids[i].x + 5, asteroids[i].y + 5, 15, 3, 12));
                    }
                    asteroids.splice(i, 1);
                    bullets.splice(c, 1);
                    score += 20;
                    console.log(asteroids)
                    break loop1; 
                }
            }
        }
    }
    if (ship.visible) {
        ship.Update();
        ship.Draw();
    }

    if (bullets.length !== 0) {
        for (let i = 0; i < bullets.length; i++) {
            bullets[i].Update();
            bullets[i].Draw();
        }
    }
    if (asteroids.length !== 0) {
        for (let i = 0; i < asteroids.length; i++) {
            asteroids[i].Update();
            asteroids[i].Draw(i); 
        }
    }
    requestAnimationFrame(Render);
}