let canvas = document.querySelector("canvas");
let c = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let mouse = {
  x: innerWidth / 2,
  y: innerHeight / 2,
};

let gravity = 0.06;
let friction = 0.994;

window.addEventListener("resize", () => {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
});

class Particle {
  constructor(x, y, radius, color, velocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
    this.opacity = 1;
  }

  draw() {
    c.save();
    c.globalAlpha = this.opacity;
    c.shadowBlur = 4;
    c.shadowColor = this.color;
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.fill();
    c.closePath();
    c.restore();
  }

  update() {
    this.draw();

    this.velocity.x *= friction;
    this.velocity.y *= friction;

    this.velocity.y += gravity;

    this.x += this.velocity.x;
    this.y += this.velocity.y;

    this.opacity -= 0.005;
  }
}

class Rocket {
  constructor(targetX, targetY) {
    this.x = canvas.width / 2;
    this.y = canvas.height;
    this.targetX = targetX;
    this.targetY = targetY;
    this.radius = 2;
    this.color = "white";
    this.speed = 8;
    this.angle = Math.atan2(this.targetY - this.y, this.targetX - this.x);
    this.velocity = {
      x: Math.cos(this.angle) * this.speed,
      y: Math.sin(this.angle) * this.speed,
    };
    this.exploded = false;
  }

  draw() {
    c.save();
    c.shadowBlur = 20;
    c.shadowColor = this.color;
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.fill();
    c.closePath();
    c.restore();
  }

  update() {
    this.draw();

    // going up glow effect
    particles.push(
      new Particle(this.x, this.y, 1, "rgba(255, 255, 255, 0.81)", {
        x: (Math.random() - 0.5) * 1.5,
        y: (Math.random() - 0.5) * 0.5,
      })
    );

    this.x += this.velocity.x;
    this.y += this.velocity.y;

    if (
      Math.hypot(this.x - this.targetX, this.y - this.targetY) < 6 &&
      !this.exploded
    ) {
      this.explode();
      this.exploded = true;
      let blastsound = document.createElement("audio");
      blastsound.src = "fireworkblast.mp3";
      blastsound.play();
    }
  }

  explode() {
    let particlecount = 210;
    let angleinrement = (Math.PI * 2) / particlecount;
    let power = 7;

    for (let i = 0; i < particlecount; i++) {
      let color = Math.random() < 0.5 ? "green" : "white";
      particles.push(
        new Particle(this.x, this.y, 1.5, color, {
          x: Math.cos(angleinrement * i) * Math.random() * power,
          y: Math.sin(angleinrement * i) * Math.random() * power,
        })
      );
    }
  }
}

let particles = [];
let rockets = [];

function animation() {
  requestAnimationFrame(animation);
  c.fillStyle = "rgba(0, 0, 0, 0.2)";
  c.fillRect(0, 0, innerWidth, innerHeight);

  rockets.forEach((rocket, index) => {
    rocket.update();
    if (rocket.exploded) rockets.splice(index, 1);
  });

  particles.forEach((particle, index) => {
    if (particle.opacity > 0) {
      particle.update();
    } else {
      particles.splice(index, 1);
    }
  });
}
animation();

window.addEventListener("click", (event) => {
  rockets.push(new Rocket(event.clientX, event.clientY));
  let launchsoind = document.createElement("audio");
  launchsoind.src = "launchsound.flac";
  launchsoind.play();
});
