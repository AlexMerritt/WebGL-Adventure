var CubeMapScene = (function () {
    CubeMapScene.prototype.particleSystem;
    CubeMapScene.prototype.rotation;

    function CubeMapScene() {
        this.name = "Cube Map Scene";
    }
    
    CubeMapScene.prototype.init = function(renderWindow) {
        this.scene = new THREE.Scene();
        this.camera = CreateCamera(renderWindow);

        this.rotation = 0;

        this.particleSystem = new ParticleSystem(100, -100);
        

        this.scene.add(this.particleSystem.object);
    };
    
    CubeMapScene.prototype.addGUI = function(gui){
    };
    
    CubeMapScene.prototype.destroy = function () {
    };
    
    CubeMapScene.prototype.update = function (dt) {
        this.rotation += dt / 10.0;
        this.particleSystem.SetPosition(Math.cos(this.rotation) * 200, Math.sin(this.rotation) * 200);

        this.particleSystem.Update(dt);
    };
    
    CubeMapScene.prototype.render = function (renderer) {
        renderer.setClearColor(0x0c0c0c, 1 );
        renderer.render(this.scene, this.camera);
    };
    
    return CubeMapScene;
})();