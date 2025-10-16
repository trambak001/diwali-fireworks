let fireworks = [];
let gravity;
let bgMusic;
let explosionSound;
let soundsLoaded = false;

function preload() {
  // Load background music and explosion sound
  // Using free sound URLs - you should replace these with your own uploaded sounds
  soundFormats('mp3', 'ogg');
  
  // For now, we'll create placeholder sound loading
  // You'll need to upload actual sound files to the repo
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB);
  gravity = createVector(0, 0.2);
  stroke(255);
  strokeWeight(4);
  background(0);
  
  // Create audio context on user interaction
  getAudioContext().suspend();
  
  // Display text to indicate user can click
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(32);
  text('सब के लिए Happy Diwali!', width/2, height/2);
  textSize(20);
  text('Click anywhere to start fireworks!', width/2, height/2 + 50);
}

function mousePressed() {
  // Resume audio context on first user interaction
  if (getAudioContext().state !== 'running') {
    userStartAudio();
    
    // Start background music if available
    if (bgMusic && !bgMusic.isPlaying()) {
      bgMusic.loop();
      bgMusic.setVolume(0.3);
    }
  }
  
  // Create firework at click position
  fireworks.push(new Firework(mouseX, mouseY));
}

function draw() {
  colorMode(RGB);
  background(0, 0, 0, 25);
  
  // Auto-generate fireworks randomly
  if (random(1) < 0.03) {
    fireworks.push(new Firework(random(width*0.15, width*0.85), random(height*0.13, height*0.5)));
  }
  
  for (let i = fireworks.length - 1; i >= 0; i--) {
    fireworks[i].update();
    fireworks[i].show();
    
    if (fireworks[i].done()) {
      fireworks.splice(i, 1);
    }
  }
  
  // Display Happy Diwali message
  fill(255, 200);
  textAlign(CENTER);
  textSize(48);
  text('सब के लिए Happy Diwali! 🪔', width/2, 60);
}

class Firework {
  constructor(tx, ty) {
    this.hu = random(255);
    this.firework = new Particle(random(width), height, this.hu, true, tx, ty);
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
    // Play explosion sound
    if (explosionSound && getAudioContext().state === 'running') {
      explosionSound.play();
    }
    
    for (let i = 0; i < 100; i++) {
      const p = new Particle(this.firework.pos.x, this.firework.pos.y, this.hu, false);
      this.particles.push(p);
    }
  }
  
  done() {
    return this.exploded && this.particles.length === 0;
  }
  
  show() {
    if (!this.exploded) {
      this.firework.show();
    }
    
    for (let particle of this.particles) {
      particle.show();
    }
  }
}

class Particle {
  constructor(x, y, hu, firework, tx, ty) {
    this.pos = createVector(x, y);
    this.firework = firework;
    this.lifespan = 255;
    this.acc = createVector(0, 0);
    
    if (this.firework) {
      let target = createVector(tx, ty);
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
