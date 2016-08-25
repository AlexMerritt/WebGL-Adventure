var vertSh = `
attribute float displacement;
uniform float amplitude;
varying vec3 vNormal;
varying vec2 vUv;

void main()
{
    vUv = uv;
    vNormal = (modelMatrix * vec4(normal, 0.0)).xyz;
    //vNormal = normal;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position + normal * vec3(displacement * amplitude),1.0);
}
`;

var fragSh = `
uniform sampler2D texture1;
        
varying vec3 vNormal;
varying vec2 vUv;

void main()
{
    vec3 color = texture2D(texture1, vUv).xyz;
    vec3 light = normalize(vec3(0.5, 0.2, 1.0));
    
    color = color * max(0.01, dot(light, vNormal));
    
    gl_FragColor = vec4(color,1.0);
}
`;

var MovementBehavior = (function (){
    function MovementBehavior(){
        
    }
    
    MovementBehavior.prototype.parent;
    
    MovementBehavior.prototype.onCreate = function (){
        
    }
    
    MovementBehavior.prototype.update = function(dt){
        this.parent.mesh.rotation.x += 0.025 * dt;
        this.parent.mesh.rotation.y += 0.05 * dt;
    }
    
    return MovementBehavior;
})();

var BoxScene = (function () {    
    function BoxScene() {
        this.name = "Texture Scene";
        
        this.entitySystem = new EntitySystem();
        this.textureLoader = new THREE.TextureLoader();
    }
    
    BoxScene.prototype.init = function(renderWindow) {
        
        this.scene = new THREE.Scene();
        this.camera = CreateCamera(renderWindow);
        
        var geometry = new THREE.BoxBufferGeometry(200, 200, 200);
        
        var vertCount = geometry.attributes.position.count;        
        
        var displacement = new Float32Array(vertCount);
        
        for(var i = 0; i < vertCount; i++){
            displacement[i] = Math.random() * 30;
        }
        
        geometry.addAttribute('displacement', new THREE.BufferAttribute(displacement, 1));
        
        this.uniforms = {
            amplitude: {type:'f', value: 2.0}
        };        
        
        this.textureLoader.load("../images/khronos.png", function(tex){
            this.uniforms['texture1'] = {type:'t', value: tex};
            
            var mesh = CreateMesh(geometry, vertSh, fragSh, this.uniforms);
            mesh.material.side = THREE.DoubleSide;
            var entity = this.entitySystem.createEntity(mesh);
            entity.addBehavior(new MovementBehavior());
            
            this.scene.add(entity.mesh);
        }.bind(this));        
    };
    
    BoxScene.prototype.addGUI = function(gui){
        this.gui = {
            amplitude: 2.0
        }
        
	    gui.add(this.gui, "amplitude", 0, 10).name( "amplitude" ).onChange(function(){
            this.uniforms.amplitude.value =  this.gui.amplitude;  
        }.bind(this));
    };
    
    BoxScene.prototype.destroy = function () {
        this.entitySystem.clear();
    };
    
    BoxScene.prototype.update = function (dt) {
        this.entitySystem.update(dt); 
    };
    
    BoxScene.prototype.getScenes = function () {
        return [{camera: this.camera, scene: this.scene}];
    }
    
    BoxScene.prototype.render = function (renderer) {
        renderer.setClearColor(0x0c0c0c, 1 );
        renderer.render(this.scene, this.camera);
    };
    
    BoxScene.prototype.getCamera = function () {
        return this.camera;
    };
    
    return BoxScene;
})();