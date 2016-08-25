var Particle = (function() {
    Particle.prototype.x;
    Particle.prototype.y;
    Particle.prototype.size;
    Particle.prototype.life;
    Particle.prototype.currentLife;
    Particle.prototype.speedX;
    Particle.prototype.speedY;

    function Particle(x, y, size, life, speedX, speedY) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.life = life;
        this.currentLife = life;
        this.speedX = speedX;
        this.speedY = speedY;
    }

    return Particle;
})();

var ParticleSystem = (function () {
    ParticleSystem.prototype.particles = [];
    ParticleSystem.prototype.object;
    ParticleSystem.prototype.x;
    ParticleSystem.prototype.y;


    function ParticleSystem(x, y) {
        this.SetPosition(x,y);

        for(var i = 0; i < 10; i++){
            var p = new Particle(i * 100, i * 100, 20, 0.25, i, i);
            this.ResetParticle(p);
            this.particles.push(p);
        }

        var g = this.CreateGeometry();

        var o = new THREE.Mesh( g, new THREE.MeshBasicMaterial({color : 0xa0a000}) );

        this.object = o;
    }

    ParticleSystem.prototype.CreateGeometry = function () {
        var g = new THREE.Geometry();
        g.dynamic = true;

        for(var i = 0; i < this.particles.length; i++){
            var index = i * 4;

            var part = this.particles[i];
            
            var xn = part.x - part.size;
            var yn = part.y - part.size;
            var xp = part.x + part.size;
            var yp = part.y + part.size;

            // Add the verts
            g.vertices.push(new THREE.Vector3(xn, yn, 0.0));
            g.vertices.push(new THREE.Vector3(xn, yp, 0.0));
            g.vertices.push(new THREE.Vector3(xp, yn, 0.0));
            g.vertices.push(new THREE.Vector3(xp, yp, 0.0));

            // Create the faces
            g.faces.push( new THREE.Face3(index + 1, index, index + 2));
            g.faces.push( new THREE.Face3(index + 1, index + 2, index + 3));   
        }

        return g;
    }

    ParticleSystem.prototype.Update = function(dt) {
        for(var i = 0; i < this.particles.length; i++){
            var part = this.particles[i];

            part.currentLife -= dt;
            if(part.currentLife <= 0.0){
                this.ResetParticle(part);
            }

            part.x += part.speedX * dt;
            part.y += part.speedY * dt;
            
        }

        var g = this.CreateGeometry();

        this.object.geometry = g;
        this.object.geometry.verticiesNeedUpdate = true;
    }

    ParticleSystem.prototype.ResetParticle = function(particle){
        var life = (Math.random() * 2) + 0.1;
        var speedX = ((Math.random() - 0.5) * 10) + 10;
        var speedY = ((Math.random() - 0.5) * 10) + 10;

        particle.x = this.x;
        particle.y = this.y;
        particle.speedX = speedX;
        particle.speedY = speedY;
        particle.life = life;
        particle.currentLife = particle.life;
    }

    ParticleSystem.prototype.SetPosition = function(x, y){
        this.x = x;
        this.y = y;
    }

    return ParticleSystem;
})();