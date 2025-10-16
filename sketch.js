let fireworks = [];
let gravity;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB);
  gravity = createVector(0, 0.18);
  background(0);
}

function draw() {
  colorMode(RGB);
  background(0, 0, 0, 30);
  
  for (let i = fireworks.length - 1; i >= 0; i--) {
    fireworks[i].update();
    fireworks[i].show();
    
    if (fireworks[i].done()) {
      fireworks.splice(i, 1);
    }
  }
  
  // Display Diwali message
  push();
  textAlign(CENTER, CENTER);
  textSize(72);
  fill(255, 215, 0);
  strokeWeight(3);
  stroke(255, 150, 0);
  text('Happy Diwali', width / 2, height / 3);
  
  textSize(32);
  fill(255, 200, 100);
  strokeWeight(2);
  stroke(200, 100, 0);
  text('by Het Bhatiya and his family', width / 2, height / 3 + 80);
  pop();
}

function mousePressed() {
  fireworks.push(new Firework(mouseX, mouseY));
}

function mouseDragged() {
  fireworks.push(new Firework(mouseX, mouseY - random(30, 100)));
}

class Firework {
  constructor(x, y) {
    if (x !== undefined && y !== undefined) {
      this.target = createVector(x, y);
    } else {
      this.target = createVector(random(width), random(height / 2));
    }
    
    this.firework = new Particle(random(width), height, this.target, true);
    this.exploded = false;
    this.particles = [];
  }
  
  update() {
    if (!this.exploded) {
      this.firework.applyForce(gravity);
      this.firework.update();
      
      if (this.firework.vel.y >= 0) {
        this.exploded = true;
        this.explode();
      }
    }
    
    for (let i = this.particles.length - 1; i >= 0; i--) {
      this.particles[i].applyForce(gravity);
      this.particles[i].update();
      
      if (this.particles[i].done()) {
        this.particles.splice(i, 1);
      }
    }
  }
  
  explode() {
    for (let i = 0; i < 100; i++) {
      let p = new Particle(this.firework.pos.x, this.firework.pos.y, this.target, false);
      this.particles.push(p);
    }
  }
  
  show() {
    if (!this.exploded) {
      this.firework.show();
    }
    
    for (let i = 0; i < this.particles.length; i++) {
      this.particles[i].show();
    }
  }
  
  done() {
    return this.exploded && this.particles.length === 0;
  }
}

class Particle {
  constructor(x, y, target, firework) {
    this.pos = createVector(x, y);
    this.firework = firework;
    this.target = target;
    this.lifespan = 255;
    this.acc = createVector(0, 0);
    
    if (this.firework) {
      this.vel = p5.Vector.sub(target, this.pos);
      this.vel.mult(random(0.015, 0.025));
      this.hu = random(255);
    } else {
      this.vel = p5.Vector.random2D();
      this.vel.mult(random(2, 10));
      this.hu = random(255);
    }
  }
  
  applyForce(force) {
    this.acc.add(force);
  }
  
  update() {
    if (!this.firework) {
      this.vel.mult(0.9);
      this.lifespan -= 4;
    }
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);
  }
  
  done() {
    return this.lifespan < 0;
  }
  
  show() {
    colorMode(HSB);
    
    if (!this.firework) {
      strokeWeight(2);
      stroke(this.hu, 255, 255, this.lifespan);
    } else {
      strokeWeight(4);
      stroke(this.hu, 255, 255);
    }
    
    point(this.pos.x, this.pos.y);
  }
}

function keyPressed() {
  if (key === 'a') {
    fireworks.push(new Firework(random(width*0.15, width*0.85), random(height*0.13, height*0.5)));
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
