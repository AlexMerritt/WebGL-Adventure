var texVertSh = `
attribute float displacement;
varying vec3 vNormal;
varying vec2 vUv;

void main()
{
    vUv = uv;
    vNormal = (modelMatrix * vec4(normal, 0.0)).xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

var texFragSh = `
uniform sampler2D texture1;
        
varying vec3 vNormal;
varying vec2 vUv;

void main()
{
    vec3 color = texture2D(texture1, vUv).xyz;
    vec3 light = normalize(vec3(0.5, 0.2, 1.0));
    
    color = color * max(0.1, dot(light, vNormal));
    
    gl_FragColor = vec4(color,1.0);
}
`;

var RenderTextureScene = (function () {  
    function RenderTextureScene() {
        this.name = "Render Texture Scene";
        
        this.entitySystem = new EntitySystem();
        this.textureLoader = new THREE.TextureLoader();
        this.uniforms = {};
    }
    
    RenderTextureScene.prototype.init = function (renderWindow) {
        this.scene = new THREE.Scene();
        this.renderTextureScene = new THREE.Scene();
        this.renderTexture = new THREE.WebGLRenderTarget(renderWindow.width, renderWindow.height);
        
        this.camera = CreateCamera(renderWindow);
        
        var geometry = new THREE.BoxBufferGeometry(400, 400, 400);
        
        this.textureLoader.load("khronos.png", function(tex){
            var geo = new THREE.BoxBufferGeometry(800, 800, 800);
            this.uniforms['texture1'] = {type:'t', value: tex};
            
            var mesh = CreateMesh(geo, texVertSh, texFragSh, this.uniforms);
        
            var entity = this.entitySystem.createEntity(mesh);
            entity.addBehavior(new MovementBehavior());
            
            this.renderTextureScene.add(entity.mesh);
        }.bind(this));
        
        this.postUnis = {};
        this.postUnis['texture1'] = {type:'t', value: this.renderTexture};
        var mesh = CreateMesh(geometry, texVertSh, texFragSh, this.postUnis);
        var e2 = this.entitySystem.createEntity(mesh);
        e2.addBehavior(new MovementBehavior());
        this.scene.add(e2.mesh);
    };
    
    RenderTextureScene.prototype.addGUI = function(gui){
    };
    
    RenderTextureScene.prototype.destroy = function () {
        this.entitySystem.clear();
    };
    
    RenderTextureScene.prototype.update = function (dt){
        this.entitySystem.update(dt / 5);
    };
    
    RenderTextureScene.prototype.render = function (renderer){
        renderer.setClearColor(0xc0c0c0, 1 );
        renderer.render(this.renderTextureScene, this.camera, this.renderTexture);
        renderer.setClearColor(0x0c0c0c, 1 );
        renderer.render(this.scene, this.camera);
    }
    
    return RenderTextureScene;
})();