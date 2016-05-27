var Behavior = (function () {
    function Behavior() {
        
    }
    Behavior.prototype.parent;
    
    Behavior.prototype.onCreate = function(){
        
    }
    
    Behavior.prototype.update = function(dt) {
        var r = this.parent.renderable.GetRotation();
        r.y += dt / 50;
        this.parent.renderable.SetRotation(r.x, r.y, r.z);
    }
    
    return Behavior;
})();

var Entity = (function () {
    function Entity(mesh) {
        this.mesh = mesh;
    }
    
    Entity.prototype.mesh;
    Entity.prototype.behaviors = [];
    
    Entity.prototype.addBehavior = function(behavior){
        behavior.parent = this;
        this.behaviors.push(behavior);
    }
    
    Entity.prototype.update = function(dt){
        for(i in this.behaviors){
            this.behaviors[i].update(dt);
        }
    }
    
    return Entity;
})();

var EntitySystem = (function () {
    function EntitySystem(){
        
    }
    
    EntitySystem.prototype.entityList = [];
    
    EntitySystem.prototype.addEntity = function (entity) {
        this.entityList.push(entity);
    }
    
    EntitySystem.prototype.createEntity = function (mesh) {
        var e = new Entity(mesh);
        this.addEntity(e);
        return e;
    }
    
    EntitySystem.prototype.clear = function () {
        this.entityList = [];
    }
    
    EntitySystem.prototype.update = function (dt) {
        for(i in this.entityList){
            this.entityList[i].update(dt);
        }
    }
    
    return EntitySystem;
})();

function CreateMesh(geometry, vertexShader, fragmentShader, uniforms){
    var material = new THREE.ShaderMaterial({
            uniforms: uniforms,
            vertexShader: vertexShader,
            fragmentShader: fragmentShader
        });
        
    var m = new THREE.Mesh(geometry, material);
    
    return m;
};

function CreateCamera(renderWindow) {
    var camera = new THREE.PerspectiveCamera(75, renderWindow.getAspectRatio(), 1, 10000);
    camera.position.z = 1000;
    
    return camera;
};